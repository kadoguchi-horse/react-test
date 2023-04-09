import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { appInfoState } from "src/stores/AppInfoState";
import { loginUserState } from "src/stores/LoginUserState";
import { AppInfo, App, ScreenShot, Category, LoginUser } from "src/types";
import TextFieldRequired from "src/components/atoms/TextFieldRequired";
import {
  ImgUpload,
  LabelWithOption,
  SelectCategoryBox,
} from "src/components/molecules";
import {
  Button,
  FormControl,
  FormControlLabel,
  Stack,
  Typography,
  Radio,
  RadioGroup,
} from "@mui/material";
import Screenshot from "src/components/organisms/Screenshot";
import OkModal from "src/components/atoms/OkModal";
import { SystemConst } from "src/const";
import { HttpStatus } from "src/const";

const appVal = {
  app_id: 0,
  app_name: "",
  explanation: "",
  category_id: "",
  app_destination_category: "",
  app_destination: "",
  author_name: "",
  icon: "",
  thumbnail_image: "",
  downloads: 0,
  average_rating_score: 0,
  create_by: "",
  create_datetime: new Date(),
  update_by: "",
  update_datetime: new Date(),
  modify_count: 0,
  delete_flg: "",
} as App;

export default function Register() {
  const router = useRouter();
  const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState); // 共通ステート
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState);
  const [existSession, setExistSession] = React.useState(false);
  const [appapi, setApp] = React.useState<App[]>([appVal]);
  const [screenShot, setScreenShot] = React.useState<ScreenShot[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [categorieKeys, setCategorieKeys] = React.useState<string[]>([]);
  const [categorieNames, setCategorieNames] = React.useState<string[]>([]);
  const [appDestinationCategory, setAppDestinationCategory] =
    React.useState("URL"); // アプリの公開方式
  const [uploadBtnDisplay, setUploadBtnDisplay] = React.useState(false); // UPLOAD ボタンの状態
  const [modalDisplay, setModalDisplay] = React.useState(false); // 登録完了 Modal の状態
  const [scrImages, setScrImages] = React.useState<string[]>([]);
  const didMountRef_ScrImage = React.useRef(false);
  const didMountRef_Categorie = React.useRef(false);
  const screenshotDispCnt = 5;
  const defaultImage = SystemConst.NO_IMAGE_ICON;
  const handleChangeTimer = 500; //タイマー秒数

  React.useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setLoginUser(JSON.parse(sessionLoginUser));
      setExistSession(true);
    }

    async function fetchPost() {
      //パラメータが初期化された場合は登録モードとする
      if (appInfo.registerState === "") {
        const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
        newAppInfo.registerState = "登録";
        setAppInfo(newAppInfo);
      }

      if (appInfo.registerState !== "登録") {
        setUploadBtnDisplay(true);
        if (!didMountRef_Categorie.current) {
          //アプリ詳細情報
          const res_app = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/searchAppId?appId=${appInfo.selectedAppId}`
          );
          const app = (await res_app.json()) as App[];
          setApp(app);

          // スクリーンショット情報取得
          const res_scrshot = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appScreenshot/searchAppId?appId=${appInfo.selectedAppId}`
          );
          if (res_scrshot.status === HttpStatus.Code.OK) {
            const screenshot_array = (await res_scrshot.json()) as ScreenShot[];
            setScreenShot(screenshot_array);
          }

          // カテゴリ情報取得
          const res_categorie = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/all`
          );
          const categories_json = (await res_categorie.json()) as Category[];
          setCategories(categories_json);

          // 登録済みのスクリーンショットを取得する
          if (screenShot.length > 0) {
            const srcImage: string[] = [];
            for (let i = 0; screenShot.length > i; i++) {
              srcImage.push(screenShot[i].image);
            }
            setScrImages(srcImage);
            didMountRef_ScrImage.current = true;
          }

          // 登録したアプリに紐づくカテゴリを取得する
          let val = [];
          val = app[0].category_id.split(",");
          const key: string[] = [];
          const name: string[] = [];
          for (let i = 0; val.length > i; i++) {
            for (let j = 0; categories.length > j; j++) {
              if (val[i] === categories[j].category_id.toString()) {
                name.push(categories[j].category_nm);
                key.push(categories[j].category_id.toString());
                didMountRef_Categorie.current = true;
              }
            }
          }
          setCategorieNames(name);
          setCategorieKeys(key);

          if (app[0].category_id.length === 0) {
            didMountRef_Categorie.current = true;
          }
        }
      } else {
        setApp([appVal]);
      }
    }
    fetchPost();
  }, [
    setLoginUser,
    appInfo.selectedAppId,
    appInfo.registerState,
    scrImages,
    screenShot,
    categories,
    categorieKeys,
    didMountRef_Categorie,
    appInfo,
    setAppInfo,
  ]);

  // 必須入力が全て埋まっているかチェック
  function HandleChange() {
    window.setTimeout(() => {
      if (
        (document.getElementById("appName") as HTMLInputElement).value !== "" &&
        (document.getElementById("explanation") as HTMLInputElement).value !==
          "" &&
        (document.getElementById("appDestination") as HTMLInputElement)
          .value !== "" &&
        (document.getElementById("authorName") as HTMLInputElement).value !== ""
      ) {
        setUploadBtnDisplay(true);
      } else {
        setUploadBtnDisplay(false);
      }
    }, handleChangeTimer);
  }

  // UPLOAD ボタン押下
  async function UploadBtnClick() {
    const screenshots: string[] = [];
    for (let i = 1; i <= screenshotDispCnt; i++) {
      const screenshotTarget = document.getElementById("scr" + i);
      if (screenshotTarget) {
        const imageVal = (screenshotTarget as HTMLInputElement).value;
        if (imageVal !== defaultImage) {
          screenshots.push((screenshotTarget as HTMLInputElement).value);
        }
      }
    }

    if (appInfo.registerState === "登録") {
      // 登録 API を呼び出す
      const requestOption_create = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: (document.getElementById("appName") as HTMLInputElement)
            .value,
          explanation: (
            document.getElementById("explanation") as HTMLInputElement
          ).value,
          categoryId: (
            document.getElementById("categoryId") as HTMLInputElement
          ).value,
          appDestinationCategory: "0",
          appDestination: (
            document.getElementById("appDestination") as HTMLInputElement
          ).value,
          authorName: (
            document.getElementById("authorName") as HTMLInputElement
          ).value,
          icon: (document.getElementById("icon") as HTMLInputElement).value,
          thumbnailImage: (
            document.getElementById("thumbnailImage") as HTMLInputElement
          ).value,
          user: "testuser",
          screenshots: screenshots,
        }),
      };

      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/create`,
        requestOption_create
      );
      // 登録された app_Id を取得 & セット
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/search?searchWord=&categoryId=&sort=2&offset=&limit=1`
      );
      const apps = (await res.json()) as App[];
      const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
      newAppInfo.selectedAppId = apps[0].app_id;
      setAppInfo(newAppInfo);
    } else {
      // 更新 API を呼び出す
      const requestOption_update = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: appInfo.selectedAppId,
          appName: (document.getElementById("appName") as HTMLInputElement)
            .value,
          explanation: (
            document.getElementById("explanation") as HTMLInputElement
          ).value,
          categoryId: (
            document.getElementById("categoryId") as HTMLInputElement
          ).value,
          appDestinationCategory: "0",
          appDestination: (
            document.getElementById("appDestination") as HTMLInputElement
          ).value,
          authorName: (
            document.getElementById("authorName") as HTMLInputElement
          ).value,
          icon: (document.getElementById("icon") as HTMLInputElement).value,
          thumbnailImage: (
            document.getElementById("thumbnailImage") as HTMLInputElement
          ).value,
          user: "testuser",
          screenshots: screenshots,
        }),
      };
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/update`,
        requestOption_update
      );

      didMountRef_Categorie.current = false;
    }
    // 登録完了 Modal 表示
    setModalDisplay(true);
  }

  // モーダルクローズ処理
  const modalClose = () => {
    router.push("/detail");
  };

  if (existSession === false) {
    // セッションが破棄されている場合
    return <p>読込中...</p>;
  } else if (
    loginUser.user_role !== "Administrator" &&
    loginUser.user_role !== "Editor"
  ) {
    // 権限を持たないユーザーの場合
    return <p>権限がありません</p>;
  } else {
    return (
      <div
        onChange={HandleChange}
        onLoad={() => {
          didMountRef_Categorie.current = false;
        }}
      >
        <Head>
          <title>Application List</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <h3 style={{ whiteSpace: "nowrap" }}>
            {"アプリ" + appInfo.registerState}
          </h3>
          <Stack spacing={0.5} sx={{ whiteSpace: "nowrap" }}>
            <LabelWithOption
              label="アプリ名"
              option="required"
              marginTop="0px"
            />
            <TextFieldRequired
              id="appName"
              autoFocus={true}
              value={appInfo.registerState === "登録" ? "" : appapi[0].app_name}
            />

            <LabelWithOption label="説明" option="required" marginTop="15px" />
            <TextFieldRequired
              id="explanation"
              value={
                appInfo.registerState === "登録" ? "" : appapi[0].explanation
              }
            />

            <LabelWithOption
              label="カテゴリ"
              option="optional"
              marginTop="15px"
            />
            <SelectCategoryBox
              id="categoryId"
              categoryKey={
                appInfo.registerState === "登録" ? [] : categorieKeys
              }
              categoryName={
                appInfo.registerState === "登録" ? [] : categorieNames
              }
            />

            <LabelWithOption
              label="アプリの公開方式を選択してください"
              option="required"
              marginTop="15px"
            />
            <FormControl>
              <RadioGroup
                value={appDestinationCategory}
                row
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAppDestinationCategory(
                    (event.target as HTMLInputElement).value
                  );
                }}
              >
                <FormControlLabel
                  value="App"
                  control={<Radio />}
                  label="ファイル"
                  disabled
                />
                <FormControlLabel value="URL" control={<Radio />} label="URL" />
              </RadioGroup>
            </FormControl>
            <Typography variant="body2">{appDestinationCategory}</Typography>
            <TextFieldRequired
              id="appDestination"
              value={
                appInfo.registerState === "登録"
                  ? ""
                  : appapi[0].app_destination
              }
            />

            <LabelWithOption
              label="作成者名"
              option="required"
              marginTop="15px"
            />
            <TextFieldRequired
              id="authorName"
              value={
                appInfo.registerState === "登録" ? "" : appapi[0].author_name
              }
            />

            <LabelWithOption
              label="アプリアイコン"
              option="optional"
              marginTop="15px"
            />
            <ImgUpload
              id="icon"
              type="icon"
              imgWidth="200px"
              imgHeight="200px"
              changeList={null}
              imageSrc={
                appInfo.registerState === "登録"
                  ? defaultImage
                  : defaultImage === appapi[0].icon
                  ? defaultImage
                  : appapi[0].icon
              }
              displayClearBtn="none"
            />

            <LabelWithOption
              label="サムネイル"
              option="optional"
              marginTop="15px"
            />
            <ImgUpload
              id="thumbnailImage"
              type="thumbnail"
              imgWidth="400px"
              imgHeight="250px"
              changeList={null}
              imageSrc={
                appInfo.registerState === "登録"
                  ? defaultImage
                  : defaultImage === appapi[0].thumbnail_image
                  ? defaultImage
                  : appapi[0].thumbnail_image
              }
              displayClearBtn="none"
            />

            <LabelWithOption
              label="スクリーンショット"
              option="optional"
              marginTop="15px"
            />
            <Screenshot
              dispCnt={screenshotDispCnt}
              defaultImageStr={defaultImage}
              scrImages={scrImages}
              registerState={appInfo.registerState}
            />
          </Stack>
          <div style={{ margin: "20px 0px 30px 0px", textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              style={{ width: "200px", height: "55px" }}
              disabled={!uploadBtnDisplay}
              onClick={UploadBtnClick}
            >
              Upload
            </Button>
          </div>

          <OkModal
            open={modalDisplay}
            onClose={modalClose}
            onClick={modalClose}
            detailText={"アプリを" + appInfo.registerState + "しました。"}
          />
        </main>
      </div>
    );
  }
}

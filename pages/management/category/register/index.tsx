import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { CategoryInfo, Category, LoginUser } from "src/types";
import { categoryInfoState } from "src/stores/CategoryInfoState";
import TextFieldRequired from "src/components/atoms/TextFieldRequired";
import { LabelWithOption } from "src/components/molecules";
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { loginUserState } from "src/stores/LoginUserState";
import OkModal from "src/components/atoms/OkModal";

const categoryVal = {
  category_id: 0,
  category_nm: "",
  general_field1: "",
  disp_nm1: "",
  general_field2: "",
  disp_nm2: "",
  general_field3: "",
  disp_nm3: "",
  general_field4: "",
  disp_nm4: "",
  general_field5: "",
  disp_nm5: "",
  sort_no: 0,
  create_by: "",
  create_datetime: new Date(),
  update_by: "",
  update_datetime: new Date(),
  modify_count: 0,
  delete_flg: "0",
} as Category;

class ProcInfo {
  message: string = "";
  okng: string = ""; // ok or ng
}

export default function Register() {
  const router = useRouter();
  const handleChangeTimer = 500; //タイマー秒数
  const [categoryapi, setCategoryapi] = React.useState<Category[]>([
    categoryVal,
  ]);
  const [categoryapi_Check, setCategoryapi_Check] = React.useState<Category[]>(
    []
  );
  const [categoryInfo, setCategoryInfo] =
    useRecoilState<CategoryInfo>(categoryInfoState); // 共通ステート
  const [uploadBtnDisplay, setUploadBtnDisplay] = React.useState(false); // UPLOAD ボタンの状態
  const [modalDisplay_Caution, setModalDisplay_Caution] = React.useState(false); // 重複メッセージ Modal の状態
  const [chkUpload, setChkUpload] = React.useState(0);
  const [procInfo, setProcInfo] = React.useState(new ProcInfo());
  const didMountRef = React.useRef(false);
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState);
  const [existSession, setExistSession] = React.useState(false);

  React.useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setLoginUser(JSON.parse(sessionLoginUser));
      setExistSession(true);
    }

    async function fetchPost() {
      if (!didMountRef.current) {
        //パラメータが初期化された場合は登録モードとする
        if (categoryInfo.registerState === "") {
          const newCategoryInfo: CategoryInfo = JSON.parse(
            JSON.stringify(categoryInfo)
          );
          newCategoryInfo.registerState = "登録";
          setCategoryInfo(newCategoryInfo);
        }

        if (categoryInfo.registerState === "更新") {
          setUploadBtnDisplay(true);
          //カテゴリ情報
          const res_category = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/searchCategoryId?categoryId=${categoryInfo.category_Id}`
          );
          const category = (await res_category.json()) as Category[];
          setCategoryapi(category);
          didMountRef.current = true;
        } else {
          const res_category = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/allCategory`
          );
          const category = (await res_category.json()) as Category[];
          categoryVal.category_id =
            Math.max.apply(
              null,
              category.map(function (o) {
                return o.category_id;
              })
            ) + 1;
          setCategoryapi([categoryVal]);
          setCategoryapi_Check(category);
          didMountRef.current = true;
        }
      }
    }
    fetchPost();
  }, [
    setLoginUser,
    categoryInfo.category_Id,
    categoryInfo.registerState,
    categoryapi,
    categoryInfo,
    setCategoryInfo,
  ]);

  // モーダルクローズ処理
  const modalClose_ok = () => {
    // 再表示する
    router.push("/management/category");
  };
  const modalClose_ng = () => {
    // モーダル情報を初期化する
    setProcInfo(new ProcInfo());
  };

  // 必須入力が全て埋まっているかチェック
  function HandleChange() {
    window.setTimeout(() => {
      if (
        (document.getElementById("category_name") as HTMLInputElement).value !==
        ""
      ) {
        setUploadBtnDisplay(true);
      } else {
        setUploadBtnDisplay(false);
      }
    }, handleChangeTimer);
  }

  // UPLOAD ボタン押下
  async function UploadBtnClick() {
    const category_name = (
      document.getElementById("category_name") as HTMLInputElement
    ).value;

    if (chkUpload === 0) {
      setChkUpload(1);
      if (categoryInfo.registerState === "登録") {
        let check_CategoryName_Flg = false;
        let sortNo = 0;
        // 存在チェック
        for (let i = 0; categoryapi_Check.length > i; i++) {
          if (categoryapi_Check[i].category_nm === category_name) {
            check_CategoryName_Flg = true;
          }
          if (Number(sortNo) < Number(categoryapi_Check[i].sort_no)) {
            sortNo = categoryapi_Check[i].sort_no;
          }
        }

        if (!check_CategoryName_Flg) {
          // 登録 API を呼び出す
          sortNo++;
          const requestOption_create = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // categoryId: category_id,
              categoryName: category_name,
              sortNo: sortNo,
              user: loginUser.account_name,
            }),
          };
          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/create`,
            requestOption_create
          );
        } else {
          setModalDisplay_Caution(true);
          return;
        }
      } else {
        const category_id = (
          document.getElementById("category_id") as HTMLInputElement
        ).value;
        // 更新 API を呼び出す
        const requestOption_update = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: category_id,
            categoryName: category_name,
            // sortNo: category_sortno,
            user: loginUser.account_name,
          }),
        };
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/update`,
          requestOption_update
        );
      }
      setProcInfo({
        message: `カテゴリを${categoryInfo.registerState}しました`,
        okng: "ok",
      } as ProcInfo);

      setChkUpload(0);
    }
  }

  if (existSession === false) {
    // セッションが破棄されている場合
    return <p>読込中...</p>;
  } else if (loginUser.user_role !== "Administrator") {
    // 権限を持たないユーザーの場合
    return <p>権限がありません</p>;
  } else {
    return (
      <div onChange={HandleChange}>
        <Head>
          <title>Application List</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <h3 style={{ whiteSpace: "nowrap" }}>
            {"カテゴリ" + categoryInfo.registerState}
          </h3>
          <Stack spacing={0.5} sx={{ whiteSpace: "nowrap" }}>
            <Typography variant="body2" noWrap>
              {categoryInfo.registerState === "登録"
                ? "※IDは自動採番されます"
                : "ID"}
            </Typography>
            <TextField
              id={"category_id"}
              sx={{
                "& .MuiInputBase-input": { color: "#000000" },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "gray",
                  backgroundColor: "#bbbbbb",
                  borderRadius: "5px",
                },
                display:
                  categoryInfo.registerState === "登録" ? "none" : "flex",
              }}
              style={{ backgroundColor: "white", borderRadius: "5px" }}
              value={categoryapi[0].category_id}
              disabled={true}
            />

            <LabelWithOption
              label="カテゴリ名"
              option="required"
              marginTop="15px"
            />
            <TextFieldRequired
              id="category_name"
              autoFocus={true}
              maxLength={50}
              value={
                categoryInfo.registerState === "登録"
                  ? ""
                  : categoryapi[0].category_nm
              }
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
          <Modal
            open={modalDisplay_Caution}
            onClose={() => {
              setModalDisplay_Caution(false);
            }}
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: "fit-content",
                bgcolor: "background.paper",
                border: "1px solid #cccccc",
                p: 2,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Typography variant="subtitle2" noWrap>
                  {"すでに登録されているカテゴリ名です。"}
                </Typography>
                <Button
                  sx={{ margin: "10px 0px 0px 0px" }}
                  variant="contained"
                  color="warning"
                  onClick={() => {
                    setModalDisplay_Caution(false);
                  }}
                >
                  OK
                </Button>
              </div>
            </Box>
          </Modal>
          <OkModal
            open={procInfo.okng !== ""}
            onClose={
              procInfo.okng === "ok"
                ? modalClose_ok
                : procInfo.okng === "ng"
                ? modalClose_ng
                : undefined
            }
            onClick={
              procInfo.okng === "ok"
                ? modalClose_ok
                : procInfo.okng === "ng"
                ? modalClose_ng
                : undefined
            }
            detailText={procInfo.message}
          />
        </main>
      </div>
    );
  }
}

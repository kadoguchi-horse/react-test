import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userInfoState } from "src/stores/UserInfoState";
import { UserInfo, User, LoginUser } from "src/types";
import TextFieldRequired from "src/components/atoms/TextFieldRequired";
import { LabelWithOption } from "src/components/molecules";
import {
  Button,
  FormControl,
  FormControlLabel,
  Stack,
  Radio,
  RadioGroup,
} from "@mui/material";
import { loginUserState } from "src/stores/LoginUserState";
import OkModal from "src/components/atoms/OkModal";
import { setGlobalLoginUser } from "pages/index";
import { HttpStatus } from "src/const";

const userVal = {
  account_name: "",
  user_name: "",
  user_role: "",
  create_by: "",
  create_datetime: new Date(),
  update_by: "",
  update_datetime: new Date(),
  modify_count: 0,
  delete_flg: "",
} as User;

class ProcInfo {
  message: string = "";
  okng: string = "";
}

export default function Register() {
  const router = useRouter();
  const handleChangeTimer = 500; //タイマー秒数

  const [userInfo, setUserInfo] = useRecoilState<UserInfo>(userInfoState); // 共通ステート
  const [userapi, setUser] = React.useState<User[]>([userVal]);
  const [uploadBtnDisplay, setUploadBtnDisplay] = React.useState(false); // UPLOAD ボタンの状態
  const [procInfo, setProcInfo] = React.useState(new ProcInfo()); // 処理結果
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState);
  const [existSession, setExistSession] = React.useState(false);

  // ロール変更
  function setRadioSelectedValue(value: string) {
    // ※ラジオボタンの描写を切り替える対応
    const res_user: User[] = [userVal];
    res_user[0].account_name = userapi[0].account_name;
    res_user[0].user_name = userapi[0].user_name;
    res_user[0].account_name = userapi[0].account_name;
    res_user[0].user_role = value;
    res_user[0].create_by = userapi[0].create_by;
    res_user[0].create_datetime = userapi[0].create_datetime;
    res_user[0].update_by = userapi[0].update_by;
    res_user[0].update_datetime = userapi[0].update_datetime;
    res_user[0].modify_count = userapi[0].modify_count;
    res_user[0].delete_flg = userapi[0].delete_flg;
    setUser(res_user);

    // ※内部的に選択値を切り替える対応
    (document.getElementById("user_role") as HTMLInputElement).value = value;
  }

  // ラジオボタン選択値取得
  function getRadioSelectedValue(radioGroupId: string): string {
    let user_role_inputValue: string = "";
    document.getElementById(radioGroupId)?.childNodes.forEach((element) => {
      const user_role_input = (element as HTMLInputElement).querySelector(
        "input"
      );
      if (user_role_input?.checked === true) {
        user_role_inputValue = user_role_input.value;
      }
    });
    return user_role_inputValue;
  }

  React.useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setLoginUser(JSON.parse(sessionLoginUser));
      setExistSession(true);
    }

    async function fetchPost() {
      //パラメータが初期化された場合は登録モードとする
      if (userInfo.registerState === "") {
        const newUserInfo: UserInfo = JSON.parse(JSON.stringify(userInfo));
        newUserInfo.registerState = "登録";
        setUserInfo(newUserInfo);
      }

      if (userInfo.registerState === "更新") {
        setUploadBtnDisplay(true);
        //ユーザー詳細情報
        const res_user = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/searchAccountName?accountName=${userInfo.selectedAccountName}`
        );
        const user = (await res_user.json()) as User[];
        setUser(user);
      }
    }
    fetchPost();
  }, [
    setLoginUser,
    userInfo.selectedAccountName,
    userInfo.registerState,
    userInfo,
    setUserInfo,
  ]);

  // 必須入力が全て埋まっているかチェック
  function HandleChange() {
    window.setTimeout(() => {
      if (
        (document.getElementById("account_name") as HTMLInputElement).value !==
          "" &&
        (document.getElementById("user_name") as HTMLInputElement).value !==
          "" &&
        getRadioSelectedValue("user_role") !== ""
      ) {
        setUploadBtnDisplay(true);
      } else {
        setUploadBtnDisplay(false);
      }
    }, handleChangeTimer);
  }

  // UPLOAD ボタン押下
  async function UploadBtnClick() {
    const account_name = (
      document.getElementById("account_name") as HTMLInputElement
    ).value;
    const user_name = (document.getElementById("user_name") as HTMLInputElement)
      .value;
    const user_role = (document.getElementById("user_role") as HTMLInputElement)
      .value;

    if (userInfo.registerState === "登録") {
      // 存在チェック
      const res_user = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/searchAccountName?accountName=${account_name}`
      );

      if (res_user.status === HttpStatus.Code.NOT_FOUND) {
        // 登録 API を呼び出す
        const requestOption_create = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountName: account_name,
            userName: user_name,
            userRole: user_role,
            user: loginUser.account_name,
          }),
        };
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/create`,
          requestOption_create
        );
      } else {
        // メッセージモーダル表示
        setProcInfo({
          message: `アカウント名が既に存在しています`,
          okng: "ng",
        } as ProcInfo);
        return false;
      }
    } else {
      // 更新 API を呼び出す
      const requestOption_update = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountName: account_name,
          userName: user_name,
          userRole: user_role,
          user: loginUser.account_name,
        }),
      };
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/update`,
        requestOption_update
      );
    }
    // メッセージモーダル表示
    setProcInfo({
      message: `ユーザーを${userInfo.registerState}しました`,
      okng: "ok",
    } as ProcInfo);

    // ログイン情報を上書きする
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      const loginuser: LoginUser = JSON.parse(sessionLoginUser);
      if (loginuser.account_name === account_name) {
        loginuser.account_name = account_name;
        loginuser.user_name = user_name;
        loginuser.user_role = user_role;

        setGlobalLoginUser(loginUser);
      }
    }

    return true;
  }

  // モーダルクローズ処理
  const modalClose_ok = () => {
    // 再表示する
    router.push("/management/user");
  };
  const modalClose_ng = () => {
    // モーダル情報を初期化する
    setProcInfo(new ProcInfo());
  };

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
            {"ユーザー" + userInfo.registerState}
          </h3>
          <Stack spacing={0.5} sx={{ whiteSpace: "nowrap" }}>
            <LabelWithOption
              label="アカウント名"
              option="required"
              marginTop="0px"
            />
            <TextFieldRequired
              id="account_name"
              autoFocus={userInfo.registerState === "登録" ? true : false}
              maxLength={50}
              value={
                userInfo.registerState === "登録" ? "" : userapi[0].account_name
              }
              disabled={userInfo.registerState === "登録" ? false : true}
              pattern='^(?!.*,).*$'
            />

            <LabelWithOption label="氏名" option="required" marginTop="15px" />
            <TextFieldRequired
              id="user_name"
              autoFocus={userInfo.registerState === "登録" ? false : true}
              maxLength={50}
              value={
                userInfo.registerState === "登録" ? "" : userapi[0].user_name
              }
            />

            <LabelWithOption label="権限" option="required" marginTop="15px" />
            <FormControl>
              <RadioGroup
                id="user_role"
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Administrator"
                  control={<Radio />}
                  label="Administrator"
                  checked={
                    userInfo.registerState === "更新" &&
                    userapi[0].user_role === "Administrator"
                      ? true
                      : undefined
                  }
                  onChange={() => {
                    setRadioSelectedValue("Administrator");
                  }}
                />
                <FormControlLabel
                  value="Editor"
                  control={<Radio />}
                  label="Editor"
                  checked={
                    userInfo.registerState === "更新" &&
                    userapi[0].user_role === "Editor"
                      ? true
                      : undefined
                  }
                  onChange={() => {
                    setRadioSelectedValue("Editor");
                  }}
                />
                <FormControlLabel
                  value="User"
                  control={<Radio />}
                  label="User"
                  checked={
                    userInfo.registerState === "更新" &&
                    userapi[0].user_role === "User"
                      ? true
                      : undefined
                  }
                  onChange={() => {
                    setRadioSelectedValue("User");
                  }}
                />
              </RadioGroup>
            </FormControl>
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

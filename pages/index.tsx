import * as React from "react";
import { useRouter } from "next/router";
import { Stack, Button, TextField } from "@mui/material";
import { LoginUser, User } from "src/types";
import { useRecoilState } from "recoil";
import { loginUserState } from "src/stores/LoginUserState";
import { HttpStatus } from "src/const";

// グローバル変数
// ログイン情報　※レンダリング実行判定に使用
export let g_loginUser: LoginUser = {
  account_name: "",
  user_name: "",
  user_role: "",
};
export function setGlobalLoginUser(loginUser: LoginUser) {
  // グローバル変数に格納
  g_loginUser = loginUser;
  // セッションに格納　※ブラウザ側で使用可
  localStorage.setItem("LoginUser", JSON.stringify(loginUser));
}

const readLoginUser = (): LoginUser | undefined => {
  if (typeof window !== "undefined") {
    const loginUser = localStorage.getItem("LoginUser");
    return loginUser != null ? JSON.parse(loginUser) : undefined;
  } else {
    return undefined;
  }
};

const useLoginUser = () => {
  const [loginUser] = React.useState<LoginUser | undefined>(readLoginUser());

  const [, setLoginUser] = React.useState<LoginUser | undefined>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoginUser(readLoginUser());
    setLoading(false);
  }, []);

  return {
    loginUser,
    loading,
  };
};

const Index = () => {
  const [, setLogunUser] = useRecoilState<LoginUser>(loginUserState);
  const router = useRouter();
  const { loginUser, loading } = useLoginUser();

  if (loading) {
    return <p>読込中...</p>;
  }

  if (loginUser !== undefined) {
    setLogunUser(loginUser);
  }

  // ログインボタン押下
  async function LoginBtnClick(anonymous: boolean) {
    // ログイン情報をセット
    const userInfo: LoginUser = {
      account_name: "anonymous",
      user_name: "",
      user_role: "User",
    };

    if (!anonymous) {
      // 存在チェック
      const account_name = (
        document.getElementById("account_name") as HTMLInputElement
      ).value;
      const res_user = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/searchAccountName?accountName=${account_name}`
      );
      if (res_user.status === HttpStatus.Code.OK) {
        const user = (await res_user.json()) as User[];
        if (user[0].delete_flg === "0") {
          // ログイン情報にユーザー情報をセット
          userInfo.account_name = user[0].account_name;
          userInfo.user_name = user[0].user_name;
          userInfo.user_role = user[0].user_role;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    setGlobalLoginUser(userInfo);

    // TODO:後々はSSO認証するので、明示的ログアウト自体不要になる。 Start
    // 明示的ログインフラグ削除
    if (
      localStorage.getItem("logout") !== null &&
      localStorage.getItem("logout") === "true"
    ) {
      localStorage.removeItem("logout");
    }
    // TODO:後々はSSO認証するので、明示的ログアウト自体不要になる。 End
    router.push("/top");

    return true;
  }

  if (localStorage.length === 0) {
    // 初回アクセスやセッションが破棄された場合、匿名ログインさせる
    const userInfo: LoginUser = {
      account_name: "anonymous",
      user_name: "",
      user_role: "User",
    };
    setGlobalLoginUser(userInfo);
  }

  if (localStorage.getItem("LoginUser") === null) {
    // 明示的ログアウトの場合、ログイン画面を表示する
    return (
      <div style={{ marginBottom: "30px" }}>
        <main>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "0px 20% 0px 20%",
            }}
          >
            <h3>ログイン</h3>
            <Stack spacing={0.5} sx={{ whiteSpace: "nowrap" }}>
              <div style={{ textAlign: "left" }}>アカウント名</div>
              <TextField id="account_name" />
            </Stack>
            <div style={{ margin: "40px 0px 0px 0px", textAlign: "right" }}>
              <div
                style={{ margin: "0px 10px 0px 0px", display: "inline-block" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  style={{ width: "200px", height: "55px" }}
                  onClick={() => {
                    LoginBtnClick(true);
                  }}
                >
                  匿名ログイン
                </Button>
              </div>
              <div
                style={{ margin: "0px 0px 0px 0px", display: "inline-block" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  style={{ width: "200px", height: "55px" }}
                  onClick={() => {
                    LoginBtnClick(false);
                  }}
                >
                  ログイン
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    // トップ画面
    router.push(`/top`);
    return false;
  }
};

export default Index;

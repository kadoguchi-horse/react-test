import * as React from "react";
import { useRouter } from "next/router";
import { Button, Card, Grid, Box, Typography } from "@mui/material";
import { App, AppInfo, LoginUser } from "src/types";
import { useRecoilState } from "recoil";
import { loginUserState } from "src/stores/LoginUserState";
import { MyAppCard } from "src/components/molecules";
import { showInitial } from "src/components/molecules/MyAppCard";
import EmailIcon from "@mui/icons-material/Email";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import type { NextPage } from "next";
import { appInfoState } from "src/stores/AppInfoState";

const Mypage: NextPage = () => {
  const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState); // 共通ステート
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState);
  const [apps, setApps] = React.useState<App[]>([]);
  const [dlapps, setDlApps] = React.useState<App[]>([]);
  const [evaluationapps, setEvaluationApps] = React.useState<App[]>([]);
  const router = useRouter();
  const [showMeapp, setShowMeapp] = React.useState(false);
  const [showMeDlapp, setshowMeDlapp] = React.useState(false);
  const [showMeEvaluationapp, setshowMeEvaluationapp] = React.useState(false);
  const [existSession, setExistSession] = React.useState(false);
  const myapplist = "/mypage/applist";
  const maxapp = showInitial;
  const testemail = "test@email.com";
  const moreBtnShowStyle = "inline-flex";
  const [isLoad, setIsLoad] = React.useState(false); // ロード完了

  React.useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setLoginUser(JSON.parse(sessionLoginUser));
      setExistSession(true);
    }
    
    async function fetchApps() {
      if (sessionLoginUser) {
        const a = JSON.parse(sessionLoginUser);
        setLoginUser(a);

        //登録アプリ
        const user = a.account_name;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/search?createBy=${user}&limit=${showInitial + 1}`
        );
        const appsresjson = (await res.json()) as App[];
        //重複除外
        const result = appsresjson.filter(
          (element, index, self) =>
            self.findIndex((e) => e.app_id === element.app_id) === index
        );
        setApps(result);
        if (result.length > maxapp) {
          setShowMeapp(true);
        } else {
          setShowMeapp(false);
        }

        //ダウンロードアプリ
        const dlappres = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appDownloadHistory/search?user=${user}&limit=${showInitial + 1}`
        );
        const dlappsresjson = (await dlappres.json()) as App[];
        setDlApps(dlappsresjson);

        if (dlappsresjson.length > maxapp) {
          setshowMeDlapp(true);
        } else {
          setshowMeDlapp(false);
        }

        //評価したアプリ
        const evaluationappres = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluation/searchAppEvaluation?user=${user}&limit=${showInitial + 1}`
        );
        const evaluationappsresjson = (await evaluationappres.json()) as App[];
        //重複除外
        const evaluationresult = evaluationappsresjson.filter(
          (element, index, self) =>
            self.findIndex((e) => e.app_id === element.app_id) === index
        );
        setEvaluationApps(evaluationresult);

        if (evaluationappsresjson.length > maxapp) {
          setshowMeEvaluationapp(true);
        } else {
          setshowMeEvaluationapp(false);
        }
      }

      // ロード完了状態にする
      setIsLoad(true);
    }
    fetchApps();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoginUser]);

  if (!apps || existSession === false) {
    // アプリ情報ロード中、もしくはセッションが破棄されている場合
    return <p>読込中...</p>;
  } else if (
    loginUser.account_name === "" || loginUser.account_name === "anonymous"
  ) {
    // 匿名ユーザーの場合
    return <p>ログインを行ってください</p>;
  } else {
    
    return (
      <div style={{ marginBottom: "30px" }}>
        <main>
          <h3 style={{ whiteSpace: "nowrap" }}>マイページ</h3>
          <Card>
            <Grid padding={2}>
              <Grid paddingBottom={2} fontSize={21}>
                {loginUser?.account_name}({loginUser?.user_name})
              </Grid>
              <Grid container>
                <Grid item>
                  <EmailIcon />
                </Grid>
                <Grid item marginLeft={1}>
                  <Typography variant="body1" component="div" noWrap>
                    {testemail}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Box marginTop={3}>
            <Grid marginBottom={1} container>
              <Grid item>
                <Typography variant="body1" component="div" noWrap>
                  登録したアプリ
                </Typography>
              </Grid>
              <Grid item style={{ marginLeft: "auto" }}>
                <Button
                  onClick={() => {
                    const updateAppInfo: AppInfo = JSON.parse(
                      JSON.stringify(appInfo)
                    );
                    updateAppInfo.mayapplistState = "登録したアプリ";
                    setAppInfo(updateAppInfo);
                    (
                      document.getElementById("searchInput") as HTMLInputElement
                    ).value = "";
                    router.push(myapplist);
                  }}
                  variant="contained"
                  endIcon={<KeyboardArrowRightIcon />}
                  style={{
                    backgroundColor: "orange",
                    display: showMeapp ? moreBtnShowStyle : "none",
                  }}
                >
                  もっとみる
                </Button>
              </Grid>
            </Grid>
            {isLoad ? (
              <MyAppCard app={apps} flg={"1"}></MyAppCard>
            ) : (
              <></>
            )}
          </Box>
          <Box marginTop={3}>
            <Grid marginBottom={1} container>
              <Grid item>
                <Typography variant="body1" component="div" noWrap>
                  最近ダウンロードしたアプリ
                </Typography>
              </Grid>
              <Grid item style={{ marginLeft: "auto" }}>
                <Button
                  onClick={() => {
                    const updateAppInfo: AppInfo = JSON.parse(
                      JSON.stringify(appInfo)
                    );
                    updateAppInfo.mayapplistState = "最近ダウンロードしたアプリ";
                    setAppInfo(updateAppInfo);
                    (
                      document.getElementById("searchInput") as HTMLInputElement
                    ).value = "";
                    router.push(myapplist);
                  }}
                  variant="contained"
                  endIcon={<KeyboardArrowRightIcon />}
                  style={{
                    backgroundColor: "orange",
                    display: showMeDlapp ? moreBtnShowStyle : "none",
                  }}
                >
                  もっとみる
                </Button>
              </Grid>
            </Grid>
            {isLoad ? (
              <MyAppCard app={dlapps} flg={"2"}></MyAppCard>
            ) : (
              <></>
            )}
          </Box>
          <Box marginTop={3}>
            <Grid marginBottom={1} container>
              <Grid item>
                <Typography variant="body1" component="div" noWrap>
                  評価したアプリ
                </Typography>
              </Grid>
              <Grid item style={{ marginLeft: "auto" }}>
                <Button
                  onClick={() => {
                    const updateAppInfo: AppInfo = JSON.parse(
                      JSON.stringify(appInfo)
                    );
                    updateAppInfo.mayapplistState = "評価したアプリ";
                    setAppInfo(updateAppInfo);
                    (
                      document.getElementById("searchInput") as HTMLInputElement
                    ).value = "";
                    router.push(myapplist);
                  }}
                  variant="contained"
                  endIcon={<KeyboardArrowRightIcon />}
                  style={{
                    backgroundColor: "orange",
                    display: showMeEvaluationapp ? moreBtnShowStyle : "none",
                  }}
                >
                  もっとみる
                </Button>
              </Grid>
            </Grid>
            {isLoad ? (
              <MyAppCard app={evaluationapps} flg={"3"}></MyAppCard>
            ) : (
              <></>
            )}
          </Box>
        </main>
      </div>
    );
  }
};

export default Mypage;

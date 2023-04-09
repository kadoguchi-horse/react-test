import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { appInfoState } from "src/stores/AppInfoState";
import { AppInfo, App, LoginUser } from "src/types";
import appCardCss from "src/styles/AppCard.module.css";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { loginUserState } from "src/stores/LoginUserState";
import { SystemConst } from "src/const";

const MypageDownloadApp: NextPage = () => {
  {
    const [apps, setApps] = React.useState<App[]>([]);

    const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState); // 共通ステート
    const router = useRouter();

    const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));

    const len10 = 10;

    useEffect(() => {
      const sessionLoginUser = localStorage.getItem("LoginUser");

      async function fetchApps() {
        if (sessionLoginUser) {
          //登録アプリ
          const user = JSON.parse(sessionLoginUser).account_name;

          if (newAppInfo.mayapplistState === "最近ダウンロードしたアプリ") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appDownloadHistory/search?user=${user}`
            );
            const resapps = (await res.json()) as App[];
            setApps(resapps);
            console.log("apps");
            console.log(resapps);
          } else if (newAppInfo.mayapplistState === "登録したアプリ") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/search?createBy=${user}`
            );
            const resapps = (await res.json()) as App[];
            setApps(resapps);
            console.log(resapps);
          } else if (newAppInfo.mayapplistState === "評価したアプリ") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluation/searchAppEvaluation?user=${user}`
            );
            const resapps = (await res.json()) as App[];
            //重複除外
            const result = resapps.filter(
              (element, index, self) =>
                self.findIndex((e) => e.app_id === element.app_id) === index
            );
            setApps(result);
            console.log(resapps);
          }
        }
      }
      fetchApps();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setApps]);

    // アイコン・サムネイルに表示する画像が、画像変換可能か判定する。
    // 画像変換出来ないデータの場合、No_Imageの画像を表示する。
    const imgDataCheck = (imgData: string) => {
      if (imgData.includes("data:image")) {
        return imgData;
      } else {
        return SystemConst.NO_IMAGE_ICON;
      }
    };

    if (!apps) {
      return <p>読込中...</p>;
    }

    return (
      <div style={{ marginBottom: "30px" }}>
        <main>
          <h3 style={{ whiteSpace: "nowrap" }}>{newAppInfo.mayapplistState}</h3>
          <Box sx={{ flexGrow: 1 }}>
            <Grid marginBottom={2} container spacing={1}>
              {apps.map((post, index) => (
                <Grid item sm={4} xs={12} key={(post.app_id, index)}>
                  <Card
                    onClick={() => {
                      const updateappInfo: AppInfo = JSON.parse(
                        JSON.stringify(appInfo)
                      );
                      updateappInfo.selectedAppId = post.app_id;
                      updateappInfo.registerState = "更新";
                      setAppInfo(updateappInfo);
                      (
                        document.getElementById(
                          "searchInput"
                        ) as HTMLInputElement
                      ).value = "";
                      router.push("/detail");
                    }}
                    sx={{ m: 0.1 }}
                  >
                    <CardActionArea>
                      <Divider />
                      <CardContent style={{ padding: "5px 0px 0px 5px" }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container spacing={1}>
                            <Grid item sm={3} xs={2}>
                              <Box
                                sx={{
                                  borderRadius: 1,
                                  border: "1px solid",
                                  borderColor: "gray",
                                  backgroundColor: "white",
                                }}
                              >
                                <Image
                                  src={imgDataCheck(post.icon)}
                                  alt="icon"
                                  width={"250px"}
                                  height={"250px"}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={9}>
                              <Typography
                                variant="body1"
                                component="div"
                                noWrap
                              >
                                {index} : {post.app_name}
                              </Typography>
                              <div className={appCardCss.cardDescription}>
                                {post.explanation}
                              </div>
                              <Typography
                                variant="caption"
                                component="p"
                                noWrap
                              >
                                {post.create_datetime
                                  .toLocaleString()
                                  .substring(0, len10)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </main>
      </div>
    );
  }
};

export default MypageDownloadApp;

import * as React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { appInfoState } from "src/stores/AppInfoState";
import { AppInfo, App, ScreenShotDialog } from "src/types";
import appCardCss from "src/styles/AppCard.module.css";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SystemConst } from "src/const";

//表示数
export const showInitial = 6;

const MyAppCardFixation: React.FC<{ app: App[]; flg: string }> = ({
  app,
  flg,
}) => {
  const [isLoad, setIsLoad] = React.useState(false); // ロード完了

  //日付文字数
  const datelength = 10;

  const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState); // 共通ステート
  const router = useRouter();

  React.useEffect(() => {
    // ロード完了状態にする
    setIsLoad(true);
  }, []);

  // アイコン・サムネイルに表示する画像が、画像変換可能か判定する。
  // 画像変換出来ないデータの場合、No_Imageの画像を表示する。
  const imgDataCheck = (imgData: string) => {
    if (imgData.includes("data:image")) {
      return imgData;
    } else {
      return SystemConst.NO_IMAGE_ICON;
    }
  };

  if (!app) {
    return <p>読込中...</p>;
  }

  return (
    <div>
      {isLoad ? (
        app.length > 0 ? (
          <Box sx={{ flexGrow: 1 }}>
            <Grid marginBottom={2} container spacing={1}>
              {app.slice(0, showInitial).map((post, index) => (
                <Grid item sm={4} xs={12} key={index}>
                  <Card
                    onClick={() => {
                      const updateAppInfo: AppInfo = JSON.parse(
                        JSON.stringify(appInfo)
                      );
                      updateAppInfo.selectedAppId = post.app_id;
                      updateAppInfo.registerState = "更新";
                      setAppInfo(updateAppInfo);
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
                                {post.app_name}
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
                                  .substring(0, datelength)}
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
        ) : (
          <>該当するアプリがありません</>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyAppCardFixation;

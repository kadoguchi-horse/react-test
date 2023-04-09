import * as React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { appInfoState } from "src/stores/AppInfoState";
import { ScreenShotDialogState } from "src/stores/ScreenShotDialog";
import { AppInfo, App, ScreenShotDialog } from "src/types";
import appCardCss from "src/styles/AppCard.module.css";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import { SystemConst } from "src/const";

const AppCard: React.FC<{ app: App }> = ({ app }) => {
  const router = useRouter();
  const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState); // 共通ステート
  const [scrDialog, setscrDialog] = useRecoilState<ScreenShotDialog>(
    ScreenShotDialogState
  );

  // 単位値を取得
  const unitCount = (count: Number) => {
    let value = count.toString();
    let unit = "";

    if (parseFloat(count.toString()) / Number("100000000") >= 1) {
      unit = "億";
      value = (
        Math.floor(
          (parseFloat(count.toString()) / Number("100000000")) * Number("10")
        ) / Number("10")
      ).toString();
    } else if (parseFloat(count.toString()) / Number("10000") >= 1) {
      unit = "万";
      value = (
        Math.floor(
          (parseFloat(count.toString()) / Number("10000")) * Number("10")
        ) / Number("10")
      ).toString();
    }

    return Number(value).toLocaleString() + " " + unit;
  };

  // アイコン・サムネイルに表示する画像が、画像変換可能か判定する。
  // 画像変換出来ないデータの場合、No_Imageの画像を表示する。
  const imgDataCheck = (imgData: string) => {
    if (imgData.includes("data:image")) {
      return imgData;
    } else {
      return SystemConst.NO_IMAGE_ICON;
    }
  };

  return (
    <Card
      sx={{ m: 0.1 }}
      onClick={() => {
        const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
        newAppInfo.selectedAppId = app.app_id;
        newAppInfo.registerState = "更新";
        setAppInfo(newAppInfo);

        const newScrDialog: ScreenShotDialog = JSON.parse(
          JSON.stringify(scrDialog)
        );
        newScrDialog.dialogOpen = false;
        setscrDialog(newScrDialog);
        (document.getElementById("searchInput") as HTMLInputElement).value = "";
        router.push("/detail");
      }}
    >
      <CardActionArea>
        <Box
          sx={{
            flexGrow: 1,
            display: appInfo.thumbnailDisp === true ? "block" : "none",
          }}
        >
          <Image
            src={imgDataCheck(app.thumbnail_image)}
            alt="thumbnail"
            width={"600px"}
            height={"400px"}
          />
        </Box>
        <Divider />
        <CardContent style={{ padding: "5px 0px 0px 5px" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Box
                  sx={{
                    flexGrow: 1,
                    paddingTop: 0.5,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "gray",
                    backgroundColor: "white",
                  }}
                >
                  <Image
                    src={imgDataCheck(app.icon)}
                    alt="icon"
                    width={"250px"}
                    height={"250px"}
                  />
                </Box>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body1" component="div" noWrap>
                  {app.app_id} : {app.app_name}
                </Typography>
                <Typography variant="body2" component="div" noWrap>
                  提供 : {app.author_name}
                </Typography>
                <div className={appCardCss.cardDescription}>
                  {app.explanation}
                </div>
                <Typography variant="caption" component="p" noWrap>
                  DL:{unitCount(app.downloads)}
                </Typography>
                <Rating
                  name="half-rating-read"
                  defaultValue={Number(app.average_rating_score)}
                  precision={0.5}
                  size="medium"
                  readOnly
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AppCard;

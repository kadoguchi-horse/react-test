import * as React from "react";
import Head from "next/head";
import { useRecoilState } from "recoil";
import { appInfoState } from "src/stores/AppInfoState";
import { AppInfo, App } from "src/types";
import {
  SwitchShared,
  SelectSortOrder,
  SelectCategorie,
  SelectRatingFilter,
} from "src/components/molecules";
import AppList from "src/components/organisms/AppList";
import { Box, SelectChangeEvent, Typography } from "@mui/material";
import OkModal from "src/components/atoms/OkModal";

const Limit: number = 100;

export default function SearchResult() {
  const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState); // 共通ステート
  const [apps, setApps] = React.useState<App[]>([]); // アプリ情報
  const [existSession, setExistSession] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");

  // アプリ情報取得
  React.useEffect(() => {
    async function fetchApps() {
      const search =
        appInfo.searchWord === "all" ? "" : "%25" + appInfo.searchWord + "%25";
      const categorieId = appInfo.categoryId === "0" ? "" : appInfo.categoryId;
      const ratingValue =
        appInfo.ratingValue === "0" ? "" : appInfo.ratingValue;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/search?searchWord=${search}&categoryId=` +
          `${categorieId}&ratingValue=${ratingValue}&sort=${appInfo.selectedOrder}&offset=&limit=${Limit}`
      );
      const resapps = (await res.json()) as App[];
      // 重複除外
      const result = resapps.filter(
        (element, index, self) =>
          self.findIndex((e) => e.app_id === element.app_id) === index
      );
      setApps(result);
      setExistSession(true);

      if (result.length >= Limit) {
        // メッセージモーダル表示
        setModalMessage(`検索結果は上限${Limit}件です。\n検索条件を見直してください。`);
      }
    }
    fetchApps();
  }, [
    appInfo.searchWord,
    appInfo.selectedOrder,
    appInfo.categoryId,
    appInfo.ratingValue,
  ]);

  return (
    <div style={{ marginBottom: "30px" }}>
      <Head>
        <title>Application List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box style={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              whiteSpace: "nowrap",
              marginTop: 2,
              marginBottom: 1,
            }}
          >
            <Typography sx={{ flexGrow: 1 }}></Typography>
            <SwitchShared
              label="画像表示"
              checked={appInfo.thumbnailDisp}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
                newAppInfo.thumbnailDisp = Boolean(event.target.checked);
                setAppInfo(newAppInfo);
              }}
            />
          </Box>
          <Box style={{ marginBottom: "8px" }}>
            <SelectRatingFilter
              value={appInfo.ratingValue}
              onChange={(event: SelectChangeEvent) => {
                const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
                newAppInfo.ratingValue = event.target.value;
                setAppInfo(newAppInfo);
              }}
            />
            <SelectCategorie
              value={appInfo.categoryId}
              onChange={(event: SelectChangeEvent) => {
                const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
                newAppInfo.categoryId = event.target.value;
                setAppInfo(newAppInfo);
              }}
            />
            <SelectSortOrder
              value={appInfo.selectedOrder}
              onChange={(event: SelectChangeEvent) => {
                const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
                newAppInfo.selectedOrder = event.target.value;
                setAppInfo(newAppInfo);
              }}
            />
          </Box>
        </Box>
        {/* 検索結果が０件だった場合、メッセージを表示する */}
        {existSession === false ? (
          <div></div>
        ) : apps.length === 0 ? (
          <div>
            <Typography
              variant="body2"
              fontSize={"1rem"}
              style={{ marginBottom: "10px" }}
            >
              検索結果： {apps.length}件
            </Typography>
            <Typography variant="body2" fontSize={"1rem"}>
              検索キーワードにヒットするアプリは見つかりませんでした。
            </Typography>
          </div>
        ) : (
          <div>
            <Typography
              variant="body2"
              fontSize={"1rem"}
              style={{ marginBottom: "10px" }}
            >
              検索結果： {apps.length}件
            </Typography>
            <AppList apps={apps} />
          </div>
        )}
      </main>

      <OkModal
        open={modalMessage !== ""}
        onClose={() => {setModalMessage("")}}
        onClick={() => {setModalMessage("")}}
        detailText={modalMessage}
        />
    </div>
  );
}

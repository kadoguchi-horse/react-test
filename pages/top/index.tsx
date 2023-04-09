import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { appInfoState } from "src/stores/AppInfoState";
import { userInfoState } from "src/stores/UserInfoState";
import { AppInfo, Category, NotificationInfo } from "src/types";
import SwitchShared from "src/components/molecules/SwitchShared";
import AppListSwiper from "src/components/organisms/AppListSwiper";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Rating,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { HttpStatus } from "src/const";

// 「見つける」「カテゴリ」リストの型を作成する
type categoriesType = {
  id: string;
  children: Array<{ id: string }>;
};

// 「見つける」リストに表示するリストの値を作成する
const categories_find: categoriesType[] = [
  {
    id: "見つける",
    children: [
      { id: "全てのアプリ" },
      { id: "最新のアプリ" },
      { id: "評価の高いアプリ" },
      { id: "DL数の多いアプリ" },
    ],
  },
];

// 「カテゴリ」リストに表示するリストの値を作成する。
// リストの中身は、カテゴリ情報取得後に追加する。
const categories_categorie: categoriesType[] = [
  {
    id: "カテゴリ",
    children: [],
  },
];

// 「評価」リストに表示するratingの値を作成する。
const categories_rating: categoriesType[] = [
  {
    id: "評価",
    children: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }],
  },
];

export default function Top() {
  const router = useRouter();
  const [appInfo, setAppInfo] = useRecoilState<AppInfo>(appInfoState); // 共通ステート
  const [categories, setCategories] = useState<Category[]>([]); // カテゴリ情報
  const [notificationInfos, setNotificationInfos] = useState<
    NotificationInfo[]
  >([]); // お知らせ情報

  const [openLocate, setOpenLocate] = useState(true); // 「見つける」リストの表示・非表示切替
  const [openCategorie, setOpenCategorie] = useState(true); // 「カテゴリ」リストの表示・非表示切替
  const [openRating, setOpenRating] = useState(true); // 「評価」リストの表示・非表示切替
  const [openMenu, setOpenMenu] = useState(false); // メニューリストの表示・非表示切替
  const [existSession, setExistSession] = React.useState(false);

  const [isLoad, setIsLoad] = React.useState(false); // ロード完了

  const scrollToY = 100;
  const maxDateLength = 10;

  // カテゴリ検索時のページ内遷移処理
  const scrollToCategorieItem = (categorieName: string) => {
    const categorieItemPosition = (document.getElementById(
      "Field_" + categorieName
    ) as HTMLElement)!.getBoundingClientRect();
    const py = window.pageYOffset + categorieItemPosition.top;
    scrollTo(0, py - scrollToY);
  };

  // カテゴリ情報取得
  useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setExistSession(true);
    }

    async function fetchApps() {
      const res_category = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/all`
      );
      let categories_list: Category[] = [];
      if (res_category.status === HttpStatus.Code.OK) {
        categories_list = (await res_category.json()) as Category[];
        setCategories(categories_list);
      }

      // 「カテゴリ」リストに表示する一覧を取得
      if (categories_categorie[0].children.length === 0) {
        categories_list.forEach((category) => {
          const name = category.category_nm;
          categories_categorie[0].children.push({ id: name });
        });
      }

      const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
      newAppInfo.categoryId = "0";
      newAppInfo.ratingValue = "0";
      newAppInfo.selectedOrder = "3";
      setAppInfo(newAppInfo);

      // お知らせ情報を取得
      const res_notificationInfo = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notificationInfo/search?validity=1&sort=1`
      );
      let notificationInfo_list: NotificationInfo[];
      if (res_notificationInfo.status === HttpStatus.Code.OK) {
        notificationInfo_list =
          (await res_notificationInfo.json()) as NotificationInfo[];
        setNotificationInfos(notificationInfo_list);
      }

      // ロード完了状態にする
      setIsLoad(true);
    }
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCategories, setAppInfo]);

  // モバイルサイズ、デスクトップのサイズで使用する箇所が異なるため、
  // 「見つける」「カテゴリ」のリストを変数に作成
  const searchList = (
    <List disablePadding>
      {categories_find.map(({ id, children }) => (
        <Box key={id}>
          <ListItemButton
            onClick={() => {
              setOpenLocate(!openLocate);
            }}
            key={id}
          >
            <ListItem
              sx={{ py: 2, px: 3 }}
              style={{ paddingLeft: 0, paddingBottom: 0 }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" fontSize={"1rem"}>
                    {id}
                  </Typography>
                }
              ></ListItemText>
              {openLocate ? <ExpandLess key={id} /> : <ExpandMore key={id} />}
            </ListItem>
          </ListItemButton>
          <Collapse in={openLocate} key={id} timeout="auto" unmountOnExit>
            {children.map(({ id: childId }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  onClick={() => {
                    const newAppInfo: AppInfo = JSON.parse(
                      JSON.stringify(appInfo)
                    );
                    let selectedOrder = "";
                    if (childId === "全てのアプリ") {
                      selectedOrder = "3";
                    } else if (childId === "最新のアプリ") {
                      selectedOrder = "2";
                    } else if (childId === "評価の高いアプリ") {
                      selectedOrder = "1";
                    } else if (childId === "DL数の多いアプリ") {
                      selectedOrder = "3";
                    }
                    newAppInfo.categoryId = "0";
                    newAppInfo.ratingValue = "0";
                    newAppInfo.selectedOrder = selectedOrder;
                    newAppInfo.searchWord = "";
                    setAppInfo(newAppInfo);
                    (
                      document.getElementById("searchInput") as HTMLInputElement
                    ).value = "";
                    router.push(`/search`);
                  }}
                >
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
      {categories_categorie.map(({ id, children }) => (
        <Box key={id}>
          <ListItemButton
            onClick={() => {
              setOpenCategorie(!openCategorie);
            }}
            key={id}
          >
            <ListItem
              sx={{ py: 2, px: 3 }}
              style={{ paddingLeft: 0, paddingBottom: 0 }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" fontSize={"1rem"}>
                    {id}
                  </Typography>
                }
              ></ListItemText>
              {openCategorie ? (
                <ExpandLess key={id} />
              ) : (
                <ExpandMore key={id} />
              )}
            </ListItem>
          </ListItemButton>
          <Collapse in={openCategorie} key={id} timeout="auto" unmountOnExit>
            {children.map(({ id: childId }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  onClick={() => {
                    scrollToCategorieItem(childId);
                    setOpenMenu(!openMenu);
                  }}
                >
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
      {categories_rating.map(({ id, children }) => (
        <Box key={id}>
          <ListItemButton
            onClick={() => {
              setOpenRating(!openRating);
            }}
            key={id}
          >
            <ListItem
              sx={{ py: 2, px: 3 }}
              style={{ paddingLeft: 0, paddingBottom: 0 }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" fontSize={"1rem"}>
                    {id}
                  </Typography>
                }
              ></ListItemText>
              {openRating ? <ExpandLess key={id} /> : <ExpandMore key={id} />}
            </ListItem>
          </ListItemButton>
          <Collapse in={openRating} key={id} timeout="auto" unmountOnExit>
            {children.map(({ id: childId }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  onClick={() => {
                    const newAppInfo: AppInfo = JSON.parse(
                      JSON.stringify(appInfo)
                    );
                    newAppInfo.categoryId = "0";
                    newAppInfo.selectedOrder = "3";
                    newAppInfo.ratingValue = childId;
                    newAppInfo.searchWord = "";
                    setAppInfo(newAppInfo);
                    (
                      document.getElementById("searchInput") as HTMLInputElement
                    ).value = "";
                    router.push(`/search`);
                  }}
                >
                  <ListItemText>
                    <Box style={{ display: "flex" }}>
                      <Rating
                        name={"rating-read" + { childId }}
                        value={parseInt(childId)}
                        precision={1}
                        size="medium"
                        readOnly
                      />
                      <Typography style={{ paddingTop: "3px" }}>
                        {" "}
                        以上
                      </Typography>
                    </Box>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </Collapse>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </List>
  );

  if (existSession === false) {
    // セッションが破棄されている場合
    return <p>読込中...</p>;
  } else {
    return (
      <div style={{ marginBottom: "30px" }}>
        <Head>
          <title>Application List</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Grid sx={{ display: { sm: "none", xs: "block" } }}>
            <List style={{ backgroundColor: "grey" }}>
              <ListItemButton
                onClick={() => {
                  setOpenMenu(!openMenu);
                }}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body2"
                      fontSize={"1rem"}
                      fontWeight={"bold"}
                    >
                      見つける
                    </Typography>
                  }
                ></ListItemText>
                {openMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenu} timeout="auto" unmountOnExit>
                {searchList}
              </Collapse>
            </List>
          </Grid>
          <Grid container spacing={4}>
            <Grid
              item
              sx={{ display: { sm: "block", xs: "none" } }}
              lg={2}
              md={3}
              sm={4}
            >
              {searchList}
            </Grid>
            <Grid item lg={10} md={9} sm={8} xs={12}>
              <Box sx={{ display: "flex", marginTop: 3 }}>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="h6" fontWeight={"bold"}>
                    お知らせ
                  </Typography>
                  {notificationInfos.length > 0 ? (
                    <Card
                      sx={{
                        height: "8em",
                        overflowY: "scroll",
                        "&::-webkit-scrollbar": {
                          width: "1em",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#888",
                          borderRadius: "1em",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          background: "#555",
                        },
                      }}
                    >
                      <CardContent>
                        {notificationInfos.map((notificationInfo, idx) => {
                          return (
                            <React.Fragment
                              key={`notificationInfos_${notificationInfo.notification_id}`}
                            >
                              <Typography
                                key={`notificationInfos_title_${notificationInfo.notification_id}`}
                                sx={{ marginTop: idx > 0 ? "0.5em" : "0" }}
                                variant="body1"
                                component="div"
                              >
                                {notificationInfo.create_datetime
                                  .toString()
                                  .slice(0, maxDateLength)
                                  .replaceAll("-", "/")}
                                　{notificationInfo.title}
                              </Typography>
                              <Typography
                                key={`notificationInfos_details_${notificationInfo.notification_id}`}
                                variant="body1"
                                sx={{
                                  marginLeft: "10px",
                                  marginBottom: "-0.5em",
                                }}
                                component="div"
                              >
                                <div style={{ wordWrap: "break-word" }}>
                                  {notificationInfo.details
                                    .split("\n")
                                    .map((line, key) => (
                                      <span key={key}>
                                        {line}
                                        <br />
                                      </span>
                                    ))}
                                </div>
                              </Typography>
                            </React.Fragment>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ) : isLoad ? (
                    <Typography sx={{ marginLeft: "2em" }}>なし</Typography>
                  ) : (
                    <Typography sx={{ marginLeft: "2em" }}></Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ width: "100%", textAlign: "end", marginTop: "3px" }}>
                <SwitchShared
                  label="画像表示"
                  checked={appInfo.thumbnailDisp}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newAppInfo: AppInfo = JSON.parse(
                      JSON.stringify(appInfo)
                    );
                    newAppInfo.thumbnailDisp = Boolean(event.target.checked);
                    setAppInfo(newAppInfo);
                  }}
                />
              </Box>
              <div style={{ margin: "3px 0px" }}>
                <Typography
                  variant="caption"
                  fontWeight={"bold"}
                  style={{ marginBottom: "20px" }}
                >
                  新着
                </Typography>
              </div>
              <AppListSwiper categoryId="new" />
              {categories.map((category) => {
                return (
                  <div
                    key={category.category_id}
                    id={"Field_" + category.category_nm}
                  >
                    <div style={{ margin: "22px 0px" }}>
                      <Typography
                        variant="caption"
                        fontWeight={"bold"}
                        style={{ marginBottom: "5px" }}
                      >
                        {category.category_nm}
                      </Typography>
                    </div>
                    <AppListSwiper categoryId={String(category.category_id)} />
                  </div>
                );
              })}
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import {
  Stack,
  Button,
  Container,
  Modal,
  TextField,
  Card,
} from "@mui/material";
import {
  Box,
  Rating,
  Typography,
  Grid,
  TextareaAutosize,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  Evaluation,
  AppInfo,
  ScreenShotDialog,
  LoginUser,
  Category,
} from "src/types";
import { appInfoState } from "src/stores/AppInfoState";
import { ScreenShotDialogState } from "src/stores/ScreenShotDialog";
import { LabelWithOption, SelectCategoryBox } from "src/components/molecules";
import { loginUserState } from "src/stores/LoginUserState";
import PercentageGraph from "src/components/atoms/PercentageGraph";
import Swiper from "src/components/organisms/ScreenShotSwiper";
import Review from "src/components/organisms/ReviewList";
import css from "../../src/styles/detail.module.css";

const pagetitle = "Application List";

const Item = styled(Container)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
}));

// アプリマスタデータ
type testAppApi = [
  {
    app_id: string;
    app_name: string;
    explanation: string;
    category_id: string;
    app_destination_category: string;
    app_destination: string;
    author_name: string;
    icon: string;
    thumbnail_image: string;
    downloads: string;
    average_rating_score: number;
    update_datetime: string;
  }
];

type totalscore = [
  {
    score: string;
  }
];

const Datail: NextPage = () => {
  const router = useRouter();
  const [appapi, setApp] = useState<testAppApi>();
  const [, setAppInfoStates] = useRecoilState<AppInfo>(appInfoState);
  const [loginUser, setLoginUser] = useRecoilState<LoginUser>(loginUserState);
  const [total, setTotal] = useState(0);
  const [reviewtotal, setReviewtotal] = useState(0);
  const [categorieKeys, setCategorieKeys] = React.useState<string[]>([]);
  const [categorieNames, setCategorieNames] = React.useState<string[]>([]);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const [scrDialog, setscrDialog] = useRecoilState<ScreenShotDialog>(
    ScreenShotDialogState
  );
  const [appDeleteModalDisplay, setAppDeleteModalDisplay] =
    React.useState(false);

  const appInfo = useRecoilValue<AppInfo>(appInfoState);
  const [evaluation, setEvaluation] = React.useState<Evaluation[]>([]);

  const [reviewTilte, setReviewTilte] = useState("");
  const [reviewRating, setReviewRating] = React.useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const [oneScore, setOneScore] = useState("0%");
  const [twoScore, setTwoScore] = useState("0%");
  const [threeScore, setThreeScore] = useState("0%");
  const [fourScore, setFourScore] = useState("0%");
  const [fiveScore, setFiveScore] = useState("0%");

  const maxPercent = 100;
  const appDeleteTimer = 500;
  const maxDateLength = 10;

  const handleOpen = () => {
    setReviewTilte("");
    setReviewComment("");
    setOpen(true);
  };

  const contentType = { "Content-Type": "application/json" };
  const popuptranslate = "translate(-50%, -50%)";

  useEffect(() => {
    // ログイン情報取得
    const sessionLoginUser = localStorage.getItem("LoginUser");
    if (sessionLoginUser !== null) {
      setLoginUser(JSON.parse(sessionLoginUser));
    }

    async function fetchPost() {
      // パラメータが抹消されている場合、TOP画面に遷移する
      if (appInfo.selectedAppId === 0) {
        router.push("/top");
        return false;
      }

      //アプリ詳細情報
      const ressearchAppId = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/searchAppId?appId=${appInfo.selectedAppId}`
      );
      const resappapi = (await ressearchAppId.json()) as testAppApi;
      setApp(resappapi);

      const res_categorie = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/category/all`
      );
      const categories = (await res_categorie.json()) as Category[];
      // setCategories(categories_json);

      // 登録したアプリに紐づくカテゴリを取得する
      let val = [];
      val = resappapi[0].category_id.split(",");
      const key: string[] = [];
      const name: string[] = [];
      for (let i = 0; val.length > i; i++) {
        for (let j = 0; categories.length > j; j++) {
          if (val[i] === categories[j].category_id.toString()) {
            name.push(categories[j].category_nm);
            key.push(categories[j].category_id.toString());
            // didMountRef_Categorie.current = true;
            //return true;
          }
        }
      }
      setCategorieNames(name);
      setCategorieKeys(key);

      //平均スコア
      const resScore = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluation/average?appId=${appInfo.selectedAppId}`
      );
      const scoreapi = (await resScore.json()) as totalscore;
      const number = Number(scoreapi[0].score).toFixed(1);
      setTotal(Number(number));

      //評価情報
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluation/searchAppId?appId=` +
          appInfo.selectedAppId,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          DrawingRatingScore(data);
        });
      return true;
    }

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setLoginUser,
    appInfo.selectedAppId,
    setCategorieNames,
    setCategorieKeys,
  ]);

  //登録ボタン
  async function sendclick() {
    if (reviewRating > 0) {
      const requestOptions = {
        method: "POST",
        headers: contentType,
        body: JSON.stringify({
          appId: appInfo.selectedAppId,
          title: reviewTilte,
          score: reviewRating,
          assessor: loginUser.account_name,
          comment: reviewComment,
          user: "詳細画面",
        }),
      };
      await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/api/appEvaluation/create",
        requestOptions
      );
      setReviewRating(0);

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          `/api/appEvaluation/searchAppId?appId=` +
          appInfo.selectedAppId
      );
      const apps = (await res.json()) as Evaluation[];
      setEvaluation(apps.slice().reverse());
      setOpen(false);

      //平均スコア
      const resScore = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluation/average?appId=${appInfo.selectedAppId}`
      );
      const scoreapi = (await resScore.json()) as totalscore;
      const number = Number(scoreapi[0].score).toFixed(1);
      setTotal(Number(number));

      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluation/searchAppId?appId=` +
          appInfo.selectedAppId,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          DrawingRatingScore(data);

          const requestOption_update = {
            method: "POST",
            headers: contentType,
            body: JSON.stringify({
              appId: appInfo.selectedAppId,
              averageRatingScore: number,
            }),
          };
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/app/updateRatingScore`,
            requestOption_update
          );
        });

      router.push("/detail");
    } else {
      alert("評価 を入力してください。");
    }
  }

  // 評価グラフの描画とレビューの表示
  const DrawingRatingScore = (data: any) => {
    if (data) {
      let one = 0;
      let two = 0;
      let three = 0;
      let four = 0;
      let five = 0;
      for (let i = 0; i < data.length; i++) {
        switch (data[i].score) {
          case "1":
            one = one + 1;
            break;
          case "2":
            two = two + 1;
            break;
          case "3":
            three = three + 1;
            break;
          case "4":
            four = four + 1;
            break;
          case "5":
            five = five + 1;
            break;
        }
      }
      const fivecnt = (five / data.length) * maxPercent + "%";
      const fourcnt = (four / data.length) * maxPercent + "%";
      const threecnt = (three / data.length) * maxPercent + "%";
      const twocnt = (two / data.length) * maxPercent + "%";
      const onecnt = (one / data.length) * maxPercent + "%";

      setOneScore(onecnt);
      setTwoScore(twocnt);
      setThreeScore(threecnt);
      setFourScore(fourcnt);
      setFiveScore(fivecnt);
      setReviewtotal(data.length);
    }
    const getevaluation = data as Evaluation[];
    setEvaluation(getevaluation.slice().reverse());
  };

  async function DLclick() {
    //DL数更新
    const requestOptions = {
      method: "POST",
      headers: contentType,
      body: JSON.stringify({
        appId: appInfo.selectedAppId,
      }),
    };

    await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/api/app/updateDownloads",
      requestOptions
    ).then(() => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appDownloadHistory/search?user=${loginUser.account_name}&appId=${appInfo.selectedAppId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length !== 0) {
            //ダウンロード履歴更新 マイページ対応
            const requestOptions3 = {
              method: "POST",
              headers: contentType,
              body: JSON.stringify({
                app_id: appInfo.selectedAppId,
                account_name: loginUser.account_name,
              }),
            };

            fetch(
              process.env.NEXT_PUBLIC_API_BASE_URL +
                "/api/appDownloadHistory/update",
              requestOptions3
            );
          } else {
            //ダウンロード履歴登録 マイページ対応
            const requestOptions2 = {
              method: "POST",
              headers: contentType,
              body: JSON.stringify({
                app_id: appInfo.selectedAppId,
                user: loginUser.account_name,
                account_name: loginUser.account_name,
              }),
            };

            fetch(
              process.env.NEXT_PUBLIC_API_BASE_URL +
                "/api/appDownloadHistory/create",
              requestOptions2
            );
          }
        });
    });

    if (appapi) {
      window.open(appapi[0].app_destination, "_blank");
    }
  }

  // 更新画面への遷移処理
  function RegisterTransitionClick(state: string) {
    const newAppInfo: AppInfo = JSON.parse(JSON.stringify(appInfo));
    newAppInfo.registerState = state;
    newAppInfo.selectedAppId = appInfo.selectedAppId;
    setAppInfoStates(newAppInfo);
    router.push("/register");
  }

  // アプリの削除処理
  async function appDelete() {
    const requestOptions = {
      method: "POST",
      headers: contentType,
      body: JSON.stringify({
        appId: appInfo.selectedAppId,
      }),
    };
    // アプリ削除のAPIを呼び出す
    await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/api/app/delete",
      requestOptions
    );

    // ダイアログを閉じて、トップ画面へ遷移する
    setAppDeleteModalDisplay(false);
    await new Promise((resolve) => setTimeout(resolve, appDeleteTimer));
    router.push("/top");
  }

  if (!appapi /*|| !total*/) {
    return <p>読込中...</p>;
  }

  return (
    <div className="container">
      <Head>
        <title>{pagetitle}</title>
      </Head>

      <main className={css.main}>
        <div className={css.TopRegi}>
          <Grid container spacing={3} className={css.mgn}>
            <Grid item xs={3}>
              <Box sx={{ borderRadius: 1 }} width="auto">
                <Image
                  src={appapi[0].icon}
                  alt="logo"
                  width={"100%"}
                  height={"100%"}
                />
              </Box>
            </Grid>
            <Grid item xs={8}>
              <label>{appapi[0].app_name}</label>
            </Grid>
          </Grid>
          {appapi[0].app_destination_category === "0" ? (
            <Typography className={css.mgn}>
              利用数：{Number(appapi[0].downloads).toLocaleString()}
            </Typography>
          ) : (
            <Typography className={css.mgn}>
              ダウンロード数：{Number(appapi[0].downloads).toLocaleString()}
            </Typography>
          )}
          <div className={css.positonreight}>
            {appapi[0].app_destination_category === "0" ? (
              <Button
                className={css.hyoukabtn}
                color="warning"
                variant="contained"
                disableElevation
                onClick={DLclick}
                style={{ fontWeight: "600", width: "100px" }}
              >
                開く
              </Button>
            ) : (
              <Button
                className={css.hyoukabtn}
                color="warning"
                variant="contained"
                disableElevation
                onClick={DLclick}
              >
                Download
              </Button>
            )}
          </div>
          <Swiper appId={appapi[0].app_id} />
          <Card className={css.setumei}>{appapi[0].explanation}</Card>
          <Typography className={css.mgn}>カテゴリ </Typography>
          <SelectCategoryBox
            id="categoryId"
            disable={true}
            categoryKey={categorieKeys}
            categoryName={categorieNames}
          />
          <Typography className={css.mgn}>
            最終更新日 {appapi[0].update_datetime.slice(0, maxDateLength)}
          </Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography className={css.total}>
              {Number(total).toFixed(1)}
            </Typography>
            <Rating
              name="disabled"
              value={Number(total)}
              readOnly
              precision={0.5}
              sx={{ color: "orange", fontSize: { sm: "25px", xs: "17px" } }}
            />
            <Typography className={css.totalreview}>
              レビュー数:{Number(reviewtotal).toLocaleString()}件
            </Typography>
          </Grid>

          <Grid item xs={9}>
            <PercentageGraph title="5" size={fiveScore} />
            <PercentageGraph title="4" size={fourScore} />
            <PercentageGraph title="3" size={threeScore} />
            <PercentageGraph title="2" size={twoScore} />
            <PercentageGraph title="1" size={oneScore} />
          </Grid>
        </Grid>
        <Stack
          className={css.positonreight}
          direction="row"
          spacing={0.5}
          sx={{ width: "100%", display: "flex", marginTop: 1, marginBottom: 1 }}
        >
          <Button
            className={css.hyoukabtn}
            color="warning"
            variant="contained"
            disableElevation
            onClick={handleOpen}
          >
            評価する
          </Button>
        </Stack>
        {evaluation && <Review evaluation={evaluation} />}
        <Box
          style={{ textAlign: "right" }}
          display={
            loginUser.user_role === "Administrator" ||
            loginUser.user_role === "Editor"
              ? "block"
              : "none"
          }
        >
          <IconButton
            aria-label="delete"
            onClick={() => {
              setAppDeleteModalDisplay(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            aria-label="Edit"
            onClick={() => RegisterTransitionClick("更新")}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </main>

      {/* 評価登録のポップアップ */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: popuptranslate,
            width: "80vmin",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack
            spacing={1}
            justifyContent={"center"}
            style={{ marginLeft: "22px", marginRight: "22px" }}
          >
            <LabelWithOption label="評価" option="required" marginTop="0px" />
          </Stack>
          <Stack
            spacing={1}
            justifyContent={"center"}
            style={{ marginLeft: "22px", marginRight: "22px" }}
          >
            <Rating
              name="disabled"
              sx={{ color: "orange" }}
              onChange={(event, newValue) => {
                setReviewRating(newValue!);
              }}
            />
          </Stack>
          <Stack
            spacing={1}
            justifyContent={"center"}
            style={{
              marginLeft: "22px",
              marginRight: "22px",
              marginTop: "20px",
            }}
          >
            <Typography variant="body2">タイトル</Typography>
          </Stack>
          <Stack
            spacing={1}
            justifyContent={"center"}
            style={{ marginLeft: "22px", marginRight: "22px" }}
          >
            <TextField
              id="outlined-multiline-flexible"
              multiline
              maxRows={4}
              sx={{
                "& .MuiInputBase-input": {
                  color: "#000000", // 入力文字の色
                },
              }}
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "5px",
              }}
              onChange={(event) => setReviewTilte(event.target.value)}
            />
          </Stack>
          <Stack
            spacing={1}
            justifyContent={"center"}
            style={{
              marginLeft: "22px",
              marginRight: "22px",
              marginTop: "20px",
            }}
          >
            <Typography variant="body2">コメント</Typography>
          </Stack>
          <Stack
            spacing={1}
            justifyContent={"center"}
            style={{
              marginLeft: "22px",
              marginRight: "22px",
              height: "40vmin",
            }}
          >
            <TextareaAutosize
              maxRows={4}
              aria-label="maximum height"
              placeholder=""
              defaultValue=""
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "5px",
                resize: "none",
                fontFamily: "inherit",
                padding: "10px",
              }}
              onChange={(event) => setReviewComment(event.target.value)}
            />
          </Stack>
          <Stack
            spacing={1}
            justifyContent={"center"}
            style={{
              marginLeft: "22px",
              marginRight: "22px",
              marginTop: "20px",
            }}
          >
            <Button
              color="warning"
              variant="contained"
              disableElevation
              onClick={sendclick}
              style={{ width: "50px" }}
            >
              登録
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* スクリーンショットのダイアログ */}
      <dialog
        className="image-dialog"
        open={scrDialog.dialogOpen}
        onClick={() => {
          const newScrDialog: ScreenShotDialog = JSON.parse(
            JSON.stringify(scrDialog)
          );
          newScrDialog.dialogOpen = false;
          setscrDialog(newScrDialog);
        }}
        style={{
          top: "50%",
          left: "50%",
          alignItems: "center",
          justifyContent: "center",
          transform: popuptranslate,
          width: "90%",
          height: "90%",
          zIndex: "2000",
          backgroundColor: "gray",
        }}
      >
        <div className="contents">
          <Image
            src={scrDialog.dialogImage}
            layout="fill"
            objectFit="contain"
            alt=""
          />
        </div>

        {/* アプリ削除確認のダイアログ */}
      </dialog>

      <Modal
        open={appDeleteModalDisplay}
        onClose={() => {
          setAppDeleteModalDisplay(false);
        }}
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: popuptranslate,
            width: "90%",
            maxWidth: "fit-content",
            bgcolor: "background.paper",
            border: "1px solid #cccccc",
            p: 2,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography variant="subtitle2" noWrap>
              アプリを削除します。よろしいですか？
            </Typography>
            <Button
              sx={{ width: "110px", margin: "10px 10px 0px 0px" }}
              variant="contained"
              color="warning"
              onClick={appDelete}
            >
              OK
            </Button>
            <Button
              sx={{
                width: "110px",
                margin: "10px 0px 0px 0px",
                color: "black",
              }}
              variant="contained"
              color="inherit"
              onClick={() => {
                setAppDeleteModalDisplay(false);
              }}
            >
              キャンセル
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Datail;

import { Evaluation, EvaluationUseful, LoginUser } from "src/types";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Box, Typography } from "@mui/material";
import { loginUserState } from "src/stores/LoginUserState";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles/";

const Review: React.FC<{ evaluation: Evaluation }> = ({ evaluation }) => {
  const theme = useTheme();
  // カラーテーマによって文字色を変更
  const theme_EvaluationReview = createTheme({
    palette: {
      primary: {
        main: theme.palette.mode === "dark" ? "#c0c5c2" : "#4e454a",
      },
    },
  });

  const [loginUser] = useRecoilState<LoginUser>(loginUserState);
  const [usefulCount, setUsefulCount] = useState(0); // 画面に表示する評価有益件数
  const [evaluate, setEvaluate] = useState(false); // 評価済みかを判定する変数
  const [evaluated_Yes, setEvaluated_Yes] = useState(false); // 「はい」ボタン選択を判定する変数
  const [evaluated_No, setEvaluated_No] = useState(false); // 「いいえ」ボタン選択を判定する変数
  const contentType = { "Content-Type": "application/json" };
  const timer_updateUsefulCount = 200; //有益件数更新タイマー
  const timer_getUsefuCount = 800; //評価件数取得タイマー

  useEffect(() => {
    async function fetchApps() {
      // 評価人数を取得
      setUsefulCount(evaluation.useful_count);
      // 評価情報を取得
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluationUseful/search?appId=${evaluation.app_id}&seq=${evaluation.seq}&userName=${loginUser.account_name}`
      );
      const evaluationUseful_res = (await res.json()) as EvaluationUseful[];

      // レビューに対する評価情報が取得できた場合、評価ボタンを選択状態にする。
      if (evaluationUseful_res.length > 0) {
        setEvaluate(true);
        if (evaluationUseful_res[0].useful_flg === "1") {
          setEvaluated_Yes(true);
        } else if (evaluationUseful_res[0].useful_flg === "0") {
          setEvaluated_No(true);
        }
      }
    }
    fetchApps();
  }, [evaluation, loginUser]);

  // レビューの評価情報を削除
  async function evaluateDelete() {
    const requestOptions = {
      method: "POST",
      headers: contentType,
      body: JSON.stringify({
        appId: evaluation.app_id,
        seq: evaluation.seq,
        userName: loginUser.account_name,
      }),
    };
    // アプリ削除のAPIを呼び出す
    await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/api/appEvaluationUseful/delete",
      requestOptions
    );
  }

  // レビューの評価情報の登録、もしくは更新を行う。
  async function evaluateUpdate_Create(
    usefulFlg: string,
    update_Create: string
  ) {
    const requestOptions = {
      method: "POST",
      headers: contentType,
      body: JSON.stringify({
        appId: evaluation.app_id,
        seq: evaluation.seq,
        userName: loginUser.account_name,
        usefulFlg: usefulFlg,
        user: loginUser.user_name,
      }),
    };
    if (update_Create === "update") {
      // アプリの更新APIを呼び出す
      await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "/api/appEvaluationUseful/update",
        requestOptions
      );
    } else {
      // アプリの作成APIを呼び出す
      await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "/api/appEvaluationUseful/create",
        requestOptions
      );
    }
  }

  // レビューの評価有益件数を更新
  async function updateUsefulCount() {
    window.setTimeout(async () => {
      const requestOptions = {
        method: "POST",
        headers: contentType,
        body: JSON.stringify({
          appId: evaluation.app_id,
          seq: evaluation.seq,
          user: loginUser.user_name,
        }),
      };
      // レビューの評価有益件数登録のAPIを呼び出す
      await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          "/api/appEvaluation/updateUsefulCount",
        requestOptions
      );
    }, timer_updateUsefulCount);
  }

  // 評価件数を取得
  async function getUsefuCount() {
    window.setTimeout(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appEvaluation/searchAppId?appId=${evaluation.app_id}`
      );
      const evaluation_res = (await res.json()) as Evaluation[];
      // 取得したレビューから、評価連番でフィルターをかける
      const res_filter = evaluation_res.filter((evaluation_filter) => {
        return evaluation_filter.seq === evaluation.seq;
      });
      setUsefulCount(res_filter[0].useful_count);
    }, timer_getUsefuCount);
  }

  // 「はい」を選択した場合
  const evaluationUseful_Yes = () => {
    if (evaluate) {
      // すでに「はい」が選択されていた場合
      if (evaluated_Yes) {
        setEvaluated_Yes(false); // 「はい」ボタンの選択を解除
        setEvaluated_No(false); // 「いいえ」ボタンの選択を解除
        setEvaluate(false); // 判定を未評価に変更
        evaluateDelete(); // 登録されていたレビューの評価情報を削除
      } else {
        setEvaluated_Yes(true); // 「はい」ボタンを選択
        setEvaluated_No(false); // 「いいえ」ボタンの選択を解除
        evaluateUpdate_Create("1", "update"); // 評価情報を更新
      }
    } else {
      setEvaluate(true); // 判定を評価済みに変更
      setEvaluated_Yes(true); // 「はい」ボタンを選択
      evaluateUpdate_Create("1", "create"); // 評価情報を登録
    }
    updateUsefulCount(); // 評価有益件数、無益件数を更新
    getUsefuCount(); // 評価有益件数を取得
  };

  const evaluationUseful_No = () => {
    if (evaluate) {
      if (evaluated_No) {
        setEvaluated_No(false); // 「いいえ」ボタンの選択を解除
        setEvaluated_Yes(false); // 「はい」ボタンの選択を解除
        setEvaluate(false); // 判定を未評価に変更
        evaluateDelete(); // 登録されていたレビューの評価情報を削除
      } else {
        setEvaluated_No(true); // 「いいえ」ボタンを選択
        setEvaluated_Yes(false); // 「はい」ボタンの選択を解除
        evaluateUpdate_Create("0", "update"); // 評価情報を更新
      }
    } else {
      setEvaluate(true); // 判定を評価済みに変更
      setEvaluated_No(true); // 「いいえ」ボタンを選択
      evaluateUpdate_Create("0", "create"); // 評価情報を登録
    }
    updateUsefulCount(); // 評価有益件数、無益件数を更新
    getUsefuCount(); // 評価有益件数を取得
  };

  // ボタンの選択状況によって、ボタンの色を変更する。
  const bgColor_Yes = evaluated_Yes === true ? "#736d71" : "#c0c5c2";
  const bgColor_No = evaluated_No === true ? "#736d71" : "#c0c5c2";

  return (
    <div>
      <ThemeProvider theme={theme_EvaluationReview}>
        <Box>
          <Typography
            fontSize={"12px"}
            color="primary"
            style={{ marginTop: "10px" }}
          >
            {usefulCount}人のユーザが役に立ったと評価しました
          </Typography>
          <Box
            style={{ textAlign: "left" }}
            display={"flex"}
            alignItems={"center"}
          >
            <Typography fontSize={"12px"} color="primary">
              役に立ちましたか？
            </Typography>
            <Button
              // color="primary"
              variant="contained"
              size="small"
              onClick={() => evaluationUseful_Yes()}
              style={{
                borderRadius: "50px",
                marginRight: "5px",
                backgroundColor: bgColor_Yes,
                color: "#4e454a",
              }}
            >
              はい
            </Button>
            <Button
              // color="primary"
              variant="contained"
              size="small"
              onClick={() => evaluationUseful_No()}
              style={{
                borderRadius: "50px",
                backgroundColor: bgColor_No,
                color: "#4e454a",
              }}
            >
              いいえ
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Review;

import { Evaluation, LoginUser } from "src/types";
import ReviewEvaluation from "src/components/organisms/ReviewEvaluation";
import css from "src/styles/detail.module.css";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  Stack,
  Button,
  Box,
  Rating,
  Typography,
  Avatar,
  Card,
  Grid,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { loginUserState } from "src/stores/LoginUserState";

const Review: React.FC<{ evaluation: Evaluation[] }> = ({ evaluation }) => {
  //初期表示数
  const showInitial = 2;

  //さらに表示押下時追加表示数
  const morecomment = 10;

  //現在の表示数
  const [loadIndex, setLoadIndex] = useState(showInitial);

  //さらに表示ボタン：表示
  const [showMe, setShowMe] = useState(true);

  // ログインユーザ情報を取得
  const [loginUser] = useRecoilState<LoginUser>(loginUserState);

  //日時を日付だけ切り出し
  const createDatetimeMaxLength = 10;

  //ユーザアイコン(オレンジ色)のコード
  const avatarDeepOrangeCode = 500;

  useEffect(() => {
    // さらに表示表示切替
    if (loadIndex >= evaluation.length) {
      setShowMe(false);
    } else {
      setShowMe(true);
    }
  }, [evaluation, loadIndex]);

  //さらに表示押下時
  const displayMore = () => {
    setLoadIndex(loadIndex + morecomment);
  };

  return (
    <div className={css.commentmgn}>
      {evaluation.slice(0, loadIndex).map((post) => (
        <div key={post.seq} className={css.commentinterval}>
          <Card style={{ padding: "10px" }}>
            <Grid container spacing={2}>
              <Grid item xs={9} sm={10}>
                <Box
                  sx={{ width: "100%", display: "flex", alignItems: "center" }}
                >
                  <Box style={{ margin: "0px" }} sx={{ ml: 2 }}>
                    <Avatar
                      sx={{ bgcolor: deepOrange[avatarDeepOrangeCode] }}
                    ></Avatar>
                  </Box>
                  <Rating
                    name="disabled"
                    precision={0.5}
                    value={Number(post.score)}
                    readOnly
                    sx={{ color: "orange" }}
                    style={{ paddingLeft: "2px" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} sm={2}>
                <Typography component="span" style={{ fontSize: "0.8em" }}>
                  {String(post.create_datetime!).substr(
                    0,
                    createDatetimeMaxLength
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Stack
              style={{
                marginTop: "10px",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
              spacing={1}
            >
              <Typography component="legend">{post.title}</Typography>
              <Typography className={css.kansou} component="legend">
                {post.comment}
              </Typography>
            </Stack>
            {/* レビューコメントがある、かつ、匿名ログイン出ない場合に評価ボタンを表示 */}
            {post.comment.length !== 0 ? (
              loginUser.account_name !== "anonymous" ? (
                <ReviewEvaluation evaluation={post}></ReviewEvaluation>
              ) : null
            ) : null}
          </Card>
        </div>
      ))}
      <Button
        id="aa"
        onClick={displayMore}
        variant="contained"
        style={{
          display: showMe ? "block" : "none",
        }}
      >
        さらに表示
      </Button>
    </div>
  );
};

export default Review;

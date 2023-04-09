import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import { HttpStatus } from "src/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.headers["content-type"] !== "application/json" ||
    req.method !== "POST"
  ) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }

  const appId = req.body.appId;
  const seq = req.body.seq;
  const userName = req.body.userName;
  const usefulFlg = req.body.usefulFlg;
  if (!appId) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }
  if (!seq) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }
  if (!userName) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }
  if (!usefulFlg) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }

  // レビューの評価情報を更新
  models.appEvaluationUseful
    .update(
      {
        useful_flg: req.body.usefulFlg,
        update_by: req.body.user,
        update_datetime: new Date(),
        delete_flg: req.body.deleteFlg,
      },
      { where: { app_id: appId, seq: seq, user_name: userName } }
    )
    .then(function (value: any) {
      models.appEvaluationUseful.increment("modify_count", {
        where: { app_id: appId, seq: seq, user_name: userName },
      });
      res
        .status(HttpStatus.Code.OK)
        .send("t_app_evaluation_useful update success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

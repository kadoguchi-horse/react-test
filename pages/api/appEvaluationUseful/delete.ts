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

  // レビューの評価情報を削除
  models.sequelize
    .query(
      "delete from schema_name.t_app_evaluation_useful where app_id = :appId and seq = :seq and user_name = :userName",
      { replacements: { appId: appId, seq: seq, userName: userName } }
    )
    .then(function (value: string | any[]) {})
    .catch((err: any) => {
      return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });

  return res
    .status(HttpStatus.Code.OK)
    .send("t_app_evaluation_useful delete success");
}

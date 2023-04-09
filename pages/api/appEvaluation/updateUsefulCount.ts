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
  let usefulCount = 0;
  let unusefulCount = 0;

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

  // アプリ評価情報を更新
  models.appEvaluation
    .update(
      {
        useful_count: usefulCount,
        unuseful_count: unusefulCount,
        update_by: req.body.user,
        update_datetime: new Date(),
      },
      { where: { app_id: appId, seq: seq } }
    )
    .then(function () {
      // アプリ評価情報の無益件数を取得
      models.appEvaluationUseful
        .count({ where: { app_id: appId, seq: seq, useful_flg: "1" } })
        .then(function (usefuldataCount: number) {
          usefulCount = usefuldataCount;

          // アプリ評価情報の有益件数を取得
          models.appEvaluationUseful
            .count({ where: { app_id: appId, seq: seq, useful_flg: "0" } })
            .then(function (unusefuldataCount: number) {
              unusefulCount = unusefuldataCount;

              // アプリ評価情報の有益件数と無益件数を更新
              models.appEvaluation
                .update(
                  {
                    useful_count: usefulCount,
                    unuseful_count: unusefulCount,
                  },
                  { where: { app_id: appId, seq: seq } }
                )
                .then(function () {
                  // アプリ評価情報の更新数を更新
                  models.appEvaluation.increment("modify_count", {
                    where: { app_id: appId, seq: seq },
                  });
                  res
                    .status(HttpStatus.Code.OK)
                    .send("t_app_evaluation update success");
                })
                .catch((err: any) => {
                  res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
                });
            })
            .catch((err: any) => {
              res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
            });
        })
        .catch((err: any) => {
          res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
        });
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });

  return res;
}

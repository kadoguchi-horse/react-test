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
  if (!appId) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }

  // アプリマスタデータ削除
  models.sequelize
    .query("delete from schema_name.m_app where app_id = ?", { replacements: [appId] })
    .then(function () {
      // スクリーンショットデータ削除
      models.sequelize
        .query("delete from schema_name.t_app_screenshot where app_id = ?", {
          replacements: [appId],
        })
        .then(function () {
          // アプリのレビューデータを削除
          models.sequelize
            .query("delete from schema_name.t_app_evaluation where app_id = ?", {
              replacements: [appId],
            })
            .then(function () {
              // アプリのレビュに対する評価データを削除
              models.sequelize
                .query("delete from schema_name.t_app_evaluation_useful where app_id = ?", {
                  replacements: [appId],
                })
                .then(function () {})
                .catch((err: any) => {
                  return res
                    .status(HttpStatus.Code.INTERNAL_SERVER_ERROR)
                    .send(err);
                });
            })
            .catch((err: any) => {
              return res
                .status(HttpStatus.Code.INTERNAL_SERVER_ERROR)
                .send(err);
            });
        })
        .catch((err: any) => {
          return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
        });
    })
    .catch((err: any) => {
      return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });

  return res.status(HttpStatus.Code.OK).send("m_app delete success");
}

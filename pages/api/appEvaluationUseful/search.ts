import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import Sequelize from "sequelize";
import { HttpStatus } from "src/const";
const Op = Sequelize.Op;
//import Sequelize from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }

  let sql: string =
    "select * from schema_name.t_app_evaluation_useful where 0 = 0 and app_id = ? and seq = ?";

  const appId = req.query.appId;
  const seq = req.query.seq;
  const user_name = req.query.userName;

  const params = [appId, seq];

  // user_nameが渡されていた場合、条件を追加する。
  if (user_name) {
    sql = sql + " and user_name = ?";
    params.push(user_name);
  }

  // レビューの評価情報を更新
  models.sequelize
    .query(sql, { replacements: params })
    .then(function (value: string | any[]) {
      if (value && value.length > 0) {
        return res.status(HttpStatus.Code.OK).json(value[0]);
      } else {
        return res.status(HttpStatus.Code.NOT_FOUND).send("not found");
      }
    })
    .catch((err: any) => {
      return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

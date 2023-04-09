import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import Sequelize from "sequelize";
import { HttpStatus } from "src/const";
const Op = Sequelize.Op;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }

  // アプリ毎で最新の評価情報 と アプリ情報 を取得
  let sql: string =
    "select * from schema_name.m_app A " +
    "inner join (select *, rank() over(partition by app_id order by update_datetime desc) as rank from schema_name.t_app_evaluation where 0 = 0 ";

  const user = req.query.user;
  const params = [];

  if (user) {
    sql = sql + " and assessor = ?";
    params.push(user);
  }

  sql = sql + " ) B " +
    "on A.app_id = B.app_id and B.rank = 1";

  models.sequelize
    .query(sql + " order by A.update_datetime desc", {
      replacements: params,
    })
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

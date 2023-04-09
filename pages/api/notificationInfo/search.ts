import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import { HttpStatus } from "src/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }

  // クエリ条件
  let where: any = { delete_flg: "0" };
  let order: any = [["notification_id", "ASC"]];

  // クエリパラメータ
  const validity = req.query.validity;
  const sort = req.query.sort;
  // validityチェック
  if (validity !== undefined) {
    if (!Number.isNaN(parseInt(validity as string))) {
      if (validity === "1") {
        const { Op } = require("sequelize");
        // Where: 表示開始日時<=Now And 表示終了日時>=Now
        where = {
          delete_flg: where.delete_flg,
          indicates_start_date: { [Op.lt]: new Date() },
          indicates_end_date: { [Op.gt]: new Date() },
        };
      }
    } else {
      return res
        .status(HttpStatus.Code.BAD_REQUEST)
        .send("invalid parameter error:validity");
    }
  }
  // sortチェック
  if (sort !== undefined) {
    if (!Number.isNaN(parseInt(sort as string))) {
      if (sort === "1") {
        // Order: 作成日時 降順
        order = [["create_datetime", "DESC"]];
      }
    } else {
      return res
        .status(HttpStatus.Code.BAD_REQUEST)
        .send("invalid parameter error:sort");
    }
  }

  models.notificationInfo
    .findAll({
      where: where,
      order: order,
    })
    .then(function (value: string | any[]) {
      if (value && value.length > 0) {
        return res.status(HttpStatus.Code.OK).json(value);
      } else {
        return res
          .status(HttpStatus.Code.NOT_FOUND)
          .send("t_notification_info data is not found");
      }
    })
    .catch((err: any) => {
      console.log(err);
      return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

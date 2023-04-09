import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import { HttpStatus } from "src/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }

  if (req.query.limit) {
    const limit: number = +req.query.limit;
    models.user
      .findAll({ where: { delete_flg: "0" }, limit: limit, order: [] })
      .then(function (value: string | any[]) {
        if (value && value.length > 0) {
          res.status(HttpStatus.Code.OK).json(value);
        } else {
          res
            .status(HttpStatus.Code.NOT_FOUND)
            .send("m_user data is not found");
        }
      })
      .catch((err: any) => {
        console.log(err);
        res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
      });
  } else {
    models.user
      .findAll({ where: { delete_flg: "0" } })
      .then(function (value: string | any[]) {
        if (value && value.length > 0) {
          res.status(HttpStatus.Code.OK).json(value);
        } else {
          res
            .status(HttpStatus.Code.NOT_FOUND)
            .send("m_user data is not found");
        }
      })
      .catch((err: any) => {
        console.log(err);
        res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
      });
  }
}

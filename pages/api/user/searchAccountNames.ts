import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import { HttpStatus } from "src/const";
import { existsSync } from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }
  const accountNames = typeof req.query.accountNames === "string" ? req.query.accountNames.toString().split(",") : req.query.accountNames;
  if (!accountNames) {
    return res.status(HttpStatus.Code.BAD_REQUEST).send({ error: MESSAGE.BAD_REQUEST });
  } else {
    models.user
      .findAll({ where: { account_name: accountNames } })
      .then(function (value: any[]) {
        return res.status(HttpStatus.Code.OK).json(value);
      })
      .catch((err: any) => {
        console.log(err);
        return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
      });
  }
  return res;
}

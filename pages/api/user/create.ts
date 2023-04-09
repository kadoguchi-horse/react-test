import console from "console";
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
    res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }
  console.log("call m_user create");
  models.user
    .create({
      account_name: req.body.accountName,
      user_name: req.body.userName,
      user_role: req.body.userRole,
      create_by: req.body.user,
      create_datetime: new Date(),
      update_by: req.body.user,
      update_datetime: new Date(),
      modify_count: 0,
      delete_flg: "0",
    })
    .then(function (value: any) {
      res.status(HttpStatus.Code.CREATED).send("m_app create success");
    })
    .catch((err: any) => {
      console.log(err);
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
}

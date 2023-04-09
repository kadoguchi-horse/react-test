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

  const bodys: any[] = [];
  req.body.forEach(function(body: any) {
    bodys.push({
      account_name: body.accountName,
      user_name: body.userName,
      user_role: body.userRole,
      create_by: body.user,
      create_datetime: new Date(),
      update_by: body.user,
      update_datetime: new Date(),
      modify_count: 0,
      delete_flg: "0",
    });
  });

  console.log("call m_user bulkcreate");
  models.user
    .bulkCreate(bodys)
    .then(function (value: any) {
      res.status(HttpStatus.Code.CREATED).send("m_app bulkcreate success");
    })
    .catch((err: any) => {
      console.log(err);
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
}

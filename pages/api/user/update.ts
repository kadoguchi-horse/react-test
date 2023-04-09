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

  const accountName = req.body.accountName;
  if (!accountName) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }

  models.user
    .update(
      {
        user_name: req.body.userName,
        user_role: req.body.userRole,
        update_by: req.body.user,
        update_datetime: new Date(),
        delete_flg: req.body.deleteFlg,
      },
      { where: { account_name: accountName } }
    )
    .then(function (value: any) {
      models.user.increment("modify_count", {
        where: { account_name: accountName },
      });
      res.status(HttpStatus.Code.OK).send("m_user update success");
    })
    .catch((err: any) => {
      console.log(err);
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

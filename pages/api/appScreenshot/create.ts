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

  models.appScreenshot
    .max("seq", { where: { app_id: [req.body.appId] } })
    .then(function (value: number) {
      models.appScreenshot
        .create({
          app_id: req.body.appId,
          seq: Number(value) + 1,
          image: req.body.image,
          create_by: req.body.user,
          create_datetime: new Date(),
          update_by: req.body.user,
          update_datetime: new Date(),
          modify_count: 0,
          delete_flg: "0",
        })
        .then(function () {
          res
            .status(HttpStatus.Code.CREATED)
            .send("t_app_screenshot create success");
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

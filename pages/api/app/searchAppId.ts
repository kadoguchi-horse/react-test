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

  const appId = req.query.appId;
  if (!appId) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  } else {
    models.app
      .findAll({ where: { app_id: appId, delete_flg: "0" } })
      .then(function (value: string | any[]) {
        if (value && value.length > 0) {
          return res.status(HttpStatus.Code.OK).json(value);
        } else {
          return res
            .status(HttpStatus.Code.NOT_FOUND)
            .send("m_app data is not found");
        }
      })
      .catch((err: any) => {
        return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
      });
    return res;
  }
}

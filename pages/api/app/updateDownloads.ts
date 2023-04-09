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

  const appId = req.body.appId;
  if (!appId) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }

  models.sequelize
    .query(
      "update schema_name.m_app set(downloads, update_datetime, update_by, modify_count) = (downloads+1, current_timestamp, 'system', modify_count+1) where app_id = ?",
      { replacements: [appId] }
    )
    .then(function (value: any) {
      res.status(HttpStatus.Code.OK).send("m_app update success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

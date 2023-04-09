import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import { HttpStatus } from "src/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.headers["content-type"] !== "application/json" &&
    req.method !== "POST"
  ) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }

  const accountName = req.body.account_name;
  const appId = req.body.app_id;
  if (!accountName || !appId) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }

  models.appDownloadHistory
    .update(
      {
        account_name: req.body.account_name,
        app_id: req.body.app_id,
        update_datetime: new Date(),
      },
      { where: { account_name: accountName, app_id: appId } }
    )
    .then(function (value: any) {
      models.category.increment("modify_count", {
        where: { account_name: accountName, app_id: appId },
      });

      res
        .status(HttpStatus.Code.OK)
        .send("t_app_download_history update success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

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
  const ratingScore = req.body.averageRatingScore;

  if (!appId || !ratingScore) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }

  models.sequelize
    .query(
      "update schema_name.m_app set(average_rating_score, update_datetime, update_by, modify_count) = (:ratingScore, current_timestamp, 'system', modify_count+1) where app_id = :appId",
      { replacements: { ratingScore: ratingScore, appId: appId } }
    )
    .then(function (value: any) {
      res.status(HttpStatus.Code.OK).send("m_app update success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

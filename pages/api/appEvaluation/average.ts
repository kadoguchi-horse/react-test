import { METHODS } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import { HttpStatus } from "src/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (!req.query.appId) {
      res
        .status(HttpStatus.Code.BAD_REQUEST)
        .json({ message: "The appId is a must" });
    } else {
      models.sequelize
        .query(
          "SELECT AVG(score) as score FROM schema_name.t_app_evaluation where app_id = :app_id",
          { replacements: { app_id: req.query.appId } }
        )
        .then(function (value: any[]) {
          res.status(HttpStatus.Code.OK).json(value[0]);
        });
    }
  }
}

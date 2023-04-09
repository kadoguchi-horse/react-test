import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import { HttpStatus } from "src/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  models.category
    .findAll({ order: ["sort_no"] })
    .then(function (value: string | any[]) {
      if (value && value.length > 0) {
        res.status(HttpStatus.Code.OK).json(value);
      } else {
        res.status(HttpStatus.Code.NOT_FOUND);
      }
    });
}

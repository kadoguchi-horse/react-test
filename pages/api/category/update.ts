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

  const categoryId = req.body.categoryId;
  if (!categoryId) {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ error: MESSAGE.BAD_REQUEST });
  }

  models.category
    .update(
      {
        category_nm: req.body.categoryName,
        sort_no: req.body.sortNo,
        update_by: req.body.user,
        update_datetime: new Date(),
        delete_flg: req.body.deleteFlg,
      },
      { where: { category_id: categoryId } }
    )
    .then(function (value: any) {
      models.category.increment("modify_count", {
        where: { category_id: categoryId },
      });

      res.status(HttpStatus.Code.OK).send("m_category update success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

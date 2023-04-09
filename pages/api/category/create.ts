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
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }
  models.category
    .create({
      category_nm: req.body.categoryName,
      general_field1: "",
      disp_nm1: "",
      general_field2: "",
      disp_nm2: "",
      general_field3: "",
      disp_nm3: "",
      general_field4: "",
      disp_nm4: "",
      general_field5: "",
      disp_nm5: "",
      sort_no: req.body.sortNo,
      create_by: req.body.user,
      create_datetime: new Date(),
      update_by: req.body.user,
      update_datetime: new Date(),
      modify_count: 0,
      delete_flg: "0",
    })
    .then(function (value: any) {
      res.status(HttpStatus.Code.CREATED).send("m_category create success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

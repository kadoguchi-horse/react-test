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

  models.app
    .create({
      app_name: req.body.appName,
      explanation: req.body.explanation,
      category_id: req.body.categoryId,
      app_destination_category: req.body.appDestinationCategory,
      app_destination: req.body.appDestination,
      author_name: req.body.authorName,
      icon: req.body.icon,
      thumbnail_image: req.body.thumbnailImage,
      downloads: 0,
      average_rating_score: 0.0,
      create_by: req.body.user,
      create_datetime: new Date(),
      update_by: req.body.user,
      update_datetime: new Date(),
      modify_count: 0,
      delete_flg: "0",
    })
    .then(function () {
      if (req.body.screenshots && req.body.screenshots.length > 0) {
        // 登録直後のapp_id を取得
        models.sequelize
          .query("select last_value from m_app_app_id_seq")
          .then(function (value: string | any[]) {
            if (value && value.length > 0) {
              const createAppId = value[0][0].last_value;
              const screenshots = req.body.screenshots as string[];
              screenshots.forEach((image, index, arr) => {
                models.appScreenshot
                  .create({
                    app_id: createAppId,
                    seq: index + 1,
                    image: image,
                    create_by: req.body.user,
                    create_datetime: new Date(),
                    update_by: req.body.user,
                    update_datetime: new Date(),
                    modify_count: 0,
                    delete_flg: "0",
                  })
                  .then(function () {
                    // success
                  })
                  .catch((err: any) => {
                    return res
                      .status(HttpStatus.Code.INTERNAL_SERVER_ERROR)
                      .send(err);
                  });
              });
              return res.status(HttpStatus.Code.CREATED).json(createAppId);
            } else {
              return res
                .status(HttpStatus.Code.NOT_FOUND)
                .send("appid not found");
            }
          })
          .catch((err: any) => {
            return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
          });
      }
      res.status(HttpStatus.Code.CREATED).send("m_app create success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

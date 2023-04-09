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

  models.app
    .update(
      {
        app_name: req.body.appName,
        explanation: req.body.explanation,
        category_id: req.body.categoryId,
        app_destination_category: req.body.appDestinationCategory,
        app_destination: req.body.appDestination,
        author_name: req.body.authorName,
        icon: req.body.icon,
        thumbnail_image: req.body.thumbnailImage,
        update_by: req.body.user,
        update_datetime: new Date(),
      },
      { where: { app_id: appId } }
    )
    .then(function () {
      models.app.increment("modify_count", { where: { app_id: appId } });

      // スクリーンショットテーブルの更新（DELETE → INSERTで洗い替えする
      models.sequelize
        .query("delete from schema_name.t_app_screenshot where app_id = ?", {
          replacements: [appId],
        })
        .then(function () {
          const screenshots = req.body.screenshots as string[];
          screenshots.forEach((image, index, arr) => {
            models.appScreenshot
              .create({
                app_id: appId,
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
        })
        .catch((err: any) => {
          return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
        });

      res.status(HttpStatus.Code.OK).send("m_app update success");
    })
    .catch((err: any) => {
      res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

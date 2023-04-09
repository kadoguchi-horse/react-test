import type { NextApiRequest, NextApiResponse } from "next";
import models from "../../../models/index";
import MESSAGE from "../const/Message";
import Sequelize from "sequelize";
import { HttpStatus } from "src/const";
const Op = Sequelize.Op;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(HttpStatus.Code.BAD_REQUEST)
      .send({ message: MESSAGE.BAD_REQUEST });
  }

  let sql: string =
    "select * from (select app_id,app_name, regexp_split_to_table(coalesce((case when category_id = '' then NULL else category_id end), '0'),',') as category_id," +
    "explanation,app_destination_category,app_destination ,author_name,icon,thumbnail_image,downloads,average_rating_score," +
    "create_by,create_datetime,update_by,update_datetime,modify_count,delete_flg from schema_name.m_app) app where 0 = 0";

  const searchWord = req.query.searchWord;
  const sort = req.query.sort;
  const categoryId = req.query.categoryId;
  const ratingValue = req.query.ratingValue;
  const offset = req.query.offset;
  const limit = req.query.limit;
  const createBy = req.query.createBy;
  const params = [];

  if (searchWord) {
    sql = sql + " and (app_name like ? or explanation like ?)";
    params.push(searchWord);
    params.push(searchWord);
  }

  if (categoryId) {
    if (!Number.isNaN(parseInt(categoryId as string))) {
      sql = sql + " and category_id = ?";
      params.push(categoryId);
    } else {
      return res
        .status(HttpStatus.Code.BAD_REQUEST)
        .send("invalid parameter error:categoryId");
    }
  }

  if (ratingValue) {
    if (!Number.isNaN(parseInt(ratingValue as string))) {
      sql = sql + " and average_rating_score >= ?";
      params.push(ratingValue);
    } else {
      return res
        .status(HttpStatus.Code.BAD_REQUEST)
        .send("invalid parameter error:ratingValue");
    }
  }

  if (createBy) {
    sql = sql + " and create_by  = ?";
    params.push(createBy);
  }

  if (sort) {
    if (!Number.isNaN(parseInt(sort as string))) {
      switch (sort) {
        case "1":
          sql = sql + " order by average_rating_score desc, app_id";
          break;
        case "2":
          sql = sql + " order by create_datetime desc, app_id";
          break;
        case "3":
          sql = sql + " order by downloads desc, app_id";
          break;
        default:
          sql = sql + " order by app_id";
      }
    } else {
      return res
        .status(HttpStatus.Code.BAD_REQUEST)
        .send("invalid parameter error:sort");
    }
  }

  if (offset) {
    if (!Number.isNaN(parseInt(offset as string))) {
      sql = sql + " offset ? ";
      params.push(offset);
    } else {
      return res
        .status(HttpStatus.Code.BAD_REQUEST)
        .send("invalid parameter error:offset");
    }
  }

  if (limit) {
    if (!Number.isNaN(parseInt(limit as string))) {
      sql = sql + " limit ? ";
      params.push(limit);
    } else {
      return res
        .status(HttpStatus.Code.BAD_REQUEST)
        .send("invalid parameter error:limit");
    }
  }

  models.sequelize
    .query(sql, { replacements: params })
    .then(function (value: string | any[]) {
      if (value && value.length > 0) {
        return res.status(HttpStatus.Code.OK).json(value[0]);
      } else {
        return res.status(HttpStatus.Code.NOT_FOUND).send("not found");
      }
    })
    .catch((err: any) => {
      return res.status(HttpStatus.Code.INTERNAL_SERVER_ERROR).send(err);
    });
  return res;
}

import Sequelize from "sequelize";
import category from "./category";
import app from "./app";
import appEvaluation from "./appEvaluation";
import appEvaluationUseful from "./appEvaluationUseful";
import appScreenshot from "./appScreenshot";
import user from "./user";
import notificationInfo from "./notificationInfo";
import appDownloadHistory from "./appDownloadHistory"; //ダウンロード履歴登録 マイページ対応

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

let sequelize: Sequelize.Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize.Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize.Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// 2022/09/14 T.Usagi 型エラー解消の為に追加
interface database {
  [key: string]: any;
}

const db: database = {
  category: category.initialize(sequelize),
  app: app.initialize(sequelize),
  appEvaluation: appEvaluation.initialize(sequelize),
  appEvaluationUseful: appEvaluationUseful.initialize(sequelize),
  appScreenshot: appScreenshot.initialize(sequelize),
  user: user.initialize(sequelize),
  notificationInfo: notificationInfo.initialize(sequelize),
  appDownloadHistory: appDownloadHistory.initialize(sequelize), //ダウンロード履歴登録 マイページ対応
  sequelize: sequelize,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;

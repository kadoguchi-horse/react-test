import { Sequelize, Model, DataTypes } from "sequelize";

export default class appScreenshot extends Model {
  public app_id!: number;
  public seq!: number;
  public image!: string;

  public create_by!: string;
  public create_datetime!: Date;
  public update_by!: string;
  public update_datetime!: Date;
  public modify_count!: number;
  public delete_flg!: number;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        app_id: {
          type: DataTypes.NUMBER,
          primaryKey: true,
          allowNull: false,
        },
        seq: {
          type: DataTypes.NUMBER,
          primaryKey: true,
          allowNull: false,
        },
        image: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        create_by: {
          type: DataTypes.STRING(),
          allowNull: false,
        },
        create_datetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        update_by: {
          type: DataTypes.STRING(),
          allowNull: false,
        },
        update_datetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        modify_count: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        delete_flg: {
          type: DataTypes.CHAR(1),
          allowNull: false,
        },
      },
      {
        tableName: "t_app_screenshot",
        sequelize: sequelize,
        timestamps: false,
        schema: 'schema_name',
      }
    );
    return this;
  }
}

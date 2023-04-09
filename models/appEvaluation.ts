import { Sequelize, Model, DataTypes } from "sequelize";

export default class appEvaluation extends Model {
  public app_id!: number;
  public seq!: number;
  public title!: string;
  public score!: number;
  public assessor!: string;
  public comment!: string;
  public useful_count!: number;
  public unuseful_count!: number;
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
        title: {
          type: DataTypes.STRING(),
          allowNull: false,
          defaultValue: "",
        },
        score: {
          type: DataTypes.NUMBER,
          allowNull: true,
          defaultValue: "",
        },
        assessor: {
          type: DataTypes.STRING(),
          allowNull: false,
          defaultValue: "",
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: "",
        },
        useful_count: {
          type: DataTypes.NUMBER,
          allowNull: false,
          defaultValue: 0,
        },
        unuseful_count: {
          type: DataTypes.NUMBER,
          allowNull: false,
          defaultValue: 0,
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
        tableName: "t_app_evaluation",
        sequelize: sequelize,
        timestamps: false,
        schema: 'schema_name',
      }
    );
    return this;
  }
}

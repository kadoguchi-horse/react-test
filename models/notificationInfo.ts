import { Sequelize, Model, DataTypes } from "sequelize";

export default class notificationInfo extends Model {
  public notification_id!: number;
  public indicates_start_date!: Date;
  public indicates_end_date!: Date;
  public notification_date!: Date;
  public title!: string;
  public details!: string;

  public create_by!: string;
  public create_datetime!: Date;
  public update_by!: string;
  public update_datetime!: Date;
  public modify_count!: number;
  public delete_flg!: number;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        notification_id: {
          type: DataTypes.NUMBER,
          primaryKey: true,
          allowNull: false,
        },
        indicates_start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        indicates_end_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        notification_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(),
          allowNull: false,
        },
        details: {
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
        tableName: "t_notification_info",
        sequelize: sequelize,
        timestamps: false,
        schema: 'schema_name',
      }
    );
    return this;
  }
}

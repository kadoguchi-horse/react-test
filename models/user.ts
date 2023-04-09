import { Sequelize, Model, DataTypes } from "sequelize";

export default class user extends Model {
  public account_name!: string;
  public user_name!: string;
  public user_role!: string;

  public create_by!: string;
  public create_datetime!: Date;
  public update_by!: string;
  public update_datetime!: Date;
  public modify_count!: number;
  public delete_flg!: number;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        account_name: {
          type: DataTypes.STRING(),
          primaryKey: true,
          allowNull: false,
        },
        user_name: {
          type: DataTypes.STRING(),
          allowNull: false,
        },
        user_role: {
          type: DataTypes.STRING(),
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
        tableName: "m_user",
        sequelize: sequelize,
        timestamps: false,
        schema: 'schema_name',
      }
    );
    return this;
  }
}

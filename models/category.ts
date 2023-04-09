import { Sequelize, Model, DataTypes } from "sequelize";

export default class category extends Model {
  public category_id!: number;
  public category_nm!: string;
  public general_field1!: string;
  public disp_nm1!: string;
  public general_field2!: string;
  public disp_nm2!: string;
  public general_field3!: string;
  public disp_nm3!: string;
  public general_field4!: string;
  public disp_nm4!: string;
  public general_field5!: string;
  public disp_nm5!: string;
  public delete_flg!: string;
  public sort_no!: number;

  //public readonly create_datetime!: Date;
  //public readonly update_datetime!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        category_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        category_nm: {
          type: DataTypes.STRING(),
          allowNull: true,
          defaultValue: "",
        },
        general_field1: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        disp_nm1: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        general_field2: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        disp_nm2: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        general_field3: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        disp_nm3: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        general_field4: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        disp_nm4: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        general_field5: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        disp_nm5: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: "",
        },
        sort_no: {
          type: DataTypes.INTEGER,
          allowNull: true,
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
        tableName: "m_category",
        sequelize: sequelize,
        timestamps: false,
        schema: 'schema_name',
      }
    );
    return this;
  }
}

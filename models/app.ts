import { Sequelize, Model, DataTypes } from 'sequelize';
import { CreatedAt, UpdatedAt } from 'sequelize-typescript';

export default class app extends Model {
  public app_id!: number;
  public app_name!: string;
  public explanation!: string;
  public category_id!: string;
  public app_destination_category!: string;
  public app_destination!: string;
  public author_name!: string;
  public icon!: string;
  public thumbnail_image!: string;
  public downloads!: string;
  public average_rating_score!: string;

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
          autoIncrement: true,
          allowNull: false,
        },
        app_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        explanation: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        category_id: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: '',
        },
        app_destination_category: {
          type: DataTypes.CHAR(1),
          allowNull: false,
          defaultValue: '',
        },
        app_destination: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        author_name: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
        },
        icon: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        thumbnail_image: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        downloads: {
          type: DataTypes.NUMBER,
          allowNull: true,
          defaultValue: '',
        },
        average_rating_score: {
          type: DataTypes.NUMBER,
          allowNull: true,
          defaultValue: '',
        },
        create_by: {
          type: DataTypes.STRING,
          allowNull: false
        },
        create_datetime: {
          type: DataTypes.DATE,
          allowNull: false
        },
        update_by: {
          type: DataTypes.STRING,
          allowNull: false
        },
        update_datetime: {
          type: DataTypes.DATE,
          allowNull: false
        },
        modify_count: {
          type: DataTypes.NUMBER,
          allowNull: false
        },
        delete_flg: {
          type: DataTypes.CHAR(1),
          allowNull: false
        }
      }, {
        tableName: 'm_app',
        sequelize: sequelize,
        timestamps: false,
        schema: 'schema_name',
      }
    );
    return this;
  }
}
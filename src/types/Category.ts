// カテゴリマスタ
type Category = {
  category_id: number;      // カテゴリID
  category_nm: string;      // カテゴリ名称
  general_field1: string;   // 汎用項目1
  disp_nm1: string;         // 表示名1
  general_field2: string;   // 汎用項目2
  disp_nm2: string;         // 表示名2
  general_field3: string;   // 汎用項目3
  disp_nm3: string;         // 表示名3
  general_field4: string;   // 汎用項目4
  disp_nm4: string;         // 表示名4
  general_field5: string;   // 汎用項目5
  disp_nm5: string;         // 表示名5
  sort_no: number;          // 表示順
  create_by: string;        // 作成者
  create_datetime: Date;    // 作成日時
  update_by: string;        // 最終更新者
  update_datetime: Date;    // 最終更新日時
  modify_count: number;     // 更新数
  delete_flg: string;       // 削除フラグ
};

export default Category;

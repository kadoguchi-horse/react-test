/** HTTP レスポンス ステータス */
export namespace HttpStatus {
  /** コード */
  export namespace Code {
    export const OK = 200; // 正常
    export const CREATED = 201; // 正常、リソース作成
    export const BAD_REQUEST = 400; // 構文が無効である
    export const NOT_FOUND = 404; // リクエストされたリソースなし
    export const INTERNAL_SERVER_ERROR = 500; // サーバー側での何かしらのエラー
  }

  /** メッセージ */
  export namespace Message {
    export const BAD_REQUEST = "Bad Request"; // 400
  }
}

export default HttpStatus;

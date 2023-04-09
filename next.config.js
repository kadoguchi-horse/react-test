// 2023-03-16 Add usagibarai　
// セキュリティヘッダーの追加
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'sameorigin'
  },
  {
    key: 'Referrer-Policy',
    value: 'no-referrer',
  },
];
module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,   // 2023-03-17 Add usagibarai X-Powered-By remove
  async headers() {
    return [
      {
        // これらのヘッダーをアプリケーションのすべてのルートに適用します。
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
};

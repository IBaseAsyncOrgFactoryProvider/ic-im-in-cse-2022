
## 怎麼 build
這樣一坨麵條格式又亂，ESLint 跟 Prettier 還會打架的 repo，到底是哪個沒水準的寫的～～

我只測過 Node.js 18 / macOS 12 這個環境，npm script 我用了 rm、cp、mv，用 Windows 的人要自己修

1. 請你先在 functions/ 底下跑 `npm install`
2. 回到 repo 頂層，下 `npm install`
3. 下 `npm run export`
4. 這時候你要把 out/ 搬到 repo 外面，遠離 node_modules，不然當你要用 wrangler publish 的時候，它會很想分析你的 node_modules（明明我就幫你 bundle 好了！），會炸掉

Firebase Realtime Database 要記得加上 `.indexOn` 的規則：
```json
{
  "rules": {
    "authAuditLogs": {
      ".indexOn": ["target"]
    },
    "signups": {
      ".indexOn": ["owner"]
    }
  }
}
```

## Environment variables
```ts
export type Env = {
  GRECAPTCHA_SECRET: string

  // 你可以看程式碼寫一個 API 一樣的服務:)
  SMTP_BRIDGE_TOKEN: string
  MAIL_FROM: string
  FIREBASE_RTDB_URL: string

  // 這是 json
  FIREBASE_SERVICE_ACCOUNT_CREDENTIALS: string
  JWT_SECRET: string
}
```

## -
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

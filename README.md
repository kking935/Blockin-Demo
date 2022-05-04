## Blockin Demo

Welcome to the Blockin Demo! Blockin is a JavaScript library built to provide a flexible foundation for resource providers to implement role-based access control, dynamic resource owner privileges, and expiration tokens on-chain through a two-step process. The first step, authorization, creates an on-chain asset which is to be presented as an access token when interacting with a resource. The second step, authentication, verifies ownership of an asset through querying the blockchain and cryptographic digital signatures.

The Blockin library can be found at [`Blockin`](https://github.com/matt-davison/blockin). Blockin is supposed to be a flexible, generic interface that can be implemented on any blockchain infrastructure. In this demo, we show how Blockin can be used by creating auhtorization assets on Algorand and using the Blockin library as a module within React dApp. 

The authorizing resource's backend is simulated in src/pages/api. For an actual implementation, this API should be hosted elsewhere, but it is done like this for convenience purposes. Here, we make use of local secrets using process.env variables defined in the .env file. Anything not in this api folder should never use the Blockin library.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Second, you will need to create a .env file with a sample passphrase and all valid API links and secrets. An example is provided at .env.example.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

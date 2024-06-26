# Scrapper

👋 Welcome to the Scrapper project! 🚀

To get started, follow these steps:

1. Create a new file called `config.ts` inside the `src` folder.

2. Copy and paste the following content into `config.ts`:

```typescript
export const config = {
    OUTPUT_DIR: "output",
    DB_CONFIG: {
        database: "{database}",
        hostname: "{hostname}",
        password: "{password}",
        port: 5432,
        user: "{user}",
    },
};
```

Make sure to replace the placeholders `{database}`, `{hostname}`, `{password}`, and `{user}` with your own values.

That's it! You're all set to start using the Scrapper project. Happy coding! 😄🎉

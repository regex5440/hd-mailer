declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      JWT_SECRET: string;
      SMTP_SERVER: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
      SMTP_PORT: string;
      EMAIL_DOMAIN: string;
    }
  }
}

export {};

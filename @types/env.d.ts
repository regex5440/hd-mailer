declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      HTTP_PORT: string;
      JWT_SECRET: string;
      CERTIFICATE: string;
      CERTIFICATE_KEY: string;
      CERTIFICATE_PASSPHRASE: string;
      SMTP_SERVER: string;
      SMTP_USERNAME: string;
      SMTP_PASSWORD: string;
      SMTP_PORT: string;
      EMAIL_DOMAIN: string;
    }
  }
}

export {};

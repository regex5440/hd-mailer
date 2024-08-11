### HD-Mailer (LEGACY) | LATEST DEPLOYMENT FROM BRANCH:[main-v2](https://github.com/regex5440/hd-mailer/tree/main-v2)

> Mailing service API to be used by different apps.
> Currently live [here](https://mailer2.hdxdev.in)↗️

## Pre-requisites

- Node >= 20.10.0
- Docker
- docker-compose [gist](https://gist.github.com/npearce/6f3c7826c7499587f00957fee62f8ee9#docker-compose-install)↗️

## Stack & Utilities

- [ExpressJs](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zookeeper + Kafka (by confluent)](https://www.confluent.io/)
- [jose (jwt)](https://github.com/panva/jose)
- [NodeMailer](https://www.nodemailer.com/)
- [Zod](https://zod.dev/)

## Setup & Usage

> Requires a `.env` file to be at the root, with required variables (as mentioned below)

### Development Flow

1. Spin-up the kafka service (exposed at port 9092)
   ```
   npm run kafka
   ```
2. For new containers, create kafka topic:
   ```
   npm run create-topic
   ```
3. Start in dev mode:
   ```
   npm run dev
   ```

### Production Flow

> Everything is handled with `npm start`

## Environment Variables

NOTE: Values must be without quotes

```
JWT_SECRET=<JWT secret key to be used for static token>
HTTP_PORT=<Only used for http server> (optional, default 6432)
SMTP_SERVER=<SMTP host url>
SMTP_PORT=<SMTP port> (optional, default 465)
SMTP_USERNAME=<SMTP email username>
SMTP_PASSWORD=<SMTP email password>
EMAIL_DOMAIN=<SMTP email registered for>
```

## API Methods

-> `POST: /mail`

> - Headers
>
> ```
>  "Content-Type": "application/json",
>  "Authorization": "Bearer <Static Token>"
> ```

> - JSON body example:
>
> ```
>  {
>    "fromService": "Harsh",
>    "toEmail": "harshdagar@hdxdev.in",
>    "subject": "Test Email Subject",
>    "html": "<h1>Test Email Body</h1>",
>    "allowReply": true  // Optional. If false, sending email: noreply@<process.env.EMAIL_DOMAIN> else process.env.SMTP_USERNAME
>
>  }
> ```

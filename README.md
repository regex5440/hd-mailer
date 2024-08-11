### HD-Mailer

> Mailing service API to be used by different apps.
> Currently live [here](https://mailer.hdxdev.in)↗️

## Pre-requisites

- Node >= 20.10.0

## Stack & Utilities

- [TypeScript](https://www.typescriptlang.org/)
- [jose (jwt)](https://github.com/panva/jose)
- [NodeMailer](https://www.nodemailer.com/)
- [Zod](https://zod.dev/)

## Setup Environment Variables

Requires a `.env` file to be at the root, with required variables (as mentioned below)

NOTE: Values must be without quotes

```

// Producer Lambda
SQS_URL=<SQS Url for producer lambda>
JWT_SECRET=<JWT secret key to be used for static token>
AWS_REGION=<AWS lambda region, can only be used for local-setup>

// Consumer Lambda
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

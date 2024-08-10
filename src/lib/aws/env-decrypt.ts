import {
  KMSClient,
  DecryptCommand,
  DecryptCommandInput,
} from "@aws-sdk/client-kms";

const client = new KMSClient({ region: process.env.AWS_REGION });

export default async function decryptEnvVar(name: string) {
  try {
    const encrypted = process.env[name] as string;
    const req: DecryptCommandInput = {
      CiphertextBlob: Buffer.from(encrypted, "base64"),
      EncryptionContext: {
        LambdaFunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME as string,
      },
    };
    const command = new DecryptCommand(req);
    const response = await client.send(command);
    const decrypted = new TextDecoder().decode(response.Plaintext);

    process.env[name] = decrypted;
    return decrypted;
  } catch (err) {
    console.log("Decrypt error:", err);
    throw err;
  }
}

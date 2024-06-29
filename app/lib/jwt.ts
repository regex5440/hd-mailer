import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET);

export const isTokenValid = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, JWT_SECRET, {
      algorithms: ["RSA256"],
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const generateStaticToken = async () => {
  return new SignJWT({ issuedBy: "https://hdxdev.in", service: "hd.mailer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(JWT_SECRET);
};

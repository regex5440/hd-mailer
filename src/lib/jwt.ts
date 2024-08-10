import { SignJWT, jwtVerify } from "jose";

const getEncodedSecret = () => {
  const encoder = new TextEncoder();
  return encoder.encode(process.env.JWT_SECRET);
};

export const isTokenValid = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, getEncodedSecret(), {
      algorithms: ["HS256"],
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
    .sign(getEncodedSecret());
};

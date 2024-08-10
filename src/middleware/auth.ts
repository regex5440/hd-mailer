// THis middleware will only validate a JWT static token provided in request authorization header as Bearer token
import { isTokenValid } from "../lib/jwt.js";

export default (authorizationHeader: string) => {
  try {
    if (!authorizationHeader) {
      throw new Error("Missing authorization header");
    }
    return isTokenValid(authorizationHeader.replace("Bearer ", ""));
  } catch (error) {
    return false;
  }
};

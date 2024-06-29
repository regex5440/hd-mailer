// THis middleware will only validate a JWT static token provided in request authoriztion header as Bearer token
import { Request, Response, NextFunction } from "express";
import {} from "jose";
import { isTokenValid } from "../lib/jwt.js";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const isAuthentic = isTokenValid(token);
    if (!isAuthentic) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

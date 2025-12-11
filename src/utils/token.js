import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.ACCESS_SECRET, {
    expiresIn: jwtConfig.ACCESS_EXPIRES_IN,
  });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.REFRESH_SECRET, {
    expiresIn: jwtConfig.REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, jwtConfig.ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.REFRESH_SECRET);
};
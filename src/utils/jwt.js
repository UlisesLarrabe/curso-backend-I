import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createToken = (user) => {
  const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "1h" });
  return token;
};

export const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded;
};

export const getJWTCookie = (req) => {
  let token = null;
  if (req.signedCookies) {
    token = req.signedCookies.access_token;
  }
  return token;
};

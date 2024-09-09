import jwt from "jsonwebtoken";

export const createToken = (user) => {
  const token = jwt.sign({ user }, "palabrasupersecreta", { expiresIn: "1h" });
  return token;
};

export const decodeToken = (token) => {
  const decoded = jwt.verify(token, "palabrasupersecreta");
  return decoded;
};

export const getJWTCookie = (req) => {
  let token = null;
  if (req.signedCookies) {
    token = req.signedCookies.access_token;
  }
  return token;
};

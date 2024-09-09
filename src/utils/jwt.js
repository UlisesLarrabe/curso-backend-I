import jwt from "jsonwebtoken";

export const createToken = (user) => {
  const token = jwt.sign({ user }, "palabrasupersecreta", { expiresIn: "1h" });
  return token;
};

export const decodeToken = (token) => {
  const decoded = jwt.verify(token, "palabrasupersecreta");
  return decoded;
};

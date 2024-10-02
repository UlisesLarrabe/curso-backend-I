import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";
import { getJWTCookie } from "../utils/jwt.js";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([getJWTCookie]),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (jwt_payload, done) => {
        try {
          const userFound = await UserModel.findOne({
            email: jwt_payload.user.email,
          })
            .populate("cartId")
            .lean();
          if (!userFound) return done(null, false);
          return done(null, userFound);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;

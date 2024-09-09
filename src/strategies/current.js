import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";
import { getJWTCookie } from "../utils/jwt.js";

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([getJWTCookie]),
        secretOrKey: "palabrasupersecreta",
      },
      (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;

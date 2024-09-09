import passport from "passport";

export const invokePassport = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .json({ error: info.messages ? info.messages : info.toString() });
      req.user = user;
      next();
    })(req, res, next);
  };
};

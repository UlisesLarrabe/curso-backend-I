import { Router } from "express";
import { decodeToken } from "../utils/jwt.js";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, ...cb) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(cb)
    );
  }

  post(path, policies, ...cb) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(cb)
    );
  }

  delete(path, policies, ...cb) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(cb)
    );
  }

  put(path, policies, ...cb) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(cb)
    );
  }

  applyCallbacks(cb) {
    return cb.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).send({ error: error.message });
      }
    });
  }

  customResponses(req, res, next) {
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "Success", payload });
    res.sendError = (error) => res.status(400).send({ status: "Error", error });
    next();
  }

  handlePolicies(policies) {
    return (req, res, next) => {
      if (policies.includes("PUBLIC")) return next();
      const reqJWT = req.signedCookies.access_token;
      if (!reqJWT) return res.status(401).send({ error: "User not logged" });
      let userPayload = null;
      try {
        userPayload = decodeToken(reqJWT).user;
      } catch (error) {
        return res.status(401).send({ error: "Invalid token" });
      }
      if (!userPayload)
        return res
          .status(401)
          .send({ error: "An error has occured with the token" });
      if (!policies.includes(userPayload.role.toUpperCase()))
        return res.status(403).send({ error: "Not authorized" });
      req.user = userPayload;
      next();
    };
  }
}

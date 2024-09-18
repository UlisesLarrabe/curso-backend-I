import UserService from "../services/user.services.js";
import { createResponse } from "../utils/createResponse.js";
import { createToken } from "../utils/jwt.js";
import Controllers from "./controllers.js";

const userService = new UserService();

export default class UserController extends Controllers {
  constructor() {
    super(userService);
  }

  register = async (req, res, next) => {
    const { first_name, last_name, email, password, age } = req.body;
    if (!first_name || !last_name || !email || !password || !age) {
      return createResponse(res, 400, "All fields are required");
    }
    try {
      const data = await this.service.register(req.body);
      if (!data) {
        return createResponse(res, 400, "User already exist");
      }
      createResponse(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return createResponse(res, 400, "All fields are required");
    }
    try {
      const data = await this.service.login(email, password);
      if (!data) {
        return createResponse(res, 400, "Incorrect password or email");
      }
      //Le debo pasar el usuario en data
      const token = createToken(data);
      res.cookie("access_token", token, { maxAge: 60000, signed: true });
      const json = { data, token };
      createResponse(res, 200, json);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    res.clearCookie("access_token");
    createResponse(res, 200, "Logged out");
  };

  getCurrent = async (req, res, next) => {
    const user = req.user;
    res.json({ user });
  };
}

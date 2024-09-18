import UserAccessMongo from "../models/user.dao.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import Services from "./services.js";

const userDao = new UserAccessMongo();

export default class UserService extends Services {
  constructor() {
    super(userDao);
  }

  async register(user) {
    try {
      const { email } = user;
      const exist = await this.dao.getByEmail(email);
      if (exist) return null;
      const newUser = {
        ...user,
        password: createHash(user.password),
      };
      await this.dao.create(newUser);
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(email, password) {
    try {
      const user = await this.dao.getByEmail(email);
      if (!user) return null;
      if (!isValidPassword(password, user.password)) return null;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}

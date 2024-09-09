import { createHash, isValidPassword } from "../../utils/crypt.js";
import UserModel from "../models/user.model.js";

class SessionManager {
  async register(user) {
    try {
      const userAlreadyExists = await UserModel.findOne({ email: user.email });
      if (userAlreadyExists)
        return { status: 400, message: "User with that email already exist" };
      const newUser = {
        ...user,
        password: createHash(user.password),
      };
      console.log(newUser);

      if (
        user.email === "adminCoder@coder.com" &&
        user.password === "adminCod3r123"
      ) {
        const response = await UserModel.create({
          role: "admin",
          ...newUser,
        });
        if (response) return { status: 201, message: "User created" };
        return { status: 400, message: "Error creating user" };
      }
      const response = await UserModel.create(newUser);
      if (response) return { status: 201, message: "User created" };
      return { status: 400, message: "Error creating user" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(email, password) {
    try {
      const user = await UserModel.findOne({ email }).lean();
      if (!user) return { status: 404, message: "User not found" };
      if (!isValidPassword(password, user.password))
        return { status: 401, message: "Incorrect password" };
      return { status: 200, message: "Login successful", user: user };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default SessionManager;

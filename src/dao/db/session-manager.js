import UserModel from "../models/user.model.js";

class SessionManager {
  async register(user) {
    try {
      const userAlreadyExists = await UserModel.findOne({ email: user.email });
      if (userAlreadyExists)
        return { status: 400, message: "User with that email already exist" };
      const response = await UserModel.create(user);
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
      if (user.password !== password)
        return { status: 401, message: "Incorrect password" };
      return { status: 200, message: "Login successful", user: user };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default SessionManager;

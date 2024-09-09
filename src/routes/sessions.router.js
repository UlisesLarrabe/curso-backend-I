import { Router } from "express";
import SessionManager from "../dao/db/session-manager.js";
import { createToken } from "../utils/jwt.js";
import { invokePassport } from "../middlewares/handleError.js";

const router = Router();
const sessionManager = new SessionManager();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  if (!first_name || !last_name || !email || !password || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const response = await sessionManager.register({
      first_name,
      last_name,
      email,
      password,
      age,
    });
    return res.json({ status: response.status, message: response.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const response = await sessionManager.login(email, password);
    if (response.status === 200) {
      const userInfo = {
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        email: response.user.email,
        age: response.user.age,
        role: response.user.role,
      };
      const token = createToken(userInfo);
      res.cookie("access_token", token, { maxAge: 60000, signed: true });
    }
    return res
      .status(response.status)
      .json({ status: response.status, message: response.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("access_token");
});

router.get("/current", invokePassport("current"), (req, res) => {
  const user = req.user;
  res.json({ user });
});

export default router;

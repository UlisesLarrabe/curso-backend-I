import { Router } from "express";
import SessionManager from "../dao/db/session-manager.js";

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
    return res.status(response.status).json({ message: response.message });
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
      };
      req.session.user = userInfo;
      req.session.isLog = true;
    }
    return res
      .status(response.status)
      .json({ status: response.status, message: response.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

import { Request, Response } from "express";
import { userStorage } from "../models/User";
import { validatePassword } from "../utils/passwordValidator";

export async function register(req: Request, res: Response) {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Email, username, and password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isStrong) {
      return res.status(400).json({
        error: "Password is not strong enough",
        feedback: passwordValidation.feedback,
      });
    }

    if (userStorage.emailExists(email)) {
      return res.status(409).json({ error: "Email already registered" });
    }

    if (userStorage.usernameExists(username)) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const user = await userStorage.create(email, username, password);
    (req.session as any).userId = user.id;

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const isValid = await userStorage.verifyPassword(email, password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userStorage.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    (req.session as any).userId = user.id;

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
}

export function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.json({ message: "Logout successful" });
  });
}

export function getCurrentUser(req: Request, res: Response) {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = userStorage.getById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    user: { id: user.id, email: user.email, username: user.username },
  });
}

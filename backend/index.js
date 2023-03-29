import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { UserModel as User } from "./models/User.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

try {
  mongoose.connect(process.env.MONGO_URL);
} catch (error) {
  console.error(error);
}

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URI,
  }),
);

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    Jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;

      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (passwordMatch) {
      Jwt.sign(
        Jwt.sign(
          { userId: user._id, username, email },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res
              .cookie("token", token, { sameSite: "none", secure: true })
              .status(201)
              .json({
                id: user._id,
              });
          },
        ),
      );
    }
  }
});

// register endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    Jwt.sign(
      { userId: createdUser._id, username, email },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
          });
      },
    );
  } catch (error) {
    console.log(res.status(400).json({ error: error.message }));
  }
});

console.log("running at port 8000");
app.listen(8000);

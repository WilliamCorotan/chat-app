import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { UserModel as User } from "./models/User.js";
import { WebSocketServer } from "ws";
import { MessageModel } from "./models/Message.js";

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

const getUserDataFromRequest = async (req) => {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      Jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
};

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

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});
app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  console.log(userId);
  console.log(userData);
  const ourUserId = userData.userId;
  try {
    const messages = await MessageModel.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    console.log(user.email);
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (passwordMatch) {
      Jwt.sign(
        { userId: user._id, username, email: user.email },
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
      );
    } else {
      res.json({ error: "Invalid Credentials" });
    }
  } else {
    res.json({ error: "Invalid Credentials" });
  }
});

app.post("/logout", (req, res) => {
  try {
    res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
  } catch (error) {
    console.log(error);
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
  } catch (err) {
    res.json({ errorCode: err.code, keyValue: err.keyValue });
  }
});

const server = app.listen(8000);

const wsServer = new WebSocketServer({ server });

wsServer.on("connection", (connection, req) => {
  const notifyOnlinePeople = () => {
    [...wsServer.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wsServer.clients].map((client) => {
            return {
              userId: client.userId,
              username: client.username,
              email: client.email,
            };
          }),
        }),
      );
    });
  };
  connection.isAlive = true;
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      connection.terminate();
      notifyOnlinePeople();
    }, 1000);
  }, 1000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        Jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username, email } = userData;
          connection.userId = userId;
          connection.username = username;
          connection.email = email;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    message = JSON.parse(message.toString());
    const { recipient, text } = message;
    if (recipient && text) {
      const messageDoc = await MessageModel.create({
        sender: connection.userId,
        recipient,
        text,
      });
      [...wsServer.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              _id: messageDoc._id,
            }),
          ),
        );
    }
  });

  //Notifies everyone for online users
  notifyOnlinePeople();
});

wsServer.on("close", (data) => {});

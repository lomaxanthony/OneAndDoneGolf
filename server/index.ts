import "dotenv/config";
import express from "express";
// import cors from "cors";
import { prisma } from './lib/prisma';
import {hashPassword, createToken, comparePassword} from './lib/auth';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/golfers", async (req, res) => {
  try {
    const golfers = await prisma.golfer.findMany();
    res.json(golfers);
  } catch (error) {
    console.error("Error fetching golfers:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch golfers" });
  }
});

app.post("/api/golfers", async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const golfer = await prisma.golfer.create({
      data: { name }
    });
    
    res.status(201).json(golfer);
  } catch (error) {
    console.error("Error creating golfer:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create golfer" });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username, and password are required" });
    }
    
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { 
        email,
        username,
        password: hashedPassword
      }
    });

    const token = createToken(user.id);

    res.status(201).json({ user, token });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    } 

    const user = await prisma.user.findUnique({
      where: {email: email}
    });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken(user.id);
    console.log(`User ${email} logged in successfully`);
    res.json({ user, token})
    
  } catch (error) {
    console.error("Error loging in: ", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to login"})
    
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import "dotenv/config";
import express from "express";
// import cors from "cors";
import { prisma } from './lib/prisma'

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
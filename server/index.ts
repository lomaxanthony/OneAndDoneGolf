import "dotenv/config";
import express from "express";
// import cors from "cors";
import { prisma } from './lib/prisma';
import {hashPassword, createToken, comparePassword} from './lib/auth';
import { authMiddleware } from './lib/middleware';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Golfer APIs

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

// Authentication APIs

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


// Tournament APIs

app.get("/api/tournaments", async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany();
    res.json(tournaments);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch tournaments" });
  }
});

app.post("/api/tournaments", async (req, res) => {
  try {
    const { name, week, year, date } = req.body;

    if (!name || !week || !year || !date) {
      return res.status(400).json({ error: "Tournament name, week, year, or date are required " });
    }

    const tournament = await prisma.tournament.create({
      data: { 
        name,
        week,
        year,
        date: new Date(date)
      }
    });

    res.status(201).json(tournament);
  } catch (error) {
    console.error("Error creating tournament:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create tournament" });
  }
})


// Pick APIs

app.post("/api/picks", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId
    const { tournId, golferId } = req.body;

    if (!tournId || !golferId ) {
      return res.status(400).json({ error: "Tournament ID and golfer ID are required" });
    }

    const existingPick = await prisma.pick.findUnique({
      where: {
        userId_tournId: { userId, tournId }
      }
    })

    if (existingPick) {
      return res.status(400).json({ error: "You already have a pick for this tournament." });
    }

    const pickedBefore = await prisma.pick.findMany({
      where: {
        userId,
        golferId
      }
    })

    if (pickedBefore.length > 0) {
      return res.status(400).json({ error: "You already picked this golfer this season." });
    }

    const pick = await prisma.pick.create({
      data: {
        userId,
        tournId,
        golferId
      }
    });
    res.status(201).json(pick);

  } catch (error) {
    console.error("Error creating pick:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create pick" });
  }  
})

// Leaderboard API
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Get all users
    const users = await prisma.user.findMany();
    
    const leaderboard = [];

    // For each user, calculate their total earnings
    for (const user of users) {
      // Get all picks for this user
      const picks = await prisma.pick.findMany({
        where: {
          userId: user.id
        }
      });

      let totalEarnings = 0;

      // For each pick, find the earnings
      for (const pick of picks) {
        const result = await prisma.result.findFirst({
          where: {
            tournId: pick.tournId,
            golferId: pick.golferId
          }
        });

        if (result) {
          totalEarnings += result.earnings;
        }
      }

      // Add user to leaderboard
      leaderboard.push({
        userId: user.id,
        username: user.username,
        totalEarnings
      });
    }

    // Sort by highest earnings first
    leaderboard.sort((a, b) => b.totalEarnings - a.totalEarnings);

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch leaderboard" });
  }
});
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
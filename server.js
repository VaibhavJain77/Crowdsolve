import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@deepgram/sdk";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- API Endpoint for AI Suggestions ---
app.post("/api/solve", async (req, res) => {
  try {
    const { query } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(query);
    res.json({ solution: result.response.text() });
  } catch (err) {
    console.error("--- GEMINI ERROR ---", err);
    res.status(500).json({ error: err.message });
  }
});

// --- API Endpoint for AI Summarization ---
app.post("/api/summarize", async (req, res) => {
  try {
    const { solutionsText } = req.body;
    if (!solutionsText || solutionsText.trim() === "") {
      return res.status(400).json({ error: "No solutions provided to summarize." });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Based on the following user-submitted solutions, analyze them and identify the top 3 most practical and distinct suggestions. Present them as a simple, numbered list. Do not add any extra commentary before or after the list.\n\n--- SOLUTIONS ---\n${solutionsText}`;
    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (err) {
    console.error("--- GEMINI SUMMARY ERROR ---", err);
    res.status(500).json({ error: err.message });
  }
});


// --- API Endpoint for Audio Transcription ---
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded." });
    }

    // Get the audio data directly from the in-memory buffer
    const audioBuffer = req.file.buffer;

    // Send the audio buffer to Deepgram for transcription
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        smart_format: true,
      }
    );

    if (error) {
      throw error;
    }

    // Send the transcribed text back to the client
    const transcript = result.results.channels[0].alternatives[0].transcript;
    res.json({ text: transcript });

  } catch (err) {
    console.error("--- DEEPGRAM ERROR ---", err);
    res.status(500).json({ error: err.message || "Failed to transcribe audio." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
import express, { Request, Response } from "express";
import { allowCors } from "./cors";
import multer from "multer";
import path from "path";
import { Buffer } from "buffer";

const app = express();
app.use(allowCors);
const port = process.env.PORT || 3001;

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// Mock transcript service
function mockTranscribe(audioBuffer: Buffer): string {
  // In real implementation, call STT engine here
  return "This is a mock transcript.";
}

app.post(
  "/api/transcribe",
  upload.single("audio"),
  (req: Request, res: Response) => {
    console.log("Received file", req.file?.originalname);
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded." });
    }
    // Call mock transcript service
    const transcript = mockTranscribe((req.file as Express.Multer.File).buffer);
    res.json({ transcript });
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

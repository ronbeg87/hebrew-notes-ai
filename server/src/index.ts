import express, { Request, Response } from "express";
import { allowCors } from "./cors";
import multer from "multer";
import { getTranscriber } from "./transcriber/index";
import type { Transcriber } from "./transcriber/Transcriber";

const app = express();
app.use(allowCors);
const port = process.env.PORT || 3001;

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// Choose transcriber implementation here
// const transcriber: Transcriber = getTranscriber("mock");
const transcriber: Transcriber = getTranscriber("whisper");

app.post(
  "/api/transcribe",
  upload.single("audio"),
  async (req: Request, res: Response) => {
    console.log("Received file", req.file?.originalname);
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded." });
    }
    try {
      const transcript = await transcriber.transcribe(
        (req.file as Express.Multer.File).buffer
      );
      res.json({ transcript });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

## Additional Coding Guidelines

- Always keep code organized and reusable as much as possible, but avoid over-engineering if not needed.
- Do not use too many comments; only add comments when truly necessary to avoid cluttering the codebase.

## Project Implementation Plan

### 1. Requirements & Architecture

- Cross-platform desktop app (Electron), web client (shared frontend code), and backend server
- TypeScript for type safety and maintainability
- Modular, abstracted architecture for easy swapping of components (audio source, STT, LLM, etc.)
- MVP: Record audio from mic, transcribe, summarize, display results

### 2. High-Level Architecture

- **Audio Input Abstraction**
  - Interface for audio sources (mic, virtual cable, file, etc.)
- **Transcription (STT) Abstraction**
  - Interface for STT engines (local, cloud, etc.)
- **LLM Summarization Abstraction**
  - Interface for LLMs (local, OpenAI, etc.)
- **UI Layer**
  - React/HTML for user interaction (used in both Electron and web client)
- **Server Layer**
  - Node.js/TypeScript backend for handling API requests, audio processing, STT, and LLM integration
- **State Management**
  - Store transcripts, notes, and meeting metadata

### 3. MVP Phase

#### 3.1. Project Setup

- Scaffold Electron + TypeScript project
- Set up basic UI (start/stop recording, show transcript/notes)

#### 3.2. Audio Input (Microphone)

- Implement audio capture from the default microphone
- Abstract audio input as an interface

#### 3.3. Transcription (STT)

- Integrate a simple STT engine (e.g., Google Speech-to-Text API or Whisper API)
- Abstract STT as an interface

#### 3.4. LLM Summarization

- Integrate a simple LLM summarization (e.g., OpenAI GPT API)
- Abstract LLM as an interface

#### 3.5. Display Results

- Show live transcript in the UI
- Show meeting notes after summarization

### 4. Post-MVP: Extensibility & Improvements

#### 4.1. Audio Source Abstraction

- Add support for other audio sources (virtual cable, system audio, file)
- Allow user to select audio source

#### 4.2. Pluggable STT

- Add support for local STT (e.g., Whisper.cpp)
- Allow switching between local/cloud STT

#### 4.3. Pluggable LLM

- Add support for local LLMs (e.g., Llama.cpp)
- Allow switching between local/cloud LLM

#### 4.4. Streaming & Real-Time

- Implement streaming audio to STT for real-time transcription
- Optionally stream audio to remote server

#### 4.5. Meeting Platform Integration

- (Optional) Detect and capture audio from Teams/Zoom/Meet directly

#### 4.6. UI/UX Enhancements

- Meeting management (history, export, search)
- User settings (API keys, preferences)
- Error handling and notifications

### 5. Abstraction Example (for extensibility)

- `AudioSource` interface: start(), stop(), onData(callback)
- `Transcriber` interface: transcribe(audioBuffer) → text
- `Summarizer` interface: summarize(text) → notes

### 6. Testing & Deployment

- Unit and integration tests for each module
- Build and package Electron app for Windows/Mac/Linux

Work through each checklist item systematically.
Keep communication concise and focused.
Follow development best practices.

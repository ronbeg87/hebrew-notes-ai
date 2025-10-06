# Hebrew Meeting Notes Web Client# React + TypeScript + Vite



A web-based application for recording audio from your microphone and transcribing it using OpenAI's Whisper API. This is the web version of the Hebrew Meeting Notes application.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## FeaturesCurrently, two official plugins are available:



- 🎤 Record audio directly from your microphone- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- 🎵 Playback recorded audio- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- 📝 Transcribe audio using OpenAI Whisper API (optimized for Hebrew)

- 💾 Download recorded audio files## React Compiler

- 🔒 Secure API key storage (local only)

- 📱 Responsive web interfaceThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



## Getting Started## Expanding the ESLint configuration



### PrerequisitesIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:



- Node.js (v18 or higher)```js

- OpenAI API key for transcriptionexport default defineConfig([

  globalIgnores(['dist']),

### Installation  {

    files: ['**/*.{ts,tsx}'],

1. Install dependencies:    extends: [

```bash      // Other configs...

npm install

```      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

2. Start the development server:      // Alternatively, use this for stricter rules

```bash      tseslint.configs.strictTypeChecked,

npm run dev      // Optionally, add this for stylistic rules

```      tseslint.configs.stylisticTypeChecked,



3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)      // Other configs...

    ],

### Configuration    languageOptions: {

      parserOptions: {

1. Click "Show" in the Settings panel        project: ['./tsconfig.node.json', './tsconfig.app.json'],

2. Enter your OpenAI API key        tsconfigRootDir: import.meta.dirname,

3. The key is stored locally in your browser and only sent to OpenAI for transcription      },

      // other options...

## Usage    },

  },

1. **Record Audio**: Click "Start Recording" to begin capturing audio from your microphone])

2. **Stop Recording**: Click "Stop Recording" to finish recording```

3. **Playback**: Use the audio player to review your recording

4. **Transcribe**: Click "Transcribe" to convert the audio to text using OpenAI WhisperYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

5. **Download**: Save the audio file locally using the "Download Audio" button

```js

## Technical Details// eslint.config.js

import reactX from 'eslint-plugin-react-x'

### Architectureimport reactDom from 'eslint-plugin-react-dom'



The application follows a modular architecture similar to the Electron version:export default defineConfig([

  globalIgnores(['dist']),

- **AudioSource Interface**: Abstraction for audio input sources  {

- **MicrophoneAudioSource**: Web Audio API implementation for microphone access    files: ['**/*.{ts,tsx}'],

- **Transcriber Interface**: Abstraction for transcription services    extends: [

- **WebWhisperTranscriber**: OpenAI Whisper API integration      // Other configs...

      // Enable lint rules for React

### Audio Processing      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

- Captures audio using the Web Audio API      reactDom.configs.recommended,

- Processes audio in real-time using ScriptProcessorNode    ],

- Converts Float32Array chunks to WAV format for playback and transcription    languageOptions: {

- Supports 44.1kHz sample rate with 16-bit PCM encoding      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### Security        tsconfigRootDir: import.meta.dirname,

      },

- API keys are stored in browser's local memory only      // other options...

- No server-side storage or logging of audio data    },

- Direct communication with OpenAI API from the browser  },

])

## Development```


### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory and can be served by any static web server.

## Browser Compatibility

- Modern browsers with Web Audio API support
- HTTPS required for microphone access (except localhost)
- Tested on Chrome, Firefox, Safari, and Edge

## Troubleshooting

### Microphone Access Issues
- Ensure your browser has microphone permissions
- Check that no other application is using the microphone
- Try refreshing the page and granting permissions again

### Transcription Issues
- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you have internet connectivity

### Audio Quality Issues
- Check your microphone is working properly
- Ensure you're in a quiet environment
- Consider using an external microphone for better quality

## Future Enhancements

- Support for additional transcription services
- Real-time transcription streaming
- Audio preprocessing and noise reduction
- Meeting notes summarization with LLM
- Multiple language support
- Audio file upload support
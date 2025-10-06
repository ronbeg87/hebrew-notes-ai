const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// IPC handler to save a file to a user-selected location
ipcMain.handle('save-file', async (event, buffer, defaultFileName) => {
  const win = BrowserWindow.getFocusedWindow();
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: defaultFileName,
    filters: [
      { name: 'WAV Audio', extensions: ['wav'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (!canceled && filePath) {
    fs.writeFileSync(filePath, Buffer.from(buffer));
  }
});
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
// IPC handler to save a Blob as a temp WAV file and return the file path
ipcMain.handle('save-temp-file', async (event, blob) => {
  // Electron does not support direct Blob transfer; expect ArrayBuffer
  const buffer = Buffer.from(blob);
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, `./playground/recording_${Date.now()}.wav`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('http://localhost:5173'); // Vite dev server
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handler for whisper.cpp transcription
ipcMain.handle('whisper-transcribe', async (event, audioFilePath) => {
  return new Promise((resolve, reject) => {
    // Replace 'whisper.cpp' and args with your actual binary and model path
    const whisperPath = 'whisper'; // Path to whisper.cpp binary
    const args = ['--language', "he", audioFilePath];
    const proc = spawn(whisperPath, args);
    let transcript = '';
    proc.stdout.on('data', (data) => {
      transcript += data.toString();
    });
    proc.stderr.on('data', (data) => {
      // Optionally log errors
    });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(transcript);
      } else {
        reject(new Error('Whisper.cpp failed with code ' + code));
      }
    });
  });
});

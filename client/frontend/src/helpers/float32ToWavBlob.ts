// Helper: Convert Float32Array chunks to WAV Blob
function float32ToWavBlob(chunks: Float32Array[], sampleRate: number): Blob {
  const length = chunks.reduce((acc, arr) => acc + arr.length, 0);
  const buffer = new Float32Array(length);
  let offset = 0;
  for (const arr of chunks) {
    buffer.set(arr, offset);
    offset += arr.length;
  }
  const pcm = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    let s = Math.max(-1, Math.min(1, buffer[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const wavBuffer = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(wavBuffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, pcm.length * 2, true);
  let idx = 44;
  for (let i = 0; i < pcm.length; i++, idx += 2) {
    view.setInt16(idx, pcm[i], true);
  }
  return new Blob([wavBuffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export { float32ToWavBlob };

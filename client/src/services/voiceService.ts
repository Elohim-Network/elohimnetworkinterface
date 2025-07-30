// Voice Service for Agent Elohim VPS Integration
export class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    } catch (error) {
      throw new Error('Failed to access microphone. Please check permissions.');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recording not started'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  async transcribeAndProcess(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('http://178.16.143.5:3000/voice', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer elohim-core'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Voice processing failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || 'Voice processed successfully';
    } catch (error) {
      console.error('Voice service error:', error);
      throw new Error('Failed to process voice with Agent Elohim.');
    }
  }

  async synthesizeSpeech(text: string): Promise<string> {
    try {
      const response = await fetch('http://178.16.143.5:3000/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer elohim-core'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`Speech synthesis failed: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      throw new Error('Failed to synthesize speech with Agent Elohim.');
    }
  }
}

export const voiceService = new VoiceService();
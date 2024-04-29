import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";

const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
const REACT_APP_SPEECH_KEY = process.env.REACT_APP_SPEECH_KEY;
const REACT_APP_SPEECH_REGION = process.env.REACT_APP_SPEECH_REGION;
const REACT_APP_SPEECH_LANGUAGES = process.env.REACT_APP_SPEECH_LANGUAGES;

class SpeechService {
  constructor() {
    this.displayText = "";
  }

  async speechToTextFromMic() {
    return new Promise((resolve, reject) => {
      const speechConfig = speechsdk.SpeechConfig.fromSubscription(
        REACT_APP_SPEECH_KEY,
        REACT_APP_SPEECH_REGION
      );
      speechConfig.autoDetectSourceLanguages = REACT_APP_SPEECH_LANGUAGES;

      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

      this.displayText = "Speak into your microphone...";

      recognizer.recognizeOnceAsync((result) => {
        if (result.reason === ResultReason.RecognizedSpeech) {
          this.displayText = result.text;
          resolve(this.displayText);
        } else {
          this.displayText =
            "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
          reject(this.displayText);
        }
      });
    });
  }
}

export default SpeechService;

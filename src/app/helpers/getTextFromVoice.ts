/* eslint-disable @typescript-eslint/no-explicit-any */
import speech from '@google-cloud/speech';
import fs from 'fs';

const client = new speech.SpeechClient();

export const voiceToText = async (filename: any): Promise<string | undefined> => {
    try {
        // Read the audio file and convert it to base64
        const audioBytes = fs.readFileSync(filename).toString('base64');

        // Configure request with audio and recognition settings
        const audio = {
            content: audioBytes,
        };
        const config = {
            encoding: 'MP3',      // Update encoding if different
            sampleRateHertz: 16000,    // Match your audio file's sample rate
            languageCode: 'en-US',     // Update language code if needed
        };
        const request:any = {
            audio: audio,
            config: config,
        };

        // Perform the transcription request
        const [response] = await client.recognize(request);
        const transcripts: any = response.results
            ?.map((result:any) => result.alternatives?.[0]?.transcript)
            .filter((transcript:any): transcript is string => !!transcript);

        // Join multiple results if there are multiple segments
        return transcripts.join(" ");

    } catch (error) {
        console.error('Error transcribing audio:', error);
        return undefined;
    }
};

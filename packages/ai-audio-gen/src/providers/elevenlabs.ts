/**
 * ElevenLabs provider – TTS, Music, Sound Effects
 * Docs: https://elevenlabs.io/docs
 */
export class ElevenLabsProvider {
  constructor(private getApiKey: () => string | undefined) {}

  private get key() {
    const k = this.getApiKey();
    if (!k) throw new Error("ElevenLabs API key missing. Add it in AI Settings.");
    return k;
  }

  /** Text-to-Speech */
  async textToSpeech(
    text: string,
    voiceId = "21m00Tcm4TlvDq8ikWAM", // Rachel
    onProgress?: (p: number) => void
  ): Promise<Blob> {
    onProgress?.(10);

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": this.key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ElevenLabs TTS failed: ${err}`);
    }

    onProgress?.(100);
    return await res.blob();
  }

  /** Sound Effects */
  async soundEffects(
    prompt: string,
    durationSec = 5,
    onProgress?: (p: number) => void
  ): Promise<Blob> {
    onProgress?.(10);

    const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
      method: "POST",
      headers: {
        "xi-api-key": this.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: durationSec,
        prompt_influence: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ElevenLabs SFX failed: ${err}`);
    }

    onProgress?.(100);
    return await res.blob();
  }

  /** Music generation (ElevenLabs Music) */
  async music(
    prompt: string,
    durationSec = 30,
    onProgress?: (p: number) => void
  ): Promise<Blob> {
    onProgress?.(10);

    // Note: exact endpoint may vary with ElevenLabs Music version
    const res = await fetch("https://api.elevenlabs.io/v1/music-generation", {
      method: "POST",
      headers: {
        "xi-api-key": this.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        duration_seconds: durationSec,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(
        `ElevenLabs Music failed: ${err}. ` +
          `Check that your plan includes Music generation.`
      );
    }

    onProgress?.(100);
    return await res.blob();
  }
}

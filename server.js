const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'default_voice';

// System prompt for Gemini
const SYSTEM_PROMPT = `You are a professional rap and grime lyric writing assistant.
Your role is to generate original lyrics inspired by specific writing styles - NOT to copy existing songs.

You focus ONLY on technical writing patterns:
- Flow and cadence (BPM feel, delivery pace)
- Rhyme schemes (internal, multisyllabic, patterns)
- Bar structure and phrasing
- Wordplay density and techniques
- Punchline placement and delivery

ARTIST STYLES (TECHNIQUES ONLY):
Redman: Funk-influenced cadence, heavy internal rhymes, strong punchlines per 2-4 bars, 85-95 BPM feel
Old Slim Shady: Rapid delivery, dense multisyllabic stacking, conversational tone, shock value
Wiley: 140 BPM grime, 8-bar phrases, aggressive cadence, road slang heavy
Skepta: Hook-based repetition, catchy refrains, swagger/ad-libs, luxury references
Sox: Machine-gun bars, rapid multis, intense energy, battle-ready wordplay

RULES:
1. NEVER copy or closely paraphrase any existing songs
2. Output in clean format: [HOOK], [VERSE 1], [VERSE 2], etc.
3. Maintain bar count and rhyme scheme consistency
4. Respect user's chosen style blend and wordplay density
5. Generate original content only`;

// POST /generate-lyrics
app.post('/generate-lyrics', async (req, res) => {
  try {
    const { seedLyrics, mode, styleBlend, wordplayDensity, topic } = req.body;

    if (!seedLyrics) {
      return res.status(400).json({ error: 'seedLyrics is required' });
    }

    const userPrompt = `
User seed bars:
${seedLyrics}

Mode: ${mode || 'continue_verse'}
Style blend (0=US Boom-Bap, 1=UK Grime): ${styleBlend || 0.5}
Wordplay density (1-5): ${wordplayDensity || 3}
Topic/Theme: ${topic || 'General'}

Generate lyrics following the artist style parameters and system prompt. Output ONLY the lyrics.`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        contents: [{
          parts: [
            { text: SYSTEM_PROMPT },
            { text: userPrompt }
          ]
        }]
      },
      {
        headers: { 'x-goog-api-key': GEMINI_API_KEY },
        params: { key: GEMINI_API_KEY }
      }
    );

    const lyrics = response.data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      lyrics,
      metadata: {
        mode,
        styleBlend,
        wordplayDensity,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating lyrics:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /render-voice
app.post('/render-voice', async (req, res) => {
  try {
    const { lyrics, voiceId, stability, clarity } = req.body;

    if (!lyrics) {
      return res.status(400).json({ error: 'lyrics is required' });
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || ELEVENLABS_VOICE_ID}`,
      {
        text: lyrics,
        voice_settings: {
          stability: stability || 0.5,
          similarity_boost: clarity || 0.75
        }
      },
      {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
        responseType: 'arraybuffer'
      }
    );

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (error) {
    console.error('Error rendering voice:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'BARSMITH Backend API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BARSMITH API running on port ${PORT}`);
});

module.exports = app;

# BARSMITH Backend API

BART Smith Backend API - Node.js/Express server for AI-powered rap lyric generation with Gemini 3 Flash and ElevenLabs voice cloning integration.

## Features

- **Lyric Generation**: Generate original rap and grime lyrics using Gemini 3 Flash
- **Style Blending**: Mix US Boom-Bap and UK Grime influences
- **Artist Techniques**: Redman, Old Slim Shady, Wiley, Skepta, Sox style parameters
- **Voice Rendering**: Convert generated lyrics to speech using ElevenLabs
- **Custom Voices**: Clone and use your own voice
- **RESTful API**: Easy-to-use HTTP endpoints

## Quick Start

15


- Node.js >= 18.0.0
- npm or yarn
- Gemini API Key (from Google AI Studio)
- ElevenLabs API Key (from elevenlabs.io)

- ## Important: API Keys Required

- **BARSMITH is a public open-source project, but you must provide your own API keys to use it.**

- This project does NOT include or store any API credentials. Each user must get their own keys:

- ### 1. Gemini API Key (Free)

- Go to [Google AI Studio](https://aistudio.google.com)
- Create a new project
- Get your free API key (no credit card required)
- Free tier: Unlimited requests
- After free tier: ~$0.00075 per request

### 2. ElevenLabs API Key (Free)

- Go to [ElevenLabs](https://www.elevenlabs.io)
- Sign up for a free account
- Get your API key in settings
- Free tier: 10,000 characters/month
- Clone your voice: Record 5-10 seconds of audio
- Use voice ID for custom audio

### Security

- `.env` files are **NEVER** committed to git (see `.gitignore`)
- Your API keys are personal credentials
- Always use `.env.example` as a template
- Never share your API keys

### Costs

You only pay for what you use:
- **Gemini**: Free tier is very generous, then ~$0.08 per 1M input tokens
- **ElevenLabs**: Free tier 10K characters/month, then ~$0.30 per 1M characters

Both services have excellent free tiers for development and testing.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/faith1bot/barsmith-backend.git
   cd barsmith-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ELEVENLABS_VOICE_ID=your_voice_id
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## API Endpoints

### POST /generate-lyrics

Generate rap lyrics based on seed bars and style parameters.

**Request body:**
```json
{
  "seedLyrics": "I'm spitting fire, yeah, the mic is hot\nFlow so sick, never gonna stop",
  "mode": "continue_verse",
  "styleBlend": 0.5,
  "wordplayDensity": 3,
  "topic": "confidence"
}
```

**Parameters:**
- `seedLyrics` (string, required): Your initial bars/hook/concept
- `mode` (string): `continue_verse`, `write_hook`, `freestyle_sheet`
- `styleBlend` (number): 0 = US Boom-Bap, 1 = UK Grime (default: 0.5)
- `wordplayDensity` (number): 1-5 scale (default: 3)
- `topic` (string): Theme or topic (optional)

**Response:**
```json
{
  "success": true,
  "lyrics": "[VERSE]\n...",
  "metadata": {
    "mode": "continue_verse",
    "styleBlend": 0.5,
    "wordplayDensity": 3,
    "timestamp": "2025-01-21T12:00:00Z"
  }
}
```

### POST /render-voice

Convert generated lyrics to speech using your cloned voice.

**Request body:**
```json
{
  "lyrics": "I'm spitting fire, yeah, the mic is hot\nFlow so sick, never gonna stop",
  "voiceId": "your_voice_id",
  "stability": 0.5,
  "clarity": 0.75
}
```

**Parameters:**
- `lyrics` (string, required): Lyrics to render
- `voiceId` (string): Your ElevenLabs voice ID (optional, uses default if not provided)
- `stability` (number): Voice stability 0-1 (default: 0.5)
- `clarity` (number): Voice clarity/similarity 0-1 (default: 0.75)

**Response:**
Audio stream (audio/mpeg format)

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "BARSMITH Backend API"
}
```

## System Prompt & Artist Styles

The system prompt ensures:
- **No plagiarism**: Only generates original content
- **Technical focus**: Mimics writing techniques, not lyrics
- **Style parameters**: Each artist has unique technical parameters

### Redman (US Boom-Bap)
- Flow: Laid-back, funk-influenced cadence
- Rhyme scheme: Heavy internal rhymes, multisyllabic
- Punchlines: 1 strong punchline per 2-4 bars
- Tempo feel: 85-95 BPM sensibility

### Old Slim Shady (US - Internal Multis)
- Flow: Rapid delivery, complex syllable stacking
- Rhyme scheme: Dense internal rhymes and multis
- Wordplay: Shocking imagery, absurdist humor
- Bar density: High multisyllabic compression

### Wiley (UK Grime)
- Flow: Rapid, aggressive grime cadence
- Rhyme scheme: 8-bar phrase structures, reloads
- Delivery: Confident, authoritative presence
- Wordplay: Slang-heavy, road slang

### Skepta (UK Grime)
- Flow: Infectious, repetitive hook-based structure
- Rhyme scheme: Catchy refrains, punchy 2-4 bar phrases
- Delivery: Swagger, charisma, ad-libs

### Sox (UK Grime - Rapid Fire)
- Flow: Machine-gun delivery, rapid-fire bars
- Rhyme scheme: Quick multi-syllabic multis
- Wordplay: Battle-ready, sharp technical lyrics

## Deployment

### Docker

```bash
docker build -t barsmith-backend .
docker run -p 5000:5000 --env-file .env barsmith-backend
```

### Railway / Render / Cloud Run

1. Push to GitHub
2. Connect repository to Railway/Render/Cloud Run
3. Set environment variables in deployment platform
4. Deploy

### Environment Variables for Production

```
GEMINI_API_KEY=<your_key>
ELEVENLABS_API_KEY=<your_key>
ELEVENLABS_VOICE_ID=<your_id>
PORT=5000
NODE_ENV=production
```

## Integration with n8n

Create n8n workflows to:
1. Accept Telegram/Discord bot commands
2. Call `/generate-lyrics` endpoint
3. Call `/render-voice` endpoint
4. Return audio + lyrics to users

## Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test lyric generation
curl -X POST http://localhost:5000/generate-lyrics \
  -H "Content-Type: application/json" \
  -d '{
    "seedLyrics": "I\'m spitting fire, the mic is hot",
    "mode": "continue_verse",
    "styleBlend": 0.5,
    "wordplayDensity": 3
  }'
```

## Related Projects

- [BARSMITH Frontend](https://aistudio.google.com/apps/drive/17BwU7j9kgbpyBc57xd6lsxd-RbHLYGgs) - Google AI Studio App
- [BARSMITH Notion Docs](https://www.notion.so/BARSMITH-Rap-Lyric-Generator-2ef6bddc261780368259e612380227df) - Project Documentation

## License

MIT License - feel free to use for personal and commercial projects

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with:** Express.js, Gemini 3 Flash, ElevenLabs, Node.js

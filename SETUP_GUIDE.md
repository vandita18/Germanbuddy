# Germanbuddy AI Tutor Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Your API Key

Choose ONE of these options:

#### Option A: Google Gemini (Recommended - Free)
1. Go to: https://makersuite.google.com/app/apikey
2. Click **"Create API Key"** → **"Create API key in new project"**
3. Copy the API key (it will look like: `AIzaSy...`)

#### Option B: OpenAI
1. Go to: https://platform.openai.com/api/keys
2. Click **"Create new secret key"**
3. Copy the key (it will look like: `sk-...`)

#### Option C: Anthropic (Claude)
1. Go to: https://console.anthropic.com/account/keys
2. Click **"Create Key"**
3. Copy the key

---

### Step 2: Add Environment Variable to Netlify

**For Google Gemini:**
1. Go to your Netlify site: https://app.netlify.com
2. Navigate to: **Site settings** → **Build & deploy** → **Environment**
3. Click **"Add a variable"**
4. Enter:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Paste your API key from Step 1
5. Click **"Save"**

**For OpenAI:**
- Same steps but use:
  - **Key:** `OPENAI_API_KEY`
  - **Value:** Your OpenAI key

**For Anthropic:**
- Same steps but use:
  - **Key:** `ANTHROPIC_API_KEY`
  - **Value:** Your Anthropic key

---

### Step 3: Test Your Setup

Once you've saved the environment variable:

1. Wait 1-2 minutes for Netlify to redeploy
2. Send a POST request to your API endpoint:

```bash
curl -X POST https://your-site.netlify.app/api/ai/explain \
  -H "Content-Type: application/json" \
  -d '{"topic": "German present tense"}'
```

Or test in your browser console:
```javascript
fetch('/api/ai/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'German verbs' })
})
.then(r => r.json())
.then(console.log)
```

---

## Expected Response

### Success (200):
```json
{
  "success": true,
  "explanation": "Here is your German lesson..."
}
```

### Error - No API Key (503):
```json
{
  "error": "AI tutor is not available in this environment"
}
```

### Error - Invalid Topic (400):
```json
{
  "error": "Topic is required"
}
```

---

## Troubleshooting

### "AI tutor is not available in this environment"
- **Cause:** API key not set in Netlify environment
- **Fix:** Follow Step 2 above and wait 1-2 minutes for redeployment

### "AI tutor could not be reached"
- **Cause:** API service is down or key is invalid
- **Fix:** Check your API key is correct in Netlify settings

### "AI tutor returned an empty response"
- **Cause:** The AI service returned no content
- **Fix:** Try a different topic or different API provider

---

## Adding Fallback API Keys (Optional)

To have automatic fallback support, add multiple keys:

1. Add `GEMINI_API_KEY` (tries first)
2. Add `OPENAI_API_KEY` (tries if Gemini fails)
3. Add `ANTHROPIC_API_KEY` (tries if OpenAI fails)

The system will automatically try the next provider if one fails.

---

## Support

For issues:
1. Check Netlify Function logs: **Functions** → **api/ai/explain** → **Logs**
2. Verify API key is correct
3. Ensure your API account has credits/quota available

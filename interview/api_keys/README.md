# API Keys Folder

Edit `config.json` to change the AI provider key manually.

## Google AI Studio setup
1. Open Google AI Studio.
2. Create an API key.
3. Paste it into `gemini_api_key`.
4. Keep `provider` as `gemini`.

Example:

```json
{
  "provider": "gemini",
  "gemini_api_key": "your-key-here",
  "gemini_model": "gemini-1.5-flash"
}
```

If the key is blank or invalid, the app falls back to mock AI logic.

const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let text, language_code, speaker;
  try {
    const body = JSON.parse(event.body);
    text = body.text;
    language_code = body.language_code;
    speaker = body.speaker;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!text || !language_code) {
    return { statusCode: 400, body: JSON.stringify({ error: 'text and language_code are required' }) };
  }

  const allowedLangs = ['kn-IN', 'hi-IN', 'gu-IN'];
  if (!allowedLangs.includes(language_code)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Unsupported language' }) };
  }

  const allowedSpeakers = ['shubh', 'aditya', 'ritu', 'priya', 'neha', 'rahul', 'pooja', 'rohan', 'simran', 'kavya', 'amit', 'dev', 'ishita', 'shreya', 'kabir', 'roopa'];
  const selectedSpeaker = allowedSpeakers.includes(speaker) ? speaker : 'priya';

  const payload = JSON.stringify({
    text: text,
    target_language_code: language_code,
    model: 'bulbul:v3',
    speaker: selectedSpeaker,
    pace: 0.9,
    speech_sample_rate: 22050,
    output_audio_codec: 'mp3',
    enable_preprocessing: true,
  });

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.sarvam.ai',
          path: '/text-to-speech',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    if (response.statusCode !== 200) {
      return {
        statusCode: response.statusCode,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Sarvam API error', status: response.statusCode }),
      };
    }

    const result = JSON.parse(response.body);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
      body: JSON.stringify({ audio: result.audios[0] }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to call Sarvam API' }),
    };
  }
};

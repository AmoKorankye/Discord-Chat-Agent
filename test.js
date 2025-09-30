import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('Testing OpenAI API...');

try {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 10
  });
  
  console.log('✅ API Key works!');
  console.log('Response:', response.choices[0].message.content);
} catch (error) {
  console.error('❌ API Key failed:', error.message);
}
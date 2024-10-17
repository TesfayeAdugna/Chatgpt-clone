// services/openAIService.ts
import { openai } from '../lib/openaiClient';

export const getChatbotResponse = async (userMessage: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: 100,
    });
    return response.choices[0]?.message?.content?.trim() || 'No response';
  } catch (error) {
    return 'Sorry, there was an error generating the response.';
  }
};
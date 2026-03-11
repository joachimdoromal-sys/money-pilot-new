import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log('API called with method:', req.method);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ message: 'Send a POST request to chat' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const { messages } = req.body;
      console.log('Received messages:', messages);
      
      // Get the last 10 messages for context
      const recentMessages = messages.slice(-10);
      
      // Build conversation history
      let conversation = "You are Money Pilot AI, a friendly financial assistant. Keep responses helpful and concise (2-3 sentences).\n\n";
      
      for (const msg of recentMessages) {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversation += `${role}: ${msg.content}\n`;
      }
      
      conversation += "Assistant: ";
      console.log('Sending to Gemini:', conversation);

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const result = await model.generateContent(conversation);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini response:', text);
      res.status(200).json({ message: text });
      
    } catch (error) {
      console.error('Chat error:', error);
      res.status(200).json({ 
        message: "Hi! I'm your Money Pilot AI. How can I help with your finances?" 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
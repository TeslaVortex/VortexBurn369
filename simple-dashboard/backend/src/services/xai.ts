import axios from 'axios';

// Budget tips based on spending patterns
const budgetTips = [
  "Track every expense for a week - you'll be surprised where money goes! 📊",
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings 💰",
  "Set up automatic transfers to savings on payday 🏦",
  "Review subscriptions monthly - cancel what you don't use 📱",
  "Use the 24-hour rule before big purchases 🛒",
  "Pack lunch twice a week to save $50+/month 🥪",
  "Compare prices before buying - a quick search saves money 🔍",
  "Build an emergency fund - start with $500 goal 🎯",
  "Crypto tip: Never invest more than you can afford to lose ⚠️",
  "DCA (Dollar Cost Average) reduces volatility risk in crypto 📈"
];

// Get a smart budget tip based on expenses
export const getBudgetTip = async (expenses?: number): Promise<string> => {
  // If xAI API key is configured, try to get AI-powered tip
  if (process.env.XAI_API_KEY && process.env.XAI_API_KEY !== 'your-xai-api-key-here') {
    try {
      const response = await axios.post('https://api.x.ai/v1/chat/completions', {
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful financial advisor. Give one short, practical budget tip in under 50 words. Be friendly and use an emoji.'
          },
          {
            role: 'user',
            content: expenses 
              ? `Give a budget tip for someone who spent $${expenses} this month.`
              : 'Give a general budget tip for saving money.'
          }
        ],
        max_tokens: 100
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log('xAI API not available, using fallback tips');
    }
  }
  
  // Fallback: Return a random tip from our collection
  const randomIndex = Math.floor(Math.random() * budgetTips.length);
  return budgetTips[randomIndex];
};

// Legacy function for compatibility
export const getXaiTip = getBudgetTip;

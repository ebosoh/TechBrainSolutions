import { log } from "./vite";
import axios from "axios";

// Deepseek chat implementation
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  try {
    // Define system message for the assistant
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are TechBrain's AI assistant. TechBrain is a technology company that specializes in AI, Big Data, Machine Learning, Web Design, E-commerce Platforms, and Digital Marketing. 
      
Your responses should be helpful, concise, and professional. If asked about services, provide specific information about TechBrain's offerings. If you don't know something specific about TechBrain beyond what's mentioned here, acknowledge that and offer to connect the user with a human representative for more details.

Keep responses under 150 words unless a detailed explanation is necessary.

Add appropriate emojis to your responses to make them more engaging. For instance:
- Use 🤖 when discussing AI
- Use 🧠 when discussing Machine Learning
- Use 📊 when discussing Big Data
- Use 🎨 when discussing Web Design
- Use 🛒 when discussing E-commerce
- Use 📈 when discussing Marketing
- Use 👋 when greeting users
- End your messages with a friendly emoji like 😊, 👍, ✨, 🚀, 💯, 🔥, ⭐, or 🌟`
    };

    // Combine history with new message
    const messages: ChatMessage[] = [
      systemMessage,
      ...history,
      { role: "user", content: message }
    ];

    log(`Sending request to Deepseek API: ${message}`, "chat-api");
    
    // Check if we have an API key
    if (!process.env.DEEPSEEK_API_KEY) {
      log("Missing Deepseek API key, falling back to rule-based responses", "chat-api");
      return generateFallbackResponse(message);
    }
    
    // Make API request to Deepseek
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );
    
    // Extract the response content
    const aiResponse = response.data.choices[0].message.content;
    
    log(`Deepseek response generated: ${aiResponse.substring(0, 100)}...`, "chat-api");
    
    return aiResponse;
  } catch (error: any) {
    log(`Error with Deepseek API: ${error.message}`, "chat-api");
    console.error("Deepseek API error:", error);
    
    // Fall back to rule-based response if API fails
    log("Falling back to rule-based responses", "chat-api");
    return generateFallbackResponse(message);
  }
}

// Fallback function using rule-based responses
function generateFallbackResponse(message: string): string {
  // Create a simple rule-based response generator
  // This is used as a fallback when the API key is missing or API call fails
  const keywords = {
    "ai": "TechBrain specializes in AI solutions including machine learning models, predictive analytics, and intelligent automation. Our AI solutions can help streamline operations, gain insights from data, and create personalized user experiences.",
    "machine learning": "TechBrain's machine learning expertise includes developing custom algorithms, implementing neural networks, and creating data-driven systems that learn and improve over time.",
    "big data": "Our Big Data solutions help companies collect, store, process, and analyze massive datasets to extract valuable insights. We implement scalable architecture and advanced analytics tools to turn your data into a strategic asset.",
    "web design": "TechBrain creates beautiful, responsive websites optimized for performance and user experience. We combine cutting-edge design principles with solid technical implementation to ensure your web presence stands out.",
    "e-commerce": "Our e-commerce platforms are built to drive sales, streamline operations, and provide exceptional shopping experiences. From product catalog management to secure payment processing, we handle all aspects of online retail.",
    "marketing": "TechBrain's digital marketing strategies encompass SEO, content marketing, social media campaigns, and performance analytics to increase your brand visibility and drive meaningful customer engagement.",
    "contact": "You can reach the TechBrain team through our contact form. A representative will respond to your inquiry within 24 hours.",
    "service": "TechBrain offers various technology services including AI & Machine Learning, Big Data Analytics, Web Development, E-commerce Solutions, and Digital Marketing. Which specific service would you like to know more about?",
    "hello": "Hello! I'm TechBrain's AI assistant. How can I help you with our technology services today?",
    "hi": "Hi there! I'm here to help with information about TechBrain's services. What would you like to know about our technology solutions?",
    "help": "I'd be happy to help! I can provide information about TechBrain's services, expertise, and how we can assist with your technology needs. What specific area are you interested in?"
  };

  // Simple response generation logic
  let aiResponse = "I'm sorry, I don't have specific information about that topic. 🤔 Would you like me to connect you with a human representative who can better address your questions?";
  
  // Check for keywords in the message (case insensitive)
  const lowerMessage = message.toLowerCase();
  for (const [keyword, response] of Object.entries(keywords)) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      // Add emojis based on the keyword
      let emoji = "";
      if (keyword === "ai") emoji = "🤖 ";
      else if (keyword === "machine learning") emoji = "🧠 ";
      else if (keyword === "big data") emoji = "📊 ";
      else if (keyword === "web design") emoji = "🎨 ";
      else if (keyword === "e-commerce") emoji = "🛒 ";
      else if (keyword === "marketing") emoji = "📈 ";
      else if (keyword === "contact") emoji = "📞 ";
      else if (keyword === "service") emoji = "🛠️ ";
      else if (keyword === "hello" || keyword === "hi") emoji = "👋 ";
      else if (keyword === "help") emoji = "🆘 ";
      
      aiResponse = emoji + response;
      break;
    }
  }
  
  // If no keyword match, provide a general response for questions
  if (aiResponse.includes("I'm sorry") && lowerMessage.includes("?")) {
    aiResponse = "That's a great question! 💡 TechBrain offers comprehensive technology solutions across AI, Big Data, Web Design, E-commerce, and Digital Marketing. For more specific details on this inquiry, I'd recommend filling out our contact form so our specialists can provide you with detailed information tailored to your needs. ✨";
  }
  
  // Add a random friendly emoji at the end if not already present
  const friendlyEmojis = ["😊", "👍", "✨", "🚀", "💯", "🔥", "⭐", "🌟"];
  
  // Simple check if the last character is likely an emoji by checking if it's in our list
  const lastChar = aiResponse.trim().slice(-1);
  const alreadyHasEmoji = friendlyEmojis.some(emoji => emoji.includes(lastChar));
  
  if (!alreadyHasEmoji) {
    const randomEmoji = friendlyEmojis[Math.floor(Math.random() * friendlyEmojis.length)];
    aiResponse = aiResponse + " " + randomEmoji;
  }
  
  log(`Fallback response generated: ${aiResponse.substring(0, 100)}...`, "chat-api");
  
  return aiResponse;
}
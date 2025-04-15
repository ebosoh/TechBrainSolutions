import { log } from "./vite";
import axios from "axios";
import { collectWebsiteContent, formatContentForAI } from "./websiteContent";

// Deepseek chat implementation
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Cache website content to avoid repeated database calls
let cachedWebsiteContent: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Gets website content for AI context, with caching
 */
async function getWebsiteContent(): Promise<string> {
  const now = Date.now();
  
  // Use cached content if available and not expired
  if (cachedWebsiteContent && now - cacheTimestamp < CACHE_DURATION) {
    log("Using cached website content for AI", "chat-api");
    return cachedWebsiteContent;
  }
  
  // Collect and format fresh content
  log("Collecting fresh website content for AI", "chat-api");
  const contentData = await collectWebsiteContent();
  const formattedContent = formatContentForAI(contentData);
  
  // Update cache
  cachedWebsiteContent = formattedContent;
  cacheTimestamp = now;
  
  return formattedContent;
}

export async function generateChatResponse(
  message: string,
  history: ChatMessage[] = [],
  userName?: string
): Promise<string> {
  try {
    // Get website content for context
    const websiteContent = await getWebsiteContent();
    
    // Define system message for the assistant, including website content and userName if available
    const userNameInstruction = userName ? `You are speaking with ${userName}. Address them by name occasionally to personalize the conversation.` : '';
    
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are TechBrain's AI assistant. Use the following website content to provide accurate and specific answers about TechBrain:

${websiteContent}

Your responses should be helpful, concise, and professional. When answering questions about TechBrain, rely on the above content to provide accurate information. If asked about something not covered in the website content, acknowledge that and offer to connect the user with a human representative for more details.

${userNameInstruction}

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

    log(`Sending request to Deepseek API with website context: ${message}`, "chat-api");
    
    // Check if we have an API key
    if (!process.env.DEEPSEEK_API_KEY) {
      log("Missing Deepseek API key, falling back to rule-based responses", "chat-api");
      return generateFallbackResponse(message, userName);
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
    return generateFallbackResponse(message, userName);
  }
}

// Fallback function using rule-based responses with optional website content
function generateFallbackResponse(message: string, userName?: string, websiteContent?: string): string {
  // Create a simple rule-based response generator
  // This is used as a fallback when the API key is missing or API call fails
  const keywords = {
    "ai": "TechBrain specializes in AI solutions including machine learning models, predictive analytics, and intelligent automation. Our AI solutions can help streamline operations, gain insights from data, and create personalized user experiences.",
    "machine learning": "TechBrain's machine learning expertise includes developing custom algorithms, implementing neural networks, and creating data-driven systems that learn and improve over time.",
    "big data": "Our Big Data solutions help companies collect, store, process, and analyze massive datasets to extract valuable insights. We implement scalable architecture and advanced analytics tools to turn your data into a strategic asset.",
    "web design": "TechBrain creates beautiful, responsive websites optimized for performance and user experience. We combine cutting-edge design principles with solid technical implementation to ensure your web presence stands out.",
    "e-commerce": "Our e-commerce platforms are built to drive sales, streamline operations, and provide exceptional shopping experiences. From product catalog management to secure payment processing, we handle all aspects of online retail.",
    "marketing": "TechBrain's digital marketing strategies encompass SEO, content marketing, social media campaigns, and performance analytics to increase your brand visibility and drive meaningful customer engagement.",
    "contact us": "You can reach the TechBrain team through our contact form. A representative will respond to your inquiry within 24 hours. You can also call us at +254 (78) 0010010 or email us at hudson.eboso@techbrain.africa.",
    "service": "TechBrain offers various technology services including AI & Machine Learning, Big Data Analytics, Web Development, E-commerce Solutions, and Digital Marketing. Which specific service would you like to know more about?",
    "hello": "Hello! I'm TechBrain's AI assistant. How can I help you with our technology services today?",
    "hi": "Hi there! I'm here to help with information about TechBrain's services. What would you like to know about our technology solutions?",
    "help": "I'd be happy to help! I can provide information about TechBrain's services, expertise, and how we can assist with your technology needs. What specific area are you interested in?",
    "careers": "TechBrain has several career opportunities. You can find all our current job openings on our Careers page. We're always looking for talented individuals passionate about technology.",
    "location": "TechBrain is located at University Way, Nairobi, Kenya.",
    "reach us": "You can reach TechBrain at +254 (78) 0010010 or via email at hudson.eboso@techbrain.africa. Alternatively, you can use our contact form on the website.",
    "tajiri": "Tajiri AI is one of our successful projects - it's a data-driven MMF Investment Advisor. You can learn more about it at https://tajiri.live/",
    "contact information": "For inquiries, you can reach TechBrain at +254 (78) 0010010 or via email at hudson.eboso@techbrain.africa. Our office is located at University Way, Nairobi, Kenya.",
    "phone number": "TechBrain's phone number is +254 (78) 0010010. Feel free to call us with any questions about our services."
  };

  // Simple response generation logic
  let aiResponse = "I'm sorry, I don't have specific information about that topic. 🤔 You can contact TechBrain directly at +254 (78) 0010010 or via email at hudson.eboso@techbrain.africa, or use the contact form on our website.";
  
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
      else if (keyword === "contact us") emoji = "📞 ";
      else if (keyword === "reach us") emoji = "📞 ";
      else if (keyword === "contact information") emoji = "📞 ";
      else if (keyword === "phone number") emoji = "📞 ";
      else if (keyword === "service") emoji = "🛠️ ";
      else if (keyword === "careers") emoji = "💼 ";
      else if (keyword === "location") emoji = "📍 ";
      else if (keyword === "tajiri") emoji = "💰 ";
      else if (keyword === "hello" || keyword === "hi") emoji = "👋 ";
      else if (keyword === "help") emoji = "🆘 ";
      
      aiResponse = emoji + response;
      break;
    }
  }
  
  // If no keyword match, provide a general response for questions
  if (aiResponse.includes("I'm sorry") && lowerMessage.includes("?")) {
    aiResponse = "That's a great question! 💡 TechBrain offers comprehensive technology solutions across AI, Big Data, Web Design, E-commerce, and Digital Marketing. For more specific details on this inquiry, you can contact us at +254 (78) 0010010 or via email at hudson.eboso@techbrain.africa, or use our contact form to get a tailored response from our specialists. ✨";
  }
  
  // Personalize the response with userName if available
  if (userName) {
    // Add the user's name to the beginning of the response for greetings
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      aiResponse = `👋 Hello, ${userName}! I'm TechBrain's AI assistant. How can I help you with our technology services today?`;
    } 
    // For questions about services, add name at the beginning
    else if (lowerMessage.includes("service") || lowerMessage.includes("help")) {
      aiResponse = `${userName}, ${aiResponse}`;
    }
    // For other responses, randomly decide to add the name
    else if (Math.random() > 0.5) {
      // Sometimes add the name at the beginning
      if (Math.random() > 0.5) {
        aiResponse = `${userName}, ${aiResponse.charAt(0).toLowerCase() + aiResponse.slice(1)}`;
      } 
      // Sometimes add it in the middle or end of the sentence
      else {
        // If the response is longer, try to insert the name in a natural position
        const sentences = aiResponse.split('. ');
        if (sentences.length > 1) {
          // Add the name to the second sentence
          sentences[1] = `${userName}, ${sentences[1].charAt(0).toLowerCase() + sentences[1].slice(1)}`;
          aiResponse = sentences.join('. ');
        }
      }
    }
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
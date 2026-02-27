import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';
import { analyzeProduct } from './geminiService';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBUiALGa0tfDnD0sV1L-krFVXkIdLFXaVk' });

// Chatbot conversation context
interface ConversationContext {
  sessionId: string;
  conversationHistory: ChatMessage[];
  currentProduct?: string;
  userPreferences: UserPreferences;
  lastAnalysisResult?: any;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface UserPreferences {
  language: Language;
  priceRange?: { min: number; max: number };
  preferredBrands?: string[];
  priorityAspects?: string[];
}

// Chatbot service
export class ProductAnalysisChatbot {
  private context: ConversationContext;

  constructor(sessionId: string, language: Language = Language.ENGLISH) {
    this.context = {
      sessionId,
      conversationHistory: [],
      userPreferences: { language },
    };
  }

  async sendMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.context.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    // Detect intent
    const intent = await this.detectIntent(userMessage);

    let response: string;

    switch (intent.type) {
      case 'product_inquiry':
        response = await this.handleProductInquiry(intent.productName);
        break;
      case 'comparison':
        response = await this.handleComparison(intent.products);
        break;
      case 'aspect_question':
        response = await this.handleAspectQuestion(intent.aspect);
        break;
      case 'price_question':
        response = await this.handlePriceQuestion();
        break;
      case 'recommendation':
        response = await this.handleRecommendation(intent.criteria);
        break;
      default:
        response = await this.handleGeneralQuery(userMessage);
    }

    // Add assistant response to history
    this.context.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });

    return response;
  }

  private async detectIntent(message: string): Promise<any> {
    const prompt = `
    Analyze this user message and determine the intent:
    Message: "${message}"
    
    Possible intents:
    - product_inquiry: User asking about a specific product
    - comparison: User wants to compare products
    - aspect_question: User asking about specific feature (battery, camera, etc.)
    - price_question: User asking about pricing
    - recommendation: User wants product recommendations
    - general: General conversation
    
    Extract relevant entities (product names, aspects, criteria).
    Return JSON: { type: string, productName?: string, products?: string[], aspect?: string, criteria?: any }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      return JSON.parse(response.text);
    } catch (error) {
      return { type: 'general' };
    }
  }

  private async handleProductInquiry(productName?: string): Promise<string> {
    if (!productName) {
      return "I'd be happy to help you analyze a product! Which product would you like me to analyze?";
    }

    try {
      const result = await analyzeProduct(productName, this.context.userPreferences.language);
      this.context.currentProduct = productName;
      this.context.lastAnalysisResult = result;

      return this.formatProductSummary(result);
    } catch (error) {
      return `I encountered an issue analyzing ${productName}. Could you please rephrase or try another product?`;
    }
  }

  private formatProductSummary(result: any): string {
    return `
📱 **${result.productName}**

💰 **Best Prices:**
${result.prices.slice(0, 3).map((p: any) => `• ${p.store}: ${p.price}`).join('\n')}

✅ **Top Pros:**
${result.pros.slice(0, 3).map((pro: string) => `• ${pro}`).join('\n')}

❌ **Key Cons:**
${result.cons.slice(0, 3).map((con: string) => `• ${con}`).join('\n')}

Would you like more details about any specific aspect?
    `.trim();
  }

  private async handleComparison(products?: string[]): Promise<string> {
    if (!products || products.length < 2) {
      return "To compare products, please specify at least two product names. For example: 'Compare iPhone 15 and Samsung Galaxy S24'";
    }

    // Implement comparison logic
    return `I'll compare ${products.join(' vs ')} for you. Let me analyze both products...`;
  }

  private async handleAspectQuestion(aspect?: string): Promise<string> {
    if (!this.context.lastAnalysisResult) {
      return "Please first ask me to analyze a product, then I can answer questions about specific aspects.";
    }

    if (!aspect) {
      return "Which aspect would you like to know about? (battery, camera, performance, price, etc.)";
    }

    // Search for aspect in analysis result
    const aspectData = this.findAspectData(aspect);
    return aspectData || `I don't have specific information about ${aspect} in my analysis.`;
  }

  private findAspectData(aspect: string): string | null {
    const result = this.context.lastAnalysisResult;
    const lowerAspect = aspect.toLowerCase();

    // Check pros
    const relevantPros = result.pros.filter((pro: string) => 
      pro.toLowerCase().includes(lowerAspect)
    );

    // Check cons
    const relevantCons = result.cons.filter((con: string) => 
      con.toLowerCase().includes(lowerAspect)
    );

    if (relevantPros.length > 0 || relevantCons.length > 0) {
      let response = `**${aspect.toUpperCase()} Analysis:**\n\n`;
      
      if (relevantPros.length > 0) {
        response += `✅ Positives:\n${relevantPros.map((p: string) => `• ${p}`).join('\n')}\n\n`;
      }
      
      if (relevantCons.length > 0) {
        response += `❌ Negatives:\n${relevantCons.map((c: string) => `• ${c}`).join('\n')}`;
      }
      
      return response;
    }

    return null;
  }

  private async handlePriceQuestion(): Promise<string> {
    if (!this.context.lastAnalysisResult) {
      return "Please first tell me which product you're interested in.";
    }

    const prices = this.context.lastAnalysisResult.prices;
    let response = `💰 **Price Comparison for ${this.context.currentProduct}:**\n\n`;
    
    prices.forEach((price: any) => {
      response += `• **${price.store}**: ${price.price}\n`;
    });

    // Find best deal
    const lowestPrice = prices.reduce((min: any, p: any) => {
      const price = parseFloat(p.price.replace(/[^0-9.]/g, ''));
      const minPrice = parseFloat(min.price.replace(/[^0-9.]/g, ''));
      return price < minPrice ? p : min;
    }, prices[0]);

    response += `\n🎯 **Best Deal**: ${lowestPrice.store} at ${lowestPrice.price}`;
    
    return response;
  }

  private async handleRecommendation(criteria?: any): Promise<string> {
    return "Based on your preferences, I can recommend products. What's your budget and what features are most important to you?";
  }

  private async handleGeneralQuery(message: string): Promise<string> {
    const conversationHistory = this.context.conversationHistory
      .slice(-5)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `
    You are a helpful product analysis assistant. 
    
    Conversation history:
    ${conversationHistory}
    
    User's latest message: "${message}"
    
    Respond naturally and helpfully. If the user asks about a product, encourage them to let you analyze it.
    If they have already analyzed a product, reference the previous analysis context.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      return response.text;
    } catch (error) {
      return "I'm here to help you analyze products and make informed decisions. How can I assist you today?";
    }
  }

  getConversationHistory(): ChatMessage[] {
    return this.context.conversationHistory;
  }

  clearHistory(): void {
    this.context.conversationHistory = [];
    this.context.lastAnalysisResult = null;
    this.context.currentProduct = undefined;
  }
}

// Voice Assistant Integration
export class VoiceAssistant {
  private recognition: any;
  private synthesis: any;
  private chatbot: ProductAnalysisChatbot;

  constructor(language: Language = Language.ENGLISH) {
    this.chatbot = new ProductAnalysisChatbot(Date.now().toString(), language);
    this.initializeSpeechRecognition(language);
    this.initializeSpeechSynthesis();
  }

  private initializeSpeechRecognition(language: Language): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.getLanguageCode(language);
    }
  }

  private initializeSpeechSynthesis(): void {
    this.synthesis = window.speechSynthesis;
  }

  private getLanguageCode(language: Language): string {
    const codeMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      // Add more mappings
    };
    return codeMap[language] || 'en-IN';
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.recognition.start();

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        reject(new Error(event.error));
      };
    });
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.recognition?.lang || 'en-IN';
      utterance.onend = () => resolve();
      
      this.synthesis.speak(utterance);
    });
  }

  async processVoiceCommand(): Promise<void> {
    try {
      const userSpeech = await this.startListening();
      console.log('User said:', userSpeech);
      
      const response = await this.chatbot.sendMessage(userSpeech);
      console.log('Bot response:', response);
      
      await this.speak(response);
    } catch (error) {
      console.error('Voice processing error:', error);
      await this.speak("Sorry, I didn't catch that. Could you please repeat?");
    }
  }
}

// Export chatbot instance creator
export const createChatbotSession = (language: Language = Language.ENGLISH): ProductAnalysisChatbot => {
  return new ProductAnalysisChatbot(Date.now().toString(), language);
};

// Export voice assistant instance creator
export const createVoiceAssistant = (language: Language = Language.ENGLISH): VoiceAssistant => {
  return new VoiceAssistant(language);
};

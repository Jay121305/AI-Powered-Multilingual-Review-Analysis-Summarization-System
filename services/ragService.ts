import { GoogleGenAI, Type } from "@google/genai";
import type { Language } from '../types';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCrxuhIjZCbk85Q5YB00btdsBuebiOH5Vg' });

// Enhanced RAG interfaces
interface RetrievedContext {
  productInfo: ProductInfo;
  reviewSummaries: ReviewSummary[];
  priceData: PriceInfo[];
  competitorData: CompetitorInfo[];
}

interface PriceInfo {
  store: string;
  price: string;
  url: string;
  lastUpdated: Date;
  reliability: number;
}

interface CompetitorInfo {
  name: string;
  price: string;
  category: string;
  marketShare: number;
  strengths: string[];
}

interface ProductInfo {
  name: string;
  category: string;
  specifications: Record<string, any>;
  availability: string;
}

interface ReviewSummary {
  source: string;
  totalReviews: number;
  avgRating: number;
  commonPraises: string[];
  commonComplaints: string[];
  reviewSnippets: string[];
}

interface AspectBasedAnalysis {
  aspect: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  mentionCount: number;
  keyPhrases: string[];
  impact: 'high' | 'medium' | 'low';
}

// RAG-enhanced product analysis
export const ragEnhancedAnalysis = async (
  productName: string, 
  targetLanguage: Language
): Promise<any> => {
  
  // Phase 1: Retrieval - Get comprehensive data
  const retrievalPrompt = `
  As a market research expert, retrieve comprehensive information about "${productName}" from the Indian market:
  
  1. PRODUCT CONTEXT:
     - Official product name and variants
     - Category and subcategory
     - Key specifications and features
     - Target audience and use cases
  
  2. REVIEW ANALYSIS SOURCES:
     - Amazon.in customer reviews
     - Flipkart user feedback  
     - YouTube review channels
     - Tech blogs and expert reviews
     - Social media mentions
  
  3. MARKET DATA:
     - Current pricing across platforms
     - Availability and stock status
     - Competitor landscape
     - Market positioning
  
  Gather this data and prepare for detailed analysis.
  `;

  // Phase 2: Aspect-Based Sentiment Analysis
  const absaPrompt = `
  Based on the retrieved data about "${productName}", perform detailed aspect-based sentiment analysis:
  
  ASPECTS TO ANALYZE:
  🎨 Design & Aesthetics
  ⚡ Performance & Speed
  🔋 Battery Life (if applicable)
  📸 Camera Quality (if applicable)  
  💰 Price & Value for Money
  🏗️ Build Quality & Durability
  🛎️ Customer Service Experience
  🚚 Delivery & Logistics
  📦 Packaging & Unboxing
  🔧 Ease of Use & Setup
  
  For each aspect:
  - Sentiment: positive/negative/neutral
  - Confidence score (0-1)
  - Key phrases from reviews
  - Number of mentions
  - Impact level on purchase decision
  `;

  // Phase 3: Generation with retrieved context
  const enhancedPrompt = `
  You are an AI product analyst with access to comprehensive market data about "${productName}".
  
  Using RAG methodology:
  1. RETRIEVED CONTEXT: Real-time Indian market data, reviews, and pricing
  2. AUGMENTED KNOWLEDGE: Your AI understanding of product categories and consumer behavior  
  3. GENERATE: Structured analysis in ${targetLanguage}
  
  Perform ASPECT-BASED SENTIMENT ANALYSIS and create detailed product intelligence:
  
  ${retrievalPrompt}
  ${absaPrompt}
  
  Return comprehensive JSON with:
  - Enhanced product information
  - Aspect-wise sentiment breakdown
  - Confidence scores for each analysis
  - Cultural context for Indian market
  - Actionable insights for consumers
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancedPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            
            // Enhanced with RAG context
            contextualInfo: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                marketPosition: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                culturalRelevance: { type: Type.STRING }
              }
            },
            
            // ABSA Results
            aspectAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  aspect: { type: Type.STRING },
                  sentiment: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  mentionCount: { type: Type.NUMBER },
                  keyPhrases: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  impact: { type: Type.STRING },
                  examples: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            
            // Traditional fields enhanced with RAG/ABSA
            variants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER } // RAG confidence
                }
              }
            },
            
            prices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  store: { type: Type.STRING },
                  price: { type: Type.STRING },
                  url: { type: Type.STRING },
                  reliability: { type: Type.NUMBER } // Source reliability score
                }
              }
            },
            
            // ABSA-enhanced pros/cons
            sentimentSummary: {
              type: Type.OBJECT,
              properties: {
                overallSentiment: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                strongPositives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                significantNegatives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                neutralAspects: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            },
            
            alternativeProducts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  similarityScore: { type: Type.NUMBER } // RAG similarity
                }
              }
            }
          },
          required: ["productName", "aspectAnalysis", "sentimentSummary"]
        }
      }
    });

    return JSON.parse(response.text.trim());
    
  } catch (error) {
    console.error("Enhanced RAG/ABSA Analysis Error:", error);
    throw new Error("Failed to perform enhanced product analysis");
  }
};

// Utility function for aspect importance weighting
export const calculateAspectImportance = (
  aspects: AspectBasedAnalysis[], 
  productCategory: string
): AspectBasedAnalysis[] => {
  const categoryWeights: Record<string, Record<string, number>> = {
    'smartphone': {
      'performance': 0.9,
      'camera': 0.8,
      'battery': 0.8,
      'price': 0.7,
      'design': 0.6
    },
    'laptop': {
      'performance': 0.9,
      'battery': 0.7,
      'build_quality': 0.8,
      'price': 0.7,
      'design': 0.5
    }
    // Add more categories
  };
  
  return aspects.map(aspect => ({
    ...aspect,
    impact: getImpactLevel(
      aspect.mentionCount, 
      aspect.confidence,
      categoryWeights[productCategory]?.[aspect.aspect] || 0.5
    )
  }));
};

const getImpactLevel = (mentions: number, confidence: number, weight: number): 'high' | 'medium' | 'low' => {
  const score = (mentions * confidence * weight) / 100;
  if (score > 0.7) return 'high';
  if (score > 0.4) return 'medium';
  return 'low';
};
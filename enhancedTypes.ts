// Enhanced types for RAG and ABSA functionality
import { ProductAnalysisResult, Language } from './types';

export interface RAGEnhancedResult extends ProductAnalysisResult {
  contextualInfo: ContextualInfo;
  aspectAnalysis: AspectBasedAnalysis[];
  sentimentSummary: SentimentSummary;
  dataQuality: DataQualityMetrics;
}

export interface ContextualInfo {
  category: string;
  marketPosition: string;
  targetAudience: string;
  culturalRelevance: string;
  marketTrends: string[];
  seasonality?: string;
}

export interface AspectBasedAnalysis {
  aspect: ProductAspect;
  sentiment: SentimentType;
  confidence: number;
  mentionCount: number;
  keyPhrases: string[];
  impact: ImpactLevel;
  examples: string[];
  trendDirection: 'improving' | 'declining' | 'stable';
}

export interface SentimentSummary {
  overallSentiment: SentimentType;
  confidenceScore: number;
  strongPositives: string[];
  significantNegatives: string[];
  neutralAspects: string[];
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface DataQualityMetrics {
  sourcesAnalyzed: number;
  dataFreshness: 'fresh' | 'recent' | 'outdated';
  reviewsProcessed: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  biasIndicators: string[];
}

export enum ProductAspect {
  DESIGN = 'design',
  PERFORMANCE = 'performance', 
  BATTERY = 'battery',
  CAMERA = 'camera',
  DISPLAY = 'display',
  AUDIO = 'audio',
  PRICE = 'price',
  BUILD_QUALITY = 'build_quality',
  CUSTOMER_SERVICE = 'customer_service',
  DELIVERY = 'delivery',
  PACKAGING = 'packaging',
  EASE_OF_USE = 'ease_of_use',
  SOFTWARE = 'software',
  CONNECTIVITY = 'connectivity',
  DURABILITY = 'durability'
}

export enum SentimentType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative', 
  NEUTRAL = 'neutral',
  MIXED = 'mixed'
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// RAG-specific interfaces
export interface RAGContext {
  retrievalSources: RetrievalSource[];
  contextRelevance: number;
  informationCompleteness: number;
  lastUpdated: Date;
}

export interface RetrievalSource {
  source: string;
  type: 'review' | 'pricing' | 'specification' | 'expert_opinion';
  credibility: number;
  recency: Date;
  language: Language;
}

// ABSA-specific interfaces
export interface ABSAConfig {
  aspectsToAnalyze: ProductAspect[];
  sentimentThreshold: number;
  minimumMentions: number;
  includeNeutral: boolean;
  weightByImportance: boolean;
}

export interface AspectMention {
  aspect: ProductAspect;
  sentiment: SentimentType;
  context: string;
  source: string;
  confidence: number;
}

// Enhanced product analysis with RAG/ABSA
export interface EnhancedProductAnalysisResult {
  // Original fields
  productName: string;
  variants: EnhancedVariant[];
  prices: EnhancedPrice[];
  pros: string[];
  cons: string[];
  alternativeProducts: EnhancedAlternative[];
  
  // RAG enhancements
  ragContext: RAGContext;
  contextualInsights: string[];
  marketIntelligence: MarketIntelligence;
  
  // ABSA enhancements  
  aspectAnalysis: AspectBasedAnalysis[];
  sentimentBreakdown: SentimentSummary;
  aspectImportanceRanking: AspectImportanceRank[];
  
  // Quality metrics
  analysisQuality: DataQualityMetrics;
  recommendationConfidence: number;
}

export interface EnhancedVariant {
  name: string;
  description: string;
  confidence: number;
  availability: 'in_stock' | 'limited' | 'out_of_stock';
  popularityScore: number;
}

export interface EnhancedPrice {
  store: string;
  price: string;
  url: string;
  reliability: number;
  priceHistory?: PriceHistoryPoint[];
  discountInfo?: DiscountInfo;
}

export interface EnhancedAlternative {
  name: string;
  price: string;
  reason: string;
  similarityScore: number;
  betterAspects: ProductAspect[];
  worseAspects: ProductAspect[];
}

export interface MarketIntelligence {
  marketShare: number;
  pricePosition: 'budget' | 'mid_range' | 'premium';
  competitiveAdvantage: string[];
  marketTrends: string[];
  buyingRecommendation: 'buy' | 'wait' | 'consider_alternatives';
}

export interface AspectImportanceRank {
  aspect: ProductAspect;
  importance: number;
  userCareLevel: 'critical' | 'important' | 'nice_to_have';
  marketExpectation: number;
}

export interface PriceHistoryPoint {
  date: Date;
  price: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface DiscountInfo {
  originalPrice: string;
  discountPercent: number;
  validUntil?: Date;
  discountType: 'sale' | 'coupon' | 'cashback' | 'exchange';
}

// Re-export original types for backwards compatibility
export * from './types';
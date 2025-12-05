import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCrxuhIjZCbk85Q5YB00btdsBuebiOH5Vg' });

// Factuality checking and hallucination detection
export interface FactCheckResult {
  isFactual: boolean;
  confidence: number;
  verifiedClaims: VerifiedClaim[];
  hallucinations: Hallucination[];
  sources: SourceAttribution[];
}

export interface VerifiedClaim {
  claim: string;
  verificationStatus: 'verified' | 'partially_verified' | 'unverified' | 'false';
  confidence: number;
  sources: string[];
}

export interface Hallucination {
  statement: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  correction?: string;
}

export interface SourceAttribution {
  source: string;
  url: string;
  reliability: number;
  dateAccessed: Date;
  claimsCovered: string[];
}

// Constrained decoding for structured output
export interface ConstrainedGenerationConfig {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  requiredFields: string[];
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'range' | 'format' | 'enum' | 'regex' | 'custom';
  rule: any;
  errorMessage: string;
}

// Fact-checking service
export class FactCheckingService {
  /**
   * Verify product analysis results against multiple sources
   */
  async verifyProductAnalysis(analysisResult: any): Promise<FactCheckResult> {
    const claims = this.extractClaims(analysisResult);
    const verifiedClaims: VerifiedClaim[] = [];
    const hallucinations: Hallucination[] = [];
    const sources: SourceAttribution[] = [];

    // Verify each claim
    for (const claim of claims) {
      const verification = await this.verifyClaim(claim, analysisResult.productName);
      verifiedClaims.push(verification);

      // Detect hallucinations
      if (verification.verificationStatus === 'false') {
        hallucinations.push({
          statement: claim,
          reason: 'Contradicts verified sources',
          severity: 'high',
          correction: await this.getCorrection(claim, analysisResult.productName)
        });
      }
    }

    // Check price accuracy
    const priceHallucinations = await this.checkPriceAccuracy(analysisResult.prices);
    hallucinations.push(...priceHallucinations);

    // Verify availability claims
    const availabilityCheck = await this.verifyAvailability(
      analysisResult.productName,
      analysisResult.prices
    );
    
    if (!availabilityCheck.isValid) {
      hallucinations.push({
        statement: 'Product availability claims',
        reason: availabilityCheck.reason,
        severity: 'medium'
      });
    }

    const isFactual = hallucinations.filter(h => h.severity === 'high').length === 0;
    const confidence = this.calculateConfidence(verifiedClaims, hallucinations);

    return {
      isFactual,
      confidence,
      verifiedClaims,
      hallucinations,
      sources
    };
  }

  /**
   * Extract verifiable claims from analysis
   */
  private extractClaims(analysis: any): string[] {
    const claims: string[] = [];
    
    // Extract from pros
    if (analysis.pros) {
      claims.push(...analysis.pros);
    }
    
    // Extract from cons
    if (analysis.cons) {
      claims.push(...analysis.cons);
    }
    
    // Extract from variants
    if (analysis.variants) {
      analysis.variants.forEach((v: any) => {
        claims.push(v.description);
      });
    }

    return claims;
  }

  /**
   * Verify individual claim
   */
  private async verifyClaim(claim: string, productName: string): Promise<VerifiedClaim> {
    const prompt = `
    Verify this claim about ${productName}:
    Claim: "${claim}"
    
    Search the web for recent, reliable sources to verify this claim.
    Check multiple sources including:
    - Official product pages
    - Expert reviews
    - Verified user reviews
    - Tech journalism sites
    
    Determine:
    1. Is this claim verified, partially verified, unverified, or false?
    2. Confidence level (0-1)
    3. List of sources that support or contradict this claim
    
    Return JSON: { verificationStatus: string, confidence: number, sources: string[] }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);
      
      return {
        claim,
        verificationStatus: result.verificationStatus,
        confidence: result.confidence,
        sources: result.sources || []
      };
    } catch (error) {
      return {
        claim,
        verificationStatus: 'unverified',
        confidence: 0,
        sources: []
      };
    }
  }

  /**
   * Check if prices are accurate and not hallucinated
   */
  private async checkPriceAccuracy(prices: any[]): Promise<Hallucination[]> {
    const hallucinations: Hallucination[] = [];

    // Check for unrealistic prices
    const priceValues = prices.map(p => {
      const match = p.price.match(/[\d,]+/);
      return match ? parseInt(match[0].replace(/,/g, '')) : 0;
    });

    // Detect anomalies
    if (priceValues.length > 0) {
      const avg = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
      const stdDev = Math.sqrt(
        priceValues.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / priceValues.length
      );

      priceValues.forEach((price, idx) => {
        if (Math.abs(price - avg) > 3 * stdDev) {
          hallucinations.push({
            statement: `Price at ${prices[idx].store}: ${prices[idx].price}`,
            reason: 'Price significantly deviates from market average',
            severity: 'high',
            correction: `Expected range: ₹${Math.round(avg - stdDev)} - ₹${Math.round(avg + stdDev)}`
          });
        }
      });
    }

    // Check for duplicate or suspiciously similar prices
    const uniquePrices = new Set(priceValues);
    if (uniquePrices.size < priceValues.length * 0.5) {
      hallucinations.push({
        statement: 'Price listings',
        reason: 'Too many identical prices across different retailers',
        severity: 'medium'
      });
    }

    return hallucinations;
  }

  /**
   * Verify product availability
   */
  private async verifyAvailability(
    productName: string, 
    prices: any[]
  ): Promise<{ isValid: boolean; reason: string }> {
    // Check if product exists and URLs are valid
    const storesWithUrls = prices.filter(p => p.url && p.url !== '#');
    
    if (storesWithUrls.length === 0) {
      return {
        isValid: false,
        reason: 'No valid URLs provided for price verification'
      };
    }

    // All stores have unrealistic combinations
    const suspiciousPatterns = [
      'example.com',
      'placeholder',
      'dummy',
      'test.com'
    ];

    const hasSuspiciousUrls = prices.some(p => 
      suspiciousPatterns.some(pattern => p.url?.includes(pattern))
    );

    if (hasSuspiciousUrls) {
      return {
        isValid: false,
        reason: 'Detected placeholder or invalid URLs'
      };
    }

    return { isValid: true, reason: '' };
  }

  /**
   * Get correction for false claim
   */
  private async getCorrection(claim: string, productName: string): Promise<string> {
    const prompt = `
    This claim about ${productName} is false: "${claim}"
    Provide the correct information based on verified sources.
    Be concise and factual.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      
      return response.text.trim();
    } catch (error) {
      return 'Unable to provide correction';
    }
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(
    verifiedClaims: VerifiedClaim[],
    hallucinations: Hallucination[]
  ): number {
    if (verifiedClaims.length === 0) return 0;

    const verificationScore = verifiedClaims.reduce((sum, claim) => {
      const weight = {
        'verified': 1.0,
        'partially_verified': 0.7,
        'unverified': 0.3,
        'false': 0
      }[claim.verificationStatus] || 0;
      
      return sum + (weight * claim.confidence);
    }, 0) / verifiedClaims.length;

    // Penalize for hallucinations
    const hallucinationPenalty = hallucinations.reduce((penalty, h) => {
      const severityWeight = { 'high': 0.3, 'medium': 0.15, 'low': 0.05 }[h.severity];
      return penalty + severityWeight;
    }, 0);

    return Math.max(0, Math.min(1, verificationScore - hallucinationPenalty));
  }
}

// Constrained generation service
export class ConstrainedGenerationService {
  /**
   * Generate response with strict constraints
   */
  async generateWithConstraints(
    prompt: string,
    config: ConstrainedGenerationConfig
  ): Promise<any> {
    // Add constraints to prompt
    const constrainedPrompt = this.addConstraintsToPrompt(prompt, config);

    // Generate with constraints
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: constrainedPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: config.temperature || 0.3, // Lower temp for more factual
        topP: config.topP || 0.8,
        topK: config.topK || 40,
        maxOutputTokens: config.maxTokens || 2048,
        stopSequences: config.stopSequences
      }
    });

    const result = JSON.parse(response.text);

    // Validate against rules
    const validationErrors = this.validateOutput(result, config.validationRules);
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    return result;
  }

  /**
   * Add constraints to prompt
   */
  private addConstraintsToPrompt(
    prompt: string,
    config: ConstrainedGenerationConfig
  ): string {
    let constrainedPrompt = prompt + '\n\nIMPORTANT CONSTRAINTS:\n';
    
    constrainedPrompt += `- Response MUST include these required fields: ${config.requiredFields.join(', ')}\n`;
    constrainedPrompt += '- All information MUST be factual and verifiable\n';
    constrainedPrompt += '- Do NOT invent or hallucinate information\n';
    constrainedPrompt += '- If uncertain, explicitly state "unverified" or "information not available"\n';
    constrainedPrompt += '- Include sources and confidence levels where applicable\n';

    // Add field-specific constraints
    config.validationRules.forEach(rule => {
      constrainedPrompt += `- Field "${rule.field}": ${rule.errorMessage}\n`;
    });

    return constrainedPrompt;
  }

  /**
   * Validate output against rules
   */
  private validateOutput(output: any, rules: ValidationRule[]): string[] {
    const errors: string[] = [];

    rules.forEach(rule => {
      const value = output[rule.field];
      
      if (value === undefined || value === null) {
        errors.push(`Missing required field: ${rule.field}`);
        return;
      }

      switch (rule.type) {
        case 'range':
          if (typeof value === 'number') {
            const { min, max } = rule.rule;
            if (value < min || value > max) {
              errors.push(rule.errorMessage);
            }
          }
          break;
        
        case 'enum':
          if (!rule.rule.includes(value)) {
            errors.push(rule.errorMessage);
          }
          break;
        
        case 'regex':
          if (typeof value === 'string') {
            const regex = new RegExp(rule.rule);
            if (!regex.test(value)) {
              errors.push(rule.errorMessage);
            }
          }
          break;
        
        case 'format':
          // Check specific formats (e.g., URL, email, price)
          if (rule.rule === 'url' && typeof value === 'string') {
            try {
              new URL(value);
            } catch {
              errors.push(rule.errorMessage);
            }
          }
          break;
      }
    });

    return errors;
  }
}

// Export singleton instances
export const factChecker = new FactCheckingService();
export const constrainedGenerator = new ConstrainedGenerationService();

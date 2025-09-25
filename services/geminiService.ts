import { GoogleGenAI, Type } from "@google/genai";
import type { ProductAnalysisResult } from '../types';
import { Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getLanguageName = (langCode: Language): string => {
    const languageMap: { [key in Language]: string } = {
        [Language.ENGLISH]: 'English',
        [Language.HINDI]: 'Hindi',
        [Language.BENGALI]: 'Bengali',
        [Language.MARATHI]: 'Marathi',
        [Language.TELUGU]: 'Telugu',
        [Language.TAMIL]: 'Tamil',
        [Language.GUJARATI]: 'Gujarati',
        [Language.KANNADA]: 'Kannada',
        [Language.MALAYALAM]: 'Malayalam',
        [Language.URDU]: 'Urdu',
        [Language.NEPALI]: 'Nepali',
        [Language.SPANISH]: 'Spanish',
        [Language.FRENCH]: 'French',
        [Language.GERMAN]: 'German',
        [Language.JAPANESE]: 'Japanese',
        [Language.CHINESE]: 'Chinese',
    };
    return languageMap[langCode] || 'English';
}

export const analyzeProduct = async (productName: string, targetLanguage: Language): Promise<ProductAnalysisResult> => {
    const languageName = getLanguageName(targetLanguage);
    
    const prompt = `
    You are an expert product analyst for the Indian market. Your goal is to provide a comprehensive, structured overview for the user.
    Focus your search on the **Indian e-commerce market**.
    
    Search the web for the product: "${productName}".
    
    Your task is to gather the following information and return it ONLY as a single, minified JSON object. Do not add any other text, greetings, or explanations.

    1.  **productName**: The official name of the product you analyzed.
    2.  **variants**: Identify 2-4 common variants of this product available in India (e.g., different RAM/storage, different models like 'Pro' or 'Lite'). Provide the variant name and a brief description.
    3.  **prices**: Find the current price from at least 3 different major Indian online retailers (e.g., Amazon.in, Flipkart, Croma, Reliance Digital). Prices must be in **Indian Rupees (₹)**. Provide the store name, the price, and a direct URL.
    4.  **pros**: Read user and expert reviews from an Indian perspective. List the top 3-5 most commonly cited positive points.
    5.  **cons**: Read user and expert reviews from an Indian perspective. List the top 3-5 most commonly cited negative points.
    6.  **alternativeProducts**: Suggest 2-3 alternative products in a similar price range and category, popular in the Indian market. For each, provide the name, estimated price in INR, and a short reason why it's a good alternative.
    
    All text in 'pros', 'cons', 'variants', and 'alternativeProducts' must be in ${languageName}.
    
    The final JSON object must match this exact structure:
    {
      "productName": "Official Product Name",
      "variants": [
        {"name": "Variant Name", "description": "Brief description in ${languageName}"},
        ...
      ],
      "prices": [
        {"store": "Store Name", "price": "Price in ₹", "url": "Product URL"},
        ...
      ],
      "pros": [
        "Positive point 1 in ${languageName}",
        ...
      ],
      "cons": [
        "Negative point 1 in ${languageName}",
        ...
      ],
      "alternativeProducts": [
        {"name": "Alternative Product Name", "price": "Estimated Price in ₹", "reason": "Reason for suggestion in ${languageName}"},
        ...
      ]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        productName: { type: Type.STRING },
                        variants: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                },
                                required: ["name", "description"]
                            }
                        },
                        prices: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    store: { type: Type.STRING },
                                    price: { type: Type.STRING },
                                    url: { type: Type.STRING }
                                },
                                required: ["store", "price", "url"]
                            }
                        },
                        pros: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        cons: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        alternativeProducts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    price: { type: Type.STRING },
                                    reason: { type: Type.STRING },
                                },
                                required: ["name", "price", "reason"]
                            }
                        }
                    },
                    required: ["productName", "variants", "prices", "pros", "cons", "alternativeProducts"]
                }
            },
        });

        const jsonText = response.text.trim();
        const result: ProductAnalysisResult = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error calling Gemini API or parsing JSON:", error);
        throw new Error("Failed to get product analysis. The API may have returned an invalid format or could not find the product.");
    }
};
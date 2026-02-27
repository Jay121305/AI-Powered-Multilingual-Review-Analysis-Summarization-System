import { GoogleGenAI } from "@google/genai";
import type { ProductAnalysisResult } from '../types';
import { Language } from '../types';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBUiALGa0tfDnD0sV1L-krFVXkIdLFXaVk' });

const getLanguageName = (langCode: Language): string => {
    const languageMap: { [key in Language]: string } = {
        // Indian Languages
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
        [Language.PUNJABI]: 'Punjabi',
        [Language.ODIA]: 'Odia',
        [Language.ASSAMESE]: 'Assamese',
        [Language.SANSKRIT]: 'Sanskrit',
        [Language.KONKANI]: 'Konkani',
        [Language.SINDHI]: 'Sindhi',
        // Global Languages
        [Language.SPANISH]: 'Spanish',
        [Language.FRENCH]: 'French',
        [Language.GERMAN]: 'German',
        [Language.JAPANESE]: 'Japanese',
        [Language.CHINESE]: 'Chinese',
        [Language.ARABIC]: 'Arabic',
        [Language.PORTUGUESE]: 'Portuguese',
        [Language.RUSSIAN]: 'Russian',
        [Language.KOREAN]: 'Korean',
        [Language.ITALIAN]: 'Italian',
        [Language.DUTCH]: 'Dutch',
        [Language.TURKISH]: 'Turkish',
        [Language.POLISH]: 'Polish',
        [Language.VIETNAMESE]: 'Vietnamese',
        [Language.THAI]: 'Thai',
        [Language.INDONESIAN]: 'Indonesian',
        [Language.MALAY]: 'Malay',
        [Language.PERSIAN]: 'Persian',
        [Language.HEBREW]: 'Hebrew',
        [Language.SWAHILI]: 'Swahili',
    };
    return languageMap[langCode] || 'English';
}

export const analyzeProduct = async (productName: string, targetLanguage: Language): Promise<ProductAnalysisResult> => {
    const languageName = getLanguageName(targetLanguage);
    
    const prompt = `Analyze "${productName}" for Indian market. Return ONLY JSON (no markdown, no text):

{
  "productName": "Name",
  "variants": [{"name": "Variant", "description": "${languageName} text"}],
  "prices": [{"store": "Store", "price": "₹X", "url": "URL"}],
  "pros": ["Pro in ${languageName}"],
  "cons": ["Con in ${languageName}"],
  "alternativeProducts": [{"name": "Product", "price": "₹X", "reason": "${languageName} text"}]
}

Include: 2-3 variants, 3+ Indian store prices, 3-5 pros/cons, 2-3 alternatives. All text in ${languageName}.
    `;

    try {
        console.log('Calling Gemini API for product:', productName);
        
        // Use v1beta API with gemini-2.5-flash model
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBUiALGa0tfDnD0sV1L-krFVXkIdLFXaVk`;
        console.log('Using gemini-2.5-flash model');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                }
            })
        });

        console.log('Gemini API response received, status:', response.status);
        
        const responseText = await response.text();
        console.log('Raw response:', responseText.substring(0, 500));
        
        if (!response.ok) {
            console.error('API error response:', responseText);
            throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('Parsed response structure:', JSON.stringify(data, null, 2).substring(0, 500));
        
        if (!data.candidates || data.candidates.length === 0) {
            console.error('No candidates in response:', data);
            throw new Error("API returned no candidates. Response: " + JSON.stringify(data));
        }
        
        if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
            console.error('Invalid candidate structure:', data.candidates[0]);
            throw new Error("API candidate missing content/parts. Response: " + JSON.stringify(data.candidates[0]));
        }

        const text = data.candidates[0].content.parts[0].text.trim();
        console.log('Response text (first 500 chars):', text.substring(0, 500));
        console.log('Response text (last 200 chars):', text.substring(Math.max(0, text.length - 200)));
        
        // Try to extract JSON from the response
        let jsonText = text;
        
        // If the response is wrapped in markdown code blocks, extract it
        if (text.includes('```json')) {
            const match = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (match) {
                jsonText = match[1].trim();
                console.log('Extracted JSON from ```json block');
            }
        } else if (text.includes('```')) {
            const match = text.match(/```\s*([\s\S]*?)\s*```/);
            if (match) {
                jsonText = match[1].trim();
                console.log('Extracted JSON from ``` block');
            }
        } else {
            // Try to find JSON object in the text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonText = jsonMatch[0].trim();
                console.log('Extracted JSON object from text');
            }
        }
        
        console.log('JSON text to parse (first 300 chars):', jsonText.substring(0, 300));
        
        const result: ProductAnalysisResult = JSON.parse(jsonText);
        console.log('Successfully parsed product analysis');
        
        return result;

    } catch (error: any) {
        console.error("Detailed error calling Gemini API:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // More specific error messages
        if (error.message?.includes('API key') || error.message?.includes('API_KEY') || error.message?.includes('403')) {
            throw new Error("Invalid API key. Please check your Gemini API key configuration.");
        }
        if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
            throw new Error("API quota exceeded. Please try again later or check your API limits.");
        }
        if (error.message?.includes('404') || error.message?.includes('not found')) {
            throw new Error("Model not found. Please verify the API endpoint.");
        }
        if (error instanceof SyntaxError) {
            throw new Error("Failed to parse API response. The API returned invalid JSON format.");
        }
        
        throw new Error(`Failed to get product analysis: ${error.message || 'Unknown error occurred'}`);
    }
};
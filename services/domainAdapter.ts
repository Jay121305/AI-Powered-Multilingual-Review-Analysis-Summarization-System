import { GoogleGenAI, Type } from "@google/genai";
import type { Language } from '../types';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCrxuhIjZCbk85Q5YB00btdsBuebiOH5Vg' });

// Domain Categories
export enum ProductDomain {
    ELECTRONICS = 'electronics',
    FASHION = 'fashion',
    HEALTHCARE = 'healthcare',
    HOME_APPLIANCES = 'home_appliances',
    BEAUTY = 'beauty',
    BOOKS = 'books',
    SPORTS = 'sports',
    AUTOMOTIVE = 'automotive',
    FOOD = 'food',
    TOYS = 'toys',
}

// Domain-specific aspects
const domainAspects: Record<ProductDomain, string[]> = {
    [ProductDomain.ELECTRONICS]: [
        'Performance', 'Battery Life', 'Display Quality', 'Build Quality',
        'Camera Quality', 'Audio Quality', 'Connectivity', 'Software/UI',
        'Price Value', 'Durability', 'After-Sales Service', 'Heating Issues'
    ],
    [ProductDomain.FASHION]: [
        'Fabric Quality', 'Fit & Comfort', 'Design & Style', 'Color Accuracy',
        'Stitching Quality', 'Size Accuracy', 'Price Value', 'Durability',
        'Wash & Care', 'Brand Authenticity', 'Delivery Packaging'
    ],
    [ProductDomain.HEALTHCARE]: [
        'Effectiveness', 'Safety & Side Effects', 'Ease of Use', 'Packaging',
        'Price Value', 'Availability', 'Doctor Recommendation', 'Certification',
        'Ingredient Quality', 'Expiry & Freshness', 'Customer Support'
    ],
    [ProductDomain.HOME_APPLIANCES]: [
        'Performance', 'Energy Efficiency', 'Noise Level', 'Build Quality',
        'Ease of Use', 'Cleaning & Maintenance', 'Space & Design',
        'Price Value', 'Durability', 'Warranty & Service', 'Safety Features'
    ],
    [ProductDomain.BEAUTY]: [
        'Effectiveness', 'Skin/Hair Suitability', 'Fragrance', 'Packaging',
        'Ingredients', 'Price Value', 'Texture & Consistency', 'Longevity',
        'Brand Authenticity', 'Allergic Reactions', 'Cruelty-Free Status'
    ],
    [ProductDomain.BOOKS]: [
        'Content Quality', 'Writing Style', 'Print Quality', 'Binding',
        'Price Value', 'Delivery Condition', 'Translation Quality',
        'Edition Accuracy', 'Illustrations', 'Cover Design'
    ],
    [ProductDomain.SPORTS]: [
        'Performance', 'Comfort', 'Durability', 'Build Quality',
        'Size & Fit', 'Price Value', 'Design', 'Material Quality',
        'Grip & Handling', 'Weight', 'Safety Features'
    ],
    [ProductDomain.AUTOMOTIVE]: [
        'Performance', 'Fuel Efficiency', 'Comfort', 'Safety Features',
        'Build Quality', 'Maintenance Cost', 'Price Value', 'Technology',
        'Resale Value', 'After-Sales Service', 'Spare Parts Availability'
    ],
    [ProductDomain.FOOD]: [
        'Taste', 'Freshness', 'Quality', 'Packaging', 'Price Value',
        'Expiry Date', 'Ingredients', 'Nutritional Value', 'Delivery Condition',
        'Authenticity', 'Quantity'
    ],
    [ProductDomain.TOYS]: [
        'Quality', 'Safety', 'Educational Value', 'Durability',
        'Age Appropriateness', 'Entertainment Value', 'Price Value',
        'Brand Authenticity', 'Assembly', 'Size Accuracy'
    ],
};

// Domain-specific retailer mapping
const domainRetailers: Record<ProductDomain, string[]> = {
    [ProductDomain.ELECTRONICS]: [
        'Amazon.in', 'Flipkart', 'Croma', 'Reliance Digital', 'Vijay Sales', 'Tata CLiQ'
    ],
    [ProductDomain.FASHION]: [
        'Amazon Fashion', 'Myntra', 'Ajio', 'Flipkart Fashion', 'Nykaa Fashion', 'Tata CLiQ'
    ],
    [ProductDomain.HEALTHCARE]: [
        'PharmEasy', '1mg', 'Netmeds', 'Apollo Pharmacy', 'Amazon Pharmacy', 'Flipkart Health+'
    ],
    [ProductDomain.HOME_APPLIANCES]: [
        'Amazon.in', 'Flipkart', 'Croma', 'Reliance Digital', 'Vijay Sales', 'Tata CLiQ'
    ],
    [ProductDomain.BEAUTY]: [
        'Nykaa', 'Purplle', 'Amazon Beauty', 'Flipkart', 'Sephora India', 'MyGlamm'
    ],
    [ProductDomain.BOOKS]: [
        'Amazon.in', 'Flipkart', 'Bookswagon', 'Crossword', 'Sapna Book House'
    ],
    [ProductDomain.SPORTS]: [
        'Decathlon', 'Amazon.in', 'Flipkart', 'Myntra', 'Ajio', 'Nike India'
    ],
    [ProductDomain.AUTOMOTIVE]: [
        'CarDekho', 'CarWale', 'Amazon Automotive', 'Flipkart Automotive', 'Boodmo'
    ],
    [ProductDomain.FOOD]: [
        'BigBasket', 'Blinkit', 'Zepto', 'Amazon Fresh', 'Flipkart Grocery', 'Swiggy Instamart'
    ],
    [ProductDomain.TOYS]: [
        'Amazon.in', 'Flipkart', 'FirstCry', 'Hamleys', 'Funcorp'
    ],
};

// Auto-detect domain from product name
export const detectDomain = (productName: string): ProductDomain => {
    const name = productName.toLowerCase();
    
    // Electronics keywords
    if (/(phone|laptop|tablet|tv|camera|headphone|speaker|smartwatch|earbuds|mouse|keyboard|monitor)/i.test(name)) {
        return ProductDomain.ELECTRONICS;
    }
    // Fashion keywords
    if (/(shirt|jeans|dress|shoes|saree|kurta|jacket|pants|top|tshirt|clothing)/i.test(name)) {
        return ProductDomain.FASHION;
    }
    // Healthcare keywords
    if (/(medicine|supplement|vitamin|health|medical|pharmacy|drug|tablet|capsule)/i.test(name)) {
        return ProductDomain.HEALTHCARE;
    }
    // Home appliances keywords
    if (/(refrigerator|fridge|washing machine|ac|air conditioner|microwave|oven|mixer|grinder)/i.test(name)) {
        return ProductDomain.HOME_APPLIANCES;
    }
    // Beauty keywords
    if (/(cream|lotion|shampoo|conditioner|perfume|makeup|cosmetic|skincare|lipstick)/i.test(name)) {
        return ProductDomain.BEAUTY;
    }
    // Books keywords
    if (/(book|novel|textbook|guide|magazine|publication)/i.test(name)) {
        return ProductDomain.BOOKS;
    }
    // Sports keywords
    if (/(cricket|football|badminton|gym|fitness|sports|yoga|exercise|bicycle)/i.test(name)) {
        return ProductDomain.SPORTS;
    }
    // Automotive keywords
    if (/(car|bike|scooter|motorcycle|vehicle|auto|tyre|helmet)/i.test(name)) {
        return ProductDomain.AUTOMOTIVE;
    }
    // Food keywords
    if (/(food|snack|beverage|grocery|organic|nutrition)/i.test(name)) {
        return ProductDomain.FOOD;
    }
    // Toys keywords
    if (/(toy|game|puzzle|doll|kids|children)/i.test(name)) {
        return ProductDomain.TOYS;
    }
    
    // Default to electronics
    return ProductDomain.ELECTRONICS;
};

// Domain-adapted analysis
export const analyzeDomainSpecific = async (
    productName: string,
    targetLanguage: Language,
    domain?: ProductDomain
): Promise<any> => {
    const detectedDomain = domain || detectDomain(productName);
    const aspects = domainAspects[detectedDomain];
    const retailers = domainRetailers[detectedDomain];
    
    const prompt = `
    You are an expert product analyst specializing in the ${detectedDomain.toUpperCase()} category for the Indian market.
    
    Product: "${productName}"
    Category: ${detectedDomain}
    Target Language: ${targetLanguage}
    
    Perform domain-specific analysis focusing on these ${detectedDomain}-specific aspects:
    ${aspects.map((a, i) => `${i + 1}. ${a}`).join('\n')}
    
    Search the web for this product from these ${detectedDomain}-specific Indian retailers:
    ${retailers.join(', ')}
    
    Your analysis MUST include:
    
    1. **productName**: Official product name
    
    2. **domain**: "${detectedDomain}"
    
    3. **domainSpecificInfo**: Category-specific details relevant to ${detectedDomain}
       ${getDomainSpecificFields(detectedDomain)}
    
    4. **variants**: 2-4 common variants available in India
    
    5. **prices**: Current prices from at least 3 retailers mentioned above (in ₹)
    
    6. **aspectWiseAnalysis**: For EACH aspect listed above, provide:
       - aspect name
       - sentiment (positive/negative/neutral/mixed)
       - confidence score (0-1)
       - key findings (2-3 points in ${targetLanguage})
       - mention count
    
    7. **overallPros**: Top 5 positive points in ${targetLanguage}
    
    8. **overallCons**: Top 5 negative points in ${targetLanguage}
    
    9. **alternativeProducts**: 2-3 alternatives in same ${detectedDomain} category
    
    10. **domainExpertRecommendation**: 
        - buyRecommendation (buy/wait/avoid)
        - reasoning in ${targetLanguage}
        - bestFor: Who should buy this
        - notFor: Who should avoid this
    
    Return ONLY a minified JSON object with the exact structure above.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: getDomainSchema(detectedDomain)
            },
        });

        const result = JSON.parse(response.text.trim());
        return {
            ...result,
            domain: detectedDomain,
            analysisDate: new Date().toISOString(),
        };

    } catch (error) {
        console.error("Domain-specific analysis error:", error);
        throw new Error(`Failed to analyze ${detectedDomain} product. Please try again.`);
    }
};

// Get domain-specific fields prompt
const getDomainSpecificFields = (domain: ProductDomain): string => {
    const fieldMap: Record<ProductDomain, string> = {
        [ProductDomain.ELECTRONICS]: `
       - processorType, ram, storage (if applicable)
       - operatingSystem
       - warrantyPeriod
       - certifications`,
        [ProductDomain.FASHION]: `
       - fabricType
       - availableSizes
       - careInstructions
       - countryOfOrigin`,
        [ProductDomain.HEALTHCARE]: `
       - activeIngredients
       - dosageForm
       - prescriptionRequired
       - sideEffects
       - certifications`,
        [ProductDomain.HOME_APPLIANCES]: `
       - powerConsumption
       - capacity/size
       - warrantyPeriod
       - energyRating`,
        [ProductDomain.BEAUTY]: `
       - skinType
       - ingredients
       - crueltryFree
       - shelfLife`,
        [ProductDomain.BOOKS]: `
       - author
       - publisher
       - isbn
       - pageCount
       - edition`,
        [ProductDomain.SPORTS]: `
       - sportType
       - material
       - sizeGuide
       - skillLevel`,
        [ProductDomain.AUTOMOTIVE]: `
       - mileage
       - engineCapacity
       - transmissionType
       - fuelType`,
        [ProductDomain.FOOD]: `
       - brandName
       - expiryDate
       - nutritionalInfo
       - certifications`,
        [ProductDomain.TOYS]: `
       - ageRange
       - material
       - safetyStandards
       - assemblyRequired`,
    };
    return fieldMap[domain] || '';
};

// Domain-specific JSON schema
const getDomainSchema = (domain: ProductDomain) => ({
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING },
        domain: { type: Type.STRING },
        domainSpecificInfo: { type: Type.OBJECT },
        variants: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
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
                },
            }
        },
        aspectWiseAnalysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    aspect: { type: Type.STRING },
                    sentiment: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                    keyFindings: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    mentionCount: { type: Type.NUMBER },
                },
            }
        },
        overallPros: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        overallCons: {
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
            }
        },
        domainExpertRecommendation: {
            type: Type.OBJECT,
            properties: {
                buyRecommendation: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                bestFor: { type: Type.STRING },
                notFor: { type: Type.STRING },
            }
        }
    },
    required: ["productName", "domain", "aspectWiseAnalysis", "overallPros", "overallCons"]
});

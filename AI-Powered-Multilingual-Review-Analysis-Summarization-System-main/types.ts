export interface Price {
  store: string;
  price: string;
  url: string;
}

export interface ProductVariant {
  name: string;
  description: string;
}

export interface AlternativeProduct {
  name: string;
  price: string;
  reason: string;
}

export interface ProductAnalysisResult {
  productName: string;
  variants: ProductVariant[];
  prices: Price[];
  pros: string[];
  cons: string[];
  alternativeProducts: AlternativeProduct[];
}

export enum Language {
    ENGLISH = 'en',
    HINDI = 'hi',
    BENGALI = 'bn',
    MARATHI = 'mr',
    TELUGU = 'te',
    TAMIL = 'ta',
    GUJARATI = 'gu',
    KANNADA = 'kn',
    MALAYALAM = 'ml',
    URDU = 'ur',
    NEPALI = 'ne',
    SPANISH = 'es',
    FRENCH = 'fr',
    GERMAN = 'de',
    JAPANESE = 'ja',
    CHINESE = 'zh',
}

export const languageOptions = [
    { value: Language.ENGLISH, label: 'English' },
    { value: Language.HINDI, label: 'Hindi' },
    { value: Language.BENGALI, label: 'Bengali' },
    { value: Language.MARATHI, label: 'Marathi' },
    { value: Language.TELUGU, label: 'Telugu' },
    { value: Language.TAMIL, label: 'Tamil' },
    { value: Language.GUJARATI, label: 'Gujarati' },
    { value: Language.KANNADA, label: 'Kannada' },
    { value: Language.MALAYALAM, label: 'Malayalam' },
    { value: Language.URDU, label: 'Urdu' },
    { value: Language.NEPALI, label: 'Nepali' },
    { value: Language.SPANISH, label: 'Spanish' },
    { value: Language.FRENCH, label: 'French' },
    { value: Language.GERMAN, label: 'German' },
    { value: Language.JAPANESE, label: 'Japanese' },
    { value: Language.CHINESE, label: 'Chinese' },
];
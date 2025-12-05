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
    // Indian Languages
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
    PUNJABI = 'pa',
    ODIA = 'or',
    ASSAMESE = 'as',
    SANSKRIT = 'sa',
    KONKANI = 'kok',
    SINDHI = 'sd',
    // Global Languages
    SPANISH = 'es',
    FRENCH = 'fr',
    GERMAN = 'de',
    JAPANESE = 'ja',
    CHINESE = 'zh',
    ARABIC = 'ar',
    PORTUGUESE = 'pt',
    RUSSIAN = 'ru',
    KOREAN = 'ko',
    ITALIAN = 'it',
    DUTCH = 'nl',
    TURKISH = 'tr',
    POLISH = 'pl',
    VIETNAMESE = 'vi',
    THAI = 'th',
    INDONESIAN = 'id',
    MALAY = 'ms',
    PERSIAN = 'fa',
    HEBREW = 'he',
    SWAHILI = 'sw',
}

export const languageOptions = [
    // Indian Languages
    { value: Language.ENGLISH, label: 'English', region: 'Indian' },
    { value: Language.HINDI, label: 'हिंदी (Hindi)', region: 'Indian' },
    { value: Language.BENGALI, label: 'বাংলা (Bengali)', region: 'Indian' },
    { value: Language.MARATHI, label: 'मराठी (Marathi)', region: 'Indian' },
    { value: Language.TELUGU, label: 'తెలుగు (Telugu)', region: 'Indian' },
    { value: Language.TAMIL, label: 'தமிழ் (Tamil)', region: 'Indian' },
    { value: Language.GUJARATI, label: 'ગુજરાતી (Gujarati)', region: 'Indian' },
    { value: Language.KANNADA, label: 'ಕನ್ನಡ (Kannada)', region: 'Indian' },
    { value: Language.MALAYALAM, label: 'മലയാളം (Malayalam)', region: 'Indian' },
    { value: Language.URDU, label: 'اردو (Urdu)', region: 'Indian' },
    { value: Language.NEPALI, label: 'नेपाली (Nepali)', region: 'Indian' },
    { value: Language.PUNJABI, label: 'ਪੰਜਾਬੀ (Punjabi)', region: 'Indian' },
    { value: Language.ODIA, label: 'ଓଡ଼ିଆ (Odia)', region: 'Indian' },
    { value: Language.ASSAMESE, label: 'অসমীয়া (Assamese)', region: 'Indian' },
    { value: Language.SANSKRIT, label: 'संस्कृत (Sanskrit)', region: 'Indian' },
    { value: Language.KONKANI, label: 'कोंकणी (Konkani)', region: 'Indian' },
    { value: Language.SINDHI, label: 'سنڌي (Sindhi)', region: 'Indian' },
    // Global Languages
    { value: Language.SPANISH, label: 'Español (Spanish)', region: 'Global' },
    { value: Language.FRENCH, label: 'Français (French)', region: 'Global' },
    { value: Language.GERMAN, label: 'Deutsch (German)', region: 'Global' },
    { value: Language.JAPANESE, label: '日本語 (Japanese)', region: 'Global' },
    { value: Language.CHINESE, label: '中文 (Chinese)', region: 'Global' },
    { value: Language.ARABIC, label: 'العربية (Arabic)', region: 'Global' },
    { value: Language.PORTUGUESE, label: 'Português (Portuguese)', region: 'Global' },
    { value: Language.RUSSIAN, label: 'Русский (Russian)', region: 'Global' },
    { value: Language.KOREAN, label: '한국어 (Korean)', region: 'Global' },
    { value: Language.ITALIAN, label: 'Italiano (Italian)', region: 'Global' },
    { value: Language.DUTCH, label: 'Nederlands (Dutch)', region: 'Global' },
    { value: Language.TURKISH, label: 'Türkçe (Turkish)', region: 'Global' },
    { value: Language.POLISH, label: 'Polski (Polish)', region: 'Global' },
    { value: Language.VIETNAMESE, label: 'Tiếng Việt (Vietnamese)', region: 'Global' },
    { value: Language.THAI, label: 'ไทย (Thai)', region: 'Global' },
    { value: Language.INDONESIAN, label: 'Bahasa Indonesia', region: 'Global' },
    { value: Language.MALAY, label: 'Bahasa Melayu', region: 'Global' },
    { value: Language.PERSIAN, label: 'فارسی (Persian)', region: 'Global' },
    { value: Language.HEBREW, label: 'עברית (Hebrew)', region: 'Global' },
    { value: Language.SWAHILI, label: 'Kiswahili', region: 'Global' },
];
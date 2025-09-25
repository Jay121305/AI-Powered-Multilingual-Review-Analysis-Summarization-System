import React, { useState, useCallback } from 'react';
import type { ProductAnalysisResult } from './types';
import { Language } from './types';
import { Header } from './components/Header';
import { ProductInput } from './components/ReviewInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeProduct } from './services/geminiService';

const App: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!productName.trim()) {
      setError('Please enter a product name to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeProduct(productName, language);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred during analysis. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [productName, language]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="space-y-8">
          <ProductInput
            productName={productName}
            setProductName={setProductName}
            language={language}
            setLanguage={setLanguage}
            onSummarize={handleAnalyze}
            isLoading={isLoading}
          />
          <ResultsDisplay
            isLoading={isLoading}
            error={error}
            analysisResult={analysisResult}
          />
        </div>
      </main>
      <footer className="text-center py-4 mt-8 text-sm text-slate-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
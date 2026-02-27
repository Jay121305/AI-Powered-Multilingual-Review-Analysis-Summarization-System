import React from 'react';
import type { Language } from '../types';
import { languageOptions } from '../types';
import { SparklesIcon } from './icons';

interface ProductInputProps {
  productName: string;
  setProductName: (name: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  onSummarize: () => void;
  isLoading: boolean;
}

export const ProductInput: React.FC<ProductInputProps> = ({
  productName,
  setProductName,
  language,
  setLanguage,
  onSummarize,
  isLoading,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-slate-700 mb-1">
          Enter Product Name
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          className="w-full p-3 border border-slate-300 rounded-md shadow-sm transition bg-slate-800 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Victus 16, iPhone 15 Pro Max, Sony WH-1000XM5..."
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading && productName.trim()) {
              onSummarize();
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">
          Analysis Language
        </label>
        <select
          id="language"
          name="language"
          className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          disabled={isLoading}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onSummarize}
        disabled={isLoading || !productName.trim()}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          'Analyzing...'
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Analyze Product
          </>
        )}
      </button>
    </div>
  );
};
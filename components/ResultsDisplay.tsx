import React from 'react';
import type { ProductAnalysisResult } from '../types';
import { Spinner } from './Spinner';
import { InfoIcon, LinkIcon, ThumbsUpIcon, ThumbsDownIcon, LightBulbIcon } from './icons';

interface ResultsDisplayProps {
  isLoading: boolean;
  error: string | null;
  analysisResult: ProductAnalysisResult | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, error, analysisResult }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md text-center">
        <Spinner />
        <p className="mt-4 text-slate-600 font-medium">AI is analyzing the Indian market...</p>
        <p className="mt-1 text-sm text-slate-500">Finding prices, reviews, and alternatives.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md text-center border-2 border-dashed border-slate-200">
        <InfoIcon className="w-12 h-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-medium text-slate-700">Ready for Analysis</h3>
        <p className="mt-1 text-sm text-slate-500">
          Enter a product name to see prices, reviews, and alternatives from the Indian market.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      <h1 className="text-3xl font-bold text-center text-slate-900">{analysisResult.productName}</h1>

      {/* Variants Section */}
      {analysisResult.variants && analysisResult.variants.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Available Variants</h2>
          <div className="space-y-3">
            {analysisResult.variants.map((variant, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-md">
                <p className="font-semibold text-slate-800">{variant.name}</p>
                <p className="text-sm text-slate-600">{variant.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Price Comparison (India)</h2>
        {analysisResult.prices && analysisResult.prices.length > 0 ? (
          <ul className="space-y-3">
            {analysisResult.prices.map((item, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <span className="font-semibold text-slate-700">{item.store}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-indigo-600">{item.price}</span>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-indigo-600 hover:underline"
                    aria-label={`Visit ${item.store} for ${analysisResult.productName}`}
                  >
                    <span>Visit Store</span>
                    <LinkIcon className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No pricing information found.</p>
        )}
      </div>

      {/* Pros and Cons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros Column */}
        <div>
          <h3 className="text-lg font-bold text-green-700 flex items-center mb-3">
            <ThumbsUpIcon className="w-6 h-6 mr-2" />
            Pros
          </h3>
          <ul className="space-y-2">
            {analysisResult.pros && analysisResult.pros.length > 0 ? (
              analysisResult.pros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">&#10003;</span>
                  <p className="text-slate-700">{pro}</p>
                </li>
              ))
            ) : (
              <li className="text-slate-500">No pros were summarized.</li>
            )}
          </ul>
        </div>

        {/* Cons Column */}
        <div>
          <h3 className="text-lg font-bold text-red-700 flex items-center mb-3">
            <ThumbsDownIcon className="w-6 h-6 mr-2" />
            Cons
          </h3>
          <ul className="space-y-2">
            {analysisResult.cons && analysisResult.cons.length > 0 ? (
              analysisResult.cons.map((con, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2.5 mt-1">&#10007;</span>
                  <p className="text-slate-700">{con}</p>
                </li>
              ))
            ) : (
              <li className="text-slate-500">No cons were summarized.</li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Alternative Products Section */}
      {analysisResult.alternativeProducts && analysisResult.alternativeProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4 flex items-center">
             <LightBulbIcon className="w-6 h-6 mr-2 text-yellow-500" />
            You Might Also Like
          </h2>
          <div className="space-y-3">
            {analysisResult.alternativeProducts.map((alt, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-md">
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-slate-800">{alt.name}</p>
                    <p className="font-bold text-indigo-600 text-right">{alt.price}</p>
                </div>
                <p className="text-sm text-slate-600 mt-1">{alt.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
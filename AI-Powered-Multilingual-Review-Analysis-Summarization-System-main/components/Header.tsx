import React from 'react';
import { PriceTagIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg">
                       <PriceTagIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Product Price & Review Analyzer</h1>
                        <p className="text-slate-500 text-sm">Compare prices and see pros & cons at a glance</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
# AI-Powered Multilingual Review Analysis Summarization System

An AI-powered web application that provides a comprehensive, India-centric analysis for any product. It fetches real-time prices from various e-commerce sites, summarizes user reviews into clear pros and cons, identifies product variants, and suggests alternatives, all in your preferred language.

This tool is designed to empower consumers to make smarter, faster, and more informed purchasing decisions.

## ✨ Key Features

- **🇮🇳 India-Centric Price Comparison**: Get the latest prices in Indian Rupees (₹) from major Indian online retailers like Amazon.in, Flipkart, Croma, and more, complete with direct links.
- **📊 Pros & Cons Analysis**: The AI reads and understands thousands of user and expert reviews, distilling them into the most commonly cited positive and negative points for a quick, balanced overview.
- **📦 Product Variant Detection**: Automatically finds and lists common variants of the product, such as different storage sizes, colors, or related models (e.g., "Pro" vs. "Standard").
- **💡 Smart Alternatives**: Discovers and suggests similar products in the same price range, providing a brief reason for each recommendation to help you explore other options.
- **🌐 Multilingual Support**: Get your analysis in numerous languages, including English, Hindi, Tamil, Telugu, Bengali, Nepali, and many more.

## 🚀 Technology Stack

- **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/) for a robust and type-safe user interface.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a modern, utility-first design system.
- **Core Logic**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash` model) leveraging its advanced capabilities for web search, structured data generation (JSON), and multilingual summarization.

## 🔧 Getting Started

### Prerequisites

- A modern web browser.
- A **Google Gemini API Key**. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup and Running the Application

This project is configured to run in an environment where the API key is provided as an environment variable.

1.  **Environment Variable**: Ensure that the `API_KEY` environment variable is set with your Google Gemini API key. In a local development setup, you would typically create a `.env` file in the project root:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

2.  **Dependencies**: The project uses a modern setup with `importmap` in `index.html` to load dependencies like React and `@google/genai` directly from a CDN. This means you don't need a traditional `npm install` step.

3.  **Running the App**: To run the project, you just need to serve the `index.html` file with a local web server.

## How It Works

1.  The user enters a product name and selects a language.
2.  The frontend calls the `analyzeProduct` function in `services/geminiService.ts`.
3.  A detailed prompt is sent to the Gemini API, instructing it to act as an Indian market expert. The prompt asks the model to search the web and return a structured JSON object containing prices, pros, cons, variants, and alternatives.
4.  The Gemini model performs the web search, analyzes the data, and generates the JSON response in the requested language.
5.  The frontend receives the structured data, parses it, and dynamically renders the results in a clean, user-friendly interface using React components.

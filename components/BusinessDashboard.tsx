import React, { useState, useEffect } from 'react';
import type { ProductAnalysisResult } from '../types';

// Business Dashboard Interfaces
interface BusinessMetrics {
  totalAnalyses: number;
  avgSentiment: number;
  topAspects: AspectMetric[];
  competitorComparison: CompetitorMetric[];
  trendingProducts: TrendingProduct[];
  customerInsights: CustomerInsight[];
}

interface AspectMetric {
  aspect: string;
  avgScore: number;
  trend: 'up' | 'down' | 'stable';
  mentionCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface CompetitorMetric {
  competitor: string;
  avgPrice: number;
  avgRating: number;
  marketShare: number;
}

interface TrendingProduct {
  productName: string;
  searchVolume: number;
  avgSentiment: number;
  category: string;
}

interface CustomerInsight {
  insight: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export const BusinessDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Business Analytics Dashboard</h1>
          <p className="text-slate-600 mt-2">Real-time insights for sellers & businesses</p>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <select 
              className="px-4 py-2 border rounded-md"
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value as any)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <select 
              className="px-4 py-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <KPICard 
            title="Total Analyses"
            value="12,458"
            change="+23%"
            trend="up"
          />
          <KPICard 
            title="Avg Sentiment"
            value="4.2/5"
            change="+0.3"
            trend="up"
          />
          <KPICard 
            title="Review Coverage"
            value="89%"
            change="+5%"
            trend="up"
          />
          <KPICard 
            title="Response Time"
            value="2.3s"
            change="-0.5s"
            trend="up"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aspect-wise Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Aspect-wise Performance</h2>
            <AspectChart />
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Sentiment Distribution</h2>
            <SentimentPieChart />
          </div>

          {/* Competitor Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Competitor Comparison</h2>
            <CompetitorTable />
          </div>

          {/* Trending Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Trending Products</h2>
            <TrendingList />
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">AI-Powered Customer Insights</h2>
          <CustomerInsightsList />
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Export Reports</h2>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              📊 Export to Excel
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              📄 Generate PDF Report
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              📧 Email Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}> = ({ title, value, change, trend }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="text-sm text-slate-600 mb-1">{title}</div>
    <div className="text-3xl font-bold text-slate-900">{value}</div>
    <div className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
      {trend === 'up' ? '↑' : '↓'} {change} vs last period
    </div>
  </div>
);

// Aspect Chart Component
const AspectChart: React.FC = () => {
  const aspects = [
    { name: 'Performance', score: 85, trend: 'up' },
    { name: 'Price Value', score: 72, trend: 'stable' },
    { name: 'Build Quality', score: 88, trend: 'up' },
    { name: 'Battery Life', score: 65, trend: 'down' },
    { name: 'Camera', score: 90, trend: 'up' },
  ];

  return (
    <div className="space-y-4">
      {aspects.map((aspect) => (
        <div key={aspect.name}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{aspect.name}</span>
            <span className="text-sm font-bold">{aspect.score}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                aspect.score >= 80 ? 'bg-green-600' : 
                aspect.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${aspect.score}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Sentiment Pie Chart (simplified representation)
const SentimentPieChart: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-600 rounded"></div>
        <span>Positive</span>
      </div>
      <span className="font-bold">68%</span>
    </div>
    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-600 rounded"></div>
        <span>Neutral</span>
      </div>
      <span className="font-bold">22%</span>
    </div>
    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-600 rounded"></div>
        <span>Negative</span>
      </div>
      <span className="font-bold">10%</span>
    </div>
  </div>
);

// Competitor Table
const CompetitorTable: React.FC = () => {
  const competitors = [
    { name: 'Your Product', price: '₹25,999', rating: 4.2, share: '28%' },
    { name: 'Competitor A', price: '₹24,499', rating: 4.0, share: '35%' },
    { name: 'Competitor B', price: '₹27,999', rating: 4.3, share: '22%' },
    { name: 'Competitor C', price: '₹23,999', rating: 3.8, share: '15%' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Rating</th>
            <th className="p-2 text-right">Share</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((comp, idx) => (
            <tr key={idx} className={`border-b ${idx === 0 ? 'bg-indigo-50 font-semibold' : ''}`}>
              <td className="p-2">{comp.name}</td>
              <td className="p-2 text-right">{comp.price}</td>
              <td className="p-2 text-right">{comp.rating}/5</td>
              <td className="p-2 text-right">{comp.share}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Trending List
const TrendingList: React.FC = () => {
  const trending = [
    { name: 'iPhone 15 Pro', volume: '↑ 156%', sentiment: '4.4/5' },
    { name: 'Samsung Galaxy S24', volume: '↑ 89%', sentiment: '4.2/5' },
    { name: 'OnePlus 12', volume: '↑ 67%', sentiment: '4.3/5' },
    { name: 'Nothing Phone 2', volume: '↑ 45%', sentiment: '4.0/5' },
  ];

  return (
    <div className="space-y-3">
      {trending.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded">
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-green-600">{item.volume}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">{item.sentiment}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Customer Insights List
const CustomerInsightsList: React.FC = () => {
  const insights = [
    { 
      text: 'Battery life is the #1 concern for 67% of negative reviews', 
      impact: 'high',
      action: 'Consider addressing in next product iteration'
    },
    { 
      text: 'Camera quality praised in premium segment, but missing in mid-range', 
      impact: 'medium',
      action: 'Opportunity for product line expansion'
    },
    { 
      text: 'Price sensitivity highest in tier 2/3 cities', 
      impact: 'high',
      action: 'Regional pricing strategy recommended'
    },
  ];

  return (
    <div className="space-y-4">
      {insights.map((insight, idx) => (
        <div key={idx} className="border-l-4 border-indigo-600 bg-indigo-50 p-4 rounded">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-slate-900">{insight.text}</p>
              <p className="text-sm text-slate-600 mt-1">💡 {insight.action}</p>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-semibold ${
              insight.impact === 'high' ? 'bg-red-100 text-red-800' :
              insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {insight.impact.toUpperCase()} IMPACT
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

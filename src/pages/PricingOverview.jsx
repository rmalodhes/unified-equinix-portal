import React from 'react';
import { ArrowLeft, PieChart } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { formatCurrency } from '../utils/calculations';

const PricingOverview = () => {
  const { draft, getTotalPrice, navigate } = useStore();

  const breakdown = draft.map(item => ({
    name: item.name,
    price: item.price,
    category: item.category
  }));

  const categoryTotals = breakdown.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.price;
    return acc;
  }, {});

  const totalPrice = getTotalPrice();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>
        <div className="flex items-center gap-3">
          <PieChart className="w-8 h-8 text-equinix-blue" />
          <h1 className="text-3xl font-bold text-equinix-dark">Pricing Overview</h1>
        </div>
        <p className="text-gray-600 mt-2">Detailed breakdown of your monthly costs</p>
      </div>

      {totalPrice === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">💰</div>
          <div className="text-gray-500 text-lg mb-4">No items to price</div>
          <button
            onClick={() => navigate('home')}
            className="btn-primary"
          >
            Start Configuring
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Item Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>Item Breakdown</span>
              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {breakdown.length} items
              </span>
            </h2>
            <div className="space-y-3">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-2 rounded transition-colors">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(item.price)}</div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Card */}
          <div className="space-y-6">
            {/* Category Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Category Summary</h2>
              <div className="space-y-3">
                {Object.entries(categoryTotals).map(([category, total]) => {
                  const percentage = ((total / totalPrice) * 100).toFixed(1);
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{category}</span>
                        <span className="font-semibold">{formatCurrency(total)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-equinix-blue h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage}% of total</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-equinix-blue to-red-600 rounded-lg p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Total Monthly Cost</h3>
              <div className="text-3xl font-bold mb-2">{formatCurrency(totalPrice)}</div>
              <div className="text-red-100 text-sm">
                Annual cost: {formatCurrency(totalPrice * 12)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('view-draft')}
                className="w-full btn-primary"
              >
                Review Full Configuration
              </button>
              <button
                onClick={() => navigate('home')}
                className="w-full btn-secondary"
              >
                Add More Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingOverview;
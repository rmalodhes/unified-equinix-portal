import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { formatCurrency } from '../utils/calculations';

const ViewDraft = () => {
  const { draft, addToCart, getTotalPrice, navigate, removeFromDraft } = useStore();

  const handleAddToCart = () => {
    draft.forEach(item => addToCart(item));
    navigate('cart');
  };

  const handleRemoveItem = (id) => {
    removeFromDraft(id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>
        <h1 className="text-3xl font-bold text-equinix-dark">Draft Summary</h1>
        <p className="text-gray-600 mt-2">Review your configuration before adding to cart</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Details</h2>
          {draft.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <div className="text-gray-500 text-lg">No items in draft</div>
              <button
                onClick={() => navigate('home')}
                className="mt-4 btn-primary"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {draft.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(item.price)}/mo
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    {Object.entries(item.configuration || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-equinix-dark font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {draft.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-xl font-semibold">Total Monthly Cost:</span>
                <div className="text-sm text-gray-600 mt-1">
                  {draft.length} item{draft.length !== 1 ? 's' : ''} configured
                </div>
              </div>
              <span className="text-3xl font-bold text-green-600">
                {formatCurrency(getTotalPrice())}/mo
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('home')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-equinix-blue text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDraft;
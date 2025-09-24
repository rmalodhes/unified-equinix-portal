import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { calculatePrice } from '../../utils/calculations';

const WorkflowDrawer = ({ isOpen, onClose, productKey, product }) => {
  const { addToDraft } = useStore();
  const [configuration, setConfiguration] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations] = useState(['patch-panel', 'cross-connect', 'fiber-connect']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const price = calculatePrice(product, configuration);
    addToDraft({
      name: product.name,
      category: product.category,
      configuration,
      price
    });
    
    onClose();
    setConfiguration({});
    setIsSubmitting(false);
  };

  const handleRecommendationClick = (recProductKey) => {
    console.log('Opening recommendation:', recProductKey);
    // In a real implementation, this would open another drawer
  };

  if (!isOpen || !product) return null;

  const estimatedPrice = calculatePrice(product, configuration);

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="absolute right-0 top-0 h-full w-1/2 bg-white shadow-xl overflow-y-auto transform transition-transform animate-slide-in-right">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-equinix-dark">{product.name}</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Recommendations */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-3 text-blue-900">Recommended Products</h3>
            <div className="flex gap-2 flex-wrap">
              {recommendations
                .filter(recKey => recKey !== productKey)
                .map(recKey => (
                  <button
                    key={recKey}
                    onClick={() => handleRecommendationClick(recKey)}
                    className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                  >
                    {recKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {product.fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent transition-all"
                    value={configuration[field.name] || ''}
                    onChange={(e) => setConfiguration(prev => ({ ...prev, [field.name]: e.target.value }))}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    min={field.min}
                    max={field.max}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent transition-all"
                    value={configuration[field.name] || ''}
                    onChange={(e) => setConfiguration(prev => ({ ...prev, [field.name]: e.target.value }))}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Monthly Cost:</span>
                <span className="text-xl font-bold text-green-600">
                  ${estimatedPrice}
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-equinix-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add to Draft'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDrawer;
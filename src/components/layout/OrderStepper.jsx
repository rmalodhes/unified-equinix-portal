import React, { useState } from "react";
import { Building, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "../../hooks/useStore";

const OrderStepper = () => {
  const { draft, selectedIBX, selectedCage } = useStore();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-80 bg-gradient-to-b from-white/90 to-gray-50/90 backdrop-blur-sm p-6 h-screen overflow-y-auto border-r border-gray-100 relative z-10">
      <div className="mb-6 p-4 bg-gradient-to-r from-equinix-blue/5 to-indigo-600/5 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-500">
        <h3 className="text-lg font-bold mb-2 text-gray-700 hover:bg-gradient-to-r hover:from-equinix-blue hover:to-indigo-600 hover:bg-clip-text hover:text-transparent transition-all duration-500">
          Order Configuration
        </h3>
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-4 h-4" />
            <span>IBX: {selectedIBX}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Cage: {selectedCage}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {draft.length === 0 ? (
          <div className="text-gray-500 text-sm bg-white p-4 rounded-lg border-2 border-dashed border-gray-200 text-center">
            No items in draft
          </div>
        ) : (
          draft.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {expandedItems[index] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>
              {expandedItems[index] && (
                <div className="px-3 pb-3 text-sm text-gray-600 border-t border-gray-100 animate-fade-in">
                  <div className="mt-2 space-y-1">
                    {Object.entries(item.configuration || {}).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    )}
                    <div className="flex justify-between text-green-600 font-medium mt-2 pt-2 border-t">
                      <span>Price:</span>
                      <span>${item.price}/mo</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderStepper;

import React, { useState } from "react";
import { useStore } from "../../hooks/useStore";
import TemplateCard from "./TemplateCard";
import TemplateModal from "./TemplateModal";

const ProductCard = ({ productKey, product }) => {
  const IconComponent = product.icon;
  const { navigate } = useStore();
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Use essentialTemplates if available, fallback to templates
  const templates = product.essentialTemplates || product.templates || [];
  const displayTemplates = templates.slice(0, 3); // Show first 3 templates
  const hasMoreTemplates = templates.length > 3;

  return (
    <div className="card group relative overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-equinix-blue/2 to-indigo-600/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-lg border border-blue-50 group-hover:shadow-sm group-hover:scale-105 transition-all duration-500 animate-gentle-pulse">
              <IconComponent className="w-6 h-6 text-equinix-blue group-hover:text-indigo-600 transition-colors duration-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-equinix-dark group-hover:text-indigo-700 transition-colors duration-500">
                {product.name}
              </h3>
              <span className="text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-blue-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`orderDetails?product=${productKey}`)}
            className="btn-primary flex items-center gap-2 group-hover:shadow-xl group-hover:scale-105"
            aria-label={`Configure ${product.name}`}
          >
            Create New
          </button>
        </div>

        {/* <p className="text-gray-600 text-sm mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {product.description}
        </p> */}

        {/* Templates Section */}
        {templates.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-800">
                Quick Start Templates
              </h4>
              {hasMoreTemplates && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTemplateModal(true);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  View More ({templates.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {displayTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  productKey={productKey}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={templates}
        productKey={productKey}
        productName={product.name}
      />
    </div>
  );
};

export default ProductCard;

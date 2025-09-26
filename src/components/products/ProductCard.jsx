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
          <div className="flex items-center gap-3">
            {/* View Provider Link - Only for Interconnection products */}
            {product.category === "Interconnection" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add navigation logic for provider view
                  navigate(`providers?product=${productKey}`);
                }}
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium hover:underline transition-colors duration-200 flex items-center gap-1"
              >
                View Providers
                <svg className="w-4 h-4 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            )}
            <button
              onClick={() => navigate(`orderDetails?product=${productKey}`)}
              className="btn-primary flex items-center gap-2 group-hover:shadow-xl group-hover:scale-105"
              aria-label={`Configure ${product.name}`}
            >
              Create New
            </button>
          </div>
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

        {/* View More Link - Always shown in bottom right corner */}
        <div className="mt-6 border-gray-100 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTemplateModal(true);
            }}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors duration-200 flex items-center gap-1"
          >
            View More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
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

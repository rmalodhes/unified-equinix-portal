import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { useStore } from "../../hooks/useStore";

const TemplateCard = ({ template, productKey, compact = false }) => {
  const { navigate } = useStore();

  const handleTemplateSelect = () => {
    const params = new URLSearchParams({
      product: productKey,
      template: template.id,
    });
    navigate(`orderDetails?${params.toString()}`);
  };

  if (compact) {
    return (
      <div
        className="template-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={handleTemplateSelect}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">
            {template.name}
          </h4>
          {template.popular && (
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              <span>Popular</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* Essential Details in Compact View */}
        {template.essentialDetails && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {template.essentialDetails.map((detail, index) => (
              <div key={index} className="bg-gray-50 rounded p-2">
                <p className="text-xs text-gray-500 font-medium">
                  {detail.label}
                </p>
                <p className="text-xs font-semibold text-gray-900 mt-0.5 line-clamp-1">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {template.mrcPricing && template.nrcPricing ? (
            <>
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium">One-time</p>
                <p className="font-bold text-sm text-blue-600">
                  {template.nrcPricing}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium">Monthly</p>
                <p className="font-bold text-sm text-green-600">
                  {template.mrcPricing}
                </p>
              </div>
            </>
          ) : (
            <span className="font-bold text-sm text-equinix-blue">
              {template.pricing || template.mrcPricing}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="template-card bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleTemplateSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {template.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
              {template.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          {template.popular && (
            <div className="flex items-center gap-1 text-sm text-amber-600 mb-2">
              <Star className="w-4 h-4 fill-current" />
              <span>Most Popular</span>
            </div>
          )}
          {template.mrcPricing && template.nrcPricing ? (
            <div className="space-y-1">
              <div>
                <p className="text-xs text-gray-500 font-medium">Monthly</p>
                <p className="font-bold text-lg text-green-600">
                  {template.mrcPricing}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Setup</p>
                <p className="font-bold text-lg text-blue-600">
                  {template.nrcPricing}
                </p>
              </div>
            </div>
          ) : (
            <span className="font-bold text-xl text-equinix-blue">
              {template.pricing || template.mrcPricing}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {template.description}
      </p>

      <div className="mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
          Use Case
        </p>
        <p className="text-sm text-gray-700">{template.useCase}</p>
      </div>

      {template.essentialDetails && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {template.essentialDetails.map((detail, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                {detail.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">Click to configure</span>
        <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default TemplateCard;

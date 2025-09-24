import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { useStore } from "../../hooks/useStore";

const TemplateCard = ({ template, productKey, compact = false }) => {
  const { navigate } = useStore();

  const getTierColor = (tier) => {
    switch (tier) {
      case "basic":
        return "from-green-500 to-emerald-600";
      case "business":
        return "from-blue-500 to-indigo-600";
      case "enterprise":
        return "from-purple-500 to-violet-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case "basic":
        return "bg-green-100 text-green-800 border-green-200";
      case "business":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${getTierBadgeColor(
              template.tier
            )}`}
          >
            {template.tier.charAt(0).toUpperCase() + template.tier.slice(1)}
          </span>
          <span className="font-bold text-sm text-equinix-blue">
            {template.pricing}
          </span>
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
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTierColor(
              template.tier
            )} flex items-center justify-center`}
          >
            <span className="text-white font-bold text-lg">
              {template.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
              {template.name}
            </h3>
            <span
              className={`text-sm px-2 py-1 rounded-full border ${getTierBadgeColor(
                template.tier
              )}`}
            >
              {template.tier.charAt(0).toUpperCase() + template.tier.slice(1)}
            </span>
          </div>
        </div>

        <div className="text-right">
          {template.popular && (
            <div className="flex items-center gap-1 text-sm text-amber-600 mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span>Most Popular</span>
            </div>
          )}
          <span className="font-bold text-xl text-equinix-blue">
            {template.pricing}
          </span>
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

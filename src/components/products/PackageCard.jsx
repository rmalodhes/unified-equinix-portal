import React from "react";
import { ShoppingCart, Package as PackageIcon } from "lucide-react";
import { useStore } from "../../hooks/useStore";

const PackageCard = ({ packageData }) => {
  const IconComponent = packageData.icon || PackageIcon;
  const { addToCart, addToPackages, navigate } = useStore();

  return (
    <div className="card group relative overflow-hidden border-2 border-transparent hover:border-blue-200 transition-all duration-500">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Package Badge */}
      <div className="absolute top-2 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-gentle-pulse z-20">
        PACKAGE DEAL
      </div>

      <div className="relative z-10">
        {/* Header with Icon, Title and CTA */}
        <div className="flex justify-between items-start mb-6 mt-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <IconComponent className="w-7 h-7 text-blue-600 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-equinix-dark group-hover:text-blue-700 transition-colors duration-300">
                {packageData.name}
              </h3>
              <span className="text-sm text-blue-600 font-bold bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-full">
                {packageData.category}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const packageWithConfig = {
                  ...packageData,
                  id: Date.now(),
                  price: packageData.discountedPrice,
                  configuration: {
                    ...packageData.configuration,
                    configuredAt: new Date().toISOString(),
                  },
                };
                addToPackages(packageWithConfig);
                navigate("packages");
              }}
              className="btn-secondary flex items-center gap-2"
              aria-label={`Add ${packageData.name} to packages`}
            >
              <PackageIcon className="w-4 h-4" />
              Add to Package
            </button>
            <button
              onClick={() => {
                const packageWithConfig = {
                  ...packageData,
                  id: Date.now(),
                  price: packageData.discountedPrice,
                  configuration: {
                    ...packageData.configuration,
                    configuredAt: new Date().toISOString(),
                  },
                };
                addToCart(packageWithConfig);
                navigate("cart");
              }}
              className="btn-primary flex items-center gap-2"
              aria-label={`Add ${packageData.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 rounded-xl border border-blue-100 group-hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg text-gray-500 line-through">
                ${packageData.originalPrice}/month
              </span>
              <span className="text-2xl font-bold text-green-600">
                ${packageData.discountedPrice}/month
              </span>
            </div>
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              {packageData.discount}% OFF
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Save ${packageData.originalPrice - packageData.discountedPrice} per
            month
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {packageData.description}
        </p>

        {/* Included Products - Single Line Format */}
        <div className="mb-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            Included Products:
          </h4>
          <div className="space-y-1">
            {packageData.includedProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-gray-700">
                    {product.name}
                  </span>
                  <span className="text-gray-500">- {product.description}</span>
                </div>
                <span className="text-gray-400 text-xs">
                  ${product.originalPrice}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Package Configuration */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            Package Configuration:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(packageData.configuration).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">
            Package Benefits:
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {packageData.features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-xs text-gray-600"
              >
                <span className="w-1 h-1 bg-equinix-blue rounded-full mt-2 flex-shrink-0"></span>
                <span>{feature}</span>
              </div>
            ))}
            {packageData.features.length > 3 && (
              <div className="text-xs text-gray-500 mt-1">
                +{packageData.features.length - 3} more benefits included
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;

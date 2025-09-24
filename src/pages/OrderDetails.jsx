import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Package, Save } from "lucide-react";
import { useStore } from "../hooks/useStore";
import { productData } from "../data/productData";
import { calculatePrice } from "../utils/calculations";

const OrderDetails = () => {
  const {
    navigate,
    addToCart,
    addToPackages,
    selectedIBX: selectedIbx,
    selectedCage,
  } = useStore();
  const [configuration, setConfiguration] = useState({});
  const [currentProduct, setCurrentProduct] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  useEffect(() => {
    // Get product and template from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productKey = urlParams.get("product");
    const templateId = urlParams.get("template");

    if (productKey && productData[productKey]) {
      setCurrentProduct({ key: productKey, ...productData[productKey] });

      // Initialize configuration with default values
      let initialConfig = {
        ibx: selectedIbx,
        cage: selectedCage,
      };

      // If template is specified, prefill with template configuration
      if (templateId) {
        const product = productData[productKey];
        const templates = product.essentialTemplates || product.templates || [];
        const selectedTemplate = templates.find((t) => t.id === templateId);

        if (selectedTemplate && selectedTemplate.configuration) {
          initialConfig = {
            ...initialConfig,
            ...selectedTemplate.configuration,
            templateName: selectedTemplate.name,
            templateId: selectedTemplate.id,
          };
        }
      }

      setConfiguration(initialConfig);
      setEstimatedPrice(calculatePrice(productData[productKey], initialConfig));
    }
  }, [selectedIbx, selectedCage]);

  useEffect(() => {
    if (currentProduct) {
      setEstimatedPrice(calculatePrice(currentProduct, configuration));
    }
  }, [configuration, currentProduct]);

  const handleConfigurationChange = (field, value) => {
    setConfiguration((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      const productWithConfig = {
        ...currentProduct,
        id: Date.now(),
        price: estimatedPrice,
        configuration: {
          ...configuration,
          configuredAt: new Date().toISOString(),
        },
      };
      addToCart(productWithConfig);
      navigate("cart");
    }
  };

  const handleAddToPackage = () => {
    if (currentProduct) {
      const productWithConfig = {
        ...currentProduct,
        id: Date.now(),
        price: estimatedPrice,
        configuration: {
          ...configuration,
          configuredAt: new Date().toISOString(),
        },
      };
      addToPackages(productWithConfig);
      navigate("packages");
    }
  };

  if (!currentProduct) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚠️</div>
          <div className="text-gray-500 text-lg mb-4">Product not found</div>
          <button onClick={() => navigate("home")} className="btn-primary">
            Back to Discovery
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = currentProduct.icon;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discovery
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <IconComponent className="w-8 h-8 text-equinix-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-equinix-dark">
              {currentProduct.name}
            </h1>
            <p className="text-gray-600">
              Configure your infrastructure solution
            </p>
            {configuration.templateName && (
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full border border-indigo-200">
                  Template: {configuration.templateName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Form */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Configuration Details</h2>

          <div className="space-y-6">
            {/* Basic Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBX Location
                </label>
                <input
                  type="text"
                  value={configuration.ibx || ""}
                  onChange={(e) =>
                    handleConfigurationChange("ibx", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent"
                  placeholder="Enter IBX location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cage Selection
                </label>
                <input
                  type="text"
                  value={configuration.cage || ""}
                  onChange={(e) =>
                    handleConfigurationChange("cage", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent"
                  placeholder="Enter cage selection"
                />
              </div>
            </div>

            {/* Product Specific Fields */}
            {currentProduct.fields &&
              currentProduct.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <select
                      value={configuration[field.name] || ""}
                      onChange={(e) =>
                        handleConfigurationChange(field.name, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      min={field.min}
                      max={field.max}
                      value={configuration[field.name] || ""}
                      onChange={(e) =>
                        handleConfigurationChange(field.name, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent"
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}

            {/* Additional Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Power Requirements (kW)
                </label>
                <input
                  type="number"
                  value={configuration.power || ""}
                  onChange={(e) =>
                    handleConfigurationChange("power", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent"
                  placeholder="Enter power requirements"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bandwidth (Mbps)
                </label>
                <input
                  type="number"
                  value={configuration.bandwidth || ""}
                  onChange={(e) =>
                    handleConfigurationChange("bandwidth", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent"
                  placeholder="Enter bandwidth requirements"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={configuration.notes || ""}
                onChange={(e) =>
                  handleConfigurationChange("notes", e.target.value)
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equinix-blue focus:border-transparent"
                placeholder="Add any additional configuration notes..."
              />
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-medium">
                  ${currentProduct.basePrice}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Configuration:</span>
                <span className="font-medium">
                  +${estimatedPrice - currentProduct.basePrice}/mo
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total Monthly:</span>
                <span className="font-bold text-xl text-green-600">
                  ${estimatedPrice}/mo
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Annual cost: ${estimatedPrice * 12}
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Configuration Summary
            </h3>
            <div className="space-y-2">
              {Object.entries(configuration).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleAddToPackage}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Add to Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

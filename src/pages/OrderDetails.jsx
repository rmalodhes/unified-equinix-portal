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

      // Set default draw cap for secure cabinet
      if (productKey === "secure-cabinet") {
        initialConfig.drawCap = "2kVA"; // Default to basic option
      }

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
            templateMrcPricing: selectedTemplate.mrcPricing,
            templateNrcPricing: selectedTemplate.nrcPricing,
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
    setConfiguration((prev) => {
      const newConfig = {
        ...prev,
        [field]: value,
      };

      // Reset PDU selection when circuit type changes
      if (field === "circuitType" && currentProduct?.key === "secure-cabinet") {
        newConfig.pdu = "";
        newConfig.pduCount = 0;
      }

      return newConfig;
    });
  };

  // Helper function to get available PDUs based on circuit type
  const getAvailablePdus = (circuitType) => {
    if (!circuitType) return [];

    const pduOptions = {
      "Single Phase Circuit": [
        {
          id: "PDU:P24E20G",
          name: "PDU P24E20G",
          description: "Single Phase PDU",
        },
      ],
      "Two Phase Circuit": [
        {
          id: "PDU:P36E30G",
          name: "PDU P36E30G",
          description: "Two Phase PDU",
        },
      ],
      "Three Phase Circuit": [
        {
          id: "PDU:P48E50G",
          name: "PDU P48E50G",
          description: "Three Phase PDU",
        },
      ],
    };

    return pduOptions[circuitType] || [];
  };

  // Helper function to get max PDU count based on circuit type
  const getMaxPduCount = (circuitType) => {
    const maxCounts = {
      "Single Phase Circuit": 1,
      "Two Phase Circuit": 2,
      "Three Phase Circuit": 1,
    };
    return maxCounts[circuitType] || 0;
  };

  const handlePduSelection = (pduId) => {
    if (configuration.pdu === pduId) {
      // Deselect PDU
      setConfiguration((prev) => ({
        ...prev,
        pdu: "",
        pduCount: 0,
      }));
    } else {
      // Select PDU with count 1
      setConfiguration((prev) => ({
        ...prev,
        pdu: pduId,
        pduCount: 1,
      }));
    }
  };

  const handlePduCountChange = (increment) => {
    const maxCount = getMaxPduCount(configuration.circuitType);
    const currentCount = configuration.pduCount || 0;
    const newCount = increment ? currentCount + 1 : currentCount - 1;

    if (newCount >= 0 && newCount <= maxCount) {
      setConfiguration((prev) => ({
        ...prev,
        pduCount: newCount,
      }));

      if (newCount === 0) {
        setConfiguration((prev) => ({
          ...prev,
          pdu: "",
        }));
      }
    }
  };

  // Pricing calculator for secure cabinet
  const calculateSecureCabinetPricing = () => {
    const baseCabinetPrice = { mrc: 1200, nrc: 200 }; // Standard Cabinet base price
    let totalMrc = baseCabinetPrice.mrc;
    let totalNrc = baseCabinetPrice.nrc;

    const breakdown = {
      standardCabinet: { mrc: baseCabinetPrice.mrc, nrc: baseCabinetPrice.nrc },
      cabinetDimensions: { mrc: 0, nrc: 0 },
      circuitType: { mrc: 0, nrc: 0 },
      pdu: { mrc: 0, nrc: 0 },
      drawCap: { mrc: 0, nrc: 0 },
    };

    // Cabinet Dimensions pricing
    if (configuration.cabinetDimensions) {
      switch (configuration.cabinetDimensions) {
        case "600mm × 800mm × 2000mm": // Compact
          breakdown.cabinetDimensions = { mrc: -350, nrc: -50 }; // Discount for smaller
          break;
        case "600mm × 1200mm × 2200mm": // Standard (base price)
          breakdown.cabinetDimensions = { mrc: 0, nrc: 0 };
          break;
        case "800mm × 1200mm × 2200mm": // Enterprise
          breakdown.cabinetDimensions = { mrc: 600, nrc: 600 }; // Premium for larger
          break;
      }
    }

    // Circuit Type pricing
    if (configuration.circuitType) {
      switch (configuration.circuitType) {
        case "Single Phase Circuit":
          breakdown.circuitType = { mrc: 0, nrc: 0 }; // Base circuit
          break;
        case "Two Phase Circuit":
          breakdown.circuitType = { mrc: 150, nrc: 100 }; // Additional cost
          break;
        case "Three Phase Circuit":
          breakdown.circuitType = { mrc: 300, nrc: 200 }; // Premium circuit
          break;
      }
    }

    // PDU pricing
    if (configuration.pdu && configuration.pduCount > 0) {
      const pduCost = { mrc: 80, nrc: 150 }; // Per PDU cost
      breakdown.pdu = {
        mrc: pduCost.mrc * configuration.pduCount,
        nrc: pduCost.nrc * configuration.pduCount,
      };
    }

    // Draw Cap pricing
    if (configuration.drawCap) {
      switch (configuration.drawCap) {
        case "2kVA":
          breakdown.drawCap = { mrc: 0, nrc: 0 }; // Base draw cap
          break;
        case "3kVA":
          breakdown.drawCap = { mrc: 50, nrc: 25 };
          break;
        case "4kVA":
          breakdown.drawCap = { mrc: 100, nrc: 50 };
          break;
        case "5kVA":
          breakdown.drawCap = { mrc: 150, nrc: 75 };
          break;
      }
    }

    // Calculate totals
    Object.values(breakdown).forEach((item) => {
      totalMrc += item.mrc;
      totalNrc += item.nrc;
    });

    return {
      breakdown,
      totals: { mrc: totalMrc, nrc: totalNrc },
    };
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
  const pricing =
    currentProduct.key === "secure-cabinet"
      ? calculateSecureCabinetPricing()
      : null;

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
            {/* Secure Cabinet Specific Configuration */}
            {currentProduct.key === "secure-cabinet" ? (
              <>
                {/* Cabinet Dimensions Cards */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cabinet Dimensions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      "600mm × 800mm × 2000mm",
                      "600mm × 1200mm × 2200mm",
                      "800mm × 1200mm × 2200mm",
                    ].map((dimensions) => (
                      <div
                        key={dimensions}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center ${
                          configuration.cabinetDimensions === dimensions
                            ? "border-equinix-blue bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          handleConfigurationChange(
                            "cabinetDimensions",
                            dimensions
                          )
                        }
                      >
                        <div className="font-medium text-gray-900">
                          {dimensions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Circuit Type Cards */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Circuit Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        type: "Single Phase Circuit",
                        description: "Basic single phase power",
                        icon: "1Φ",
                        maxPdu: "Max: 1 PDU",
                      },
                      {
                        type: "Single Phase Circuit x 2",
                        description: "Two phase power distribution",
                        icon: "2Φ",
                        maxPdu: "Max: 2 PDUs",
                      },
                      {
                        type: "Three Phase Circuit",
                        description: "High-power three phase",
                        icon: "3Φ",
                        maxPdu: "Max: 1 PDU",
                      },
                    ].map((circuit) => (
                      <div
                        key={circuit.type}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          configuration.circuitType === circuit.type
                            ? "border-equinix-blue bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          handleConfigurationChange("circuitType", circuit.type)
                        }
                      >
                        <div className="text-center">
                          <h4 className="font-semibold text-sm text-gray-900 mb-1">
                            {circuit.type}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {circuit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDU Selection Cards */}
                {configuration.circuitType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      PDU Selection (Optional)
                    </label>
                    <div className="space-y-4">
                      {getAvailablePdus(configuration.circuitType).map(
                        (pdu) => (
                          <div
                            key={pdu.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-6 h-6 border-2 rounded cursor-pointer transition-all duration-200 ${
                                    configuration.pdu === pdu.id
                                      ? "border-equinix-blue bg-equinix-blue"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                  onClick={() => handlePduSelection(pdu.id)}
                                >
                                  {configuration.pdu === pdu.id && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-900">
                                    {pdu.name}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    {pdu.description}
                                  </p>
                                </div>
                              </div>

                              {configuration.pdu === pdu.id &&
                                getMaxPduCount(configuration.circuitType) >
                                  1 && (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handlePduCountChange(false)
                                      }
                                      disabled={
                                        (configuration.pduCount || 0) <= 1
                                      }
                                      className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      -
                                    </button>
                                    <span className="text-sm font-medium min-w-[2rem] text-center">
                                      {configuration.pduCount || 0}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handlePduCountChange(true)}
                                      disabled={
                                        (configuration.pduCount || 0) >=
                                        getMaxPduCount(
                                          configuration.circuitType
                                        )
                                      }
                                      className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        )
                      )}

                      {configuration.circuitType &&
                        getAvailablePdus(configuration.circuitType).length ===
                          0 && (
                          <p className="text-sm text-gray-500 italic">
                            No PDUs available for selected circuit type.
                          </p>
                        )}
                    </div>
                  </div>
                )}

                {/* Draw Cap Cards */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Draw Cap
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { capacity: "2kVA", mrc: 0, description: "Basic Power" },
                      {
                        capacity: "3kVA",
                        mrc: 50,
                        description: "Standard Power",
                      },
                      { capacity: "4kVA", mrc: 100, description: "High Power" },
                      {
                        capacity: "5kVA",
                        mrc: 150,
                        description: "Maximum Power",
                      },
                    ].map((drawCap) => (
                      <div
                        key={drawCap.capacity}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center relative ${
                          configuration.drawCap === drawCap.capacity
                            ? "border-equinix-blue bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          handleConfigurationChange("drawCap", drawCap.capacity)
                        }
                      >
                        <div className="text-lg font-bold text-equinix-blue mb-1">
                          {drawCap.capacity}
                        </div>
                        <div className="text-sm font-semibold">
                          {drawCap.mrc === 0 ? (
                            <span className="text-green-600">Included</span>
                          ) : (
                            <span className="text-blue-600">
                              +${drawCap.mrc}/mo
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Other Product Fields */
              currentProduct.fields &&
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
              ))
            )}
          </div>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
            <div className="space-y-3">
              {configuration.templateMrcPricing &&
              configuration.templateNrcPricing ? (
                // Template pricing display
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly (MRC):</span>
                    <span className="font-medium text-green-600">
                      {configuration.templateMrcPricing}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Setup (NRC):</span>
                    <span className="font-medium text-blue-600">
                      {configuration.templateNrcPricing}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Template: {configuration.templateName}
                  </div>
                </>
              ) : pricing ? (
                // Dynamic secure cabinet pricing
                <>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Pricing Summary
                    </h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Standard Cabinet:</span>
                        <span className="font-medium">
                          ${pricing.breakdown.standardCabinet.mrc}/mo
                        </span>
                      </div>

                      {pricing.breakdown.cabinetDimensions.mrc !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Size Adjustment:
                          </span>
                          <span
                            className={`font-medium ${
                              pricing.breakdown.cabinetDimensions.mrc >= 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {pricing.breakdown.cabinetDimensions.mrc >= 0
                              ? "+"
                              : ""}
                            ${pricing.breakdown.cabinetDimensions.mrc}/mo
                          </span>
                        </div>
                      )}

                      {pricing.breakdown.circuitType.mrc !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Circuit Type:</span>
                          <span className="font-medium text-red-600">
                            +${pricing.breakdown.circuitType.mrc}/mo
                          </span>
                        </div>
                      )}

                      {pricing.breakdown.pdu.mrc !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            PDU ({configuration.pduCount}x):
                          </span>
                          <span className="font-medium text-red-600">
                            +${pricing.breakdown.pdu.mrc}/mo
                          </span>
                        </div>
                      )}

                      {pricing.breakdown.drawCap.mrc !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Draw Cap ({configuration.drawCap}):
                          </span>
                          <span className="font-medium text-red-600">
                            +${pricing.breakdown.drawCap.mrc}/mo
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Total Monthly:
                        </span>
                        <span className="font-bold text-xl text-green-600">
                          ${pricing.totals.mrc}/mo
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-gray-900">
                          Setup Cost:
                        </span>
                        <span className="font-bold text-lg text-blue-600">
                          ${pricing.totals.nrc}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Standard pricing display
                <>
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
                </>
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

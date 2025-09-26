import React, { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Tag,
  CheckCircle,
  Globe,
  Network,
  Cable,
  Wrench,
  Shield,
  Zap,
  Package,
  Plus
} from "lucide-react";

const SolutionsFlow = () => {
  const { navigate, addToCart, cart } = useStore();
  const [configuredProduct, setConfiguredProduct] = useState(null);
  const [addedRecommendations, setAddedRecommendations] = useState(new Set());

  useEffect(() => {
    // Get configured product from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const productData = urlParams.get("product");
    
    if (productData) {
      try {
        const product = JSON.parse(decodeURIComponent(productData));
        
        // Ensure the product has required properties
        if (!product || !product.name) {
          console.error("Invalid product data");
          navigate("products");
          return;
        }
        
        // Clean up the product object to avoid serialization issues
        const cleanProduct = {
          ...product,
          icon: undefined // Remove icon to avoid serialization issues
        };
        
        setConfiguredProduct(cleanProduct);
      } catch (error) {
        console.error("Error parsing product data:", error);
        navigate("products");
      }
    } else {
      // Fallback to redirect to products if no product data
      navigate("products");
    }
  }, [navigate]);

  // Recommendations based on the configured product
  const getRecommendations = (product) => {
    if (!product) return [];

    // Check if it's a Secure Cabinet product
    const isSecureCabinet = product.name?.toLowerCase().includes('secure cabinet') || 
                           product.key === 'secure-cabinet';
    
    if (isSecureCabinet) {
      return [
        {
          id: 'cross-connect-package-10',
          name: 'Cross Connect Package',
          description: 'Bundle of 10 fiber cross-connect units for direct physical connections between your equipment and service providers.',
          originalPrice: 1500,
          discountedPrice: 1125,
          discount: 25,
          quantity: 10,
          badge: 'BEST VALUE',
          badgeColor: 'bg-green-500',
          category: 'Connectivity Solutions',
          products: ['Fiber Cross Connect', 'Express Installation'],
          features: [
            '10 Cross Connect Units included',
            'Single Mode Fiber connectivity',
            'Express installation service',
            '24/7 technical support'
          ],
          location: 'Same IBX as your cabinet',
          icon: Cable,
          setupFee: 200,
          isPackage: true,
          packageDetails: {
            totalUnits: 10,
            unitType: 'Cross Connect',
            pricePerUnit: 112.5
          }
        },
        {
          id: 'smart-hands-support-20',
          name: 'Smart Hands Support Plan',
          description: '20 hours monthly allocation of professional remote hands services for equipment management and troubleshooting.',
          originalPrice: 1200,
          discountedPrice: 960,
          discount: 20,
          quantity: 20,
          badge: 'RECOMMENDED',
          badgeColor: 'bg-blue-500',
          category: 'Support Services',
          products: ['Remote Hands', '24/7 Support'],
          features: [
            '20 hours monthly allocation',
            'Business day response time < 2 hours',
            'Remote equipment management',
            'Professional technical support'
          ],
          location: 'Global coverage',
          icon: Wrench,
          setupFee: 0,
          isPackage: true,
          packageDetails: {
            totalUnits: 20,
            unitType: 'Support Hours',
            pricePerUnit: 48
          }
        }
      ];
    }

    return [];
  };

  const recommendations = getRecommendations(configuredProduct);

  const handleAddRecommendation = (recommendation) => {
    // Check if item already exists in added recommendations
    if (addedRecommendations.has(recommendation.id)) {
      return;
    }

    const cartItem = {
      id: recommendation.id,
      name: recommendation.name,
      description: recommendation.description,
      price: recommendation.discountedPrice, // Monthly recurring price
      originalPrice: recommendation.originalPrice,
      category: recommendation.category,
      qty: 1,
      
      // Proper pricing structure
      oneTimePrice: recommendation.setupFee || 0,
      unitPrice: {
        oneTime: recommendation.setupFee || 0,
        recurring: recommendation.discountedPrice
      },
      
      // Package details for display
      packageDetails: recommendation.packageDetails,
      isPackage: recommendation.isPackage,
      
      // Discount information
      hasDiscount: true,
      discountPercentage: recommendation.discount,
      discounts: [{
        type: 'package',
        description: `${recommendation.discount}% package discount`,
        amount: recommendation.originalPrice - recommendation.discountedPrice
      }],
      
      // Additional metadata
      isRecommended: true,
      addedAt: new Date().toISOString(),
      recommendedFor: configuredProduct?.name,
      
      // Features and details
      features: recommendation.features,
      products: recommendation.products
    };
    
    // Add to cart
    addToCart(cartItem);
    
    // Mark as added
    setAddedRecommendations(prev => new Set([...prev, recommendation.id]));
  };



  // Format currency helper
  const fmt = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!configuredProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500 text-lg mb-4">Loading your configuration...</div>
          <div className="text-gray-400 text-sm">
            If this takes too long, <button onClick={() => navigate("products")} className="text-blue-600 hover:underline">go back to products</button>
          </div>
        </div>
      </div>
    );
  }

  // Safely get icon component - configuredProduct.icon might be serialized
  const getProductIcon = () => {
    // If the icon is already a valid component, use it
    if (configuredProduct?.icon && typeof configuredProduct.icon === 'function') {
      return configuredProduct.icon;
    }
    // Default fallback to Package icon
    return Package;
  };
  
  const ConfiguredProductIcon = getProductIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-32 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/6 to-blue-400/6 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("products")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-all duration-200 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
           <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Solutions Discovery
            </span>
          </h1>
          <p className="text-md text-gray-600 max-w-3xl mx-auto mb-8">
            Describe your infrastructure needs and we have built the perfect solution for you
          </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Recommended Add-ons</h3>
                  </div>
                  <p className="text-gray-600">Complete your infrastructure with these complementary services</p>
                </div>
                
                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {recommendations.map((recommendation) => {
                      const IconComponent = recommendation.icon;
                      const isAdded = addedRecommendations.has(recommendation.id);
                      
                      return (
                        <div
                          key={recommendation.id}
                          className="group bg-gradient-to-br from-white to-slate-50/50 rounded-xl shadow-lg border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                        >
                          {/* Discount Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              {recommendation.discount}% OFF
                            </div>
                          </div>

                          {/* Recommendation Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <div className={`${recommendation.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}>
                              {recommendation.badge}
                            </div>
                          </div>

                          <div className="p-6 pt-16">
                            {/* Header */}
                            <div className="text-center mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">{recommendation.name}</h4>
                              {recommendation.packageDetails && (
                                <div className="text-sm text-blue-600 font-semibold">
                                  Package of {recommendation.packageDetails.totalUnits} {recommendation.packageDetails.unitType.toLowerCase()}s
                                </div>
                              )}
                              <p className="text-sm text-gray-600 mt-2">{recommendation.description}</p>
                            </div>

                            {/* Features */}
                            <div className="space-y-2 mb-4">
                              {recommendation.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-start gap-2 text-xs">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-600">{feature}</span>
                                </div>
                              ))}
                            </div>

                            {/* Pricing */}
                            <div className="text-center mb-4">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-xl font-bold text-gray-900">
                                  {fmt(recommendation.discountedPrice)}
                                </span>
                                <span className="text-sm text-gray-500">/mo</span>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm text-gray-400 line-through">
                                  {fmt(recommendation.originalPrice)}
                                </span>
                                <span className="text-sm text-green-600 font-semibold">
                                  Save {fmt(recommendation.originalPrice - recommendation.discountedPrice)}
                                </span>
                              </div>
                              {recommendation.setupFee > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  + {fmt(recommendation.setupFee)} setup fee
                                </div>
                              )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => handleAddRecommendation(recommendation)}
                              disabled={isAdded}
                              className={`w-full font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                isAdded
                                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:scale-105'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Added to Cart
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  Add to Cart
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Go to Cart Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("cart")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mx-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                Go to Cart
              </button>
              <p className="text-gray-500 text-sm mt-3">
                Review your selections and proceed to checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsFlow;
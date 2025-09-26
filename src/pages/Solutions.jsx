import React, { useState } from "react";
import { useStore } from "../hooks/useStore";
import { IBX_OPTIONS } from "../utils/constants";
import mapImage from "../assets/map.png";
import { 
  Bot, 
  Search, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  ShoppingCart, 
  Star, 
  Tag,
  CheckCircle,
  ChevronDown,
  MapPin,
  Send,
  Network,
  Cable,
  Router,
  Wifi,
  Link2,
  Lock,
  Server,
  X
} from "lucide-react";

const Solutions = () => {
  const { navigate, addToCart, selectedIBX, setSelectedIBX } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showIBXDropdown, setShowIBXDropdown] = useState(false);
  const [localSelectedIBX, setLocalSelectedIBX] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // New state for configured product flow
  const [configuredProduct, setConfiguredProduct] = useState(null);
  const [showConfiguredFlow, setShowConfiguredFlow] = useState(false);

  // Check for configured product on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const configuredData = urlParams.get("configured");
    
    if (configuredData) {
      try {
        const product = JSON.parse(decodeURIComponent(configuredData));
        if (product && product.name) {
          setConfiguredProduct(product);
          setShowConfiguredFlow(true);
          // Hide search functionality when showing configured product
          setShowRecommendations(false);
        }
      } catch (error) {
        console.error("Error parsing configured product:", error);
      }
    }
  }, []);

  const getConnectionIcon = (connectionType) => {
    const iconMap = {
      "Inter Connect": Network,
      "Campus connect": Cable,
      "Campus Connect": Cable,
      "Fiber Connect": Wifi,
      "Metro Connect": Router,
      "Cross Connect": Link2,
      "Secure Cabinet": Lock,
      "Express Install": Zap,
      "Cabinet Express": Server
    };
    return iconMap[connectionType] || Network;
  };

  const generateAIRecommendation = (query, sourceIBX) => {
    // Enhanced pattern to catch more connection variations
    const connectionPattern = /(?:connection|connect|link).*?(?:from\s+)?(\w+).*?(?:to\s+)?(\w+)|(\w+).*?(?:to\s+)?(\w+)/i;
    const match = query.match(connectionPattern);
    
    if (match) {
      const from = match[1] || match[3] || sourceIBX;
      const to = match[2] || match[4];
      
      if (from && to && from.toUpperCase() !== to.toUpperCase()) {
        // Special case for MB3 to MB4 - no presence recommendation
        if (from.toUpperCase() === 'MB3' && to.toUpperCase() === 'MB4') {
          return {
            title: "Infrastructure Setup & Connection Solution",
            subtitle: `No presence in MB3 detected - Complete setup with secure cabinet and connection to ${to.toUpperCase()}`,
            originalPrice: 8500,
            discountedPrice: 6800,
            discount: 20,
            connectionPath: [
              { type: "Secure Cabinet", from: "Setup", to: "MB3", checked: true },
              { type: "Express Install", from: "MB3", to: "Ready", checked: true },
              { type: "Cross Connect", from: "MB3", to: to.toUpperCase(), checked: true }
            ],
            category: "Infrastructure Solutions",
            isSetupSolution: true
          };
        }
        
        // Default multi-hop connection for other connections
        return {
          title: "Connection Solution",
          subtitle: `connection path: ${from.toUpperCase()} to ${to.toUpperCase()}`,
          originalPrice: 10000,
          discountedPrice: 5000,
          discount: 50,
          connectionPath: [
            { type: "Inter Connect", from: from.toUpperCase(), to: "SV19", checked: true },
            { type: "Campus connect", from: "SV19", to: "SV16", checked: true },
            { type: "Fiber Connect", from: "SV16", to: "SV2", checked: true },
            { type: "Metro Connect", from: "SV2", to: "SV5", checked: true },
            { type: "Campus Connect", from: "SV5", to: "SV1", checked: true },
            { type: "Cross Connect", from: "SV1", to: to.toUpperCase(), checked: true }
          ],
          category: "Connectivity Solutions"
        };
      }
    }
    return null;
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI search processing
    setTimeout(() => {
      setIsSearching(false);
      
      // Generate AI recommendation based on query
      const recommendation = generateAIRecommendation(searchQuery, localSelectedIBX);
      
      if (recommendation) {
        setAiRecommendations([recommendation]);
        setShowRecommendations(true);
      } else {
        // Show generic message if no specific connection detected
        console.log("AI Search query:", searchQuery);
        setAiRecommendations([]);
        setShowRecommendations(false);
      }
    }, 2000);
  };

  const handleAddToCart = (solution) => {
    addToCart({
      id: solution.id,
      name: solution.name,
      price: solution.discountedPrice,
      originalPrice: solution.originalPrice,
      category: "Solution",
      description: solution.description,
      products: solution.products
    });
  };

  // Sample solutions data
  const recommendedSolutions = [
    {
      id: 1,
      category: "Connectivity Solutions",
      name: "MB1 -> AWS Direct Connect",
      description: "Establish a private, secure connection from your cage to Amazon Web Services.",
      originalPrice: 3000,
      discountedPrice: 2400,
      discount: 20,
      products: ["Cross Connect", "Fabric Router"],
      features: [
        "Direct connection to AWS",
        "High-speed bandwidth up to 10Gbps",
        "Reduced data transfer costs",
        "Enhanced security and reliability"
      ],
      location: "MB1 -> AWS",
      popular: true
    },
    {
      id: 2,
      category: "Connectivity Solutions", 
      name: "MB2 -> Azure Cloud",
      description: "Build a high-throughput, private link to Azure cloud ecosystem .",
      originalPrice: 2800,
      discountedPrice: 2240,
      discount: 20,
      products: ["Fabric Router"],
      features: [
        "Direct connection to Azure",
        "High-speed bandwidth up to 10Gbps",
        "Reduced data transfer costs", 
        "Enhanced security and reliability"
      ],
      location: "MB2 -> Azure"
    },
    {
      id: 3,
      category: "Infrastructure Solutions",
      name: "Hybrid Cloud Infrastructure",
      description: "Complete hybrid cloud setup with colocation, connectivity, and cloud integration.",
      originalPrice: 5500,
      discountedPrice: 4400,
      discount: 20,
      products: ["Cabinet", "Cross Connect", "Cloud Exchange", "DDoS Protection"],
      features: [
        "42U cabinet with power redundancy",
        "Multi-cloud connectivity",
        "Advanced security features",
        "24/7 monitoring and support"
      ],
      location: "Multiple Locations",
      trending: true
    },
    {
      id: 4,
      category: "Security Solutions",
      name: "Enterprise Security Bundle",
      description: "Comprehensive security solution with DDoS protection, firewall, and monitoring.",
      originalPrice: 4200,
      discountedPrice: 3360,
      discount: 20,
      products: ["DDoS Protection", "Managed Firewall", "Security Monitoring"],
      features: [
        "24/7 DDoS protection",
        "Managed firewall services",
        "Real-time threat monitoring",
        "Incident response support"
      ],
      location: "Global Coverage"
    }
  ];

  return (
    <div className="min-h-screen w-full p-6 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-32 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/6 to-blue-400/6 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* AI Search Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Solutions Discovery
            </span>
          </h1>
          <p className="text-md text-gray-600 max-w-3xl mx-auto mb-8">
            Describe your infrastructure needs and we have built the perfect solution for you
          </p>

          {/* AI Search Box */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col">
                {/* Main Search Area */}
                <div className="flex items-start px-6 ">
                  {/* Search Input */}
                  <textarea
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask for solutions from this location"
                    className="flex-1 text-lg text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent resize-none min-h-[80px] py-4"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAISearch();
                      }
                    }}
                  />

    
                </div>

                {/* Bottom Row with IBX Selector */}
                <div className="flex items-center justify-between px-6 pb-2">
                  {/* A-side IBX Selector */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setShowIBXDropdown(!showIBXDropdown)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium transition-colors duration-200"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      <span className={localSelectedIBX ? 'text-gray-700' : 'text-gray-500'}>
                        {localSelectedIBX || 'A-side IBX'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${showIBXDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* IBX Dropdown */}
                    {showIBXDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        {IBX_OPTIONS.map((ibx) => (
                          <button
                            key={ibx}
                            onClick={() => {
                              setLocalSelectedIBX(ibx);
                              setSelectedIBX(ibx);
                              setShowIBXDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm ${
                              localSelectedIBX === ibx ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5" />
                              {ibx}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  {/* Send Button */}
                  <button
                    onClick={handleAISearch}
                    disabled={isSearching}
                    className="flex-shrink-0 ml-4 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {showRecommendations && aiRecommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Recommended Solutions</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                Limited time offers
              </div>
            </div>

            {/* AI Recommendation Cards */}
            <div className="grid lg:grid-cols-2 gap-8">
              {aiRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden relative"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">{recommendation.category || "Connectivity Solutions"}</span>
                          {recommendation.isSetupSolution ? (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full flex items-center gap-1">
                              <Server className="w-3 h-3 fill-current" />
                              Setup Required
                            </span>
                          ) : null }
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{recommendation.title}</h3>
                        <p className="text-gray-600 text-sm">{recommendation.subtitle}</p>
                      </div>
                      <button 
                        onClick={() => setShowMapModal(true)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors duration-200 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
                      >
                        View Map
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Globe className="w-4 h-4" />
                      {recommendation.isSetupSolution ? "Infrastructure Setup" : "Multi-Location Path"}
                    </div>

                    {/* Connection Path & Products Combined */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Connection Path & Products:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {recommendation.connectionPath.map((connection, idx) => {
                          const IconComponent = getConnectionIcon(connection.type);
                          return (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-3 h-3 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="font-medium text-gray-900 truncate">{connection.from}</span>
                                  <ArrowRight className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                                  <span className="font-medium text-gray-900 truncate">{connection.to}</span>
                                </div>
                                <div className="text-xs text-gray-500 truncate">{connection.type}</div>
                              </div>
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="p-6 pt-0">

                    {/* Pricing and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ${recommendation.discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">/mo</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm text-gray-400 line-through">
                            ${recommendation.originalPrice.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600 font-semibold">
                              Save {recommendation.discount}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200">
                          View Details
                        </button>
                        <button
                          onClick={() => handleAddToCart({
                            id: `ai-rec-${index}`,
                            name: recommendation.title,
                            price: recommendation.discountedPrice,
                            originalPrice: recommendation.originalPrice,
                            category: "AI Recommendation",
                            description: recommendation.subtitle,
                            products: recommendation.connectionPath.map(cp => cp.type)
                          })}
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                        >
                          <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Solutions Section - Only show when no AI recommendations are displayed */}
        {!showRecommendations && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Recommended Solutions For You</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                Limited time offers
              </div>
            </div>

          {/* Solutions Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {recommendedSolutions.map((solution) => (
              <div
                key={solution.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">{solution.category}</span>
                        {solution.popular && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Popular
                          </span>
                        )}
                        {solution.trending && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            Trending
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.name}</h3>
                      <p className="text-gray-600 text-sm">{solution.description}</p>
                    </div>
                    <button 
                      onClick={() => setShowMapModal(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors duration-200 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
                    >
                      View Map
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Globe className="w-4 h-4" />
                    {solution.location}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Included Products:</h4>
                    <div className="flex flex-wrap gap-2">
                      {solution.products.map((product, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {solution.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${solution.discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">/mo</span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-gray-400 line-through">
                          ${solution.originalPrice.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-600 font-semibold">
                            Save {solution.discount}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200">
                        View Details
                      </button>
                      <button
                        onClick={() => handleAddToCart(solution)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                      >
                        <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Discount Badge */}
                {solution.discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-3 shadow-lg">
                      {solution.discount}% OFF
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Global Infrastructure Map</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <img 
                src={mapImage} 
                alt="Global Infrastructure Map" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solutions;
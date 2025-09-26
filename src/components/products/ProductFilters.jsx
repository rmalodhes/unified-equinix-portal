import React, { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { CATEGORIES, IBX_OPTIONS, CAGE_OPTIONS } from "../../utils/constants";
import { useStore } from "../../hooks/useStore";

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  offeringFilter,
  setOfferingFilter,
  subCategoryFilter,
  setSubCategoryFilter,
}) => {
  const { selectedIBX, setSelectedIBX } = useStore();
  const [showIBXDropdown, setShowIBXDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [zSideIBX, setZSideIBX] = useState("MB2");

  // Define subcategory options only for Interconnection
  const getSubCategoryOptions = () => {
    if (selectedFilter === CATEGORIES.INTERCONNECTION) {
      return [
        { value: "all", label: "Types" },
        { value: "fiber-connect", label: "Fiber Connect" },
        { value: "metro-connect", label: "Metro Connect" },
        { value: "campus-connect", label: "Campus Connect" },
        { value: "cross-connect", label: "Cross Connect" },
        { value: "virtual-connection", label: "Virtual Connection" },
        { value: "cloud-router", label: "Cloud Router" },
      ];
    }
    return [];
  };

  const subCategoryOptions = getSubCategoryOptions();
  
  const getCategoryLabel = (category) => {
    switch (category) {
      case CATEGORIES.ALL:
        return "All Types";
      case CATEGORIES.COLOCATION:
        return "Colocation";
      case CATEGORIES.INTERCONNECTION:
        return "Interconnection";
      default:
        return "Category";
    }
  };

  const getProductsTitle = (category) => {
    switch (category) {
      case CATEGORIES.COLOCATION:
        return "Colocation Products";
      case CATEGORIES.INTERCONNECTION:
        return "Interconnection Products";
      case CATEGORIES.ALL:
      default:
        return "All Products";
    }
  };

  return (
    <div className="mb-8 space-y-8">
      {/* Unified Search Component */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
           Discover Products
          </span>
        </h2>
        <p className="text-md text-gray-600 max-w-2xl mx-auto mb-6">
          Search for products and templates with advanced filtering options
        </p>

        {/* Unified Search Box */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col">
              {/* Main Search Area */}
              <div className="flex items-center px-6 py-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 focus-within:text-equinix-blue transition-all duration-300" />
                  <input
                    type="text"
                    placeholder={
                      offeringFilter === "package"
                        ? "Search bundles..."
                        : "Search for products..."
                    }
                    className="w-full pl-12 pr-4 py-3 text-lg text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Bottom Row with Selectors */}
              <div className="flex items-center justify-between px-6 pb-4 border-gray-100">
                <div className="flex items-center gap-4">
                  {/* A-side IBX Selector */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setShowIBXDropdown(!showIBXDropdown)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium transition-colors duration-200"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      <span className={selectedIBX ? 'text-gray-700' : 'text-gray-500'}>
                        {selectedIBX || 'A-side IBX'}
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
                              setSelectedIBX(ibx);
                              setShowIBXDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm ${
                              selectedIBX === ibx ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
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

                  {/* Category Selector */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium transition-colors duration-200"
                    >
                      <span className="text-gray-700">
                        {getCategoryLabel(selectedFilter)}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Category Dropdown */}
                    {showCategoryDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            setSelectedFilter(CATEGORIES.ALL);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm ${
                            selectedFilter === CATEGORIES.ALL ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          All Types
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFilter(CATEGORIES.COLOCATION);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm ${
                            selectedFilter === CATEGORIES.COLOCATION ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Colocation
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFilter(CATEGORIES.INTERCONNECTION);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm ${
                            selectedFilter === CATEGORIES.INTERCONNECTION ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Interconnection
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Products Section Title */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          {getProductsTitle(selectedFilter)}
        </h3>
        
        {/* Filter Controls - Only for Interconnection */}
        {selectedFilter === CATEGORIES.INTERCONNECTION && subCategoryOptions.length > 0 && (
          <div className="flex items-center gap-4">
            {/* Z-Side IBX Filter */}
            <div className="w-40 relative">
              <select
                value={zSideIBX}
                onChange={(e) => setZSideIBX(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-equinix-blue/30 focus:border-equinix-blue/50 transition-all duration-300 text-gray-800 font-medium hover:bg-gray-50 focus:bg-white focus:shadow-sm appearance-none bg-white cursor-pointer"
              >
                {IBX_OPTIONS.map((ibx) => (
                  <option key={ibx} value={ibx}>
                    {ibx}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            
            {/* Types Filter */}
            <div className="w-48 relative">
              <select
                value={subCategoryFilter}
                onChange={(e) => setSubCategoryFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-equinix-blue/30 focus:border-equinix-blue/50 transition-all duration-300 text-gray-800 font-medium hover:bg-gray-50 focus:bg-white focus:shadow-sm appearance-none bg-white cursor-pointer"
              >
                {subCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductFilters;

import React, { useState } from "react";
import { useStore } from "../hooks/useStore";
import { productData } from "../data/productData";
import { packageData } from "../data/packageData";
import { CATEGORIES, IBX_OPTIONS, CAGE_OPTIONS } from "../utils/constants";
import ProductCard from "../components/products/ProductCard";
import PackageCard from "../components/products/PackageCard";
import ProductFilters from "../components/products/ProductFilters";

const Products = () => {
  const { selectedIBX, selectedCage, setSelectedIBX, setSelectedCage } =
    useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(CATEGORIES.COLOCATION);
  const [offeringFilter, setOfferingFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");

  const filteredProducts = Object.keys(productData).filter((key) => {
    const product = productData[key];
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedFilter === CATEGORIES.ALL ||
      (selectedFilter === CATEGORIES.COLOCATION &&
        product.category === "Colocation") ||
      (selectedFilter === CATEGORIES.INTERCONNECTION &&
        product.category === "Interconnection");
    
    // Filter by subcategory for Interconnection products
    const matchesSubCategory = 
      subCategoryFilter === "all" || 
      subCategoryFilter === key || 
      (selectedFilter !== CATEGORIES.INTERCONNECTION);
    
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const filteredPackages = Object.keys(packageData).filter((key) => {
    const pkg = packageData[key];
    const matchesSearch = pkg.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen w-full p-6 relative overflow-hidden">
      {/* Subtle Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-32 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/6 to-blue-400/6 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          offeringFilter={offeringFilter}
          setOfferingFilter={setOfferingFilter}
          subCategoryFilter={subCategoryFilter}
          setSubCategoryFilter={setSubCategoryFilter}
        />

        <div className="grid grid-cols-1 gap-8">
          {offeringFilter === "package"
            ? filteredPackages.map((packageKey) => (
                <PackageCard
                  key={packageKey}
                  packageKey={packageKey}
                  packageData={packageData[packageKey]}
                />
              ))
            : filteredProducts.map((productKey) => (
                <ProductCard
                  key={productKey}
                  productKey={productKey}
                  product={productData[productKey]}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
import React from "react";
import { useStore } from "../hooks/useStore";
import { 
  Box, 
  Layers, 
  ArrowRight, 
  Globe, 
  Shield, 
  Zap, 
  Server,
  Network,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle,
  Building,
  Cable
} from "lucide-react";

const HomePage = () => {
  const { navigate } = useStore();

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Elements */}
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

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Equinix Portal
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              The world's digital infrastructure company. Build, scale, and optimize your digital infrastructure with our comprehensive suite of colocation and interconnection services.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("products")}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Box className="w-6 h-6" />
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate("solutions")}
                className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-300"
              >
                <Layers className="w-6 h-6" />
                View Our Solutions
              </button>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="mt-20 p-8 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("products")}
                className="p-6 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 text-left group"
              >
                <Box className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-gray-900 mb-2">Browse Products</h3>
                <p className="text-sm text-gray-600">Explore our colocation and interconnection services</p>
              </button>

              <button
                onClick={() => navigate("solutions")}
                className="p-6 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 text-left group"
              >
                <Layers className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-gray-900 mb-2">View Solutions</h3>
                <p className="text-sm text-gray-600">Discover integrated infrastructure solutions</p>
              </button>

              <button
                onClick={() => navigate("quotes")}
                className="p-6 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 text-left group"
              >
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  📄
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">My Quotes</h3>
                <p className="text-sm text-gray-600">Manage and review your service quotes</p>
              </button>

              <button
                onClick={() => navigate("orders")}
                className="p-6 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 text-left group"
              >
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  📋
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">My Orders</h3>
                <p className="text-sm text-gray-600">Track your active service orders</p>
              </button>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="mt-20 grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">260+</div>
              <div className="text-sm text-gray-600">Data Centers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">70+</div>
              <div className="text-sm text-gray-600">Metro Areas</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-sm text-gray-600">Customers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Network className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99.999%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
          </div>

          {/* Featured Services */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Core Services</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Build your digital infrastructure with our comprehensive portfolio of colocation and interconnection services
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Colocation Services */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Colocation</h3>
                    <p className="text-blue-600 font-medium">Secure Data Center Space</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  House your critical IT infrastructure in our world-class data centers with enterprise-grade security, power, and cooling systems.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24/7 Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Redundant Power</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Climate Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Remote Hands</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("products")}
                  className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Colocation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Interconnection Services */}
              <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Cable className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Interconnection</h3>
                    <p className="text-purple-600 font-medium">Network Connectivity</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Connect directly to cloud providers, networks, and business partners with our comprehensive interconnection solutions.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Cross Connects</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Cloud Routing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Virtual Connections</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Fabric Services</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("products")}
                  className="w-full bg-white hover:bg-gray-50 text-purple-600 font-semibold py-3 px-6 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Interconnection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Why Choose Equinix */}
          <div className="mt-20 bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Equinix?</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                We're the world's digital infrastructure company, connecting businesses to their customers and partners inside the most interconnected data centers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-gray-300">
                  Access to 260+ data centers across 70+ metro areas worldwide, bringing you closer to your customers.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
                <p className="text-gray-300">
                  Bank-level security with 24/7 monitoring, biometric access controls, and comprehensive compliance certifications.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Proven Reliability</h3>
                <p className="text-gray-300">
                  99.999% uptime SLA with redundant power, cooling, and connectivity to keep your business running 24/7.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => navigate("solutions")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Layers className="w-6 h-6" />
                Discover Our Solutions
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mt-20 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Get <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Started?</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Begin your digital infrastructure journey with Equinix today
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Box className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Browse Products</h3>
                <p className="text-gray-600 mb-6">
                  Explore our comprehensive portfolio of colocation and interconnection services tailored to your needs.
                </p>
                <button
                  onClick={() => navigate("products")}
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-2 mx-auto"
                >
                  View Products <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Layers className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Design Solutions</h3>
                <p className="text-gray-600 mb-6">
                  Work with our experts to design custom solutions that meet your specific business requirements.
                </p>
                <button
                  onClick={() => navigate("solutions")}
                  className="text-purple-600 font-semibold hover:underline flex items-center gap-2 mx-auto"
                >
                  View Solutions <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center group hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">3. Deploy Fast</h3>
                <p className="text-gray-600 mb-6">
                  Get up and running quickly with our streamlined deployment process and expert support team.
                </p>
                <button
                  onClick={() => navigate("orders")}
                  className="text-green-600 font-semibold hover:underline flex items-center gap-2 mx-auto"
                >
                  Track Orders <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

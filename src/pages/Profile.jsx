import React from "react";
import { ArrowLeft, User, Mail, Building, MapPin } from "lucide-react";
import { useStore } from "../hooks/useStore";

const Profile = () => {
  const { navigate } = useStore();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("products")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-gray-600" />
          <h1 className="text-3xl font-bold text-equinix-dark">Profile</h1>
        </div>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-equinix-blue rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-gray-600">Infrastructure Manager</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600">john.doe@company.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Company</div>
                  <div className="text-gray-600">Acme Corporation</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-gray-600">San Francisco, CA</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Account Settings</h3>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">IBX Access Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    MB2
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    SV5
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    NY1
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    LA1
                  </span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Cage Access</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    A-101
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    A-102
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    B-201
                  </span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Role Permissions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Configure Infrastructure</li>
                  <li>• Create Orders</li>
                  <li>• Generate Quotes</li>
                  <li>• Manage Packages</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="btn-primary">Edit Profile</button>
            <button className="btn-secondary">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// src/components/factory/FactoryInventory.jsx
import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, ShoppingCart, Scale, DollarSign, ArrowLeft, MapPin, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FactoryInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, filter]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/inventory`);
      setInventory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory.filter(item => 
      item.status === 'available'
    );

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.waste_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter(item => item.waste_type === filter);
    }

    setFilteredInventory(filtered);
  };

  const wasteTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'glass', label: 'Glass' },
    { value: 'metal', label: 'Metal' },
    { value: 'paper', label: 'Paper' },
    { value: 'electronic', label: 'Electronic' }
  ];

  const getMaterialColor = (type) => {
    const colors = {
      plastic: 'from-blue-500 to-cyan-500',
      glass: 'from-emerald-500 to-green-500',
      metal: 'from-amber-500 to-orange-500',
      paper: 'from-yellow-500 to-amber-500',
      electronic: 'from-purple-500 to-pink-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || !requestQuantity) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests`, {
        waste_type: selectedItem.waste_type,
        quantity_requested: parseFloat(requestQuantity),
        special_instructions: `Request for ${requestQuantity}kg of ${selectedItem.waste_type}`
      });

      alert('Request submitted successfully!');
      setSelectedItem(null);
      setRequestQuantity('');
      fetchInventory(); // Refresh inventory
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Available Inventory</h1>
            <p className="text-blue-100 text-sm">Browse and request waste materials</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Total Items</p>
              <p className="text-white text-sm font-bold mt-1">
                {filteredInventory.length}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Available</p>
              <p className="text-white text-sm font-bold mt-1">
                {inventory.filter(item => item.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Search & Filter */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by material type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center space-x-3">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm"
              >
                {wasteTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Available Materials ({filteredInventory.length})
          </h2>

          {filteredInventory.length > 0 ? (
            <div className="space-y-3">
              {filteredInventory.map((item) => (
                <div
                  key={item.inventory_id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all active:scale-95"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${getMaterialColor(item.waste_type)}`}>
                        <Package className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm capitalize">
                          {item.waste_type}
                        </h3>
                        <p className="text-gray-600 text-xs capitalize">
                          {item.category || 'General Waste'}
                        </p>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-medium">
                      Available
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Scale size={14} className="mr-2" />
                        Quantity
                      </span>
                      <span className="font-semibold text-gray-800">{item.quantity} kg</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign size={14} className="mr-2" />
                        Price
                      </span>
                      <span className="font-semibold text-gray-800">${item.unit_price}/kg</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        Location
                      </span>
                      <span className="font-semibold text-gray-800 text-xs">{item.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95 font-medium text-sm shadow-lg shadow-blue-200 flex items-center justify-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Request Material
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Package size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No materials found</p>
              <p className="text-gray-400 text-xs mt-1">
                {inventory.length === 0 
                  ? "No waste materials available at the moment."
                  : "No materials match your current filters."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Request {selectedItem.waste_type}
              </h3>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setRequestQuantity('');
                }}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center active:scale-95"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="text"
                    value={`${selectedItem.quantity} kg`}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(e.target.value)}
                    min="1"
                    max={selectedItem.quantity}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm"
                    placeholder="Enter quantity in kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost
                  </label>
                  <input
                    type="text"
                    value={requestQuantity ? `$${(requestQuantity * selectedItem.unit_price).toFixed(2)}` : '$0.00'}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 text-sm"
                    disabled
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setRequestQuantity('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors active:scale-95 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95 font-medium text-sm shadow-lg shadow-blue-200"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactoryInventory;
// src/components/admin/InventoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search, Filter, X, BarChart3, MapPin, DollarSign, Scale } from 'lucide-react';
import axios from 'axios';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    waste_type: 'plastic',
    category: '',
    quantity: '',
    unit_price: '',
    location: '',
    status: 'available'
  });

  useEffect(() => {
    fetchInventory();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/inventory/${editingItem.inventory_id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inventory`, formData);
      }
      fetchInventory();
      setShowAddForm(false);
      setEditingItem(null);
      setFormData({
        waste_type: 'plastic',
        category: '',
        quantity: '',
        unit_price: '',
        location: '',
        status: 'available'
      });
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert('Failed to save inventory item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      waste_type: item.waste_type,
      category: item.category || '',
      quantity: item.quantity,
      unit_price: item.unit_price,
      location: item.location || '',
      status: item.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/inventory/${itemId}`);
        fetchInventory();
      } catch (error) {
        console.error('Error deleting inventory:', error);
        alert('Failed to delete inventory item');
      }
    }
  };

  const wasteTypes = ['plastic', 'glass', 'metal', 'paper', 'electronic'];
  
  const getWasteTypeColor = (type) => {
    const colors = {
      plastic: 'bg-blue-100 text-blue-800 border-blue-200',
      glass: 'bg-green-100 text-green-800 border-green-200',
      metal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paper: 'bg-orange-100 text-orange-800 border-orange-200',
      electronic: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      reserved: 'bg-amber-100 text-amber-800 border-amber-200',
      sold: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.waste_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.waste_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-green-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-2xl shadow-md mr-4">
              <Package className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Waste Inventory</h1>
              <p className="text-gray-600 mt-1">Manage available waste materials efficiently</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center font-semibold"
          >
            <Plus size={20} className="mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-blue-400">
          <div className="flex items-center">
            <Package className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-xl font-bold text-gray-800">{inventory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-green-400">
          <div className="flex items-center">
            <BarChart3 className="text-green-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-xl font-bold text-gray-800">
                {inventory.filter(item => item.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-amber-400">
          <div className="flex items-center">
            <Scale className="text-amber-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Total Weight</p>
              <p className="text-xl font-bold text-gray-800">
                {inventory.reduce((sum, item) => sum + parseFloat(item.quantity), 0)} kg
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-purple-400">
          <div className="flex items-center">
            <DollarSign className="text-purple-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-600">Avg Price</p>
              <p className="text-xl font-bold text-gray-800">
                ${(inventory.reduce((sum, item) => sum + parseFloat(item.unit_price), 0) / inventory.length || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by type, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      waste_type: 'plastic',
                      category: '',
                      quantity: '',
                      unit_price: '',
                      location: '',
                      status: 'available'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Waste Type</label>
                  <select
                    value={formData.waste_type}
                    onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  >
                    {wasteTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="e.g., PET Bottles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Storage location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md font-semibold"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      waste_type: 'plastic',
                      category: '',
                      quantity: '',
                      unit_price: '',
                      location: '',
                      status: 'available'
                    });
                  }}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-md font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Inventory Items ({filteredInventory.length})
          </h2>
        </div>
        
        {/* Mobile View - Cards */}
        <div className="block md:hidden">
          <div className="p-4 space-y-4">
            {filteredInventory.map((item) => (
              <div key={item.inventory_id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-xl ${getWasteTypeColor(item.waste_type)}`}>
                      <Package size={18} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800 capitalize">{item.waste_type}</h3>
                      {item.category && (
                        <p className="text-sm text-gray-600">{item.category}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center text-gray-600">
                    <Scale size={16} className="mr-2" />
                    {item.quantity} kg
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    ${item.unit_price}/kg
                  </div>
                  {item.location && (
                    <div className="flex items-center text-gray-600 col-span-2">
                      <MapPin size={16} className="mr-2" />
                      {item.location}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.inventory_id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-green-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Waste Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.inventory_id} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getWasteTypeColor(item.waste_type)}`}>
                        <Package size={18} />
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-gray-900 capitalize">{item.waste_type}</div>
                        {item.category && (
                          <div className="text-sm text-gray-500">{item.category}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700">
                      <Scale size={16} className="mr-2" />
                      {item.quantity} kg
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-700">
                      <DollarSign size={16} className="mr-2" />
                      ${item.unit_price}/kg
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.location ? (
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {item.location}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.inventory_id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-300" size={48} />
            <p className="text-gray-500 mt-4">No inventory items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
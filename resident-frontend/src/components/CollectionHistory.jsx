// src/components/CollectionHistory.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Package, Scale, MapPin, Filter, ChevronDown, TrendingUp } from 'lucide-react';
import axios from 'axios';

const CollectionHistory = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCollectionHistory();
  }, []);

  const fetchCollectionHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/collections/history`);
      setCollections(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collection history:', error);
      setLoading(false);
    }
  };

  const filteredCollections = collections.filter(collection => {
    if (filter !== 'all' && collection.waste_type !== filter) {
      return false;
    }

    if (dateRange.start && new Date(collection.collection_date) < new Date(dateRange.start)) {
      return false;
    }

    if (dateRange.end && new Date(collection.collection_date) > new Date(dateRange.end)) {
      return false;
    }

    return true;
  });

  const wasteTypes = [
    { value: 'all', label: 'All Types', color: 'bg-gray-500' },
    { value: 'plastic', label: 'Plastic', color: 'bg-blue-500' },
    { value: 'glass', label: 'Glass', color: 'bg-emerald-500' },
    { value: 'metal', label: 'Metal', color: 'bg-amber-500' },
    { value: 'paper', label: 'Paper', color: 'bg-amber-400' },
    { value: 'electronic', label: 'Electronic', color: 'bg-purple-500' },
    { value: 'general', label: 'General Waste', color: 'bg-gray-400' }
  ];

  const getTotalWaste = () => {
    return filteredCollections.reduce((total, collection) => total + (collection.weight || 0), 0);
  };

  const getCollectionsCount = () => {
    return filteredCollections.length;
  };

  const getWasteTypeColor = (type) => {
    const wasteType = wasteTypes.find(wt => wt.value === type);
    return wasteType ? wasteType.color : 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Collection History</h1>
            <p className="text-emerald-100 text-sm">Track your waste collection records</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Calendar className="text-white" size={24} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-medium">Total Collections</p>
                <p className="text-white text-xl font-bold mt-1">
                  {getCollectionsCount()}
                </p>
              </div>
              <Package className="text-white/80" size={20} />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-medium">Total Waste</p>
                <p className="text-white text-xl font-bold mt-1">
                  {getTotalWaste()} kg
                </p>
              </div>
              <TrendingUp className="text-white/80" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-4">
        {/* Filter Toggle */}
        <div className="bg-white rounded-2xl shadow-lg mx-2 mb-4 p-4 border border-gray-100">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              <Filter size={20} className="text-gray-600 mr-2" />
              <span className="font-medium text-gray-800">Filters</span>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-500 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 space-y-4 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800"
                >
                  {wasteTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mx-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Collection Records
            <span className="ml-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-sm">
              {filteredCollections.length}
            </span>
          </h2>
        </div>

        {/* Collections List */}
        <div className="space-y-3 px-2">
          {filteredCollections.length > 0 ? (
            filteredCollections.map((collection) => (
              <div
                key={collection.collection_id}
                className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300 active:scale-[0.98]"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getWasteTypeColor(collection.waste_type)} rounded-xl flex items-center justify-center`}>
                      <Package className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 capitalize text-sm">
                        {collection.waste_type} Waste
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {new Date(collection.collection_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600">
                      {collection.weight} kg
                    </div>
                    <div className="text-xs text-gray-500">Weight</div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1 text-gray-400" />
                    <span>Your Location</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Scale size={14} className="mr-1 text-gray-400" />
                    <span className="capitalize">{collection.waste_type}</span>
                  </div>
                </div>

                {/* Notes */}
                {collection.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium text-gray-700">Notes:</span> {collection.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No collection records</h3>
              <p className="text-gray-500 text-sm px-4">
                {collections.length === 0 
                  ? "You haven't had any waste collections yet."
                  : "No collections match your current filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionHistory;
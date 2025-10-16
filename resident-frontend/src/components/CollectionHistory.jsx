// src/components/CollectionHistory.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Package, Scale, MapPin, Filter } from 'lucide-react';
import axios from 'axios';

const CollectionHistory = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchCollectionHistory();
  }, []);

  const fetchCollectionHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/collections/history');
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
    { value: 'all', label: 'All Types' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'glass', label: 'Glass' },
    { value: 'metal', label: 'Metal' },
    { value: 'paper', label: 'Paper' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'general', label: 'General Waste' }
  ];

  const getTotalWaste = () => {
    return filteredCollections.reduce((total, collection) => total + (collection.weight || 0), 0);
  };

  const getCollectionsCount = () => {
    return filteredCollections.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Collection History</h1>
            <p className="text-gray-600">Track your waste collection records and contributions</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Collections</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {getCollectionsCount()}
              </p>
            </div>
            <Package className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Waste</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {getTotalWaste()} kg
              </p>
            </div>
            <Scale className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average per Collection</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {getCollectionsCount() > 0 ? (getTotalWaste() / getCollectionsCount()).toFixed(1) : 0} kg
              </p>
            </div>
            <Scale className="text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Filter Collections</h2>
          <Filter size={20} className="text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste Type
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {wasteTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Collections List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Collection Records ({filteredCollections.length})
        </h2>

        {filteredCollections.length > 0 ? (
          <div className="space-y-4">
            {filteredCollections.map((collection) => (
              <div
                key={collection.collection_id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Package className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 capitalize">
                        {collection.waste_type} Collection
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(collection.collection_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {collection.weight} kg
                    </div>
                    <div className="text-sm text-gray-500">Weight</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Scale size={16} className="mr-2" />
                    Type: <span className="ml-1 font-medium capitalize">{collection.waste_type}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    Collected at your location
                  </div>

                  {collection.notes && (
                    <div className="md:col-span-3">
                      <p className="text-gray-600">
                        <span className="font-medium">Notes:</span> {collection.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No collection records found</h3>
            <p className="text-gray-500">
              {collections.length === 0 
                ? "You haven't had any waste collections yet."
                : "No collections match your current filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionHistory;
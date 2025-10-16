import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Truck, Search, Crosshair } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = "AIzaSyCMMHWV8VSCEoqws7_Rh2Crea_rSPvv1t0";

const TrackVehicle = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState({
    lat: '',
    lng: ''
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  // Load Google Maps Script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("googleMapsScript");
      if (existingScript) return;

      const script = document.createElement("script");
      script.id = "googleMapsScript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  useEffect(() => {
    if (userLocation || (!useCurrentLocation && searchLocation.lat && searchLocation.lng)) {
      fetchNearbyVehicles();
      const interval = setInterval(fetchNearbyVehicles, 30000);
      return () => clearInterval(interval);
    }
  }, [userLocation, searchLocation, useCurrentLocation]);

  // Initialize or update map when vehicles or user location changes
  useEffect(() => {
    if ((userLocation || searchLocation.lat) && window.google) {
      initializeMap();
    }
  }, [vehicles, userLocation, searchLocation]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const location = useCurrentLocation ? userLocation : searchLocation;
    if (!location || !location.lat) return;

    const center = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lng)
    };

    // Create map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });
    } else {
      // Update center if map exists
      mapInstanceRef.current.setCenter(center);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // Add user location marker with custom icon
    userMarkerRef.current = new window.google.maps.Marker({
      position: center,
      map: mapInstanceRef.current,
      title: "Your Location",
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#4285F4" stroke="white" stroke-width="3"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <circle cx="20" cy="20" r="4" fill="#4285F4"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20),
      },
      zIndex: 1000,
    });

    // Add info window for user location
    const userInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; min-width: 150px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">
            📍 Your Location
          </h3>
          <p style="margin: 4px 0; font-size: 14px; color: #4b5563;">
            Lat: ${center.lat.toFixed(6)}
          </p>
          <p style="margin: 4px 0; font-size: 14px; color: #4b5563;">
            Lng: ${center.lng.toFixed(6)}
          </p>
        </div>
      `
    });

    userMarkerRef.current.addListener('click', () => {
      userInfoWindow.open(mapInstanceRef.current, userMarkerRef.current);
    });

    // Add user location circle
    new window.google.maps.Circle({
      strokeColor: "#4285F4",
      strokeOpacity: 0.4,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.1,
      map: mapInstanceRef.current,
      center: center,
      radius: 50000, // 50km radius
    });

    // Add vehicle markers
    vehicles.forEach((vehicle, index) => {
      if (vehicle.current_location_lat && vehicle.current_location_lng) {
        const vehiclePosition = {
          lat: parseFloat(vehicle.current_location_lat),
          lng: parseFloat(vehicle.current_location_lng)
        };

        const marker = new window.google.maps.Marker({
          position: vehiclePosition,
          map: mapInstanceRef.current,
          title: vehicle.vehicle_number || `Vehicle ${index + 1}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
                <path d="M20 0C12.3 0 6 6.3 6 14c0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6.3-14-14-14z" 
                  fill="${vehicle.status === 'active' ? '#22c55e' : '#eab308'}" 
                  stroke="white" 
                  stroke-width="2"/>
                <circle cx="20" cy="14" r="6" fill="white"/>
                <text x="20" y="19" font-size="12" font-weight="bold" text-anchor="middle" fill="${vehicle.status === 'active' ? '#22c55e' : '#eab308'}">🚛</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 50),
            anchor: new window.google.maps.Point(20, 50),
          },
          animation: window.google.maps.Animation.DROP,
        });

        const distance = calculateDistance(
          center.lat,
          center.lng,
          vehiclePosition.lat,
          vehiclePosition.lng
        );

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 220px;">
              <h3 style="margin: 0 0 10px 0; font-weight: bold; color: #1f2937; font-size: 16px;">
                🚛 ${vehicle.vehicle_number || 'Collection Vehicle'}
              </h3>
              <div style="border-top: 2px solid #e5e7eb; padding-top: 8px;">
                <p style="margin: 6px 0; font-size: 14px; color: #4b5563;">
                  <strong>Status:</strong> 
                  <span style="color: ${vehicle.status === 'active' ? '#22c55e' : '#eab308'};">
                    ${vehicle.status || 'Unknown'}
                  </span>
                </p>
                <p style="margin: 6px 0; font-size: 14px; color: #4b5563;">
                  <strong>Distance:</strong> ${distance.toFixed(2)} km away
                </p>
                ${vehicle.vehicle_type ? `<p style="margin: 6px 0; font-size: 14px; color: #4b5563;">
                  <strong>Type:</strong> ${vehicle.vehicle_type}
                </p>` : ''}
                <p style="margin: 6px 0; font-size: 13px; color: #4b5563;">
                  <strong>Location:</strong><br/>
                  Lat: ${vehiclePosition.lat.toFixed(6)}<br/>
                  Lng: ${vehiclePosition.lng.toFixed(6)}
                </p>
                ${vehicle.last_location_update ? `<p style="margin: 6px 0; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 6px;">
                  ⏱️ Updated: ${new Date(vehicle.last_location_update).toLocaleString()}
                </p>` : ''}
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // Adjust bounds to show all markers
    if (vehicles.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(center);
      vehicles.forEach(vehicle => {
        if (vehicle.current_location_lat && vehicle.current_location_lng) {
          bounds.extend({
            lat: parseFloat(vehicle.current_location_lat),
            lng: parseFloat(vehicle.current_location_lng)
          });
        }
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setSearchLocation(location);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Error getting your location. Please enter coordinates manually.');
        setLoading(false);
      }
    );
  };

  const fetchNearbyVehicles = async () => {
    try {
      setLoading(true);
      const location = useCurrentLocation ? userLocation : searchLocation;
      
      if (!location || !location.lat || !location.lng) {
        setVehicles([]);
        return;
      }

      // Mock data for demo - replace with your actual API call
      const mockVehicles = [
        {
          vehicle_id: 1,
          vehicle_number: "WC-001",
          status: "active",
          current_location_lat: parseFloat(location.lat) + 0.05,
          current_location_lng: parseFloat(location.lng) + 0.05,
          vehicle_type: "Garbage Truck",
          last_location_update: new Date().toISOString()
        },
        {
          vehicle_id: 2,
          vehicle_number: "WC-002",
          status: "active",
          current_location_lat: parseFloat(location.lat) - 0.03,
          current_location_lng: parseFloat(location.lng) + 0.02,
          vehicle_type: "Recycling Truck",
          last_location_update: new Date().toISOString()
        }
      ];

      setVehicles(mockVehicles);
      
      // Uncomment below for actual API call
      
      const response = await fetch(`http://localhost:3000/api/vehicles/nearby?latitude=${location.lat}&longitude=${location.lng}&maxDistance=50`);
      const data = await response.json();
      setVehicles(Array.isArray(data) ? data : [data]);
      
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSearch = () => {
    if (!useCurrentLocation && searchLocation.lat && searchLocation.lng) {
      fetchNearbyVehicles();
    }
  };

  const getDistanceColor = (distance) => {
    if (distance < 5) return 'text-green-600';
    if (distance < 15) return 'text-yellow-600';
    if (distance < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDistanceText = (distance) => {
    if (distance < 1) return 'Less than 1 km away';
    if (distance < 5) return 'Very close';
    if (distance < 15) return 'Nearby';
    if (distance < 30) return 'Moderate distance';
    return 'Far away';
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Collection Vehicle</h1>
        <p className="text-gray-600">Live location of waste collection vehicles near you</p>
      </div>

      {/* Location Selection */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Location</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="currentLocation"
                checked={useCurrentLocation}
                onChange={() => setUseCurrentLocation(true)}
                className="text-green-500 focus:ring-green-500"
              />
              <label htmlFor="currentLocation" className="font-medium text-gray-700">
                Use My Current Location
              </label>
            </div>
            
            {useCurrentLocation && userLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-700">
                  <Crosshair size={16} />
                  <span className="text-sm">
                    Current Location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
            >
              <Crosshair size={16} className="mr-2" />
              {loading ? 'Getting Location...' : 'Refresh Location'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="manualLocation"
                checked={!useCurrentLocation}
                onChange={() => setUseCurrentLocation(false)}
                className="text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="manualLocation" className="font-medium text-gray-700">
                Enter Coordinates Manually
              </label>
            </div>

            {!useCurrentLocation && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={searchLocation.lat}
                      onChange={(e) => setSearchLocation({...searchLocation, lat: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 6.9271"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={searchLocation.lng}
                      onChange={(e) => setSearchLocation({...searchLocation, lng: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 79.8612"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!searchLocation.lat || !searchLocation.lng}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
                >
                  <Search size={16} className="mr-2" />
                  Search Vehicles
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Google Maps Display */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div 
            ref={mapRef}
            className="h-96 bg-gray-100 rounded-lg"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Vehicle List */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nearby Vehicles ({vehicles.length})
            </h3>
            
            {vehicles.length > 0 ? (
              <div className="space-y-4">
                {vehicles.map((vehicle, index) => {
                  const distance = userLocation ? 
                    calculateDistance(
                      userLocation.lat, 
                      userLocation.lng, 
                      vehicle.current_location_lat, 
                      vehicle.current_location_lng
                    ) : null;

                  return (
                    <div key={vehicle.vehicle_id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">
                          {vehicle.vehicle_number || 'Collection Vehicle'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          vehicle.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : vehicle.status === 'maintenance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.status || 'Unknown'}
                        </span>
                      </div>
                      
                      {distance !== null && (
                        <div className={`text-sm font-medium mb-2 ${getDistanceColor(distance)}`}>
                          📍 {getDistanceText(distance)} ({distance.toFixed(1)} km)
                        </div>
                      )}
                      <div className={`text-sm font-medium mb-2 ${getDistanceColor(distance)}`}>
                          📞 0789840996
                        </div>
                      
                      {vehicle.last_location_update && (
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Clock size={14} className="mr-1" />
                          Updated: {new Date(vehicle.last_location_update).toLocaleTimeString()}
                        </div>
                      )}
                      
                      {(vehicle.current_location_lat && vehicle.current_location_lng) && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Navigation size={14} className="mr-1" />
                          Coordinates: {vehicle.current_location_lat.toFixed(4)}, {vehicle.current_location_lng.toFixed(4)}
                        </div>
                      )}
                      
                      {vehicle.vehicle_type && (
                        <div className="text-sm text-gray-600 mt-1">
                          Type: {vehicle.vehicle_type}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Truck size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No vehicles found</p>
                <p className="text-sm mt-1">
                  {userLocation ? 
                    "No active vehicles within 50 km radius" :
                    "Set your location to see nearby vehicles"
                  }
                </p>
              </div>
            )}
          </div>

          {vehicles.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Collection Information</h4>
              <p className="text-yellow-700 text-sm">
                {vehicles.length === 1 ? 
                  "A collection vehicle is operating in your area." :
                  `${vehicles.length} collection vehicles are operating in your area.`
                } Please have your waste ready for collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackVehicle;
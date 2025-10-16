import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Truck, Search, Crosshair, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GOOGLE_MAPS_API_KEY = "AIzaSyCMMHWV8VSCEoqws7_Rh2Crea_rSPvv1t0";

const TrackVehicle = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const navigate = useNavigate();

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
            <circle cx="20" cy="20" r="18" fill="#10b981" stroke="white" stroke-width="3"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <circle cx="20" cy="20" r="4" fill="#10b981"/>
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
      strokeColor: "#10b981",
      strokeOpacity: 0.4,
      strokeWeight: 2,
      fillColor: "#10b981",
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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/nearby?latitude=${location.lat}&longitude=${location.lng}&maxDistance=50`);
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
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Track Vehicle</h1>
            <p className="text-emerald-100 text-sm">Live location of waste collection vehicles</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Location Selection */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Search Location</h2>
          
          <div className="space-y-4">
            {/* Current Location Option */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="currentLocation"
                  checked={useCurrentLocation}
                  onChange={() => setUseCurrentLocation(true)}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="currentLocation" className="font-medium text-gray-700 text-sm">
                  Use My Current Location
                </label>
              </div>
              
              {useCurrentLocation && userLocation && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 text-emerald-700">
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
                className="w-full bg-emerald-500 text-white py-3 px-4 rounded-2xl hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center active:scale-95 font-medium text-sm"
              >
                <Crosshair size={18} className="mr-2" />
                {loading ? 'Getting Location...' : 'Refresh Location'}
              </button>
            </div>

            {/* Manual Location Option */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="manualLocation"
                  checked={!useCurrentLocation}
                  onChange={() => setUseCurrentLocation(false)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="manualLocation" className="font-medium text-gray-700 text-sm">
                  Enter Coordinates Manually
                </label>
              </div>

              {!useCurrentLocation && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={searchLocation.lat}
                        onChange={(e) => setSearchLocation({...searchLocation, lat: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm"
                        placeholder="e.g., 6.9271"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={searchLocation.lng}
                        onChange={(e) => setSearchLocation({...searchLocation, lng: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm"
                        placeholder="e.g., 79.8612"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={!searchLocation.lat || !searchLocation.lng}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-2xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center active:scale-95 font-medium text-sm"
                  >
                    <Search size={18} className="mr-2" />
                    Search Vehicles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Display */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div 
            ref={mapRef}
            className="h-96 bg-gray-100 rounded-2xl"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Vehicle List */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Nearby Vehicles ({vehicles.length})
          </h3>
          
          {vehicles.length > 0 ? (
            <div className="space-y-3">
              {vehicles.map((vehicle, index) => {
                const distance = userLocation ? 
                  calculateDistance(
                    userLocation.lat, 
                    userLocation.lng, 
                    vehicle.current_location_lat, 
                    vehicle.current_location_lng
                  ) : null;

                return (
                  <div key={vehicle.vehicle_id || index} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all active:scale-95">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-800 text-sm">
                        {vehicle.vehicle_number || 'Collection Vehicle'}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        vehicle.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : vehicle.status === 'maintenance'
                          ? 'bg-amber-100 text-amber-800'
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
                    
                    <div className="text-sm font-medium mb-2 text-blue-600">
                      📞 0789840996
                    </div>
                    
                    {vehicle.last_location_update && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock size={14} className="mr-2" />
                        Updated: {new Date(vehicle.last_location_update).toLocaleTimeString()}
                      </div>
                    )}
                    
                    {(vehicle.current_location_lat && vehicle.current_location_lng) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation size={14} className="mr-2" />
                        Coordinates: {vehicle.current_location_lat.toFixed(4)}, {vehicle.current_location_lng.toFixed(4)}
                      </div>
                    )}
                    
                    {vehicle.vehicle_type && (
                      <div className="text-sm text-gray-600 mt-2">
                        Type: {vehicle.vehicle_type}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No vehicles found</p>
              <p className="text-gray-400 text-xs mt-1">
                {userLocation ? 
                  "No active vehicles within 50 km radius" :
                  "Set your location to see nearby vehicles"
                }
              </p>
            </div>
          )}
        </div>

        {vehicles.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <h4 className="font-bold text-amber-800 mb-2 text-sm">Collection Information</h4>
            <p className="text-amber-700 text-sm">
              {vehicles.length === 1 ? 
                "A collection vehicle is operating in your area." :
                `${vehicles.length} collection vehicles are operating in your area.`
              } Please have your waste ready for collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackVehicle;
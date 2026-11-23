import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, PolygonF } from '@react-google-maps/api';
import { GoogleMapsProvider, useMapsContext } from "@/components/GoogleMapsProvider";
const containerStyle = { width: '100%', height: '600px' };
const ZONE_COLORS = {
  red: '#ef4444',
  orange: '#f97316',
  violet: '#8b5cf6'
};

interface Area {
  id: string;
  name: string;
  coords: { lat: number; lng: number }[];
}

interface ZoneData {
  zone_name: string;
  zone_type: 'red' | 'orange' | 'violet';
}

function DeliveryZoneMap() {
  const { isLoaded, loadError } = useMapsContext()

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter] = useState({ lat: 17.3850, lng: 78.4867 }); 
  const [mapZoom] = useState(11);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [zonesData, setZonesData] = useState<any[]>([]);
  const [drawingOverlay, setDrawingOverlay] = useState<google.maps.Polygon | null>(null);
  const [tempPath, setTempPath] = useState<{ lat: number; lng: number }[]>([]);
  const tempPolygonRef = useRef<google.maps.Polygon | null>(null);
  const mapListenersRef = useRef<any[]>([]);

  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]); 
  const [zoneDetails, setZoneDetails] = useState<ZoneData>({ zone_name: "", zone_type: "red" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const polygonRefs = useRef<{ [key: string]: google.maps.Polygon | null }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch("https://dev.zuget.com/admin/zones", {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4"
        }
      });
      const result = await res.json();
      setZonesData(result?.data || []);
    } catch (error) {
      console.error("Error fetching zones records:", error);
    }
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  useEffect(() => {
    if (!map || selectedAreas.length === 0 || !window.google) return;

    const bounds = new window.google.maps.LatLngBounds();
    let hasCoords = false;

    selectedAreas.forEach(area => {
      area.coords.forEach(coord => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
        hasCoords = true;
      });
    });

    if (hasCoords) {
      map.fitBounds(bounds);
    }
  }, [selectedAreas, map]);

  // HELPER FUNCTION: Normalizes path grids to verify first and last nodes match precisely
  const cleanAndClosePath = (rawCoords: { lat: number; lng: number }[]) => {
    if (rawCoords.length < 3) return rawCoords;
    
    const firstPoint = rawCoords[0];
    const lastPoint = rawCoords[rawCoords.length - 1];
    
    const isClosed = Math.abs(firstPoint.lat - lastPoint.lat) < 0.0000001 && 
                     Math.abs(firstPoint.lng - lastPoint.lng) < 0.0000001;
                     
    if (!isClosed) {
      return [...rawCoords, { lat: firstPoint.lat, lng: firstPoint.lng }];
    }
    return rawCoords;
  };

  const fetchLocalSearch = async (value: string) => {
    if (!value || value.length <= 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(`/api/area-search?query=${encodeURIComponent(value)}`);
      if (!res.ok) { setSuggestions([]); return; }
      const result = await res.json();
      if (result?.status === "success" && result?.data?.search_results) {
        setSuggestions(result.data.search_results);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching local area suggestions:", err);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchLocalSearch(value);
    }, 800); 
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleSelectArea = (item: any) => {
    setSuggestions([]);
    setSearchQuery(""); 

    if (item.polygon && item.polygon.length > 0) {
      const coords = item.polygon.map((p: any) => ({
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lng || p.long)
      }));

      const newAreaId = Date.now().toString();
      const nameHeader = item.name.split(',')[0];
      
      const closedCoords = cleanAndClosePath(coords);

      setSelectedAreas(prev => [...prev, {
        id: newAreaId,
        name: nameHeader,
        coords: closedCoords
      }]);
      
      setZoneDetails(prev => ({
        ...prev,
        zone_name: prev.zone_name || nameHeader
      }));
      
      setIsModalOpen(true);
    } else {
      alert("No boundary coordinates structure present for this record.");
    }
  };

  // Synchronizes path modifications while keeping the loop closed
  const handlePolygonEdit = useCallback((id: string, customPath?: google.maps.MVCArray<google.maps.LatLng>) => {
    let path = customPath;
    
    if (!path) {
      const polyInstance = polygonRefs.current[id];
      if (polyInstance) {
        path = polyInstance.getPath();
      }
    }

    if (path) {
      const updatedCoords = [];
      for (let i = 0; i < path.getLength(); i++) {
        updatedCoords.push({
          lat: path.getAt(i).lat(),
          lng: path.getAt(i).lng()
        });
      }

      const finalizedClosedCoords = cleanAndClosePath(updatedCoords);

      setSelectedAreas(prev => 
        prev.map(area => area.id === id ? { ...area, coords: finalizedClosedCoords } : area)
      );
    }
  }, []);

  const handleRemoveArea = (id: string) => {
    setSelectedAreas(prev => {
      const updated = prev.filter(area => area.id !== id);
      if (updated.length === 0) {
        setIsModalOpen(false);
      }
      return updated;
    });
  };

  const toggleDrawingTool = () => {
    if (!window.google) return;
    
    if (!isDrawingMode) {
      setTempPath([]);
      setIsDrawingMode(true);
    } else {
      cancelDrawing();
      setIsDrawingMode(false);
    }
  };

  const cancelDrawing = useCallback(() => {
    setTempPath([]);
    if (tempPolygonRef.current) {
      tempPolygonRef.current.setMap(null);
      tempPolygonRef.current = null;
    }
    if (map && mapListenersRef.current.length > 0) {
      mapListenersRef.current.forEach((l) => l.remove && l.remove());
      mapListenersRef.current = [];
      map.setOptions({ disableDoubleClickZoom: false, draggableCursor: undefined });
    }
  }, [map]);

const finishDrawing = useCallback(() => {
    // 1. Validation check before modifying state hooks
    if (tempPath.length < 3) {
      alert('Please draw at least three points to form a polygon.');
      return;
    }

    const finalizedClosedCoords = cleanAndClosePath(tempPath);
    const newHandDrawnId = Date.now().toString();
    
    const newArea: Area = {
      id: newHandDrawnId,
      name: `Custom Pin #${selectedAreas.length + 1}`,
      coords: finalizedClosedCoords
    };

    // 2. Erase map draw overlays first
    if (tempPolygonRef.current) {
      tempPolygonRef.current.setMap(null);
      tempPolygonRef.current = null;
    }
    
    // 3. Unbind map interface options and listeners instantly
    if (map) map.setOptions({ disableDoubleClickZoom: false, draggableCursor: undefined });
    if (mapListenersRef.current.length > 0) {
      mapListenersRef.current.forEach((l) => l.remove && l.remove());
      mapListenersRef.current = [];
    }

    // 4. Force state values to cycle sequentially to clear UI overlapping
    setTempPath([]);
    setIsDrawingMode(false);
    
    // 5. Append structural bounds to state and reveal details overlay form
    setSelectedAreas(prev => [...prev, newArea]);
    setZoneDetails({
      zone_name: `Zone ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      zone_type: 'red'
    });
    setIsModalOpen(true);

  }, [map, tempPath, selectedAreas.length]);

  // Attach map listeners for custom drawing mode
  useEffect(() => {
    if (!map || !isDrawingMode) {
      if (mapListenersRef.current.length > 0) {
        mapListenersRef.current.forEach((l) => l.remove && l.remove());
        mapListenersRef.current = [];
      }
      if (map) map.setOptions({ disableDoubleClickZoom: false, draggableCursor: undefined });
      return;
    }

    map.setOptions({ disableDoubleClickZoom: true, draggableCursor: 'crosshair' });

    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      
      setTempPath(prev => {
        const next = [...prev, latlng];
        if (!tempPolygonRef.current) {
          tempPolygonRef.current = new google.maps.Polygon({
            paths: next,
            map,
            editable: true,
            draggable: true,
            strokeColor: '#7c3aed',
            strokeWeight: 2,
            fillOpacity: 0.15,
          });
        } else {
          tempPolygonRef.current.setPath(next);
        }
        return next;
      });
    });

    const dblClickListener = map.addListener('dblclick', () => {
      finishDrawing();
    });

    const rightClickListener = map.addListener('rightclick', () => {
      cancelDrawing();
      setIsDrawingMode(false);
    });

    mapListenersRef.current = [clickListener, dblClickListener, rightClickListener];

    return () => {
      if (mapListenersRef.current.length > 0) {
        mapListenersRef.current.forEach((l) => l.remove && l.remove());
        mapListenersRef.current = [];
      }
      if (map) map.setOptions({ disableDoubleClickZoom: false, draggableCursor: undefined });
    };
  }, [isDrawingMode, map, finishDrawing, cancelDrawing]);

  const handleAddMoreTrigger = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.parentElement?.classList.add('ring-2', 'ring-purple-500');
    setTimeout(() => {
      searchInputRef.current?.parentElement?.classList.remove('ring-2', 'ring-purple-500');
    }, 1200);
  };

  const saveZone = async () => {
    if (!zoneDetails.zone_name) return alert("Please enter a zone name");
    if (selectedAreas.length === 0) return alert("Please select or draw at least one area region.");
    setLoading(true);

    const compositeLatLong = selectedAreas.flatMap((area) => {
      return area.coords.map(c => ({ lat: c.lat, long: c.lng }));
    });

    const payload = {
      app_user_id: localStorage.getItem('app_user_id'),
      zone_name: zoneDetails.zone_name,
      zone_lat_long: compositeLatLong, 
      zone_type: zoneDetails.zone_type
    };

    try {
      const response = await fetch('https://dev.zuget.com/admin/add-zone', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTc4ODkzNjYxNCJ9.RcMxNWXqsNknXJPRdkKZ4GqcuI3ZuBptl3DbG20mSgw'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
      const result = await response.json();

      if (result.status === "success" || response.status === 200) {
        alert("Combined multi-region zone saved successfully!");
        
        if (drawingOverlay) {
          drawingOverlay.setMap(null);
          setDrawingOverlay(null);
        }
        
        setSelectedAreas([]);
        setZoneDetails({ zone_name: "", zone_type: "red" });
        setIsModalOpen(false);
        setIsDrawingMode(false);
        await fetchZones();
      } else {
        alert(`Backend Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save zone cluster configuration.");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'red': return 'bg-rose-100 border-rose-200 text-rose-700';
      case 'orange': return 'bg-amber-100 border-amber-200 text-amber-700';
      default: return 'bg-purple-100 border-purple-200 text-purple-700';
    }
  };

  return loadError ? (
    <div className="flex items-center justify-center min-h-[400px] w-full text-sm font-bold text-red-600">
      Failed to load Google Maps. Check your API key and network connection.
    </div>
  ) : isLoaded ? (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 bg-white">
        
        {/* Search Input Bar Overlay */}
        <div className="absolute top-4 left-4 z-10 w-[calc(100%-32px)] max-w-3xl">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 flex items-center transition-all bg-white/95 backdrop-blur-md">
            <span className="mr-3 text-slate-400 text-lg">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by Area"
              className="w-full text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 mt-2 max-h-60 overflow-y-auto divide-y divide-slate-100">
              {suggestions.map((item: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-semibold text-slate-700 truncate mr-4">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleSelectArea(item)}
                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    + Add Area
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PIN AREA ZONE FLOATING ACTION CONTROLLER */}
        {/* <div className="absolute top-24 right-4 z-10">
          <button
            type="button"
            onClick={toggleDrawingTool}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg font-bold text-sm tracking-wide transition-all active:scale-95 cursor-pointer select-none group border
              ${isDrawingMode 
                ? 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-500/20' 
                : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-[#6d28d9] shadow-[#7c3aed]/20'
              }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M16 12V4c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v7c0 .55.45 1 1 1s1-.45 1-1v-7h1c1.1 0 2-.9 2-2z"/>
            </svg>
            <span>{isDrawingMode ? 'Cancel Pinning' : 'Pin Area Zone'}</span>
          </button>
        </div> */}

        {/* Map View Canvas Container */}
        <div className="h-[600px]">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={mapZoom}
            onLoad={(mapInstance) => setMap(mapInstance)}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              disableDoubleClickZoom: isDrawingMode
            }}
          >
            {selectedAreas.map((area) => (
              <PolygonF
                key={area.id}
                onLoad={(poly) => {
                  polygonRefs.current[area.id] = poly;
                  const path = poly.getPath();
                  
                  // Bind live path manipulation events (inserting, removing, dragging dots)
                  window.google.maps.event.addListener(path, 'set_at', () => handlePolygonEdit(area.id, path));
                  window.google.maps.event.addListener(path, 'insert_at', () => handlePolygonEdit(area.id, path));
                  window.google.maps.event.addListener(path, 'remove_at', () => handlePolygonEdit(area.id, path));
                }}
                paths={area.coords}
                editable={true}
                draggable={true}
                onDragEnd={() => handlePolygonEdit(area.id)}
                options={{
                  fillColor: ZONE_COLORS[zoneDetails.zone_type] || '#ef4444',
                  fillOpacity: 0.25,
                  strokeColor: ZONE_COLORS[zoneDetails.zone_type] || '#ef4444',
                  strokeWeight: 2,
                }}
              />
            ))}
          </GoogleMap>

          {/* Draw Instructions Panel (appears in drawing mode) */}
          {/* {isDrawingMode && (
            <div className="absolute bottom-4 left-4 z-10 w-[calc(100%-32px)] max-w-2xl bg-white rounded-2xl shadow-xl p-5 border border-slate-200/80">
              <h4 className="text-base font-bold text-slate-800 mb-4">📍 Drawing Mode Active</h4>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-xl flex-shrink-0">1️⃣</span>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Click on the map</p>
                    <p className="text-xs text-blue-700">Click multiple points to draw a polygon (minimum 3 points)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-xl flex-shrink-0">2️⃣</span>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Double-click to finish</p>
                    <p className="text-xs text-green-700">Double-click the last point or anywhere to complete the drawing</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-xl flex-shrink-0">3️⃣</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Right-click to cancel</p>
                    <p className="text-xs text-amber-700">Right-click to cancel and clear all points</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-3">
                <div className="text-xs font-medium text-slate-600">
                  Points: <span className="font-bold text-indigo-600">{tempPath.length}</span>
                </div>
                <button 
                  type="button"
                  onClick={toggleDrawingTool}
                  className="text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-rose-500 hover:bg-rose-600"
                >
                  Cancel Drawing
                </button>
              </div>
            </div>
          )} */}

          {/* Combined Component Indicator & Add More Action Bar */}
          {/* {selectedAreas.length > 0 && (
            <div className="absolute bottom-[240px] left-4 z-10 w-[calc(100%-32px)] max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200/80 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/95 backdrop-blur-sm">
              <div className="text-sm font-semibold text-slate-700 truncate max-w-md">
                {selectedAreas.map(a => a.name).join(" + ")}
              </div>
              <button
                type="button"
                onClick={handleAddMoreTrigger}
                className="border border-[#7c3aed] text-[#7c3aed] hover:bg-purple-50 px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer"
              >
                Add More
              </button>
            </div>
          )} */}

          {/* Details Configuration Panel */}
          { isModalOpen && (selectedAreas.length > 0) && (
            <div className="absolute bottom-4 left-4 z-10 w-[calc(100%-32px)] max-w-2xl bg-white rounded-2xl shadow-xl p-5 border border-slate-200/80">
              <h4 className="text-base font-bold text-slate-800 mb-4">Add Details</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Zone Name *</label>
                  <input
                    placeholder="Enter explicit zone name"
                    className="w-full border-b-2 border-slate-200 focus:border-[#7c3aed] text-sm font-semibold py-1.5 outline-none transition-all text-slate-800 bg-transparent"
                    value={zoneDetails.zone_name}
                    onChange={(e) => setZoneDetails({ ...zoneDetails, zone_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Select Zone Type *</label>
                  <select
                    className="w-full border-b-2 border-slate-200 focus:border-[#7c3aed] text-sm font-bold py-1.5 outline-none transition-all text-slate-700 bg-transparent cursor-pointer"
                    value={zoneDetails.zone_type}
                    onChange={(e) => setZoneDetails({ ...zoneDetails, zone_type: e.target.value as any })}
                  >
                    <option value="red">Red Type</option>
                    <option value="orange">Orange Zone</option>
                    <option value="violet">violet Type</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap gap-4 items-center text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Red Type : High Demand
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /> Orange Zone : Noraml Demand
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> violet Type : Least Demand
                  </span>
                </div>
                
                <button 
                  type="button"
                  onClick={saveZone} 
                  disabled={loading} 
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer w-full sm:w-auto"
                >
                  {loading ? "Saving..." : "Add to Area Zone"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configured Matrix Units */}
      <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Configured Operational Area Units</h3>
        <div className="flex flex-wrap gap-2.5">
          {zonesData.length === 0 ? (
            <p className="text-xs font-medium text-slate-400 pl-1">No delivery target coordinates configured.</p>
          ) : (
            zonesData.map((item, index) => (
              <div 
                className={`border text-xs font-bold rounded-xl px-4 py-2.5 min-w-[140px] max-w-[200px] text-center truncate shadow-xs ${getBadgeColor(item.zone_type)}`} 
                key={index}
                title={item.zone_name}
              >
                {item.zone_name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[400px] w-full text-sm font-bold text-[#7c3aed] animate-pulse">
      Loading Delivery Map Canvas Environment...
    </div>
  );
}

export default function MapClient() {
  return (
    <GoogleMapsProvider>
      <DeliveryZoneMap />
    </GoogleMapsProvider>
  );
}
"use client"
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, PolygonF } from '@react-google-maps/api';
import { FaCircle, FaEdit, FaTimes, FaMapMarkedAlt, FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import Layout from '@/components/Layout/Layout';
import Swal from 'sweetalert2';

const containerStyle = {
    width: '100%',
    height: '500px'
};

const editMapContainerStyle = {
    width: '100%',
    height: '300px'
};

const mapCenter = {
    lat: 17.4440,
    lng: 78.3815
};

const ZONE_COLORS: Record<string, { fill: string; stroke: string }> = {
    red: { fill: '#ef4444', stroke: '#dc2626' },
    orange: { fill: '#f97316', stroke: '#ea580c' },
    violet: { fill: '#8b5cf6', stroke: '#7c3aed' }
};

const MAP_LIBRARIES = ["drawing"] as any;

interface ZoneLatLong {
    lat: number;
    long: number;
    lng?: number;
}

interface ZoneItem {
    _id: string;
    zone_name: string;
    zone_type: string;
    status?: string;
    zone_lat_long: ZoneLatLong[];
}

interface CommonZoneComponentProps {
    zonename: string;
    demand: string;
}

function Page() {
    const [zonesData, setZonesData] = useState<ZoneItem[]>([]);
    const [editingZone, setEditingZone] = useState<ZoneItem | null>(null);
    const [isMapEditable, setIsMapEditable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const polygonRef = useRef<google.maps.Polygon | null>(null);

    const loaderOptions = useMemo(() => ({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyCAZmk-lXeb9OA1ebQIvgfUvE2a-3BfN40',
        libraries: MAP_LIBRARIES
    }), []);

    const { isLoaded } = useJsApiLoader(loaderOptions);

    const fetchZones = async () => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiOTc4ODkzNjYxNCJ9.RcMxNWXqsNknXJPRdkKZ4GqcuI3ZuBptl3DbG20mSgw");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        try {
            const response = await fetch("https://dev.zuget.com/admin/zones", requestOptions);
            const result = await response.json();
            if (result && result.data) {
                setZonesData(result.data);
            }
        } catch (error) {
            console.error("Error fetching zones data:", error);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const handleOpenEditModal = (zone: ZoneItem) => {
        setEditingZone({
            ...zone,
            zone_lat_long: zone.zone_lat_long.map(c => ({
                lat: parseFloat(c.lat as any),
                long: parseFloat((c.long ?? c.lng) as any)
            }))
        });
        setIsMapEditable(false);
    };

    const handleDeleteZone = async (zoneId: string) => {
        // Fetch dynamic app_user_id from localStorage
        const appUserId = localStorage.getItem('app_user_id') || '436';

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const myHeaders = new Headers();
                myHeaders.append("accept", "application/json");
                myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4");

                const requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                };

                try {
                    const response = await fetch(
                        `https://dev.zuget.com/admin/zone?zone_id=${zoneId}&app_user_id=${appUserId}`, 
                        requestOptions
                    );
                    
                    if (response.ok) {
                        Swal.fire(
                            'Deleted!',
                            'The zone has been removed.',
                            'success'
                        );
                        fetchZones(); // Refresh the current map list view instantly
                    } else {
                        Swal.fire('Error!', 'Could not execute target deletion.', 'error');
                    }
                } catch (error) {
                    console.error("Error performing deletion sequence:", error);
                    Swal.fire('Error!', 'Something went wrong on the network.', 'error');
                }
            }
        });
    };

    const handlePolygonEdit = () => {
        if (polygonRef.current) {
            const path = polygonRef.current.getPath();
            const updatedCoords: ZoneLatLong[] = [];
            for (let i = 0; i < path.getLength(); i++) {
                const xy = path.getAt(i);
                updatedCoords.push({
                    lat: xy.lat(),
                    long: xy.lng()
                });
            }
            setEditingZone(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    zone_lat_long: updatedCoords
                };
            });
        }
    };

    const handleSaveZone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingZone) return;
        setIsSubmitting(true);

        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4");
        myHeaders.append("Content-Type", "application/json");

        const rawPayload = JSON.stringify({
            "zone_id": editingZone._id,
            "app_user_id": parseInt(localStorage.getItem('app_user_id') || '436'),
            "zone_name": editingZone.zone_name,
            "zone_lat_long": editingZone.zone_lat_long,
            "zone_type": editingZone.zone_type,
            "status": editingZone.status || "active"
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: rawPayload,
        };

        try {
            const response = await fetch("https://dev.zuget.com/admin/edit-zone", requestOptions);
            if (response.ok) {
                alert("Zone parameters synchronized successfully!");
                setEditingZone(null);
                fetchZones();
            } else {
                alert("Could not process structural update submission.");
            }
        } catch (error) {
            console.error("Error performing update sequence:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const CommonZoneComponent: React.FC<CommonZoneComponentProps> = ({ zonename, demand }) => (
        <div className='border rounded-md lg:px-5 lg:py-5 bg-white shadow-sm'>
            <div className='flex justify-between pb-4 items-center'>
                <span className='flex gap-x-2 items-center capitalize font-semibold'>
                    <FaCircle color={ZONE_COLORS[zonename]?.fill || '#999'} /> {zonename} Zone Area ({demand} Demand)
                </span>
            </div>
            <ul className='flex flex-col gap-y-3 border-t border-gray-100 pt-4'>
                {zonesData.filter(item => item.zone_type === zonename).map((item, index) => (
                    <li key={item._id || index} className='flex items-center justify-between px-4 py-2 bg-gray-50 text-sm border rounded-md text-gray-700 font-medium gap-x-4'>
                        <span className="truncate">{item.zone_name || "Unnamed Area"}</span>
                        <div className="flex items-center gap-x-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className='flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded border border-blue-200 transition-colors'
                            >
                                <FaEdit className="text-xs" /> Edit Info
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteZone(item._id)}
                                className='flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1 rounded border border-rose-200 transition-colors'
                            >
                                <FaTrashAlt className="text-xs" /> Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <Layout>
            <div className='flex flex-col gap-y-6 lg:pt-6 max-w-7xl mx-auto px-4 pb-12'>

                <div className='flex flex-col gap-4'>
                    <CommonZoneComponent zonename='red' demand='high' />
                    <CommonZoneComponent zonename='orange' demand='normal' />
                    <CommonZoneComponent zonename='violet' demand='low' />
                </div>

                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white p-2">
                    <h3 className="text-md font-bold text-gray-800 p-3 flex items-center gap-2">
                        🗺️ Active Delivery Ranges Overview
                    </h3>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={mapCenter}
                            zoom={13}
                            options={{ disableDefaultUI: false, clickableIcons: false }}
                        >
                            {zonesData.map((zone, index) => {
                                if (!zone.zone_lat_long || !Array.isArray(zone.zone_lat_long)) return null;
                                const mappedPaths = zone.zone_lat_long.map(coord => ({
                                    lat: parseFloat(coord.lat as any),
                                    lng: parseFloat((coord.long || coord.lng) as any)
                                }));
                                const configColors = ZONE_COLORS[zone.zone_type] || ZONE_COLORS.violet;

                                return (
                                    <PolygonF
                                        key={zone._id || index}
                                        paths={mappedPaths}
                                        options={{
                                            fillColor: configColors.fill,
                                            fillOpacity: 0.35,
                                            strokeColor: configColors.stroke,
                                        }}
                                    />
                                );
                            })}
                        </GoogleMap>
                    ) : (
                        <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
                            Loading Live Map Coverage Area...
                        </div>
                    )}
                </div>

                {editingZone && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">

                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    ⚙️ Adjusting Parameters for Zone #{editingZone._id}
                                </h3>
                                <button type="button" onClick={() => setEditingZone(null)} className="text-gray-400 hover:text-gray-600">
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveZone} className="p-6 overflow-y-auto flex-1 flex flex-col gap-y-4">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Zone Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingZone.zone_name}
                                            onChange={(e) => setEditingZone({ ...editingZone, zone_name: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Zone Classification Type</label>
                                        <select
                                            value={editingZone.zone_type}
                                            onChange={(e) => setEditingZone({ ...editingZone, zone_type: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="red">Red (High Demand)</option>
                                            <option value="orange">Orange (Normal Demand)</option>
                                            <option value="violet">Violet (Low Demand)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Operational Status</label>
                                        <select
                                            value={editingZone.status || 'active'}
                                            onChange={(e) => setEditingZone({ ...editingZone, status: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-y-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="block text-xs font-bold text-gray-700 uppercase">Geographical Bounds Setup</span>
                                            <span className="text-xs text-gray-400">Modify shape edges interactively over live canvas view</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsMapEditable(!isMapEditable)}
                                            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded transition-all ${isMapEditable
                                                ? 'bg-orange-500 text-white shadow-sm'
                                                : 'bg-white border text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <FaMapMarkedAlt /> {isMapEditable ? "Lock Points (Done)" : "Edit Map Layout"}
                                        </button>
                                    </div>

                                    {isLoaded ? (
                                        <div className="rounded-lg overflow-hidden border border-gray-200">
                                            <GoogleMap
                                                mapContainerStyle={editMapContainerStyle}
                                                center={
                                                    editingZone.zone_lat_long[0]
                                                        ? { lat: editingZone.zone_lat_long[0].lat, lng: editingZone.zone_lat_long[0].long }
                                                        : mapCenter
                                                }
                                                zoom={13}
                                                options={{ disableDefaultUI: true }}
                                            >
                                                <PolygonF
                                                    onLoad={(polygon) => { polygonRef.current = polygon; }}
                                                    paths={editingZone.zone_lat_long.map(c => ({ lat: c.lat, lng: c.long }))}
                                                    editable={isMapEditable}
                                                    draggable={isMapEditable}
                                                    onMouseUp={handlePolygonEdit}
                                                    onDragEnd={handlePolygonEdit}
                                                    options={{
                                                        fillColor: ZONE_COLORS[editingZone.zone_type]?.fill || '#999',
                                                        fillOpacity: 0.4,
                                                        strokeColor: ZONE_COLORS[editingZone.zone_type]?.stroke || '#666',
                                                        strokeWeight: 2,
                                                    }}
                                                />
                                            </GoogleMap>
                                        </div>
                                    ) : (
                                        <div className="h-[200px] bg-gray-200 flex items-center justify-center text-sm text-gray-400">Loading Map Engine...</div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-x-2 border-t pt-4 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingZone(null)}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <FaCheckCircle /> {isSubmitting ? "Updating..." : "Submit Updates"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Page;
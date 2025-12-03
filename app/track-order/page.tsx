'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Button from '@/components/Button';

interface TrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
  'sr-status': string;
  'sr-status-label': string;
}

interface TrackingData {
  awb_code: string;
  courier_name: string;
  current_status: string;
  delivered_date: string | null;
  delivered_to: string | null;
  destination: string;
  edd: string | null;
  origin: string;
  consignee_name: string;
  pickup_date: string;
}

export default function TrackOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const awbFromUrl = searchParams.get('awb');
  
  const [tracking, setTracking] = useState<{
    data: TrackingData | null;
    activities: TrackingActivity[];
  }>({ data: null, activities: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [awbInput, setAwbInput] = useState(awbFromUrl || '');

  // Auto-track if AWB is in URL
  useEffect(() => {
    if (awbFromUrl) {
      trackOrder(awbFromUrl);
    }
  }, [awbFromUrl]);

  const trackOrder = async (awbCode: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/shiprocket/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ awb_code: awbCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to track order');
      }

      if (result.success && result.data.tracking_data) {
        const trackData = result.data.tracking_data;
        setTracking({
          data: trackData.shipment_track?.[0] || null,
          activities: trackData.shipment_track_activities || [],
        });
      } else {
        throw new Error('No tracking information available');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (awbInput.trim()) {
      trackOrder(awbInput.trim());
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'text-green-600 bg-green-50';
    if (statusLower.includes('transit') || statusLower.includes('dispatch')) return 'text-blue-600 bg-blue-50';
    if (statusLower.includes('pickup') || statusLower.includes('picked')) return 'text-purple-600 bg-purple-50';
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return 'text-red-600 bg-red-50';
    return 'text-honey-600 bg-honey-50';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return '✅';
    if (statusLower.includes('transit') || statusLower.includes('dispatch')) return '🚚';
    if (statusLower.includes('pickup') || statusLower.includes('picked')) return '📦';
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return '❌';
    return '📍';
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-honey-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

        {/* AWB Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter AWB / Tracking Number
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={awbInput}
                  onChange={(e) => setAwbInput(e.target.value)}
                  placeholder="Enter your tracking number"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
                <Button type="submit" isLoading={loading}>
                  Track
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You can find your tracking number in the order confirmation email
              </p>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Tracking Information */}
        {tracking.data && (
          <div className="space-y-6">
            {/* Shipment Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Shipment Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    AWB: <span className="font-mono font-semibold">{tracking.data.awb_code}</span>
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(tracking.data.current_status)}`}>
                  {getStatusIcon(tracking.data.current_status)} {tracking.data.current_status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600">Courier</p>
                  <p className="font-semibold text-gray-900">{tracking.data.courier_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consignee</p>
                  <p className="font-semibold text-gray-900">{tracking.data.consignee_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-semibold text-gray-900">{tracking.data.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-semibold text-gray-900">{tracking.data.destination}</p>
                </div>
                {tracking.data.pickup_date && (
                  <div>
                    <p className="text-sm text-gray-600">Pickup Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(tracking.data.pickup_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {tracking.data.edd && (
                  <div>
                    <p className="text-sm text-gray-600">Expected Delivery</p>
                    <p className="font-semibold text-green-600">{tracking.data.edd}</p>
                  </div>
                )}
                {tracking.data.delivered_date && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Delivered On</p>
                    <p className="font-semibold text-green-600">
                      {new Date(tracking.data.delivered_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {tracking.data.delivered_to && ` to ${tracking.data.delivered_to}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Timeline */}
            {tracking.activities.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h2>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-6">
                    {tracking.activities.map((activity, index) => (
                      <div key={index} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)} border-4 border-white shadow`}>
                          <span className="text-sm">{getStatusIcon(activity.status)}</span>
                        </div>
                        
                        {/* Activity content */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{activity['sr-status-label']}</h3>
                            <span className="text-sm text-gray-500">
                              {new Date(activity.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{activity.activity}</p>
                          {activity.location && (
                            <p className="text-sm text-gray-500">📍 {activity.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!tracking.data && !error && !loading && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Shipment</h2>
            <p className="text-gray-600">
              Enter your AWB/tracking number above to see the live status of your order
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

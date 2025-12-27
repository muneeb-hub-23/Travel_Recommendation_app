import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import config from '../../config';
import { Bike, Car, Bus, Coins, Save, RefreshCw } from 'lucide-react';

const TravelRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const vehicleIcons = {
    motorbike: Bike,
    car: Car,
    bus: Bus
  };

  const vehicleLabels = {
    motorbike: 'Motorbike',
    car: 'Car',
    bus: 'Bus'
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/travel-rates/`);
      if (response.ok) {
        const data = await response.json();
        
        // Ensure all vehicle types are present
        const vehicleTypes = ['motorbike', 'car', 'bus'];
        const ratesMap = {};
        
        data.forEach(rate => {
          ratesMap[rate.vehicle_type] = rate;
        });
        
        const completeRates = vehicleTypes.map(type => ({
          vehicle_type: type,
          rate_per_km: ratesMap[type]?.rate_per_km || '0.00',
          id: ratesMap[type]?.id || null
        }));
        
        setRates(completeRates);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load travel rates',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (vehicleType, value) => {
    setRates(prevRates =>
      prevRates.map(rate =>
        rate.vehicle_type === vehicleType
          ? { ...rate, rate_per_km: value }
          : rate
      )
    );
  };

  const handleSaveRates = async () => {
    setSaving(true);
    try {
      const promises = rates.map(rate =>
        fetch(`${config.API_BASE_URL}/api/travel-rates/update/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicle_type: rate.vehicle_type,
            rate_per_km: parseFloat(rate.rate_per_km)
          })
        })
      );

      const responses = await Promise.all(promises);
      const allSuccess = responses.every(res => res.ok);

      if (allSuccess) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Travel rates updated successfully',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
        fetchRates();
      } else {
        throw new Error('Some rates failed to update');
      }
    } catch (error) {
      console.error('Error saving rates:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update travel rates',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Travel Rates</h1>
          <p className="text-slate-600 mt-1">Set travel prices per kilometer for different vehicles</p>
        </div>
        <button
          onClick={handleSaveRates}
          disabled={saving}
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>{saving ? 'Saving...' : 'Save All Rates'}</span>
        </button>
      </div>

      {/* Rates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rates.map((rate) => {
          const Icon = vehicleIcons[rate.vehicle_type];
          return (
            <motion.div
              key={rate.vehicle_type}
              whileHover={{ y: -4 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-black">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {vehicleLabels[rate.vehicle_type]}
                  </h3>
                  <p className="text-sm text-slate-600">Per kilometer rate</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Rate (PKR/km)
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={rate.rate_per_km}
                    onChange={(e) => handleRateChange(rate.vehicle_type, e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-black focus:border-transparent text-lg font-semibold"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-600">Example: 100 km</p>
                <p className="text-lg font-bold text-slate-800">
                  PKR {(parseFloat(rate.rate_per_km || 0) * 100).toFixed(2)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Coins className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Rate Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• These rates are used to calculate travel costs for trip planning</li>
              <li>• Rates are charged per kilometer traveled</li>
              <li>• Update rates regularly to reflect current market prices</li>
              <li>• All rates are in Pakistani Rupees (PKR)</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TravelRates;

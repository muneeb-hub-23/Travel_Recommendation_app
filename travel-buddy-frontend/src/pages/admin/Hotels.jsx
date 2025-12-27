import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import config from '../../config';
import { Hotel as HotelIcon, Plus, Search, Eye, Edit, Trash2, Star, MapPin } from 'lucide-react';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotelSearch, setHotelSearch] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchHotels();
    fetchDestinations();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/hotels/`);
      if (response.ok) {
        const data = await response.json();
        setHotels(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/destinations/`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/hotels/${hotelId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchHotels();
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Hotel has been deleted.',
            confirmButtonColor: '#10b981',
            timer: 2000
          });
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete hotel',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    hotel.destination_name?.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    hotel.address.toLowerCase().includes(hotelSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Hotels</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              Total: <span className="font-bold text-primary-600">{hotels.length}</span> hotels
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Hotel</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search hotels by name, destination, or address..."
              value={hotelSearch}
              onChange={(e) => setHotelSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className="text-center py-12">
            <HotelIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No hotels added yet</p>
            <button className="btn-primary">
              Add Your First Hotel
            </button>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No hotels found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="card p-4 hover:shadow-lg transition-shadow">
                {hotel.image && (
                  <img 
                    src={hotel.image.startsWith('http') ? hotel.image : `${config.API_BASE_URL}${hotel.image}`}
                    alt={hotel.name}
                    className="w-full h-48 object-cover mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                )}
                <div className="mb-3">
                  <h3 className="font-bold text-slate-800 mb-1">{hotel.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.destination_name || 'Unknown Destination'}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-black fill-black" />
                    <span className="text-sm font-medium">{hotel.rating || '0.0'}</span>
                  </div>
                  <span className="text-sm text-slate-600">{hotel.total_rooms || 0} rooms</span>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{hotel.description}</p>

                <div className="text-sm font-semibold text-primary-600 mb-4">
                  From PKR {hotel.price_single || 'N/A'}/night
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedHotel(hotel)}
                    className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button
                    className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteHotel(hotel.id)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Hotels;

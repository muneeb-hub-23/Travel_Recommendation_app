import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import config from '../../config';
import { Hotel as HotelIcon, Plus, Search, Eye, Edit, Trash2, Star, MapPin, X, Phone, Mail, Globe, Clock, DollarSign } from 'lucide-react';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotelSearch, setHotelSearch] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleViewHotel = (hotel) => {
    setSelectedHotel(hotel);
    setShowViewModal(true);
  };

  const handleEditHotel = (hotel) => {
    setSelectedHotel(hotel);
    setShowEditModal(true);
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get('name'),
      description: formData.get('description'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      website: formData.get('website'),
      price_single: formData.get('price_single'),
      price_couple: formData.get('price_couple'),
      price_executive: formData.get('price_executive'),
      price_family: formData.get('price_family'),
      rating: formData.get('rating'),
      total_rooms: formData.get('total_rooms'),
      amenities: formData.get('amenities') ? formData.get('amenities').split(',').map(a => a.trim()) : []
    };

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/hotels/${selectedHotel.id}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        await fetchHotels();
        setShowEditModal(false);
        setSelectedHotel(null);
        
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Hotel updated successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to update hotel',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update hotel: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
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
                    onClick={() => handleViewHotel(hotel)}
                    className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button
                    onClick={() => handleEditHotel(hotel)}
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

      {/* View Hotel Modal */}
      {showViewModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Hotel Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-slate-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {selectedHotel.image_main && (
                <img 
                  src={selectedHotel.image_main.startsWith('http') ? selectedHotel.image_main : `${config.API_BASE_URL}${selectedHotel.image_main}`}
                  alt={selectedHotel.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                  }}
                />
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{selectedHotel.name}</h3>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedHotel.destination_name || 'Unknown Destination'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-black fill-black" />
                      <span className="font-medium">{selectedHotel.rating || '0.0'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedHotel.description || 'No description available'}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    {selectedHotel.address && (
                      <div className="flex items-center space-x-2 text-slate-600">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedHotel.address}</span>
                      </div>
                    )}
                    {selectedHotel.phone && (
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Phone className="h-4 w-4" />
                        <span>{selectedHotel.phone}</span>
                      </div>
                    )}
                    {selectedHotel.email && (
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Mail className="h-4 w-4" />
                        <span>{selectedHotel.email}</span>
                      </div>
                    )}
                    {selectedHotel.website && (
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Globe className="h-4 w-4" />
                        <a href={selectedHotel.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {selectedHotel.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Room Prices (per night)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedHotel.price_single && (
                      <div className="bg-slate-50 p-3 rounded">
                        <p className="text-xs text-slate-600">Single</p>
                        <p className="text-lg font-bold text-slate-800">PKR {selectedHotel.price_single}</p>
                      </div>
                    )}
                    {selectedHotel.price_couple && (
                      <div className="bg-slate-50 p-3 rounded">
                        <p className="text-xs text-slate-600">Couple</p>
                        <p className="text-lg font-bold text-slate-800">PKR {selectedHotel.price_couple}</p>
                      </div>
                    )}
                    {selectedHotel.price_executive && (
                      <div className="bg-slate-50 p-3 rounded">
                        <p className="text-xs text-slate-600">Executive</p>
                        <p className="text-lg font-bold text-slate-800">PKR {selectedHotel.price_executive}</p>
                      </div>
                    )}
                    {selectedHotel.price_family && (
                      <div className="bg-slate-50 p-3 rounded">
                        <p className="text-xs text-slate-600">Family</p>
                        <p className="text-lg font-bold text-slate-800">PKR {selectedHotel.price_family}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Total Rooms</h4>
                    <p className="text-slate-600">{selectedHotel.total_rooms || 'N/A'}</p>
                  </div>
                  {selectedHotel.check_in_time && (
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Check-in Time</h4>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{selectedHotel.check_in_time}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-full btn-primary py-3"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hotel Modal */}
      {showEditModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Edit Hotel</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateHotel} className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hotel Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedHotel.name}
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    defaultValue={selectedHotel.rating}
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={selectedHotel.description}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={selectedHotel.address}
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={selectedHotel.phone}
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedHotel.email}
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    defaultValue={selectedHotel.website}
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Rooms</label>
                <input
                  type="number"
                  name="total_rooms"
                  min="0"
                  defaultValue={selectedHotel.total_rooms}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">Room Prices (PKR per night)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Single</label>
                    <input
                      type="number"
                      name="price_single"
                      min="0"
                      defaultValue={selectedHotel.price_single}
                      className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Couple</label>
                    <input
                      type="number"
                      name="price_couple"
                      min="0"
                      defaultValue={selectedHotel.price_couple}
                      className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Executive</label>
                    <input
                      type="number"
                      name="price_executive"
                      min="0"
                      defaultValue={selectedHotel.price_executive}
                      className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Family</label>
                    <input
                      type="number"
                      name="price_family"
                      min="0"
                      defaultValue={selectedHotel.price_family}
                      className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amenities (comma-separated)</label>
                <input
                  type="text"
                  name="amenities"
                  defaultValue={selectedHotel.amenities ? selectedHotel.amenities.join(', ') : ''}
                  placeholder="WiFi, Pool, Gym, Restaurant"
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="submit" className="flex-1 btn-primary py-3">
                  <Edit className="h-5 w-5 inline mr-2" />
                  Update Hotel
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Hotels;

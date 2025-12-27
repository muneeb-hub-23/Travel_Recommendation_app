import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import config from '../../config';
import { MapPin, Plus, Search, Eye, Edit, Trash2, Star, X } from 'lucide-react';
import AddDestinationForm from '../../components/AddDestinationForm';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [destinationSearch, setDestinationSearch] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/destinations/`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    }
  };

  const handleViewDestination = (dest) => {
    setSelectedDestination(dest);
    setShowViewModal(true);
  };

  const handleEditDestination = (dest) => {
    setSelectedDestination(dest);
    setShowEditModal(true);
  };

  const handleUpdateDestination = async (formData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/destinations/${selectedDestination.id}/`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        await fetchDestinations();
        setShowEditModal(false);
        setSelectedDestination(null);
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Destination updated successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error updating destination: ' + JSON.stringify(error),
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to update destination: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDeleteDestination = async (destId) => {
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
        const response = await fetch(`${config.API_BASE_URL}/api/destinations/${destId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchDestinations();
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Destination has been deleted.',
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
          text: 'Failed to delete destination',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleAddDestination = async (formData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/destinations/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchDestinations();
        setShowAddDestination(false);
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Destination added successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error adding destination: ' + JSON.stringify(error),
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to add destination: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    dest.country.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    dest.category.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Destinations</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              Total: <span className="font-bold text-primary-600">{destinations.length}</span> destinations
            </div>
            <button 
              onClick={() => setShowAddDestination(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Destination</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations by name, country, or category..."
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No destinations added yet</p>
            <button 
              onClick={() => setShowAddDestination(true)}
              className="btn-primary"
            >
              Add Your First Destination
            </button>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No destinations found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div key={dest.id} className="card p-4 hover:shadow-lg transition-shadow">
                {dest.image && (
                  <img 
                    src={dest.image.startsWith('http') ? dest.image : `${config.API_BASE_URL}${dest.image}`}
                    alt={dest.name}
                    className="w-full h-48 object-cover mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">{dest.name}</h3>
                    <p className="text-sm text-slate-600">{dest.country}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-black fill-black" />
                    <span className="text-sm font-medium">{dest.rating || '0.0'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">{dest.category}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{dest.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDestination(dest)}
                    className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">View</span>
                  </button>
                  <button
                    onClick={() => handleEditDestination(dest)}
                    className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteDestination(dest.id)}
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

      {/* Add Destination Modal */}
      {showAddDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Add New Destination</h2>
              <button onClick={() => setShowAddDestination(false)} className="p-2 hover:bg-slate-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <AddDestinationForm
                onSubmit={handleAddDestination}
                onCancel={() => setShowAddDestination(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Destination Modal */}
      {showEditModal && selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Edit Destination</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <AddDestinationForm
                destination={selectedDestination}
                onSubmit={handleUpdateDestination}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Destinations;

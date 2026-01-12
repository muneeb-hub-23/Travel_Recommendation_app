import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Eye, Trash2, Search, Filter } from 'lucide-react';
import config from '../../config';

const Reviews = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_BASE_URL}/api/reviews/`);
        if (response.ok) {
          const data = await response.json();
          console.log('Reviews API response:', data);
          
          // Handle both array and paginated response
          const reviewsArray = Array.isArray(data) ? data : (data.results || []);
          
          // Transform data to match component structure
          const transformedReviews = reviewsArray.map(review => ({
            id: review.id,
            user: review.user_name || 'Anonymous',
            destination: review.destination_name || 'Unknown',
            rating: review.rating,
            comment: review.comment,
            date: formatDate(review.created_at),
            sentiment: getSentimentFromRating(review.rating)
          }));
          setAllReviews(transformedReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  // Determine sentiment based on rating
  const getSentimentFromRating = (rating) => {
    if (rating >= 4) return 'positive';
    if (rating >= 3) return 'neutral';
    return 'negative';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Reviews Management</h2>
        <p className="text-sm text-slate-600 mt-1">Manage and moderate user reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Reviews</p>
              <p className="text-2xl font-bold text-slate-800">{allReviews.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Positive</p>
              <p className="text-2xl font-bold text-green-600">
                {allReviews.filter(r => r.sentiment === 'positive').length}
              </p>
            </div>
            <ThumbsUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Neutral</p>
              <p className="text-2xl font-bold text-yellow-600">
                {allReviews.filter(r => r.sentiment === 'neutral').length}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Negative</p>
              <p className="text-2xl font-bold text-red-600">
                {allReviews.filter(r => r.sentiment === 'negative').length}
              </p>
            </div>
            <ThumbsDown className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        {/* Search and Filter */}
        <div className="mb-6 flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-3 border border-slate-300 hover:bg-slate-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : allReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">No reviews yet</p>
            <p className="text-slate-500 text-sm">Reviews will appear here once users submit them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allReviews
              .filter(review => 
                review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.comment.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((review) => (
            <div key={review.id} className="border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-black flex items-center justify-center">
                    <span className="text-white font-semibold">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{review.user}</p>
                    <p className="text-sm text-slate-500">{review.destination}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs font-medium flex items-center space-x-1 ${getSentimentColor(review.sentiment)}`}>
                    {getSentimentIcon(review.sentiment)}
                    <span className="capitalize">{review.sentiment}</span>
                  </span>
                  <div className="flex items-center space-x-1 bg-black text-white px-2 py-1">
                    <Star className="h-3 w-3 fill-white" />
                    <span className="text-sm font-semibold">{review.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 mb-3">{review.comment}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{review.date}</span>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-slate-100 transition-colors">
                    <Eye className="h-4 w-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reviews;

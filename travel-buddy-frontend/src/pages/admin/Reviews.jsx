import { motion } from 'framer-motion';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Eye, Trash2, Search, Filter } from 'lucide-react';

const Reviews = () => {
  const allReviews = [
    { id: 1, user: 'Ahmad Khan', destination: 'Hunza Valley', rating: 5, comment: 'Absolutely stunning! The views were breathtaking and the local hospitality was amazing.', date: '2 hours ago', sentiment: 'positive' },
    { id: 2, user: 'Sara Ali', destination: 'Murree Hills', rating: 4, comment: 'Great place for a family trip. Weather was pleasant and food was delicious.', date: '5 hours ago', sentiment: 'positive' },
    { id: 3, user: 'Hassan Ahmed', destination: 'Swat Valley', rating: 5, comment: 'Paradise on earth! Must visit for nature lovers.', date: '1 day ago', sentiment: 'positive' },
    { id: 4, user: 'Fatima Raza', destination: 'Naran Kaghan', rating: 3, comment: 'Beautiful scenery but roads need improvement.', date: '2 days ago', sentiment: 'neutral' },
    { id: 5, user: 'Zain Malik', destination: 'Fairy Meadows', rating: 5, comment: 'One of the best experiences of my life. Highly recommended!', date: '3 days ago', sentiment: 'positive' },
    { id: 6, user: 'Ayesha Iqbal', destination: 'Skardu', rating: 4, comment: 'Amazing lakes and mountains. Perfect for photography.', date: '4 days ago', sentiment: 'positive' },
    { id: 7, user: 'Usman Khan', destination: 'Neelum Valley', rating: 5, comment: 'Crystal clear river and lush green forests. Simply magical!', date: '5 days ago', sentiment: 'positive' },
    { id: 8, user: 'Maria Ahmed', destination: 'Chitral', rating: 2, comment: 'Expected more facilities. The natural beauty is there but infrastructure is lacking.', date: '6 days ago', sentiment: 'negative' },
  ];

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
              className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-3 border border-slate-300 hover:bg-slate-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {allReviews.map((review) => (
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
      </div>
    </motion.div>
  );
};

export default Reviews;

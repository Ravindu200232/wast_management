// src/components/Feedback.jsx
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, ThumbsUp, ThumbsDown, ArrowLeft, Calendar, Package } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [formData, setFormData] = useState({
    rating: 0,
    punctuality_rating: 0,
    service_quality_rating: 0,
    comments: '',
    collection_id: ''
  });
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myFeedback, setMyFeedback] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
    fetchMyFeedback();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/collections/history`);
      setCollections(response.data.filter(collection => 
        !collection.feedback_given // Only show collections without feedback
      ));
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchMyFeedback = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/my-feedback`);
      setMyFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleRatingChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/feedback`, formData);
      setSubmitted(true);
      setFormData({
        rating: 0,
        punctuality_rating: 0,
        service_quality_rating: 0,
        comments: '',
        collection_id: ''
      });
      fetchCollections();
      fetchMyFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const RatingStars = ({ rating, onRatingChange, label, description }) => (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
      <label className="block text-sm font-medium text-gray-800 mb-3">{label}</label>
      <div className="flex justify-between mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-2 focus:outline-none active:scale-95 transition-transform"
          >
            <Star
              size={28}
              className={star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700">
          {rating === 0 ? 'Tap to rate' : `${rating} out of 5`}
        </div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ThumbsUp size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Your feedback has been submitted successfully. We appreciate your input 
            and will use it to improve our services.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-emerald-500 text-white py-4 px-6 rounded-2xl hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-200 active:scale-95"
            >
              Submit More Feedback
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors font-medium active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Service Feedback</h1>
            <p className="text-purple-100 text-sm">Share your collection experience</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Feedback Form */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Submit Feedback</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Collection Selection */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <label className="block text-sm font-medium text-gray-800 mb-3">
                Select Collection
              </label>
              <select
                name="collection_id"
                value={formData.collection_id}
                onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm"
                required
              >
                <option value="">Choose a collection...</option>
                {collections.map((collection) => (
                  <option key={collection.collection_id} value={collection.collection_id}>
                    {new Date(collection.collection_date).toLocaleDateString()} - {collection.waste_type} ({collection.weight}kg)
                  </option>
                ))}
              </select>
              {collections.length === 0 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  No collections available for feedback.
                </p>
              )}
            </div>

            {/* Ratings */}
            <div className="space-y-4">
              <RatingStars
                rating={formData.rating}
                onRatingChange={(value) => handleRatingChange('rating', value)}
                label="Overall Satisfaction"
                description="How was your overall experience?"
              />

              <RatingStars
                rating={formData.punctuality_rating}
                onRatingChange={(value) => handleRatingChange('punctuality_rating', value)}
                label="Punctuality"
                description="Was the collection on time?"
              />

              <RatingStars
                rating={formData.service_quality_rating}
                onRatingChange={(value) => handleRatingChange('service_quality_rating', value)}
                label="Service Quality"
                description="How was the team's service?"
              />
            </div>

            {/* Comments */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <label className="block text-sm font-medium text-gray-800 mb-3">
                Additional Comments
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={4}
                className="w-full px-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm resize-none"
                placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || collections.length === 0}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-medium text-sm shadow-lg shadow-emerald-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>

        {/* My Feedback History */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">My Feedback</h3>
          
          {myFeedback.length > 0 ? (
            <div className="space-y-3">
              {myFeedback.slice(0, 3).map((feedback) => (
                <div key={feedback.feedback_id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= feedback.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      feedback.status === 'reviewed' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {feedback.comments || 'No additional comments'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {new Date(feedback.feedback_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No feedback submitted yet</p>
            </div>
          )}
        </div>

        {/* Feedback Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl p-6">
          <h4 className="font-bold text-blue-800 mb-3 text-sm">💡 Feedback Tips</h4>
          <ul className="text-blue-700 text-xs space-y-2">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
              <span>Be specific about what you liked or didn't like</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
              <span>Mention the collection team if applicable</span>
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
              <span>Suggest improvements for better service</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
// src/components/Feedback.jsx
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';

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

  useEffect(() => {
    fetchCollections();
    fetchMyFeedback();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/collections/history');
      setCollections(response.data.filter(collection => 
        !collection.feedback_given // Only show collections without feedback
      ));
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchMyFeedback = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/feedback/my-feedback');
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
      await axios.post('http://localhost:3000/api/feedback', formData);
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

  const RatingStars = ({ rating, onRatingChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 focus:outline-none"
          >
            <Star
              size={24}
              className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-500">
        {rating === 0 ? 'Select rating' : `${rating} out of 5 stars`}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <ThumbsUp size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Thank You for Your Feedback!
          </h1>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your input 
            and will use it to improve our services.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Submit More Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Service Feedback</h1>
            <p className="text-gray-600">Share your experience with our waste collection service</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Submit Feedback</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Collection Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Collection
                </label>
                <select
                  name="collection_id"
                  value={formData.collection_id}
                  onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  <p className="text-sm text-gray-500 mt-2">
                    No collections available for feedback. Feedback can only be submitted for recent collections.
                  </p>
                )}
              </div>

              {/* Overall Rating */}
              <RatingStars
                rating={formData.rating}
                onRatingChange={(value) => handleRatingChange('rating', value)}
                label="Overall Satisfaction"
              />

              {/* Punctuality Rating */}
              <RatingStars
                rating={formData.punctuality_rating}
                onRatingChange={(value) => handleRatingChange('punctuality_rating', value)}
                label="Punctuality"
              />

              {/* Service Quality Rating */}
              <RatingStars
                rating={formData.service_quality_rating}
                onRatingChange={(value) => handleRatingChange('service_quality_rating', value)}
                label="Service Quality"
              />

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || collections.length === 0}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} className="mr-2" />
                {loading ? 'Submitting Feedback...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>

        {/* My Feedback History */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">My Feedback History</h3>
            
            {myFeedback.length > 0 ? (
              <div className="space-y-4">
                {myFeedback.slice(0, 5).map((feedback) => (
                  <div key={feedback.feedback_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        feedback.status === 'reviewed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {feedback.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {feedback.comments || 'No additional comments'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(feedback.feedback_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No feedback submitted yet</p>
              </div>
            )}
          </div>

          {/* Feedback Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Feedback Tips</h4>
            <ul className="text-blue-700 text-sm space-y-2">
              <li>• Be specific about what you liked or didn't like</li>
              <li>• Mention the collection team if applicable</li>
              <li>• Suggest improvements for better service</li>
              <li>• Report any issues promptly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
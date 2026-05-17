import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import GlassCard from '../../components/common/GlassCard';
import RatingStars from '../../components/common/RatingStars';
import GradientButton from '../../components/common/GradientButton';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ImageUploader from '../../components/common/ImageUploader';
import toast from 'react-hot-toast';

const ReviewsScreen = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const q = query(collection(db, 'reviews'), where('productId', '==', productId));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client side by date (newest first) assuming createdAt exists
      revs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setReviews(revs);
      setLoading(false);
    });

    return () => unsub();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim()) return;

    setSubmitting(true);
    const toastId = toast.loading('Submitting review...');
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        customerId: user?.uid,
        customerName: user?.name || 'Anonymous User',
        rating: newRating,
        comment: newComment,
        images: reviewImages,
        createdAt: serverTimestamp(),
      });
      setNewRating(0);
      setNewComment('');
      setReviewImages([]);
      toast.success('Review submitted successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-8"
    >
      <div className="bg-amber-500 pt-12 pb-6 px-6 rounded-b-3xl text-white shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-heading font-bold">Reviews & Ratings</h1>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Write Review Section */}
        <GlassCard className="mb-8 p-4">
          <h3 className="font-heading font-bold text-secondary dark:text-amber-50 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating:</span>
              <RatingStars rating={newRating} onChange={setNewRating} readOnly={false} size={24} />
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="How was the honey?"
              rows={3}
              className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm mb-4"
              required
            />
            <div className="mb-4">
              <label className="mb-1 text-xs font-medium text-secondary dark:text-amber-100 block">Add Photos (Optional)</label>
              <ImageUploader onImagesChange={setReviewImages} maxImages={3} folder="reviews" />
            </div>
            <GradientButton type="submit" disabled={submitting || newRating === 0 || !newComment.trim()} fullWidth>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </GradientButton>
          </form>
        </GlassCard>

        {/* Reviews List */}
        <h3 className="font-heading font-bold text-secondary dark:text-amber-50 mb-4">Recent Reviews</h3>
        
        {loading ? (
          <Loader fullScreen={false} />
        ) : reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <GlassCard key={review.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-secondary dark:text-amber-50 text-sm">{review.customerName}</span>
                  <RatingStars rating={review.rating} size={14} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                {review.createdAt && (
                  <p className="text-[10px] text-gray-400 mt-2 text-right">
                    {new Date(review.createdAt.toMillis()).toLocaleDateString()}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageSquare} title="No Reviews Yet" message="Be the first to review this honey!" />
        )}
      </div>
    </motion.div>
  );
};

export default ReviewsScreen;

import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../common/GlassCard';
import FreshnessBadge from './FreshnessBadge';
import RatingStars from '../common/RatingStars';
import { getOptimizedUrl } from '../../services/cloudinaryService';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/customer/product/${product.id}`}>
      <GlassCard animateHover={true} className="flex flex-col h-full overflow-hidden p-0 border-none group cursor-pointer">
        <div className="relative w-full aspect-square overflow-hidden bg-amber-50 dark:bg-black/20">
          <img
            src={getOptimizedUrl(product.images?.[0] || 'https://via.placeholder.com/300?text=Honey', { width: 400 })}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2">
            <FreshnessBadge freshness={product.freshness || 'Fresh'} />
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-heading font-semibold text-secondary dark:text-amber-50 line-clamp-1">
              {product.title}
            </h3>
            <span className="font-bold text-primary dark:text-accent whitespace-nowrap ml-2">
              ₹{product.price}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.floralSource}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1">
              <RatingStars rating={product.rating} size={14} />
              <span className="text-xs text-gray-400 ml-1">({product.reviewCount || 0})</span>
            </div>
            <span className="text-[10px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md">
              {product.quantity}kg
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
};

export default ProductCard;

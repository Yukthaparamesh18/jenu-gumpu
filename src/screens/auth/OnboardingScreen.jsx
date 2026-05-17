import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GradientButton from '../../components/common/GradientButton';
import useAuthStore from '../../store/authStore';

const slides = [
  {
    id: 1,
    title: 'Pure Wild Honey',
    description: 'Direct from tribal honey hunters to your home.',
    image: 'https://images.unsplash.com/photo-1587049352847-4d4b1ed7fa79?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 2,
    title: 'Empower Communities',
    description: 'Support local gatherers and preserve traditional practices.',
    image: 'https://images.unsplash.com/photo-1552526881-705cefaefa19?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 3,
    title: 'Certified Fresh',
    description: 'Track the origin and freshness of every jar you purchase.',
    image: 'https://images.unsplash.com/photo-1473445761358-18e9d6d1b72e?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const setFirstLaunchCompleted = useAuthStore((state) => state.setFirstLaunchCompleted);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setFirstLaunchCompleted();
    navigate('/role-select');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-8">
      <div className="flex-grow relative overflow-hidden flex flex-col pt-12">
        <div className="absolute top-4 right-4 z-10">
          <button onClick={handleComplete} className="text-gray-500 font-medium text-sm">
            Skip
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center flex-grow px-6"
          >
            <div className="w-full aspect-square max-w-sm rounded-3xl overflow-hidden shadow-2xl mb-8 relative">
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            <h2 className="text-3xl font-heading font-bold text-secondary dark:text-amber-400 mb-4 text-center">
              {slides[currentSlide].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center text-lg px-4">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 flex flex-col items-center">
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-amber-500' : 'w-2 bg-amber-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        
        <GradientButton fullWidth onClick={handleNext}>
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
        </GradientButton>
      </div>
    </div>
  );
};

export default OnboardingScreen;

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GALLERY_IMAGES = [
  {
    src: "/manus-storage/consultation-sofa_5d10909b.jpg",
    alt: "Adelaide Manta consulting a client",
    position: "center 30%"
  },
  {
    src: "/manus-storage/consultation-redsofa_7d10391a.jpg",
    alt: "Adelaide Manta in a consultation",
    position: "center 40%"
  },
  {
    src: "/manus-storage/working-desk_ebdc9f86.webp",
    alt: "Adelaide Manta at her desk",
    position: "center 35%"
  },
  {
    src: "/manus-storage/consultation-alps_42619a86.png",
    alt: "Adelaide Manta consulting in the Alps",
    position: "center 45%"
  },
  {
    src: "/manus-storage/consultation-cafe_26ad27a5.png",
    alt: "Adelaide Manta with a client",
    position: "center 30%"
  },
  {
    src: "/manus-storage/photo-zurich-terrace_2c3e9ead.jpg",
    alt: "Adelaide Manta in Zurich",
    position: "center 40%"
  },
  {
    src: "/manus-storage/photo-cafe-meeting_777984eb.jpg",
    alt: "Adelaide Manta with a client at a cafe",
    position: "center 35%"
  },
  {
    src: "/manus-storage/photo-outdoor-meeting_1333fbfb.jpg",
    alt: "Adelaide Manta meeting a client outdoors",
    position: "center 45%"
  },
  {
    src: "/manus-storage/photo-phone-call_ad4e596b.jpg",
    alt: "Adelaide Manta on a call",
    position: "center 40%"
  },
  {
    src: "/manus-storage/services-phone_5451249b.png",
    alt: "Adelaide Manta at work",
    position: "center 35%"
  },
];

export function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Autoplay effect
  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  const goToPrevious = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
  };

  const currentImage = GALLERY_IMAGES[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main carousel container */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-[#1a2744] flex items-center justify-center">
        {/* Image */}
        <div className="relative bg-[#1a2744] flex items-center justify-center">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="h-auto max-h-[600px] w-auto transition-opacity duration-500 ease-in-out"
          />
        </div>

        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-200 group"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-white group-hover:text-[#c9a84c] transition-colors" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-200 group"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-white group-hover:text-[#c9a84c] transition-colors" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-[#1a2744]/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm font-medium">
          {currentIndex + 1} / {GALLERY_IMAGES.length}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {GALLERY_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#c9a84c] w-8'
                : 'bg-white/30 hover:bg-white/50 w-2'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Autoplay indicator */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoplay(!isAutoplay)}
          className="text-white/60 hover:text-white text-xs font-medium transition-colors"
        >
          {isAutoplay ? '⏸ Autoplay ON' : '▶ Autoplay OFF'}
        </button>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * LazyImage component with IntersectionObserver for efficient image loading
 * Only loads images when they enter the viewport
 */
const LazyImage = ({ src, alt, caption, className = "", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const currentRef = imgRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once in view
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <figure className={`my-4 ${className}`} ref={imgRef}>
      <div className="rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shadow-sm shadow-slate-200/50 dark:shadow-slate-900/30 bg-gray-50 dark:bg-slate-900/50 p-2 relative">
        {!isInView && (
          // Placeholder while not in viewport
          <div className="w-full aspect-video bg-gray-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        )}
        {isInView && (
          <>
            {!hasError ? (
              <>
                <img
                  src={src}
                  alt={alt}
                  className={`w-full h-auto rounded-lg transition-opacity duration-300 relative z-10 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={handleLoad}
                  onError={handleError}
                  loading="lazy"
                  {...props}
                />
                {!isLoaded && (
                  <div className="w-full aspect-video bg-gray-200 dark:bg-slate-800 animate-pulse rounded-lg absolute inset-0 z-0" />
                )}
              </>
            ) : (
              <div className="w-full aspect-video bg-gray-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Failed to load image
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  caption: PropTypes.string,
  className: PropTypes.string,
};

export default LazyImage;


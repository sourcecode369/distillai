import React from "react";
import PropTypes from "prop-types";

const Image = ({ src, alt, caption }) => {
  return (
    <figure className="my-6">
      <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 shadow-xl bg-gray-100 dark:bg-slate-900 p-2">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-lg"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

export default Image;





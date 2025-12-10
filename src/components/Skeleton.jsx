import React from 'react';
import PropTypes from 'prop-types';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
};

export default Skeleton;

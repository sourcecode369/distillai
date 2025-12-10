import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * VirtualList component for efficient rendering of long lists
 * Only renders items visible in the viewport plus a small buffer
 */
const VirtualList = ({
  items,
  itemHeight = 80, // Estimated height of each item in pixels
  overscan = 5, // Number of items to render outside viewport
  renderItem,
  containerClassName = "",
  containerStyle = {},
  onScroll,
  getItemKey = (item, index) => index,
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!containerHeight || items.length === 0) {
      return { start: 0, end: 0 };
    }

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { start, end };
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      key: getItemKey(item, visibleRange.start + index),
    }));
  }, [items, visibleRange, getItemKey]);

  // Total height of all items
  const totalHeight = items.length * itemHeight;

  // Offset for visible items
  const offsetY = visibleRange.start * itemHeight;

  // Handle scroll
  const handleScroll = (e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    if (onScroll) {
      onScroll(e);
    }
  };

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${containerClassName}`}
      style={containerStyle}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map(({ item, index, key }) => (
            <div key={key} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

VirtualList.propTypes = {
  items: PropTypes.array.isRequired,
  itemHeight: PropTypes.number,
  overscan: PropTypes.number,
  renderItem: PropTypes.func.isRequired,
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  onScroll: PropTypes.func,
  getItemKey: PropTypes.func,
};

export default VirtualList;





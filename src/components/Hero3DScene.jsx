import React, { useState, useEffect, useMemo, useRef } from "react";

/**
 * Premium Interactive Background (SVG/CSS)
 * Replaces R3F version due to React 19 compatibility issues.
 * Features:
 * - Dynamic Neural Network Mesh
 * - Mouse Parallax & Repulsion
 * - Twinkle & Pulse Effects
 */
const Hero3DScene = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeConnections, setActiveConnections] = useState([]);
  const [connectionKey, setConnectionKey] = useState(0);
  const containerRef = useRef(null);

  // Mouse interaction refs
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const requestRef = useRef();

  useEffect(() => {
    const checkDarkMode = () => {
      try {
        if (typeof window === 'undefined' || !document) return;
        const isDark = document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(isDark);
      } catch (e) { /* Silently fail */ }
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    if (document.documentElement) {
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }
    return () => observer.disconnect();
  }, []);

  // Generate nodes
  const nodes = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: (i * 0.25) % 6,
    duration: 6 + (i % 6) * 1.2,
    size: 8 + (i % 5) * 6, // Slightly smaller for cleaner look
    left: 5 + (i * 17) % 90,
    top: 10 + (i * 23) % 80,
    colorIndex: i % 3,
    parallaxFactor: 0.5 + Math.random(), // Random depth effect
  })), []);

  const colors = {
    purple: '167, 139, 250',
    indigo: '99, 102, 241',
    pink: '236, 72, 153',
  };
  const colorValues = [colors.purple, colors.indigo, colors.pink];

  // Dynamic connections
  useEffect(() => {
    const generateConnections = () => {
      const conns = [];
      const maxDistance = 25;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = Math.abs(nodes[i].left - nodes[j].left);
          const dy = Math.abs(nodes[i].top - nodes[j].top);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance && Math.random() > 0.7) {
            conns.push({
              id: `conn-${i}-${j}`,
              from: i,
              to: j,
              opacity: Math.max(0.1, 0.4 - (distance / maxDistance) * 0.3),
              colorIndex: nodes[i].colorIndex,
            });
          }
        }
      }
      return conns;
    };

    setActiveConnections(generateConnections());
    const interval = setInterval(() => {
      setActiveConnections(generateConnections());
      setConnectionKey(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [nodes]);

  // Mouse animation loop
  useEffect(() => {
    const handleMouseMove = (e) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const animate = () => {
      // Smooth lerp
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', mouseRef.current.x);
        containerRef.current.style.setProperty('--mouse-y', mouseRef.current.y);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Background Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? `radial-gradient(ellipse 1000px 800px at 20% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 60%), 
               radial-gradient(ellipse 900px 700px at 80% 70%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)`
            : `radial-gradient(ellipse 1000px 800px at 20% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 60%), 
               radial-gradient(ellipse 900px 700px at 80% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)`,
          animation: "background-shift 18s ease-in-out infinite",
        }}
      />

      {/* Nodes & Connections with Parallax */}
      <div className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          transform: 'translate(calc((var(--mouse-x) - 0.5) * -20px), calc((var(--mouse-y) - 0.5) * -20px))'
        }}>

        <svg className="absolute inset-0 w-full h-full preserve-3d">
          {activeConnections.map((conn, idx) => {
            const from = nodes[conn.from];
            const to = nodes[conn.to];
            return (
              <line
                key={`${conn.id}-${connectionKey}`}
                x1={`${from.left}%`} y1={`${from.top}%`}
                x2={`${to.left}%`} y2={`${to.top}%`}
                stroke={`rgba(${colorValues[conn.colorIndex]}, ${conn.opacity})`}
                strokeWidth={isDarkMode ? 2 : 1.5}
                style={{
                  transition: 'all 1s ease-in-out',
                  animation: `pulse-line ${3 + (idx % 3)}s ease-in-out infinite`
                }}
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute rounded-full"
            style={{
              width: `${node.size}px`,
              height: `${node.size}px`,
              left: `${node.left}%`,
              top: `${node.top}%`,
              background: `radial-gradient(circle, rgba(${colorValues[node.colorIndex]}, 0.8) 0%, transparent 70%)`,
              boxShadow: `0 0 ${node.size * 2}px rgba(${colorValues[node.colorIndex]}, 0.4)`,
              transform: `translate(
                calc((var(--mouse-x) - 0.5) * ${node.parallaxFactor * 40}px), 
                calc((var(--mouse-y) - 0.5) * ${node.parallaxFactor * 40}px)
              )`,
              transition: 'transform 0.1s ease-out',
              animation: `float ${node.duration}s ease-in-out infinite, twinkle ${3 + (node.id % 4)}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero3DScene;

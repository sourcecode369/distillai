import React, { useState, useEffect, useMemo } from "react";

/**
 * Premium CSS-only animated background with neural network aesthetic
 * DYNAMIC MESH - Connections randomly change over time
 */
const Hero3DSceneWrapper = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeConnections, setActiveConnections] = useState([]);
  const [connectionKey, setConnectionKey] = useState(0);

  useEffect(() => {
    const checkDarkMode = () => {
      try {
        if (typeof window === 'undefined' || !document) return;
        const isDark = document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(isDark);
      } catch (e) {
        // Silently fail
      }
    };

    const checkReducedMotion = () => {
      try {
        if (typeof window === 'undefined') return;
        setPrefersReducedMotion(
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
      } catch (e) {
        // Silently fail
      }
    };

    checkDarkMode();
    checkReducedMotion();

    // Observe dark mode changes
    try {
      const observer = new MutationObserver(checkDarkMode);
      if (document && document.documentElement) {
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }

      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkModeQuery.addEventListener("change", checkDarkMode);

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      motionQuery.addEventListener("change", checkReducedMotion);

      return () => {
        observer.disconnect();
        darkModeQuery.removeEventListener("change", checkDarkMode);
        motionQuery.removeEventListener("change", checkReducedMotion);
      };
    } catch (e) {
      // Silently fail
    }
  }, []);

  // Generate LARGE, BRIGHT animated nodes
  const nodes = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    delay: (i * 0.25) % 6,
    duration: 6 + (i % 6) * 1.2,
    size: 12 + (i % 5) * 6,
    left: 8 + (i * 5.8) % 84,
    top: 8 + (i * 6.7) % 84,
    colorIndex: i % 3,
  })), []);

  const colors = {
    purple: '167, 139, 250',
    indigo: '99, 102, 241',
    pink: '236, 72, 153',
  };

  const colorValues = [colors.purple, colors.indigo, colors.pink];

  // Update connections periodically for dynamic mesh
  useEffect(() => {
    if (prefersReducedMotion || !nodes.length) return;

    const generateConnections = () => {
      const conns = [];
      const maxDistance = 30;
      const connectionProbability = 0.35;

      const potentialConnections = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = Math.abs(nodes[i].left - nodes[j].left);
          const dy = Math.abs(nodes[i].top - nodes[j].top);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            potentialConnections.push({
              from: i,
              to: j,
              distance,
              colorIndex: nodes[i].colorIndex,
            });
          }
        }
      }

      const numConnections = Math.floor(potentialConnections.length * (0.4 + Math.random() * 0.2));
      const shuffled = [...potentialConnections].sort(() => Math.random() - 0.5);

      for (let i = 0; i < Math.min(numConnections, shuffled.length); i++) {
        const conn = shuffled[i];
        if (Math.random() > (1 - connectionProbability)) {
          conns.push({
            ...conn,
            opacity: Math.max(0.2, 0.5 - (conn.distance / maxDistance) * 0.3),
            id: `conn-${conn.from}-${conn.to}`,
          });
        }
      }

      return conns;
    };

    // Generate initial connections
    setActiveConnections(generateConnections());

    // Update connections every 3-5 seconds for dynamic effect
    const interval = setInterval(() => {
      setActiveConnections(generateConnections());
      setConnectionKey(prev => prev + 1); // Force re-render with transitions
    }, 3000 + Math.random() * 2000); // 3-5 seconds

    return () => clearInterval(interval);
  }, [prefersReducedMotion, nodes]);

  // Static version for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: isDarkMode
            ? "radial-gradient(ellipse at 50% 50%, rgba(167, 139, 250, 0.2) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(167, 139, 250, 0.15) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)",
        }}
      />
    );
  }

  return (
    <>
      {/* Desktop/Tablet: Full animated background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block"
        style={{ zIndex: 0 }}
      >
        {/* Large animated gradient orbs */}
        <div
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? `radial-gradient(ellipse 1000px 800px at 20% 30%, rgba(236, 72, 153, 0.4) 0%, rgba(236, 72, 153, 0.1) 30%, transparent 60%), 
                 radial-gradient(ellipse 900px 700px at 80% 70%, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0.1) 30%, transparent 60%),
                 radial-gradient(ellipse 1200px 900px at 50% 50%, rgba(167, 139, 250, 0.3) 0%, rgba(167, 139, 250, 0.1) 35%, transparent 65%)`
              : `radial-gradient(ellipse 1000px 800px at 20% 30%, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0.08) 30%, transparent 60%), 
                 radial-gradient(ellipse 900px 700px at 80% 70%, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.08) 30%, transparent 60%),
                 radial-gradient(ellipse 1200px 900px at 50% 50%, rgba(167, 139, 250, 0.18) 0%, rgba(167, 139, 250, 0.08) 35%, transparent 65%)`,
            animation: "background-shift 18s ease-in-out infinite",
          }}
        />

        {/* Dynamic Neural Network Mesh - SVG Lines with random connections */}
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ zIndex: 1 }}
          key={connectionKey}
        >
          <defs>
            {/* Glow filter for lines */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {activeConnections.map((conn, idx) => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];

            return (
              <line
                key={`${conn.id}-${connectionKey}`}
                x1={`${fromNode.left}%`}
                y1={`${fromNode.top}%`}
                x2={`${toNode.left}%`}
                y2={`${toNode.top}%`}
                stroke={`rgba(${colorValues[conn.colorIndex]}, ${conn.opacity})`}
                strokeWidth={isDarkMode ? "2" : "1.5"}
                strokeLinecap="round"
                style={{
                  filter: "url(#glow)",
                  opacity: conn.opacity,
                  animation: `pulse-line ${3 + (idx % 3)}s ease-in-out infinite, fade-in-line 1s ease-in`,
                  animationDelay: `${idx * 0.05}s`,
                  transition: 'opacity 1s ease-in-out',
                }}
              />
            );
          })}
        </svg>

        {/* Floating neural network nodes */}
        {nodes.map((node) => {
          const glowSize = node.size * 5;
          const nodeOpacity = 1.0;
          const glowOpacity1 = isDarkMode ? 1.0 : 0.85;
          const glowOpacity2 = isDarkMode ? 0.8 : 0.6;
          const glowOpacity3 = isDarkMode ? 0.6 : 0.4;
          const glowOpacity4 = isDarkMode ? 0.4 : 0.25;

          return (
            <div
              key={node.id}
              className="absolute rounded-full"
              style={{
                width: `${node.size}px`,
                height: `${node.size}px`,
                left: `${node.left}%`,
                top: `${node.top}%`,
                background: `radial-gradient(circle, rgba(${colorValues[node.colorIndex]}, ${nodeOpacity}) 0%, rgba(${colorValues[node.colorIndex]}, ${nodeOpacity * 0.9}) 40%, rgba(${colorValues[node.colorIndex]}, 0.5) 65%, transparent 100%)`,
                animation: `float ${node.duration}s ease-in-out infinite, twinkle ${4 + (node.id % 4)}s ease-in-out infinite`,
                animationDelay: `${node.delay}s`,
                boxShadow: `0 0 ${glowSize}px rgba(${colorValues[node.colorIndex]}, ${glowOpacity1}), 
                            0 0 ${glowSize * 1.5}px rgba(${colorValues[node.colorIndex]}, ${glowOpacity2}),
                            0 0 ${glowSize * 2.5}px rgba(${colorValues[node.colorIndex]}, ${glowOpacity3}),
                            0 0 ${glowSize * 3.5}px rgba(${colorValues[node.colorIndex]}, ${glowOpacity4})`,
                zIndex: 6,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}

        {/* Additional large pulsing orbs for depth */}
        {[0, 1, 2].map((i) => (
          <div
            key={`pulse-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 60}px`,
              height: `${80 + i * 60}px`,
              left: `${15 + i * 35}%`,
              top: `${25 + i * 25}%`,
              background: `radial-gradient(circle, rgba(${colorValues[i]}, ${isDarkMode ? 0.5 : 0.35}) 0%, rgba(${colorValues[i]}, ${isDarkMode ? 0.25 : 0.15}) 50%, transparent 80%)`,
              animation: `float ${12 + i * 4}s ease-in-out infinite`,
              animationDelay: `${i * 2.5}s`,
              filter: 'blur(25px)',
              opacity: isDarkMode ? 0.8 : 0.7,
              zIndex: 0,
            }}
          />
        ))}
      </div>

      {/* Mobile: Enhanced gradient */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none sm:hidden"
        style={{
          background: isDarkMode
            ? "radial-gradient(ellipse at 50% 50%, rgba(167, 139, 250, 0.2) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(167, 139, 250, 0.15) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)",
        }}
      />

      {/* Add CSS animations for pulsing and fading lines */}
      <style>{`
        @keyframes pulse-line {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes fade-in-line {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Hero3DSceneWrapper;

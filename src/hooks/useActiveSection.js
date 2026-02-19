import { useState, useEffect } from "react";

export const useActiveSection = (topic) => {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!topic) return;

    const handleScroll = () => {
      const sections = [
        { id: "overview", element: document.getElementById("overview") },
        ...((topic.video || topic.content?.video) ? [{ id: "video", element: document.getElementById("video") }] : []),
        ...topic.content.sections.map((_, i) => ({
          id: `section-${i}`,
          element: document.getElementById(`section-${i}`),
        })),
        { id: "resources", element: document.getElementById("resources") },
      ].filter((s) => s.element);

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [topic]);

  return activeSection;
};


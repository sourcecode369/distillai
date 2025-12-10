import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TextRotator = ({
  words = ["Artificial Intelligence", "Machine Learning", "Data Science", "Neural Networks"],
  period = 2000,
  typingSpeed = 100,
  deletingSpeed = 50
}) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(typingSpeed);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, delta]);

  const tick = () => {
    let i = loopNum % words.length;
    let fullText = words[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(typingSpeed);
    } else {
      setDelta(typingSpeed); // Constant typing speed
    }
  };

  return (
    <span className="relative inline-block min-w-[300px] text-center">
      <span
        className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient pb-2 border-r-4 border-indigo-500 pr-1 animate-pulse"
      >
        {text}
      </span>
    </span>
  );
};

TextRotator.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string),
  period: PropTypes.number,
  typingSpeed: PropTypes.number,
  deletingSpeed: PropTypes.number,
};

export default TextRotator;

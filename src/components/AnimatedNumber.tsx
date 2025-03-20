
import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const controls = useAnimationControls();

  useEffect(() => {
    if (value !== displayValue) {
      controls.start({
        opacity: [1, 0.5, 1],
        y: [0, -10, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 0.5 }
      });
      setDisplayValue(value);
    }
  }, [value, displayValue, controls]);

  return (
    <motion.span
      animate={controls}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
};

export default AnimatedNumber;

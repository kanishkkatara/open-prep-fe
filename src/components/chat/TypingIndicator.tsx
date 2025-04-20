import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 p-3 max-w-fit bg-gray-100 rounded-lg rounded-tl-none">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            delay: dot * 0.2
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
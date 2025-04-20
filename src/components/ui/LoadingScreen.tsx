import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="bg-blue-600 p-4 rounded-full mb-6">
          <BookOpen size={40} className="text-white" />
        </div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          OpenPrep
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}  
          className="text-gray-600 mb-8"
        >
          Your AI-powered GMAT tutor
        </motion.p>
        
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.7 + index * 0.2,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 0.2,
              }}
              className="w-3 h-3 rounded-full bg-blue-600"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
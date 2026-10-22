import { motion } from 'framer-motion';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const Timeline = ({ events }) => {
  return (
    <div className="relative pl-8">
      {/* Vertical Line */}
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

      {events.map((event, index) => {
        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative mb-6 last:mb-0"
          >
            <div className="absolute -left-8 mt-1">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                {event.icon || <FiCheckCircle />}
              </div>
            </div>
            <div className="ml-2">
              <h4 className="font-semibold text-gray-800 dark:text-white">{event.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Timeline;

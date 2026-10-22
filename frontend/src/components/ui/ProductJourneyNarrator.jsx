import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiSquare, FiRepeat, FiVolumeX, FiVolume2, FiAlertCircle } from 'react-icons/fi';

// Utility function to generate natural English narration
const generateNarration = (product) => {
  const batch = product?.batch;
  const collection = product?.collection;
  const retail = product?.retail;

  if (!batch) return "Product data is currently unavailable.";

  const harvestDate = batch.harvestDate 
    ? new Date(batch.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : 'an unknown date';
  
  // FIX: Calculate Total Journey Days (Retail Date - Harvest Date) to match the UI
  let totalDays = 'an unknown number of';
  if (batch.harvestDate && retail?.arrivalDate) {
    const harvest = new Date(batch.harvestDate);
    const retailDate = new Date(retail.arrivalDate);
    const diffTime = Math.abs(retailDate - harvest);
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  let text = "Welcome. ";
  text += `This product is ${batch.cropName}. `;
  text += `The Product ID is ${batch.batchId}. `;
  text += `It was harvested by Farmer ${batch.farmerName || 'Unknown'} from ${batch.farmerLocation || 'Unknown'} on ${harvestDate}. `;

  if (collection) {
    const procDate = collection.processingDate 
      ? new Date(collection.processingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
      : 'an unknown date';
    text += `The product arrived at ${collection.collectionCenter?.name || 'the collection center'} on ${procDate}. `;
    text += `It remained there for ${collection.storageDays || 0} days and received a ${collection.qualityGrade} quality grade. `;
  }

  if (retail) {
    text += `The product was transported to ${retail.retailShopName} Retail and is currently available for purchase. `;
    if (retail.price) {
      text += `The selling price is ${retail.price} rupees. `;
    }
  }

  text += `The product has been in the supply chain for ${totalDays} days. `;
  text += "Thank you for choosing transparent agricultural products.";

  return text;
};

const ProductJourneyNarrator = ({ product }) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [statusText, setStatusText] = useState('Initializing...');
  const [autoPlayFailed, setAutoPlayFailed] = useState(false);

  const utteranceRef = useRef(null);
  const narrationText = useRef('');

  // Initialize voices and check support
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      setStatusText('Voice narration is not supported on this browser.');
      return;
    }

    narrationText.current = generateNarration(product);

    // Autoplay logic: Wait 2 seconds
    const timer = setTimeout(() => {
      handlePlay();
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [product]);

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer en-IN, fallback to any en-GB or en-US, then any English
    return voices.find(v => v.lang === 'en-IN') || 
           voices.find(v => v.lang.startsWith('en-GB')) || 
           voices.find(v => v.lang.startsWith('en-US')) || 
           voices.find(v => v.lang.startsWith('en'));
  };

  const handlePlay = useCallback(() => {
    window.speechSynthesis.cancel(); // Clear any existing speech

    const utterance = new SpeechSynthesisUtterance(narrationText.current);
    const voice = getVoice();
    
    if (voice) utterance.voice = voice;
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setAutoPlayFailed(false);
      setStatusText('Speaking...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setStatusText('Finished.');
    };

    utterance.onerror = (event) => {
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      setIsSpeaking(false);
      setStatusText('An error occurred. Tap Replay to try again.');
      if (event.error === 'not-allowed') {
        setAutoPlayFailed(true);
        setStatusText('Tap Play to hear the product journey.');
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    // Fallback if browser blocks autoplay and onstart doesn't fire immediately
    setTimeout(() => {
      if (!isSpeaking && !window.speechSynthesis.speaking) {
        setAutoPlayFailed(true);
        setStatusText('Tap Play to hear the product journey.');
      }
    }, 500);

  }, [isMuted, isSpeaking]);

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
      setStatusText('Paused...');
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      setStatusText('Speaking...');
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setStatusText('Stopped.');
  };

  const handleReplay = () => {
    handleStop();
    setTimeout(() => handlePlay(), 100);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
    // Note: Browser API doesn't allow dynamically changing volume of active utterance.
    // User will need to replay to apply mute state.
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex items-center text-red-600 dark:text-red-400 mt-4">
        <FiAlertCircle className="mr-2" />
        <span className="text-sm font-medium">{statusText}</span>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-slate-800/50 p-4 rounded-xl border border-blue-100 dark:border-slate-700 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* Animated Speaker Icon */}
          <div className={`relative mr-3 ${isSpeaking ? 'animate-pulse' : ''}`}>
            <FiVolume2 className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white text-sm">AI Product Journey</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{statusText}</p>
          </div>
        </div>

        {/* Animated Sound Wave */}
        <div className="flex items-end space-x-1 h-6">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              className="w-1 bg-blue-500 rounded-full"
              animate={isSpeaking ? { height: ["20%", "100%", "20%"] } : { height: "20%" }}
              transition={isSpeaking ? { duration: 0.8, repeat: Infinity, delay: bar * 0.1 } : {}}
            />
          ))}
        </div>
      </div>

      {autoPlayFailed && !isSpeaking && !isPaused && (
        <div className="mb-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
          Autoplay was blocked by browser. Tap Play to hear the product journey.
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {/* Play / Pause / Resume */}
        {!isSpeaking && !isPaused && (
          <button onClick={handlePlay} aria-label="Play Journey" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <FiPlay />
          </button>
        )}
        {isSpeaking && (
          <button onClick={handlePause} aria-label="Pause Narration" className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 transition">
            <FiPause />
          </button>
        )}
        {isPaused && (
          <button onClick={handleResume} aria-label="Resume Narration" className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <FiPlay />
          </button>
        )}

        {/* Stop */}
        <button 
          onClick={handleStop} 
          aria-label="Stop Narration" 
          disabled={!isSpeaking && !isPaused}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSquare />
        </button>

        {/* Replay */}
        <button 
          onClick={handleReplay} 
          aria-label="Replay Narration"
          className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 transition"
        >
          <FiRepeat />
        </button>

        {/* Mute / Unmute */}
        <button 
          onClick={handleToggleMute} 
          aria-label={isMuted ? "Unmute Narration" : "Mute Narration"}
          className={`p-2 rounded-lg transition ml-auto ${isMuted ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
        >
          {isMuted ? <FiVolumeX /> : <FiVolume2 />}
        </button>
      </div>
    </div>
  );
};

export default ProductJourneyNarrator;

import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = () => {
    
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const intervalRef = useRef(null);
  const initialTotalSecondsRef = useRef(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Handle the countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Update the time display whenever totalSeconds changes
  useEffect(() => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setTimeLeft({
      hours,
      minutes,
      seconds
    });
  }, [totalSeconds]);

  const handleStart = () => {
    if (totalSeconds === 0) {
      // If timer is at 0, set it from the input values
      const newTotalSeconds = 
        parseInt(inputTime.hours || 0) * 3600 + 
        parseInt(inputTime.minutes || 0) * 60 + 
        parseInt(inputTime.seconds || 0);
      
      if (newTotalSeconds > 0) {
        setTotalSeconds(newTotalSeconds);
        initialTotalSecondsRef.current = newTotalSeconds;
      } else {
        return; // Don't start if no time is set
      }
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setTimeLeft({
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  };

  const handleInputChange = (e, field) => {
    let value = parseInt(e.target.value) || 0;
    
    // Apply limits based on the time unit
    if (field === 'hours') {
      value = Math.min(99, Math.max(0, value));
    } else {
      value = Math.min(59, Math.max(0, value));
    }
    
    setInputTime({
      ...inputTime,
      [field]: value
    });
  };

  // Format time with leading zeros
  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };

  // Calculate progress percentage for the progress bar
  const progressPercentage = initialTotalSecondsRef.current > 0 
    ? (totalSeconds / initialTotalSecondsRef.current) * 100 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Countdown Timer</h1>
      
      {/* Timer Display */}
      <div className="text-6xl font-mono font-bold mb-6 bg-white p-6 rounded-xl shadow-md text-gray-800">
        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Time Input Fields */}
      <div className="grid grid-cols-3 gap-4 mb-6 w-full">
        <div className="flex flex-col items-center">
          <label className="mb-1 text-gray-600">Hours</label>
          <input
            type="number"
            min="0"
            max="99"
            value={inputTime.hours}
            onChange={(e) => handleInputChange(e, 'hours')}
            className="w-full p-2 border rounded text-center"
            disabled={isRunning}
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-gray-600">Minutes</label>
          <input
            type="number"
            min="0"
            max="59"
            value={inputTime.minutes}
            onChange={(e) => handleInputChange(e, 'minutes')}
            className="w-full p-2 border rounded text-center"
            disabled={isRunning}
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-gray-600">Seconds</label>
          <input
            type="number"
            min="0"
            max="59"
            value={inputTime.seconds}
            onChange={(e) => handleInputChange(e, 'seconds')}
            className="w-full p-2 border rounded text-center"
            disabled={isRunning}
          />
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`px-6 py-2 rounded-lg font-medium ${
            isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors`}
        >
          Start
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          className={`px-6 py-2 rounded-lg font-medium ${
            !isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white transition-colors`}
        >
          Pause
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CountdownTimer;
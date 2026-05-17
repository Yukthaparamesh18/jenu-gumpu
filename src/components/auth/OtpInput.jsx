import React, { useRef, useState, useEffect } from 'react';

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // allow only one character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // trigger onComplete if all filled
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 w-full max-w-xs mx-auto">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={data}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-xl font-bold bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-secondary dark:text-white transition-all backdrop-blur-sm"
        />
      ))}
    </div>
  );
};

export default OtpInput;

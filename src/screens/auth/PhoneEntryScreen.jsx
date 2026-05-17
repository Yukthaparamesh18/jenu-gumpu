import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  }
};

const sendOtp = async () => {
  try {
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      "+91" + phoneNumber,
      appVerifier
    );

    window.confirmationResult = confirmationResult;

    alert("OTP Sent!");
  } catch (error) {
    console.error(error);
  }
};import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
  } from "firebase/auth";

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  };

  const sendOtp = async () => {
    try {
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phoneNumber,
        appVerifier
      );

      window.confirmationResult = confirmationResult;

      alert("OTP Sent!");
    } catch (error) {
      console.error(error);
    }
  };import {
      RecaptchaVerifier,
      signInWithPhoneNumber,
    } from "firebase/auth";

    const setupRecaptcha = () => {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );
      }
    };

    const sendOtp = async () => {
      try {
        setupRecaptcha();

        const appVerifier = window.recaptchaVerifier;

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          "+91" + phoneNumber,
          appVerifier
        );

        window.confirmationResult = confirmationResult;

        alert("OTP Sent!");
      } catch (error) {
        console.error(error);
      }
    };
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 flex flex-col justify-center">
      <GlassCard className="p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
            <Phone size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-center text-secondary dark:text-amber-50 mb-2">
          Enter your mobile number
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
          We will send you an OTP to verify your account.
        </p>

        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="w-16 flex-shrink-0 flex items-center justify-center bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl font-bold text-secondary dark:text-amber-50 h-[50px] mt-6">
              +91
            </div>
            <div className="flex-grow">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="000 000 0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                error={error}
                required
              />
            </div>
          </div>
          
          <GradientButton type="submit" fullWidth disabled={isLoading || phoneNumber.length !== 10}>
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </GradientButton>
        </form>
      </GlassCard>
      
      {/* Invisible Recaptcha Container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneEntryScreen;

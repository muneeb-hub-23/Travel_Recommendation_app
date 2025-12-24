import emailjs from 'emailjs-com';

const SERVICE_ID = import.meta.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id';
const TEMPLATE_ID = import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id';
const PUBLIC_KEY = import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key';

export const sendOTPEmail = async (email, otpCode, userName = 'User') => {
  try {
    const templateParams = {
      to_email: email,
      to_name: userName,
      otp_code: otpCode,
      message: `Your OTP code is: ${otpCode}. This code will expire in 10 minutes.`
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

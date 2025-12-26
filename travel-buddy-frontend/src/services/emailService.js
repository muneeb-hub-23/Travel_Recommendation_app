import emailjs from 'emailjs-com';
import config from '../config.js';

const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = config.EMAILJS;

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

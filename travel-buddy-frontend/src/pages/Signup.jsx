import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Phone, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';
import { sendOTPEmail } from '../services/emailService';

const Signup = ({ onSignup }) => {
  const [step, setStep] = useState(1); // 1: signup form, 2: OTP verification
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match!'
      });
      return;
    }

    if (formData.password.length < 6) {
      await Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long!'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.signup(formData);
      setUserEmail(response.email);
      
      // Send OTP via EmailJS
      const emailResult = await sendOTPEmail(
        response.email,
        response.otp_code,
        formData.first_name || 'User'
      );

      if (emailResult.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: 'Please check your email for OTP verification code.',
          confirmButtonColor: '#3b82f6'
        });
        setStep(2); // Move to OTP verification
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Email Send Failed',
          text: `Your account was created but email failed to send. Your OTP: ${response.otp_code}`,
          confirmButtonColor: '#f59e0b'
        });
        setStep(2);
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid OTP',
        text: 'OTP must be 6 digits!'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verifyOTP(userEmail, otp);
      
      await Swal.fire({
        icon: 'success',
        title: 'Email Verified!',
        text: 'Your account has been verified successfully.',
        confirmButtonColor: '#10b981'
      });

      onSignup(response.user);
      navigate('/');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await authService.resendOTP(userEmail);
      
      // Send new OTP via EmailJS
      await sendOTPEmail(
        response.email,
        response.otp_code,
        formData.first_name || 'User'
      );

      await Swal.fire({
        icon: 'success',
        title: 'OTP Resent',
        text: 'A new OTP has been sent to your email.',
        confirmButtonColor: '#3b82f6'
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Resend Failed',
        text: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await authService.googleAuth(tokenResponse.access_token);
        
        await Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: response.is_new_user ? 'Account created successfully!' : 'Login successful!',
          timer: 1500,
          showConfirmButton: false
        });

        onSignup(response.user);
        navigate('/');
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Google Auth Failed',
          text: error.message
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Failed to authenticate with Google'
      });
    }
  });

  // OTP Verification Step
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
            <p className="text-slate-600">We sent a 6-digit code to</p>
            <p className="text-blue-600 font-medium">{userEmail}</p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Enter OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest bg-blue-50 border-0 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
              >
                Didn't receive code? Resend OTP
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-slate-600 hover:text-slate-900 font-medium text-sm"
            >
              ← Back to Signup
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Signup Form Step
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-600">Start your journey with us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full pl-12 pr-4 py-3 bg-blue-50 border-0 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Last Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full pl-12 pr-4 py-3 bg-blue-50 border-0 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-3 bg-blue-50 border-0 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="w-full pl-12 pr-4 py-3 bg-blue-50 border-0 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-blue-50 border-0 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-blue-50 border-0 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 mt-1 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500" required />
            <span className="text-sm text-slate-700">
              I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</Link>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or sign up with</span>
            </div>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full bg-white border border-slate-300 text-slate-700 py-3 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

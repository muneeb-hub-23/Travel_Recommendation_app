import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';
import { sendOTPEmail } from '../services/emailService';

const Login = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1: login form, 2: OTP verification
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      
      // Check if requires verification
      if (response.requires_verification) {
        // Send OTP via EmailJS
        const emailResult = await sendOTPEmail(
          response.email,
          response.otp_code,
          'User'
        );

        if (emailResult.success) {
          await Swal.fire({
            icon: 'warning',
            title: 'Email Verification Required',
            text: 'Please verify your email first. We sent you an OTP code.',
            confirmButtonColor: '#f59e0b'
          });
        } else {
          await Swal.fire({
            icon: 'warning',
            title: 'Email Verification Required',
            text: 'Please verify your email. Failed to send OTP email - try resending.',
            confirmButtonColor: '#f59e0b'
          });
        }
        setStep(2); // Move to OTP verification
      } else {
        // Login successful
        await Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'Login successful',
          timer: 1500,
          showConfirmButton: false
        });
        onLogin(response.user);
        navigate(returnTo);
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
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
      const response = await authService.verifyOTP(email, otp);
      
      await Swal.fire({
        icon: 'success',
        title: 'Email Verified!',
        text: 'Your account has been verified successfully.',
        confirmButtonColor: '#10b981'
      });

      onLogin(response.user);
      navigate(returnTo);
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
      const response = await authService.resendOTP(email);
      
      // Send new OTP via EmailJS
      await sendOTPEmail(response.email, response.otp_code, 'User');

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

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await authService.googleAuth(credentialResponse.credential);
      
      await Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Login successful!',
        timer: 1500,
        showConfirmButton: false
      });

      onLogin(response.user);
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
  };

  const handleGoogleError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Google Login Failed',
      text: 'Failed to authenticate with Google'
    });
  };

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
            <p className="text-blue-600 font-medium">{email}</p>
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
              ← Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Login Form Step
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h2>
          <p className="text-slate-600">Login to continue your travel journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@test.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500" />
              <span className="text-sm text-slate-700">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

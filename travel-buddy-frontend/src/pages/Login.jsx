import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { useGoogleLogin } from '@react-oauth/google';
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
            text: `Your OTP: ${response.otp_code}`,
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
        navigate('/');
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await authService.googleAuth(tokenResponse.access_token);
        
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

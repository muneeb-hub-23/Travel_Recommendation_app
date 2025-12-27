import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Phone, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { GoogleLogin } from '@react-oauth/google';
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
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/';

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
          text: 'Account created but failed to send verification email. Please contact support or try resending OTP.',
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await authService.googleAuth(credentialResponse.credential);
      
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
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              width="100%"
              text="signup_with"
            />
          </div>
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

import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationSystem';
import { 
  FileText,
  Sparkles, 
  Users, 
  BarChart3,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Award,
  TrendingUp,
  Zap,
  Globe,
  Lock,
  Activity,
  Brain,
  Target,
  Eye,
  EyeOff,
  Mail,
  Key,
  Heart,
  Menu,
  X
} from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import { AnimatedButton } from './MicroInteractions';
import { useAuth } from '../App';

export default function LandingPage() {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: 'john.doe@emrx.com',
    password: '12345678',
    confirmPassword: '',
    organizationName: '',
    fullName: ''
  });
  const { addNotification } = useNotifications();

  // Animated counter effect
  const [counters, setCounters] = useState({
    patients: 0,
    timeSaved: 0,
    compliance: 0,
    rating: 0
  });

  useEffect(() => {
    const targets = { patients: 50, timeSaved: 60, compliance: 99, rating: 4.9 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    const intervals = Object.keys(targets).map(key => {
      const target = targets[key as keyof typeof targets];
      const increment = target / steps;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervals.find(i => i === intervals[0]));
        }
        setCounters(prev => ({ ...prev, [key]: current }));
      }, stepTime);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const handleAuth = () => {
    // Authenticate the user
    const success = auth?.login({
      email: formData.email,
      password: formData.password
    });
    
    if (success) {
      // Redirect to dashboard immediately
      window.location.href = '/app/dashboard';
      return;
    }
    
    if (isLoginMode) {
      addNotification({
        type: 'success',
        title: 'Welcome Back!',
        message: 'Successfully logged into ezEMRx platform.',
        actions: [
          {
            label: 'Go to Dashboard',
            onClick: () => window.location.href = '/app/dashboard',
            variant: 'primary'
          }
        ]
      });
    }
  };

  const keyFeatures = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Documentation',
      description: 'Intelligent form filling reduces documentation time by 60% with 95% accuracy',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'HIPAA Compliant Security',
      description: 'Bank-level encryption and security protocols ensure patient data protection',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Advanced Analytics',
      description: 'Real-time insights and reporting improve patient outcomes by 40%',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Family Medicine',
      organization: 'Community Health Center',
      quote: 'ezEMRx transformed our workflow. The AI assistance is incredibly accurate.',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Maria Santos',
      role: 'WIC Program Director', 
      organization: 'Regional Health Dept',
      quote: 'Our compliance rates have never been higher. Game-changing platform.',
      rating: 5,
      avatar: 'MS'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ezEMRx
                </h1>
                <p className="text-xs text-gray-500 font-medium">Healthcare Reimagined</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#security" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Security</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
              <a href="#support" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Support</a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200/50 px-2">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
                <a href="#security" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Security</a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
                <a href="#support" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Support</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-20">
        <div className="px-6 py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">#1 AI-Powered EHR Platform</span>
              </div>

              {/* Main Headline */}
              <div>
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Healthcare
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block leading-tight py-1">
                    Reimagined
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Revolutionary AI-powered Electronic Health Record system for public health clinics. 
                  Streamline workflows, ensure compliance, and improve patient outcomes.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <span className="text-3xl font-bold text-gray-900">
                      {Math.round(counters.patients)}K+
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Patients Served</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="h-6 w-6 text-green-600" />
                    <span className="text-3xl font-bold text-gray-900">
                      {Math.round(counters.timeSaved)}%
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Time Saved</p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{counters.rating.toFixed(1)}/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Column - Login/Signup Form */}
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 relative z-10">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isLoginMode ? 'Welcome Back' : 'Get Started Today'}
                  </h3>
                  <p className="text-gray-600">
                    {isLoginMode ? 'Sign in to your ezEMRx account' : 'Create your ezEMRx account'}
                  </p>
                </div>

                {/* Form Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  <button
                    onClick={() => setIsLoginMode(true)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      isLoginMode 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLoginMode(false)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      !isLoginMode 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form Fields */}
                <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
                  {/* Sign In View */}
                  {isLoginMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors leading-relaxed"
                            placeholder="sarah.chen@clinic.org"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors leading-relaxed"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                          Forgot password?
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* Sign Up View */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors leading-relaxed"
                          placeholder="Dr. Sarah Chen"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                        <input
                          type="text"
                          value={formData.organizationName}
                          onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors leading-relaxed"
                          placeholder="Community Health Center"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors leading-relaxed"
                            placeholder="sarah.chen@clinic.org"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors leading-relaxed"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors leading-relaxed"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <AnimatedButton
                    variant="primary"
                    onClick={handleAuth}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    animation="glow"
                  >
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                  </AnimatedButton>
                </form>

                {/* Social Proof */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600 mb-4">
                    Trusted by 500+ healthcare organizations
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">4.9/5 rating</span>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-20 py-20 bg-white/50 backdrop-blur-sm">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Healthcare Professionals Choose ezEMRx
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed specifically for public health clinics and WIC programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-h-[280px]">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed line-height-[1.6]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-20 py-20">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Heroes
            </h2>
            <p className="text-xl text-gray-600">
              See what healthcare professionals are saying about ezEMRx
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg min-h-[240px]">
                <div className="flex items-center space-x-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{testimonial.role}</p>
                    <p className="text-gray-500 text-sm">{testimonial.organization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-gray-900 text-white py-16">
        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ezEMRx</h3>
                  <p className="text-gray-400 text-sm">Healthcare Reimagined</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionary AI-powered EHR platform for public health clinics.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-sm">
                © 2025 ezEMRx. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
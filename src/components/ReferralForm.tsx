import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { AnimatedButton } from './MicroInteractions';
import { 
  Search, 
  Sparkles, 
  User, 
  MapPin, 
  Phone, 
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Filter,
  Info
} from 'lucide-react';
import InteractiveInput from './InteractiveInput';
import InteractiveButton from './InteractiveButton';
import ResponsiveCard from './ResponsiveCard';

export default function ReferralForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [referralReason, setReferralReason] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Routine');
  const [isCreatingReferral, setIsCreatingReferral] = useState(false);
  const [showReferralSuccess, setShowReferralSuccess] = useState(false);
  const [createdReferral, setCreatedReferral] = useState<any>(null);
  const { addNotification } = useNotifications();

  const aiSuggestions = [
    {
      id: 1,
      type: 'Pediatric Endocrinologist',
      reason: 'Growth pattern analysis indicates need for specialist evaluation',
      confidence: 92,
      provider: 'Dr. Maria Rodriguez, MD',
      location: 'Children\'s Medical Center',
      distance: '2.3 miles',
      waitTime: '2-3 weeks',
      acceptsInsurance: true,
      rating: 4.8,
      source: 'Based on WHO growth charts and patient history'
    },
    {
      id: 2,
      type: 'Registered Dietitian',
      reason: 'Nutritional optimization for growth support',
      confidence: 87,
      provider: 'Sarah Johnson, RD',
      location: 'Community Health Center',
      distance: '1.5 miles',
      waitTime: '1-2 weeks',
      acceptsInsurance: true,
      rating: 4.9,
      source: 'WIC nutrition assessment results'
    },
    {
      id: 3,
      type: 'Developmental Pediatrician',
      reason: 'Milestone tracking and cognitive assessment',
      confidence: 73,
      provider: 'Dr. James Chen, MD',
      location: 'Regional Medical Plaza',
      distance: '4.1 miles',
      waitTime: '4-6 weeks',
      acceptsInsurance: true,
      rating: 4.7,
      source: 'Developmental screening results'
    }
  ];

  const searchResults = [
    {
      id: 4,
      provider: 'Dr. Lisa Park, MD',
      specialty: 'Pediatric Gastroenterology',
      location: 'University Medical Center',
      distance: '3.2 miles',
      waitTime: '3-4 weeks',
      acceptsInsurance: true,
      rating: 4.6,
      phone: '(555) 123-4567'
    },
    {
      id: 5,
      provider: 'Dr. Michael Brown, MD',
      specialty: 'Pediatric Cardiology',
      location: 'Heart Center for Children',
      distance: '5.8 miles',
      waitTime: '2-3 weeks',
      acceptsInsurance: true,
      rating: 4.8,
      phone: '(555) 987-6543'
    }
  ];

  const specialties = [
    'All Specialties',
    'Pediatric Endocrinologist',
    'Registered Dietitian',
    'Developmental Pediatrician',
    'Pediatric Gastroenterology',
    'Pediatric Cardiology',
    'Pediatric Neurology'
  ];

  const priorityOptions = ['Routine', 'Urgent', 'STAT'];
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const handleSelectProvider = (providerId: number) => {
    setSelectedProvider(providerId);
  };

  const handleCreateReferral = async () => {
    if (!selectedProvider || !referralReason.trim()) return;
    
    setIsCreatingReferral(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const referral = {
        id: Date.now(),
        patient: 'Sofia Martinez',
        provider: [...aiSuggestions, ...searchResults].find(p => p.id === selectedProvider),
        reason: referralReason,
        priority: priorityLevel,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      setCreatedReferral(referral);
      setShowReferralSuccess(true);
      
      // Reset form after showing success
      setSelectedProvider(null);
      setReferralReason('');
      setPriorityLevel('Routine');
    } catch (error) {
      console.error('Failed to create referral:', error);
    } finally {
      setIsCreatingReferral(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowReferralSuccess(false);
    setCreatedReferral(null);
  };

  const renderProviderCard = (provider: any, isAISuggestion: boolean = false) => (
    <ResponsiveCard
      key={provider.id}
      title={provider.provider}
      subtitle={isAISuggestion ? provider.type : provider.specialty}
      interactive
      onClick={() => handleSelectProvider(provider.id)}
      className={`transition-all duration-200 ${
        selectedProvider === provider.id 
          ? 'ring-2 ring-primary-500 bg-primary-50' 
          : ''
      }`}
      actions={
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">{provider.rating}</span>
        </div>
      }
    >
      {isAISuggestion && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">AI Recommended</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(provider.confidence)}`}>
              {provider.confidence}% match
            </span>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              title={`AI Source: ${provider.source}`}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {isAISuggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm font-medium text-blue-800 mb-1">Why this referral?</p>
          <p className="text-sm text-blue-700">{provider.reason}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-900">{provider.location}</p>
            <p className="text-xs text-gray-500">{provider.distance} away</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-900">Available in</p>
            <p className="text-xs text-gray-500">{provider.waitTime}</p>
          </div>
        </div>
      </div>

      {provider.phone && (
        <div className="flex items-center space-x-2 mb-4">
          <Phone className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-900">{provider.phone}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {provider.acceptsInsurance && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Insurance Accepted
            </span>
          )}
        </div>
        {selectedProvider === provider.id && (
          <ArrowRight className="h-5 w-5 text-primary-600" />
        )}
      </div>
    </ResponsiveCard>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI-Powered Referrals</h1>
        <p className="text-gray-600 mt-2">Find the right specialists for Sofia Martinez based on AI analysis and clinical guidelines.</p>
      </div>

      {/* Patient Info Banner */}
      <ResponsiveCard
        title="Sofia Martinez"
        subtitle="4 years 10 months • WIC Patient • Last visit: Jan 15, 2025"
        className="mb-6"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div className="text-sm text-gray-600">
            Patient ready for specialist referral based on recent assessment
          </div>
        </div>
      </ResponsiveCard>

      {/* Search and Filters */}
      <ResponsiveCard title="Search Providers" className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <InteractiveInput
              label=""
              type="search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search providers, specialties, or conditions..."
              options={specialties.slice(1)} // Exclude "All Specialties"
            />
          </div>
          <div className="flex space-x-3">
            <InteractiveInput
              label=""
              type="select"
              value={selectedSpecialty}
              onChange={setSelectedSpecialty}
              placeholder="All Specialties"
              options={specialties}
              className="min-w-48"
            />
            <InteractiveButton variant="secondary" icon={<Filter className="h-4 w-4" />}>
              More Filters
            </InteractiveButton>
          </div>
        </div>
      </ResponsiveCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {/* AI Suggestions */}
          {showAISuggestions && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
                  <span className="text-sm text-gray-500">Based on patient analysis</span>
                </div>
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAISuggestions(false)}
                >
                  Hide suggestions
                </InteractiveButton>
              </div>
              <div className="space-y-4">
                {aiSuggestions.map(suggestion => renderProviderCard(suggestion, true))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Available Providers'}
              </h2>
              <span className="text-sm text-gray-500">{searchResults.length} providers found</span>
            </div>
            <div className="space-y-4">
              {searchResults.map(provider => renderProviderCard(provider, false))}
            </div>
          </div>
        </div>

        {/* Referral Summary */}
        <ResponsiveCard 
          title="Referral Summary" 
          className="h-fit sticky top-6"
        >
          {selectedProvider ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Selected Provider:</p>
                <p className="text-sm text-gray-700">
                  {[...aiSuggestions, ...searchResults].find(p => p.id === selectedProvider)?.provider}
                </p>
              </div>

              <InteractiveInput
                label="Reason for Referral"
                type="textarea"
                value={referralReason}
                onChange={setReferralReason}
                placeholder="Enter clinical reason for referral..."
                required
                rows={4}
              />

              <InteractiveInput
                label="Priority Level"
                type="select"
                value={priorityLevel}
                onChange={setPriorityLevel}
                options={priorityOptions}
              />

              <div className="pt-4 border-t border-gray-200">
                <AnimatedButton
                  variant="primary"
                  fullWidth
                  onClick={handleCreateReferral}
                  disabled={!referralReason.trim()}
                  animation="pulse"
                >
                  {isCreatingReferral ? 'Creating Referral...' : 'Create Referral'}
                </AnimatedButton>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 mb-2">No provider selected</p>
              <p className="text-xs text-gray-400">Choose a provider to create a referral</p>
            </div>
          )}
        </ResponsiveCard>
      </div>

      {/* Success Modal */}
      {showReferralSuccess && createdReferral && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Referral Created Successfully</h3>
              <p className="text-sm text-gray-600 mb-4">
                Referral #{createdReferral.id} has been sent to {createdReferral.provider?.provider}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <div className="space-y-2 text-sm">
                  <div><strong>Patient:</strong> {createdReferral.patient}</div>
                  <div><strong>Provider:</strong> {createdReferral.provider?.provider}</div>
                  <div><strong>Priority:</strong> {createdReferral.priority}</div>
                  <div><strong>Status:</strong> Pending Review</div>
                </div>
              </div>
              <div className="flex space-x-3">
                <InteractiveButton variant="secondary" onClick={handleCloseSuccess} fullWidth>
                  Close
                </InteractiveButton>
                <InteractiveButton variant="primary" fullWidth>
                  View Referral
                </InteractiveButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
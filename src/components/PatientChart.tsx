import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  Heart,
  Thermometer,
  Weight,
  Ruler,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit3,
  Download,
  Share2,
  Plus,
  TrendingUp,
  Eye
} from 'lucide-react';
import ResponsiveCard from './ResponsiveCard';
import InteractiveButton from './InteractiveButton';
import InteractiveInput from './InteractiveInput';
import { GrowthChart } from './ChartComponents';

interface PatientChartProps {
  patientId: string;
  onClose: () => void;
}

export default function PatientChart({ patientId, onClose }: PatientChartProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddVitals, setShowAddVitals] = useState(false);

  const patient = {
    id: patientId,
    name: 'Sofia Martinez',
    dob: '2020-03-15',
    age: '4 years 10 months',
    mrn: 'WIC-789012',
    phone: '(555) 123-4567',
    address: '123 Main St, City, ST 12345',
    insurance: 'Medicaid',
    emergencyContact: 'Maria Martinez - (555) 123-4568',
    allergies: ['No known allergies'],
    medications: ['Multivitamin daily'],
    lastVisit: '2025-01-15',
    nextAppointment: '2025-04-15'
  };

  const vitals = [
    { date: '2025-01-15', height: '104 cm', weight: '16.2 kg', temp: '98.6°F', bp: '95/60', hr: '88', heightValue: 104, weightValue: 16.2 },
    { date: '2024-10-15', height: '102 cm', weight: '15.8 kg', temp: '98.4°F', bp: '92/58', hr: '90', heightValue: 102, weightValue: 15.8 },
    { date: '2024-07-15', height: '100 cm', weight: '15.2 kg', temp: '98.7°F', bp: '90/55', hr: '92', heightValue: 100, weightValue: 15.2 },
    { date: '2024-04-15', height: '98 cm', weight: '14.6 kg', temp: '98.5°F', bp: '88/52', hr: '94', heightValue: 98, weightValue: 14.6 }
  ];

  const growthData = {
    heightData: vitals.map(v => ({
      date: v.date,
      value: v.heightValue,
      percentile: 50 // Simplified for demo
    })),
    weightData: vitals.map(v => ({
      date: v.date,
      value: v.weightValue,
      percentile: 55 // Simplified for demo
    }))
  };

  const visits = [
    {
      date: '2025-01-15',
      type: 'WIC Nutrition Assessment',
      provider: 'Maria Santos, RN',
      diagnosis: 'Routine nutrition assessment',
      notes: 'Growth tracking normal, nutrition plan continued'
    },
    {
      date: '2024-10-15',
      type: 'Well Child Check',
      provider: 'Dr. Sarah Chen',
      diagnosis: 'Routine well child visit',
      notes: 'All developmental milestones met, immunizations up to date'
    }
  ];

  const immunizations = [
    { vaccine: 'MMR', date: '2024-03-15', nextDue: '2029-03-15', status: 'Complete' },
    { vaccine: 'DTaP', date: '2024-03-15', nextDue: '2029-03-15', status: 'Complete' },
    { vaccine: 'Polio', date: '2024-03-15', nextDue: '2029-03-15', status: 'Complete' },
    { vaccine: 'Varicella', date: '2024-03-15', nextDue: '2029-03-15', status: 'Complete' },
    { vaccine: 'Hepatitis A', date: '2024-06-15', nextDue: '2025-06-15', status: 'Due Soon' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'vitals', label: 'Vitals & Growth', icon: Activity },
    { id: 'visits', label: 'Visit History', icon: FileText },
    { id: 'immunizations', label: 'Immunizations', icon: Heart },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Due Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-primary-50">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>MRN: {patient.mrn}</span>
                <span>DOB: {patient.dob}</span>
                <span>Age: {patient.age}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <InteractiveButton variant="secondary" size="sm" icon={<Download className="h-4 w-4" />}>
              Export Chart
            </InteractiveButton>
            <InteractiveButton variant="secondary" size="sm" icon={<Share2 className="h-4 w-4" />}>
              Share
            </InteractiveButton>
            <InteractiveButton variant="ghost" onClick={onClose}>
              Close
            </InteractiveButton>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Demographics */}
              <ResponsiveCard title="Demographics" className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Insurance</p>
                    <p className="text-sm text-gray-900">{patient.insurance}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">{patient.address}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                    <p className="text-sm text-gray-900">{patient.emergencyContact}</p>
                  </div>
                </div>
              </ResponsiveCard>

              {/* Quick Stats */}
              <div className="space-y-4">
                <ResponsiveCard title="Quick Stats" size="sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Visit</span>
                      <span className="text-sm font-medium">{patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Appointment</span>
                      <span className="text-sm font-medium">{patient.nextAppointment}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Visits</span>
                      <span className="text-sm font-medium">{visits.length}</span>
                    </div>
                  </div>
                </ResponsiveCard>

                <ResponsiveCard title="Alerts" size="sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">Hepatitis A due soon</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">Growth tracking normal</span>
                    </div>
                  </div>
                </ResponsiveCard>
              </div>

              {/* Recent Vitals */}
              <ResponsiveCard title="Recent Vitals" className="lg:col-span-3">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Ruler className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="text-lg font-semibold text-gray-900">{vitals[0].height}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Weight className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-semibold text-gray-900">{vitals[0].weight}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Thermometer className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-lg font-semibold text-gray-900">{vitals[0].temp}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Heart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-semibold text-gray-900">{vitals[0].bp}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Activity className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-lg font-semibold text-gray-900">{vitals[0].hr}</p>
                  </div>
                </div>
              </ResponsiveCard>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Vitals & Growth Tracking</h2>
                <InteractiveButton 
                  variant="primary" 
                  onClick={() => setShowAddVitals(true)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Vitals
                </InteractiveButton>
              </div>

              <GrowthChart 
                heightData={growthData.heightData}
                weightData={growthData.weightData}
              />

              <ResponsiveCard title="Vitals History">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3">Date</th>
                        <th className="text-left py-3">Height</th>
                        <th className="text-left py-3">Weight</th>
                        <th className="text-left py-3">Temperature</th>
                        <th className="text-left py-3">Blood Pressure</th>
                        <th className="text-left py-3">Heart Rate</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vitals.map((vital, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3">{vital.date}</td>
                          <td className="py-3">{vital.height}</td>
                          <td className="py-3">{vital.weight}</td>
                          <td className="py-3">{vital.temp}</td>
                          <td className="py-3">{vital.bp}</td>
                          <td className="py-3">{vital.hr}</td>
                          <td className="py-3">
                            <InteractiveButton variant="ghost" size="sm" icon={<Edit3 className="h-3 w-3" />} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ResponsiveCard>
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Visit History</h2>
                <InteractiveButton variant="primary" icon={<Plus className="h-4 w-4" />}>
                  New Visit
                </InteractiveButton>
              </div>

              <div className="space-y-4">
                {visits.map((visit, index) => (
                  <ResponsiveCard key={index} title={visit.type} subtitle={`${visit.date} - ${visit.provider}`}>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                        <p className="text-sm text-gray-900">{visit.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Notes</p>
                        <p className="text-sm text-gray-900">{visit.notes}</p>
                      </div>
                      <div className="flex space-x-2">
                        <InteractiveButton variant="secondary" size="sm" icon={<Eye className="h-4 w-4" />}>
                          View Details
                        </InteractiveButton>
                        <InteractiveButton variant="ghost" size="sm" icon={<Edit3 className="h-4 w-4" />}>
                          Edit
                        </InteractiveButton>
                      </div>
                    </div>
                  </ResponsiveCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'immunizations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Immunization Record</h2>
                <InteractiveButton variant="primary" icon={<Plus className="h-4 w-4" />}>
                  Add Immunization
                </InteractiveButton>
              </div>

              <ResponsiveCard title="Immunization Schedule">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3">Vaccine</th>
                        <th className="text-left py-3">Date Given</th>
                        <th className="text-left py-3">Next Due</th>
                        <th className="text-left py-3">Status</th>
                        <th className="text-left py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {immunizations.map((imm, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{imm.vaccine}</td>
                          <td className="py-3">{imm.date}</td>
                          <td className="py-3">{imm.nextDue}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(imm.status)}`}>
                              {imm.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <InteractiveButton variant="ghost" size="sm" icon={<Edit3 className="h-3 w-3" />} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ResponsiveCard>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Documents & Files</h2>
                <InteractiveButton variant="primary" icon={<Plus className="h-4 w-4" />}>
                  Upload Document
                </InteractiveButton>
              </div>

              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No documents uploaded yet</p>
                <p className="text-sm text-gray-400">Upload patient documents, lab results, and other files</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Vitals Modal */}
      {showAddVitals && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Vitals</h3>
            <div className="space-y-4">
              <InteractiveInput label="Height (cm)" value="" onChange={() => {}} />
              <InteractiveInput label="Weight (kg)" value="" onChange={() => {}} />
              <InteractiveInput label="Temperature (°F)" value="" onChange={() => {}} />
              <InteractiveInput label="Blood Pressure" value="" onChange={() => {}} />
              <InteractiveInput label="Heart Rate" value="" onChange={() => {}} />
            </div>
            <div className="flex space-x-3 mt-6">
              <InteractiveButton variant="primary" fullWidth>Save Vitals</InteractiveButton>
              <InteractiveButton variant="secondary" onClick={() => setShowAddVitals(false)} fullWidth>
                Cancel
              </InteractiveButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
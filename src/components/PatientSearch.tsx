import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { 
  Search, 
  User, 
  Calendar, 
  Phone, 
  MapPin,
  Filter,
  Plus,
  Eye,
  Edit3,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import InteractiveInput from './InteractiveInput';
import InteractiveButton from './InteractiveButton';
import ResponsiveCard from './ResponsiveCard';

interface PatientSearchProps {
  onSelectPatient: (patient: any) => void;
  onClose: () => void;
}

export default function PatientSearch({ onSelectPatient, onClose }: PatientSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { addNotification } = useNotifications();

  const patients = [
    {
      id: 1,
      name: 'Sofia Martinez',
      dob: '2020-03-15',
      age: '4 years 10 months',
      mrn: 'WIC-789012',
      phone: '(555) 123-4567',
      address: '123 Main St, City, ST 12345',
      lastVisit: '2025-01-15',
      nextAppointment: '2025-04-15',
      status: 'active',
      program: 'WIC',
      alerts: ['Growth monitoring due']
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      dob: '2019-08-22',
      age: '5 years 5 months',
      mrn: 'WIC-789013',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, City, ST 12345',
      lastVisit: '2025-01-10',
      nextAppointment: '2025-03-10',
      status: 'active',
      program: 'WIC',
      alerts: ['Immunization due']
    },
    {
      id: 3,
      name: 'Emma Chen',
      dob: '2021-11-03',
      age: '3 years 2 months',
      mrn: 'WIC-789014',
      phone: '(555) 345-6789',
      address: '789 Pine St, City, ST 12345',
      lastVisit: '2024-12-20',
      nextAppointment: '2025-02-20',
      status: 'active',
      program: 'WIC',
      alerts: []
    }
  ];

  const filterOptions = [
    'Active Patients',
    'WIC Program',
    'Immunization Program',
    'Overdue Visits',
    'Upcoming Appointments',
    'High Risk'
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.phone.includes(searchQuery);
    
    if (selectedFilters.length === 0) return matchesSearch;
    
    return matchesSearch && selectedFilters.some(filter => {
      switch (filter) {
        case 'Active Patients': return patient.status === 'active';
        case 'WIC Program': return patient.program === 'WIC';
        case 'Overdue Visits': return new Date(patient.lastVisit) < new Date('2025-01-01');
        case 'Upcoming Appointments': return new Date(patient.nextAppointment) <= new Date('2025-02-01');
        case 'High Risk': return patient.alerts.length > 0;
        default: return true;
      }
    });
  });

  const handleSelectPatient = (patient: any) => {
    addNotification({
      type: 'info',
      title: 'Patient Selected',
      message: `Selected ${patient.name} (MRN: ${patient.mrn})`,
      duration: 3000
    });
    onSelectPatient(patient);
  };

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Patient Search</h2>
            <p className="text-sm text-gray-600">Find and select a patient to view their records</p>
          </div>
          <InteractiveButton
            variant="ghost"
            onClick={onClose}
            icon={<Plus className="h-4 w-4 rotate-45" />}
          />
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <InteractiveInput
                label=""
                type="search"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, MRN, or phone number..."
              />
            </div>
            <div className="flex space-x-2">
              <InteractiveButton
                variant={showFilters ? 'primary' : 'secondary'}
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="h-4 w-4" />}
              >
                Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
              </InteractiveButton>
              <InteractiveButton
                variant="secondary"
                icon={<Plus className="h-4 w-4" />}
              >
                New Patient
              </InteractiveButton>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(filter => (
                  <button
                    key={filter}
                    onClick={() => handleFilterToggle(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilters.includes(filter)
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="space-y-4">
            {filteredPatients.map(patient => (
              <ResponsiveCard
                key={patient.id}
                title={patient.name}
                subtitle={`MRN: ${patient.mrn} • ${patient.age}`}
                interactive
                onClick={() => handleSelectPatient(patient)}
                className="hover:shadow-md transition-shadow"
                actions={
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                    <InteractiveButton variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />} />
                    <InteractiveButton variant="ghost" size="sm" icon={<Edit3 className="h-4 w-4" />} />
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">DOB</p>
                      <p className="text-xs text-gray-500">{patient.dob}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-xs text-gray-500">{patient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-xs text-gray-500">{patient.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Last visit: {patient.lastVisit}</span>
                    <span>Next: {patient.nextAppointment}</span>
                  </div>
                  {patient.alerts.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-yellow-700">{patient.alerts[0]}</span>
                    </div>
                  )}
                </div>
              </ResponsiveCard>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No patients found</p>
              <p className="text-sm text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { AnimatedButton } from './MicroInteractions';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import InteractiveInput from './InteractiveInput';
import ResponsiveCard from './ResponsiveCard';

interface AppointmentSchedulerProps {
  patient?: any;
  onClose: () => void;
  onSchedule: (appointment: any) => void;
}

export default function AppointmentScheduler({ patient, onClose, onSchedule }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { addNotification } = useNotifications();

  const appointmentTypes = [
    'WIC Nutrition Assessment',
    'Immunization Visit',
    'Well Child Check',
    'Follow-up Visit',
    'Consultation',
    'Emergency Visit'
  ];

  const providers = [
    'Dr. Sarah Chen - Primary Care',
    'Maria Santos, RN - WIC Nutritionist',
    'Dr. James Wilson - Pediatrician',
    'Lisa Park, RN - Immunization Specialist'
  ];

  const timeSlots = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0 && date.getDay() !== 6; // No weekends
  };

  const isTimeSlotAvailable = (time: string) => {
    // Simulate some booked slots
    const bookedSlots = ['9:00 AM', '2:00 PM', '3:30 PM'];
    return !bookedSlots.includes(time);
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(''); // Reset time when date changes
    }
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDate || !selectedTime || !appointmentType || !provider) {
      return;
    }

    const appointment = {
      patient: patient?.name || 'New Patient',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      type: appointmentType,
      provider: provider,
      notes: notes
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSchedule(appointment);
      
      onClose();
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Schedule Appointment</h2>
            {patient && (
              <p className="text-sm text-gray-600">for {patient.name} (MRN: {patient.mrn})</p>
            )}
          </div>
          <InteractiveButton
            variant="ghost"
            onClick={onClose}
            icon={<X className="h-4 w-4" />}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <ResponsiveCard title="Select Date">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <div className="flex space-x-1">
                    <InteractiveButton
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      icon={<ChevronLeft className="h-4 w-4" />}
                    />
                    <InteractiveButton
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      icon={<ChevronRight className="h-4 w-4" />}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && handleDateSelect(day)}
                      disabled={!day || !isDateAvailable(day)}
                      className={`
                        p-2 text-sm rounded-md transition-colors
                        ${!day ? 'invisible' : ''}
                        ${day && !isDateAvailable(day) 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${day && selectedDate && day.toDateString() === selectedDate.toDateString()
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : ''
                        }
                      `}
                    >
                      {day?.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </ResponsiveCard>

            {/* Time Slots */}
            <ResponsiveCard title="Select Time">
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      disabled={!isTimeSlotAvailable(time)}
                      className={`
                        p-3 text-sm rounded-md border transition-colors
                        ${!isTimeSlotAvailable(time)
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : selectedTime === time
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      {time}
                      {!isTimeSlotAvailable(time) && (
                        <div className="text-xs mt-1">Booked</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Select a date first</p>
                </div>
              )}
            </ResponsiveCard>
          </div>

          {/* Appointment Details */}
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InteractiveInput
                label="Appointment Type"
                type="select"
                value={appointmentType}
                onChange={setAppointmentType}
                options={appointmentTypes}
                placeholder="Select appointment type"
                required
              />
              <InteractiveInput
                label="Provider"
                type="select"
                value={provider}
                onChange={setProvider}
                options={providers}
                placeholder="Select provider"
                required
              />
            </div>
            <InteractiveInput
              label="Notes (Optional)"
              type="textarea"
              value={notes}
              onChange={setNotes}
              placeholder="Add any special instructions or notes..."
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && appointmentType && provider && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Appointment Summary</p>
                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                    <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Type:</strong> {appointmentType}</p>
                    <p><strong>Provider:</strong> {provider}</p>
                    {patient && <p><strong>Patient:</strong> {patient.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {!selectedDate || !selectedTime || !appointmentType || !provider ? (
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Please complete all required fields</span>
                </div>
              ) : (
                <span>Ready to schedule appointment</span>
              )}
            </div>
            <div className="flex space-x-3">
              <InteractiveButton variant="secondary" onClick={onClose}>
                Cancel
              </InteractiveButton>
              <AnimatedButton
                variant="primary"
                onClick={handleScheduleAppointment}
                disabled={!selectedDate || !selectedTime || !appointmentType || !provider}
                animation="glow"
              >
                Schedule Appointment
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
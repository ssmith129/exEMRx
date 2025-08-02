import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import ResponsiveCard from './ResponsiveCard';
import InteractiveButton from './InteractiveButton';
import InteractiveInput from './InteractiveInput';

export default function ReportsAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const timeframes = ['week', 'month', 'quarter', 'year'];
  const reportTypes = [
    { id: 'overview', label: 'Overview Dashboard', icon: BarChart3 },
    { id: 'patients', label: 'Patient Analytics', icon: Users },
    { id: 'compliance', label: 'Compliance Reports', icon: CheckCircle },
    { id: 'wic', label: 'WIC Program Stats', icon: Activity },
    { id: 'immunizations', label: 'Immunization Tracking', icon: Calendar }
  ];

  const overviewStats = [
    { label: 'Total Patients', value: '1,247', change: '+12%', trend: 'up', color: 'blue' },
    { label: 'Active WIC Participants', value: '892', change: '+8%', trend: 'up', color: 'green' },
    { label: 'Compliance Rate', value: '94.2%', change: '+2.1%', trend: 'up', color: 'primary' },
    { label: 'Overdue Visits', value: '23', change: '-15%', trend: 'down', color: 'red' }
  ];

  const complianceData = [
    { category: 'Documentation Complete', percentage: 96, status: 'excellent' },
    { category: 'Immunizations Up-to-Date', percentage: 89, status: 'good' },
    { category: 'Growth Monitoring', percentage: 98, status: 'excellent' },
    { category: 'Nutrition Assessments', percentage: 92, status: 'good' },
    { category: 'Follow-up Scheduling', percentage: 87, status: 'needs-improvement' }
  ];

  const wicStats = {
    totalParticipants: 892,
    newEnrollments: 45,
    graduations: 23,
    riskCategories: [
      { level: 'Low Risk', count: 567, percentage: 64 },
      { level: 'Medium Risk', count: 268, percentage: 30 },
      { level: 'High Risk', count: 57, percentage: 6 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <ResponsiveCard key={index} title={stat.label} size="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                  {stat.change} from last {selectedTimeframe}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <TrendingUp className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </ResponsiveCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ResponsiveCard title="Patient Visit Trends">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Visit trends chart would appear here</p>
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard title="WIC Program Distribution">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Program distribution chart would appear here</p>
            </div>
          </div>
        </ResponsiveCard>
      </div>

      {/* Recent Activity */}
      <ResponsiveCard title="Recent System Activity">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Compliance audit completed</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">45 new WIC enrollments processed</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">23 patients have overdue visits</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
          </div>
        </div>
      </ResponsiveCard>
    </div>
  );

  const renderComplianceReports = () => (
    <div className="space-y-6">
      <ResponsiveCard title="Compliance Overview">
        <div className="space-y-4">
          {complianceData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{item.category}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.percentage}% compliant</p>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ResponsiveCard title="Compliance Trends">
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Compliance trends over time</p>
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard title="Action Items">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">5 patients missing immunization records</p>
                <p className="text-xs text-red-700">Requires immediate attention</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 border border-yellow-200 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">12 nutrition assessments overdue</p>
                <p className="text-xs text-yellow-700">Schedule within 2 weeks</p>
              </div>
            </div>
          </div>
        </ResponsiveCard>
      </div>
    </div>
  );

  const renderWICStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResponsiveCard title="Total Participants" size="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{wicStats.totalParticipants}</p>
            <p className="text-sm text-gray-500">Active participants</p>
          </div>
        </ResponsiveCard>
        <ResponsiveCard title="New Enrollments" size="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{wicStats.newEnrollments}</p>
            <p className="text-sm text-gray-500">This {selectedTimeframe}</p>
          </div>
        </ResponsiveCard>
        <ResponsiveCard title="Graduations" size="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{wicStats.graduations}</p>
            <p className="text-sm text-gray-500">This {selectedTimeframe}</p>
          </div>
        </ResponsiveCard>
      </div>

      <ResponsiveCard title="Risk Category Distribution">
        <div className="space-y-4">
          {wicStats.riskCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{category.level}</h4>
                  <span className="text-sm text-gray-600">{category.count} patients</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{category.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveCard>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Comprehensive insights into clinic operations and patient outcomes</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <InteractiveInput
            label=""
            type="select"
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            options={timeframes}
            className="min-w-32"
          />
          <InteractiveButton variant="secondary" icon={<Filter className="h-4 w-4" />}>
            Filters
          </InteractiveButton>
          <InteractiveButton 
            variant="secondary" 
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </InteractiveButton>
        </div>
        <div className="flex space-x-2">
          <InteractiveButton 
            variant="primary" 
            icon={<Download className="h-4 w-4" />}
            onClick={handleGenerateReport}
            loading={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Export Report'}
          </InteractiveButton>
        </div>
      </div>

      {/* Report Type Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedReport === type.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="min-h-96">
        {selectedReport === 'overview' && renderOverviewDashboard()}
        {selectedReport === 'compliance' && renderComplianceReports()}
        {selectedReport === 'wic' && renderWICStats()}
        {(selectedReport === 'patients' || selectedReport === 'immunizations') && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">{reportTypes.find(r => r.id === selectedReport)?.label} Report</p>
            <p className="text-sm text-gray-400">Detailed analytics and insights coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter,
  Plus,
  Star,
  Archive,
  Trash2,
  User,
  Clock,
  Paperclip,
  MoreVertical,
  Reply,
  Forward,
  Flag
} from 'lucide-react';
import ResponsiveCard from './ResponsiveCard';
import InteractiveButton from './InteractiveButton';
import InteractiveInput from './InteractiveInput';

export default function MessageCenter() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [replyText, setReplyText] = useState('');

  const folders = [
    { id: 'inbox', label: 'Inbox', count: 12, icon: MessageSquare },
    { id: 'sent', label: 'Sent', count: 0, icon: Send },
    { id: 'starred', label: 'Starred', count: 3, icon: Star },
    { id: 'archived', label: 'Archived', count: 45, icon: Archive },
    { id: 'trash', label: 'Trash', count: 2, icon: Trash2 }
  ];

  const messages = [
    {
      id: 1,
      from: 'Maria Santos, RN',
      subject: 'WIC Assessment Follow-up - Sofia Martinez',
      preview: 'Please review the nutrition assessment for Sofia Martinez. The family has questions about...',
      time: '2 hours ago',
      read: false,
      starred: true,
      priority: 'high',
      attachments: 1
    },
    {
      id: 2,
      from: 'Dr. James Wilson',
      subject: 'Immunization Schedule Update',
      preview: 'New CDC guidelines for pediatric immunizations have been released. Please review...',
      time: '4 hours ago',
      read: true,
      starred: false,
      priority: 'normal',
      attachments: 0
    },
    {
      id: 3,
      from: 'System Administrator',
      subject: 'Scheduled Maintenance Notice',
      preview: 'The system will undergo scheduled maintenance this weekend from 2 AM to 6 AM...',
      time: '1 day ago',
      read: true,
      starred: false,
      priority: 'low',
      attachments: 0
    },
    {
      id: 4,
      from: 'Lisa Park, RN',
      subject: 'Patient Referral - Urgent',
      preview: 'I need to refer a patient to pediatric cardiology. Can you help with the process?',
      time: '2 days ago',
      read: false,
      starred: true,
      priority: 'high',
      attachments: 2
    }
  ];

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-gray-600';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  const renderMessageList = () => (
    <div className="space-y-2">
      {messages.map(message => (
        <div
          key={message.id}
          onClick={() => setSelectedMessage(message.id)}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedMessage === message.id
              ? 'border-primary-500 bg-primary-50'
              : message.read
                ? 'border-gray-200 bg-white hover:bg-gray-50'
                : 'border-gray-300 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 p-1 rounded-full">
                <User className="h-3 w-3 text-gray-600" />
              </div>
              <span className={`text-sm ${message.read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                {message.from}
              </span>
              {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              {message.attachments > 0 && <Paperclip className="h-4 w-4 text-gray-400" />}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}></div>
              <span className="text-xs text-gray-500">{message.time}</span>
            </div>
          </div>
          <h3 className={`text-sm mb-1 ${message.read ? 'text-gray-900' : 'font-semibold text-gray-900'}`}>
            {message.subject}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2">{message.preview}</p>
        </div>
      ))}
    </div>
  );

  const renderMessageDetail = () => {
    if (!selectedMessageData) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Select a message to view</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        {/* Message Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedMessageData.subject}</h2>
                <p className="text-sm text-gray-600">From: {selectedMessageData.from}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <InteractiveButton variant="ghost" size="sm" icon={<Reply className="h-4 w-4" />} />
              <InteractiveButton variant="ghost" size="sm" icon={<Forward className="h-4 w-4" />} />
              <InteractiveButton variant="ghost" size="sm" icon={<Star className="h-4 w-4" />} />
              <InteractiveButton variant="ghost" size="sm" icon={<Archive className="h-4 w-4" />} />
              <InteractiveButton variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} />
              <InteractiveButton variant="ghost" size="sm" icon={<MoreVertical className="h-4 w-4" />} />
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{selectedMessageData.time}</span>
            </div>
            {selectedMessageData.attachments > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="h-4 w-4" />
                <span>{selectedMessageData.attachments} attachment{selectedMessageData.attachments !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className={`flex items-center space-x-1 ${getPriorityColor(selectedMessageData.priority)}`}>
              <Flag className="h-4 w-4" />
              <span className="capitalize">{selectedMessageData.priority} priority</span>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Dear Dr. Chen,
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              I hope this message finds you well. I wanted to follow up on the WIC nutrition assessment we completed for Sofia Martinez yesterday. The family has some specific questions about the recommended dietary changes, particularly regarding iron-rich foods for their 4-year-old.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              The mother mentioned that Sofia is quite picky with vegetables and they're struggling to incorporate the suggested leafy greens into her diet. They're wondering if there are alternative iron sources that might be more appealing to a young child.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Additionally, they have questions about the portion sizes we discussed. Could you please review the assessment and provide some additional guidance? I've attached the completed assessment form and growth charts for your reference.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              The family is scheduled for a follow-up in 3 months, but they would appreciate some guidance sooner if possible.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Thank you for your time and expertise.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Best regards,<br />
              Maria Santos, RN<br />
              WIC Nutritionist<br />
              Family Health Clinic
            </p>
          </div>

          {selectedMessageData.attachments > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">WIC_Assessment_Sofia_Martinez.pdf</span>
                  <InteractiveButton variant="ghost" size="sm">Download</InteractiveButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reply Section */}
        <div className="border-t border-gray-200 p-6">
          <div className="space-y-4">
            <InteractiveInput
              label=""
              type="textarea"
              value={replyText}
              onChange={setReplyText}
              placeholder="Type your reply..."
              rows={4}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <InteractiveButton variant="ghost" size="sm" icon={<Paperclip className="h-4 w-4" />}>
                  Attach
                </InteractiveButton>
              </div>
              <div className="flex space-x-2">
                <InteractiveButton variant="secondary">Save Draft</InteractiveButton>
                <InteractiveButton 
                  variant="primary" 
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  icon={<Send className="h-4 w-4" />}
                >
                  Send Reply
                </InteractiveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompose = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Compose Message</h2>
          <InteractiveButton variant="ghost" onClick={() => setShowCompose(false)}>
            ×
          </InteractiveButton>
        </div>
        <div className="p-6 space-y-4">
          <InteractiveInput
            label="To"
            value=""
            onChange={() => {}}
            placeholder="Select recipients..."
          />
          <InteractiveInput
            label="Subject"
            value=""
            onChange={() => {}}
            placeholder="Enter subject..."
          />
          <InteractiveInput
            label="Message"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Type your message..."
            rows={8}
          />
        </div>
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <InteractiveButton variant="ghost" icon={<Paperclip className="h-4 w-4" />}>
            Attach Files
          </InteractiveButton>
          <div className="flex space-x-2">
            <InteractiveButton variant="secondary">Save Draft</InteractiveButton>
            <InteractiveButton variant="primary" icon={<Send className="h-4 w-4" />}>
              Send Message
            </InteractiveButton>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Center</h1>
            <p className="text-gray-600 mt-2">Secure communication with your healthcare team</p>
          </div>
          <InteractiveButton 
            variant="primary" 
            onClick={() => setShowCompose(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Compose
          </InteractiveButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ResponsiveCard title="Folders" className="h-full">
            <div className="space-y-2 mb-6">
              <InteractiveInput
                label=""
                type="search"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search messages..."
              />
              <InteractiveButton variant="secondary" size="sm" icon={<Filter className="h-4 w-4" />} fullWidth>
                Filters
              </InteractiveButton>
            </div>
            <nav className="space-y-1">
              {folders.map(folder => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedFolder === folder.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-3" />
                      {folder.label}
                    </div>
                    {folder.count > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedFolder === folder.id
                          ? 'bg-primary-200 text-primary-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </ResponsiveCard>
        </div>

        {/* Message List */}
        <div className="lg:col-span-1">
          <ResponsiveCard title="Messages" className="h-full">
            <div className="h-full overflow-y-auto">
              {renderMessageList()}
            </div>
          </ResponsiveCard>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <ResponsiveCard title="" className="h-full">
            {renderMessageDetail()}
          </ResponsiveCard>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && renderCompose()}
    </div>
  );
}
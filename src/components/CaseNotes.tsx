import React, { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Clock, 
  Edit3, 
  Save, 
  X,
  Plus,
  Check,
  MoreVertical,
  Reply,
  Flag
} from 'lucide-react';

interface Note {
  id: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  edited: boolean;
  approved: boolean;
  replies?: Note[];
}

export default function CaseNotes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      author: 'Dr. Sarah Chen',
      role: 'Primary Care Physician',
      content: 'Initial WIC assessment completed. Patient shows healthy growth trajectory. Height 104cm (50th percentile), Weight 16.2kg (55th percentile). Parent reports good appetite and varied diet. Recommend continuing current nutrition plan.',
      timestamp: '2 hours ago',
      edited: false,
      approved: true,
      replies: [
        {
          id: 2,
          author: 'Maria Santos, RN',
          role: 'WIC Nutritionist',
          content: 'Agreed on nutrition plan. Provided educational materials on iron-rich foods. Family expressed interest in cooking classes.',
          timestamp: '1 hour ago',
          edited: false,
          approved: true
        }
      ]
    },
    {
      id: 3,
      author: 'Maria Santos, RN',
      role: 'WIC Nutritionist',
      content: 'Follow-up from last visit: Family has successfully incorporated more vegetables into meals. Child is drinking whole milk as recommended. Growth continues to track well.',
      timestamp: '3 days ago',
      edited: true,
      approved: true
    },
    {
      id: 4,
      author: 'Dr. James Wilson',
      role: 'Pediatric Consultant',
      content: 'Reviewed growth charts and assessment. Developmental milestones appropriate for age. No concerns noted. Recommend routine follow-up in 3 months.',
      timestamp: '1 week ago',
      edited: false,
      approved: false
    }
  ]);

  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);

  const handleSaveEdit = (noteId: number, newContent: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, content: newContent, edited: true }
        : note
    ));
    setEditingNote(null);
  };

  const handleAddReply = (parentNoteId: number) => {
    if (!newReplyContent.trim()) return;

    const newReply: Note = {
      id: Date.now(),
      author: 'Dr. Sarah Chen',
      role: 'Primary Care Physician',
      content: newReplyContent,
      timestamp: 'Just now',
      edited: false,
      approved: false
    };

    setNotes(notes.map(note => 
      note.id === parentNoteId
        ? { 
            ...note, 
            replies: [...(note.replies || []), newReply]
          }
        : note
    ));

    setNewReplyContent('');
    setReplyingTo(null);
  };

  const handleAddNewNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      author: 'Dr. Sarah Chen',
      role: 'Primary Care Physician',
      content: newNoteContent,
      timestamp: 'Just now',
      edited: false,
      approved: false
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setShowNewNote(false);
  };

  const handleApproveNote = (noteId: number) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, approved: true }
        : {
            ...note,
            replies: note.replies?.map(reply => 
              reply.id === noteId 
                ? { ...reply, approved: true }
                : reply
            )
          }
    ));
  };

  const renderNote = (note: Note, isReply: boolean = false) => {
    const isEditing = editingNote === note.id;
    const [editContent, setEditContent] = useState(note.content);

    return (
      <div 
        key={note.id}
        className={`${isReply ? 'ml-12 mt-4' : 'mb-6'} bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:shadow-sm`}
      >
        {/* Note Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-full">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">{note.author}</p>
                {note.edited && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Edited
                  </span>
                )}
                {note.approved ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    Pending Review
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{note.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {note.timestamp}
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Note Content */}
        <div className="mb-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSaveEdit(note.id, editContent)}
                  className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </button>
                <button
                  onClick={() => setEditingNote(null)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
          )}
        </div>

        {/* Note Actions */}
        {!isEditing && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <button
                onClick={() => setEditingNote(note.id)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </button>
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(replyingTo === note.id ? null : note.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </button>
              )}
              <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
                <Flag className="h-3 w-3 mr-1" />
                Flag
              </button>
            </div>
            {!note.approved && (
              <button
                onClick={() => handleApproveNote(note.id)}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Approve Note
              </button>
            )}
          </div>
        )}

        {/* Reply Form */}
        {replyingTo === note.id && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <textarea
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Add your reply..."
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddReply(note.id)}
                  className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {note.replies && note.replies.map(reply => renderNote(reply, true))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Case Notes</h1>
        <p className="text-gray-600 mt-2">Clinical documentation and collaborative notes for Sofia Martinez</p>
      </div>

      {/* Patient Info Banner */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-2 rounded-full">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sofia Martinez</h2>
              <p className="text-sm text-gray-600">MRN: WIC-789012 • 4 years 10 months • WIC Patient</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewNote(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </button>
        </div>
      </div>

      {/* New Note Form */}
      {showNewNote && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h3>
          <div className="space-y-4">
            <textarea
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Enter your clinical note..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleAddNewNote}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </button>
              <button
                onClick={() => setShowNewNote(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Clinical Notes</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>{notes.length} notes</span>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No notes yet</p>
            <p className="text-sm text-gray-400">Add the first clinical note for this patient</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map(note => renderNote(note))}
          </div>
        )}
      </div>
    </div>
  );
}
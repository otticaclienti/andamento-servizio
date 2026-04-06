'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Conversation } from '@/types';
import { getStatusLabel, getStatusColor } from '@/lib/utils';

interface ConversationModalProps {
  conversation: Conversation;
  onClose: () => void;
}

export function ConversationModal({ conversation, onClose }: ConversationModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">{conversation.contactName}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(conversation.status)}`}>
              {getStatusLabel(conversation.status)}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {conversation.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'agent'
                    ? 'bg-gray-100 text-gray-800 rounded-bl-md'
                    : 'bg-blue-500 text-white rounded-br-md'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'agent' ? 'text-gray-400' : 'text-blue-100'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Conversazione gestita dall&apos;agente AI</p>
        </div>
      </div>
    </div>
  );
}

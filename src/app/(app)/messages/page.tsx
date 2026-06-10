'use client';

import { Avatar, EmptyState } from '@/components/common';
import { useMe } from '@/hooks/useAuth';
import {
  useContacts, useConversation, useDeleteMessage,
  useEditMessage, useMarkConversationRead,
  useSearchMessages, useSendMessage,
} from '@/hooks/useMessaging';
import { apiMessage, cn } from '@/lib/utils';
import { Check, Mail, Pencil, Search, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MessagesPage() {
  const { data: me } = useMe();
  const contacts = useContacts();
  const markRead = useMarkConversationRead();

  const [activeUserId, setActiveUserId] = useState('');
  const [activeUserName, setActiveUserName] = useState('');
  const [text, setText] = useState('');
  const [editId, setEditId] = useState('');
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conv = useConversation(activeUserId);
  const send = useSendMessage();
  const edit = useEditMessage();
  const remove = useDeleteMessage();
  const search = useSearchMessages(searchQuery);

  const openConversation = (userId: string, name: string) => {
    setActiveUserId(userId);
    setActiveUserName(name);
    markRead.mutate(userId);
  };

  const sendMsg = async () => {
    if (!activeUserId || !text.trim()) return;
    try {
      await send.mutateAsync({ to: activeUserId, text: text.trim() });
      setText('');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <div className='flex h-[calc(100vh-0px)]'>
      <div className='flex w-72 shrink-0 flex-col border-r border-gray-200'>
        <div className='border-b border-gray-200 p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Mail className='h-5 w-5 text-[#2C3248]' />
              <h2 className='text-lg font-bold text-gray-900'>Messages</h2>
            </div>
          </div>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search messages...'
              className='w-full rounded-full border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248]/50 focus:ring-1 focus:ring-[#2C3248]/20'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {searchQuery.length > 1 ? (
            <div className='p-2 space-y-1'>
              {(search.data?.data ?? []).map((msg: { _id: string; text: string; from?: { fullName?: string; username?: string; picture?: string; _id: string } }) => (
                <button
                  key={msg._id}
                  onClick={() => msg.from && openConversation(msg.from._id, msg.from.fullName ?? msg.from.username ?? '')}
                  className='w-full rounded-lg p-2 text-left transition-colors hover:bg-gray-50'
                >
                  <p className='text-xs text-gray-500 line-clamp-2'>{msg.text}</p>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {(contacts.data ?? []).length === 0 && (
                <div className='p-4'><EmptyState title='No conversations' message='Start a conversation.' icon={<Mail className='h-8 w-8' />} /></div>
              )}
              {(contacts.data ?? []).map((item) => (
                <button
                  key={item.user._id}
                  onClick={() => openConversation(item.user._id, item.user.fullName ?? item.user.username ?? '')}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50',
                    activeUserId === item.user._id && 'bg-gray-50'
                  )}
                >
                  <div className='relative'>
                    <Avatar src={item.user.picture} name={item.user.fullName ?? item.user.username} />
                    {(item.unreadCount ?? 0) > 0 && (
                      <span className='absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#2C3248] px-1 text-[10px] font-bold text-white'>{item.unreadCount}</span>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-gray-900'>{item.user.fullName ?? item.user.username}</p>
                    <p className='truncate text-xs text-gray-500'>{item.lastMessage?.text ?? ''}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col'>
        {!activeUserId ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center'>
              <Mail className='mx-auto h-12 w-12 text-gray-300' />
              <p className='mt-3 text-lg font-semibold text-gray-500'>Select a conversation</p>
              <p className='text-sm text-gray-400'>Choose from your contacts on the left.</p>
            </div>
          </div>
        ) : (
          <>
            <div className='flex items-center gap-3 border-b border-gray-200 px-4 py-3'>
              <Avatar name={activeUserName} />
              <p className='font-semibold text-gray-900'>{activeUserName}</p>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {(conv.data ?? []).length === 0 && (
                <div className='flex items-center justify-center h-full'>
                  <EmptyState title='No messages yet' message='Say hello!' icon={<Mail className='h-8 w-8' />} />
                </div>
              )}
              {(conv.data ?? []).map((msg) => {
                const isOwn = msg.from?._id === me?._id;
                return (
                  <div key={msg._id} className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
                    {editId === msg._id ? (
                      <div className='flex items-center gap-2 max-w-xs'>
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className='flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-[#2C3248]/50'
                        />
                        <button onClick={async () => { await edit.mutateAsync({ id: msg._id, text: editText }); setEditId(''); }} className='text-green-600 hover:text-green-500'><Check className='h-4 w-4' /></button>
                        <button onClick={() => setEditId('')} className='text-gray-400 hover:text-gray-600'><X className='h-4 w-4' /></button>
                      </div>
                    ) : (
                      <div className={cn('group relative max-w-xs rounded-2xl px-4 py-2 text-sm', isOwn ? 'bg-[#2C3248] text-white' : 'bg-gray-100 text-gray-900')}>
                        <p>{msg.text}</p>
                        {isOwn && (
                          <div className='absolute -left-16 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex'>
                            <button onClick={() => { setEditId(msg._id); setEditText(msg.text); }} className='rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white'><Pencil className='h-3.5 w-3.5' /></button>
                            <button onClick={() => remove.mutate(msg._id)} className='rounded-full p-1 text-white/70 hover:bg-red-500/10 hover:text-red-300'><Trash2 className='h-3.5 w-3.5' /></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className='flex items-center gap-2 border-t border-gray-200 p-4'>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMsg())}
                placeholder='Type a message...'
                className='flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248]/50'
              />
              <button
                onClick={sendMsg}
                disabled={send.isPending || !text.trim()}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-[#2C3248] text-white transition-colors hover:bg-[#3a415a] disabled:opacity-50'
              >
                <Send className='h-4 w-4' />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

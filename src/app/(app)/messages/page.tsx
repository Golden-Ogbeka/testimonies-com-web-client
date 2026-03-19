'use client';

import { Avatar, EmptyState } from '@/components/common';
import { useMe } from '@/hooks/useAuth';
import {
    useContacts, useConversation,
    useDeleteMessage,
    useEditMessage,
    useMarkAllConversationsRead,
    useMarkConversationRead,
    useMarkMessageRead, useSearchMessages,
    useSendMessage,
} from '@/hooks/useMessaging';
import { apiMessage, cn } from '@/lib/utils';
import { Check, Pencil, Search, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MessagesPage() {
  const { data: me } = useMe();
  const contacts = useContacts();
  const markAllRead = useMarkAllConversationsRead();
  const markRead = useMarkConversationRead();
  const markMsgRead = useMarkMessageRead();

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
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='flex w-72 shrink-0 flex-col border-r border-slate-200'>
        <div className='border-b border-slate-200 p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-lg font-bold'>Messages</h2>
            <button onClick={() => markAllRead.mutate()} className='text-xs text-blue-600 hover:underline'>Mark all read</button>
          </div>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search messages...'
              className='w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500'
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
                  className='w-full rounded-lg p-2 text-left hover:bg-slate-50'
                >
                  <p className='text-xs text-slate-500 line-clamp-2'>{msg.text}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className='space-y-0'>
              {(contacts.data ?? []).length === 0 && (
                <div className='p-4'><EmptyState title='No conversations' message='Start a conversation.' /></div>
              )}
              {(contacts.data ?? []).map((item) => (
                <button
                  key={item.user._id}
                  onClick={() => openConversation(item.user._id, item.user.fullName ?? item.user.username ?? '')}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50',
                    activeUserId === item.user._id && 'bg-blue-50'
                  )}
                >
                  <div className='relative'>
                    <Avatar src={item.user.picture} name={item.user.fullName ?? item.user.username} className='h-10 w-10' />
                    {(item.unreadCount ?? 0) > 0 && (
                      <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white'>{item.unreadCount}</span>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-900'>{item.user.fullName ?? item.user.username}</p>
                    <p className='truncate text-xs text-slate-500'>{item.lastMessage?.text ?? ''}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className='flex flex-1 flex-col'>
        {!activeUserId ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center text-slate-400'>
              <p className='text-lg font-semibold'>Select a conversation</p>
              <p className='text-sm'>Choose from your contacts on the left.</p>
            </div>
          </div>
        ) : (
          <>
            <div className='flex items-center gap-3 border-b border-slate-200 px-4 py-3'>
              <Avatar name={activeUserName} className='h-8 w-8' />
              <p className='font-semibold text-slate-900'>{activeUserName}</p>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {(conv.data ?? []).length === 0 && (
                <EmptyState title='No messages yet' message='Say hello!' />
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
                          className='flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button onClick={async () => { await edit.mutateAsync({ id: msg._id, text: editText }); setEditId(''); }} className='text-green-600 hover:text-green-700'><Check className='h-4 w-4' /></button>
                        <button onClick={() => setEditId('')} className='text-slate-400 hover:text-slate-600'><X className='h-4 w-4' /></button>
                      </div>
                    ) : (
                      <div className={cn('group relative max-w-xs rounded-2xl px-4 py-2 text-sm', isOwn ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900')}>
                        <p>{msg.text}</p>
                        {!msg.read && !isOwn && (
                          <button onClick={() => markMsgRead.mutate(msg._id)} className='mt-1 text-[10px] text-slate-400 hover:underline'>Mark read</button>
                        )}
                        {isOwn && (
                          <div className='absolute -left-16 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex'>
                            <button onClick={() => { setEditId(msg._id); setEditText(msg.text); }} className='rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600'><Pencil className='h-3.5 w-3.5' /></button>
                            <button onClick={() => remove.mutate(msg._id)} className='rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-500'><Trash2 className='h-3.5 w-3.5' /></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className='flex items-center gap-2 border-t border-slate-200 p-4'>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMsg())}
                placeholder='Type a message...'
                className='flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                onClick={sendMsg}
                disabled={send.isPending || !text.trim()}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50'
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

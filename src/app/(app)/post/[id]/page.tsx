'use client';

import { Avatar, Button, EmptyState, SkeletonCard } from '@/components/common';
import { TestimonyCard } from '@/components/feed/TestimonyCard';
import { useMe } from '@/hooks/useAuth';
import {
  useDeleteReply, useLikeReply, useReplies,
  useReplyToTestimony, useTestimony, useUnlikeReply,
  useUpdateReply,
} from '@/hooks/useTestimonies';
import { apiMessage, cn } from '@/lib/utils';
import { Check, Heart, MessageCircle, Pencil, Trash2, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: me } = useMe();
  const testimony = useTestimony(id);
  const replies = useReplies(id);
  const sendReply = useReplyToTestimony();
  const deleteReply = useDeleteReply();
  const updateReply = useUpdateReply();
  const likeReply = useLikeReply();
  const unlikeReply = useUnlikeReply();

  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState('');
  const [editText, setEditText] = useState('');

  const submitReply = async () => {
    if (!description.trim()) return;
    try {
      await sendReply.mutateAsync({ id, description: description.trim() });
      setDescription('');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg'>
        <div className='flex items-center gap-2'>
          <MessageCircle className='h-5 w-5 text-[#2C3248]' />
          <h1 className='text-lg font-bold text-gray-900'>Testimony</h1>
        </div>
      </div>

      <div>
        {testimony.isLoading && <div className='p-4'><SkeletonCard /></div>}
        {testimony.data && <TestimonyCard testimony={testimony.data} />}

        <div className='border-b border-gray-200 p-4'>
          <div className='flex gap-3'>
            <Avatar src={me?.picture} name={me?.fullName ?? me?.username} />
            <div className='flex-1'>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Write a reply...'
                rows={2}
                className='w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248]/50 focus:ring-1 focus:ring-[#2C3248]/20'
              />
              <div className='mt-2 flex justify-end'>
                <Button onClick={submitReply} disabled={sendReply.isPending || !description.trim()}>
                  {sendReply.isPending ? 'Replying...' : 'Reply'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          {replies.isLoading && <div className='p-4'><SkeletonCard /></div>}
          {!replies.isLoading && (replies.data ?? []).length === 0 && (
            <div className='p-4'>
              <EmptyState title='No replies yet' message='Be the first to reply.' icon={<MessageCircle className='h-8 w-8' />} />
            </div>
          )}
          {(replies.data ?? []).map((reply) => (
            <div key={reply._id} className='border-b border-gray-200 px-4 py-3 hover:bg-gray-50'>
              {editId === reply._id ? (
                <div className='flex gap-2'>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className='flex-1 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248]/50 focus:ring-1 focus:ring-[#2C3248]/20'
                  />
                  <div className='flex flex-col gap-1'>
                    <button onClick={async () => { await updateReply.mutateAsync({ id: reply._id, description: editText }); setEditId(''); }} className='rounded-full p-1.5 text-green-600 hover:bg-green-50'><Check className='h-4 w-4' /></button>
                    <button onClick={() => setEditId('')} className='rounded-full p-1.5 text-gray-400 hover:bg-gray-100'><X className='h-4 w-4' /></button>
                  </div>
                </div>
              ) : (
                <div className='flex items-start gap-3'>
                  <Avatar src={reply.user?.picture} name={reply.user?.fullName ?? reply.user?.username} size='sm' />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold text-gray-900'>{reply.user?.fullName ?? reply.user?.username}</span>
                      <span className='text-xs text-gray-500'>@{reply.user?.username}</span>
                    </div>
                    <p className='mt-0.5 text-sm text-gray-700'>{reply.description}</p>
                    <div className='mt-2 flex items-center gap-3 text-xs text-gray-500'>
                      <button
                        onClick={() => reply.liked ? unlikeReply.mutate(reply._id) : likeReply.mutate(reply._id)}
                        className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors hover:text-[#2C3248]', reply.liked && 'text-[#2C3248]')}
                      >
                        <Heart className={cn('h-3.5 w-3.5', reply.liked && 'fill-[#2C3248]')} strokeWidth={1.5} />
                        {reply.likesCount ?? 0}
                      </button>
                      {me?._id === reply.user?._id && (
                        <>
                          <button onClick={() => { setEditId(reply._id); setEditText(reply.description); }} className='rounded-full p-1 hover:bg-gray-100 transition-colors'><Pencil className='h-3.5 w-3.5' /></button>
                          <button onClick={() => deleteReply.mutate(reply._id)} className='rounded-full p-1 hover:bg-red-50 hover:text-red-500 transition-colors'><Trash2 className='h-3.5 w-3.5' /></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

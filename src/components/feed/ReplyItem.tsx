'use client';

import { Avatar } from '@/components/common';
import { useDeleteReply, useLikeReply, useUnlikeReply, useUpdateReply } from '@/hooks/useTestimonies';
import type { Reply } from '@/types/testimony';
import { useMe } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Check, Heart, Pencil, Trash2, X } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

function ReplyItem({ reply }: { reply: Reply }) {
  const { data: me } = useMe();
  const updateReply = useUpdateReply();
  const deleteReply = useDeleteReply();
  const likeReply = useLikeReply();
  const unlikeReply = useUnlikeReply();

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);

  const startEditing = useCallback(() => { setEditing(true); setEditText(reply.content); }, [reply.content]);
  const cancelEditing = useCallback(() => setEditing(false), []);
  const saveEdit = useCallback(async () => {
    await updateReply.mutateAsync({ id: reply._id, content: editText });
    setEditing(false);
  }, [updateReply, reply._id, editText]);
  const removeReply = useCallback(() => deleteReply.mutate(reply._id), [deleteReply, reply._id]);
  const toggleLike = useCallback(() => {
    if (reply.liked) { unlikeReply.mutate(reply._id); return; }
    likeReply.mutate(reply._id);
  }, [reply.liked, reply._id, likeReply, unlikeReply]);

  if (editing) {
    return (
      <div className='border-b border-gray-200 px-4 py-3 hover:bg-gray-50'>
        <div className='flex gap-2'>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
            aria-label='Edit reply'
            className='flex-1 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248]/50 focus:ring-1 focus:ring-[#2C3248]/20'
          />
          <div className='flex flex-col gap-1'>
            <button onClick={saveEdit} aria-label='Save edit' className='rounded-full p-1.5 text-green-600 hover:bg-green-50'><Check className='h-4 w-4' /></button>
            <button onClick={cancelEditing} aria-label='Cancel edit' className='rounded-full p-1.5 text-gray-400 hover:bg-gray-100'><X className='h-4 w-4' /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='border-b border-gray-200 px-4 py-3 hover:bg-gray-50'>
      <div className='flex items-start gap-3'>
        <Avatar src={reply.user?.picture} name={reply.user?.fullName ?? reply.user?.username} size='sm' />
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-semibold text-gray-900'>{reply.user?.fullName ?? reply.user?.username}</span>
            <span className='text-xs text-gray-500'>@{reply.user?.username}</span>
          </div>
          <p className='mt-0.5 text-sm text-gray-700'>{reply.content}</p>
          <div className='mt-2 flex items-center gap-3 text-xs text-gray-500'>
              <button
                onClick={toggleLike}
                aria-label={reply.liked ? 'Unlike reply' : 'Like reply'}
                className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors hover:text-[#2C3248]', reply.liked && 'text-[#2C3248]')}
              >
                <Heart className={cn('h-3.5 w-3.5', reply.liked && 'fill-[#2C3248]')} strokeWidth={1.5} />
                {reply.likesCount ?? 0}
              </button>
              {me?._id === reply.user?._id && (
                <>
                  <button onClick={startEditing} aria-label='Edit reply' className='rounded-full p-1 transition-colors hover:bg-gray-100'><Pencil className='h-3.5 w-3.5' /></button>
                  <button onClick={removeReply} aria-label='Delete reply' className='rounded-full p-1 transition-colors hover:bg-red-50 hover:text-red-500'><Trash2 className='h-3.5 w-3.5' /></button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ReplyItem);

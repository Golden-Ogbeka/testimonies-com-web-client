'use client';

import { Avatar, Button } from '@/components/common';
import { useMe } from '@/hooks/useAuth';
import { useReplyToTestimony } from '@/hooks/useTestimonies';
import { apiMessage } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

const REPLY_MAX = 2000;

export default function ReplyComposer({ testimonyId }: { testimonyId: string }) {
  const { data: me } = useMe();
  const sendReply = useReplyToTestimony();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    const trimmed = content.trim();
    if (!trimmed) { setError('Reply cannot be empty'); return; }
    if (trimmed.length > REPLY_MAX) { setError(`Reply must be under ${REPLY_MAX} characters`); return; }
    setError('');
    try {
      await sendReply.mutateAsync({ id: testimonyId, content: trimmed });
      setContent('');
    } catch (err) {
      toast.error(apiMessage(err));
    }
  };

  return (
    <div className='border-b border-gray-200 p-4'>
      <div className='flex gap-3'>
        <Avatar src={me?.picture} name={me?.fullName ?? me?.username} />
        <div className='flex-1'>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Write a reply...'
            aria-label='Write a reply'
            rows={2}
            className='w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#2C3248]/50 focus:ring-1 focus:ring-[#2C3248]/20'
          />
          {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
          <div className='mt-2 flex justify-end'>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-400'>{content.length}/{REPLY_MAX}</span>
              <Button onClick={submit} disabled={sendReply.isPending || !content.trim()}>
                {sendReply.isPending ? 'Replying...' : 'Reply'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

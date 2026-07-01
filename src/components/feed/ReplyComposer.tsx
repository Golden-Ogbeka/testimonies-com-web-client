'use client';

import { Avatar, Button, Textarea } from '@/components/common';
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
    if (!trimmed) {
      setError('Reply cannot be empty');
      return;
    }
    if (trimmed.length > REPLY_MAX) {
      setError(`Reply must be under ${REPLY_MAX} characters`);
      return;
    }
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
        <Avatar
          src={me?.profileImage}
          name={`${me?.firstName ?? ''} ${me?.lastName ?? ''}`}
        />
        <div className='flex-1'>
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
            placeholder='Write a reply...'
            aria-label='Write a reply'
            rows={2}
            error={error}
          />
          <div className='mt-2 flex justify-end'>
            <div className='flex items-center gap-2'>
              <span
                className={`text-xs ${content.length > REPLY_MAX ? 'text-red-500' : 'text-gray-400'}`}
              >
                {' '}
                {content.length}/{REPLY_MAX}
              </span>
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

'use client';

import { Avatar, Button } from '@/components/common';
import { useMe } from '@/hooks/useAuth';
import { useCreateTestimony } from '@/hooks/useTestimonies';
import { apiMessage } from '@/lib/utils';
import { Image as ImageIcon, Tag, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export function Composer() {
  const { data: me } = useMe();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const create = useCreateTestimony();

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const submit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    try {
      await create.mutateAsync({ title: title.trim(), description: description.trim(), tags, mediaFiles: files });
      setTitle(''); setDescription(''); setTags([]); setFiles([]);
      if (fileRef.current) fileRef.current.value = '';
      toast.success('Testimony posted');
    } catch (error) {
      toast.error(apiMessage(error));
    }
  };

  return (
    <div className='border-b border-gray-200 p-4'>
      <div className='flex gap-3'>
        <Avatar src={me?.picture} name={me?.fullName ?? me?.username} />
        <div className='flex-1 space-y-3'>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title of your testimony...'
            className='w-full bg-transparent text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none'
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Share your testimony...'
            rows={3}
            className='w-full resize-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none'
          />

          {tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {tags.map((tag) => (
                <span key={tag} className='inline-flex items-center gap-1 rounded-full bg-[#2C3248]/5 px-2 py-0.5 text-xs text-[#2C3248]'>
                  #{tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                    <X className='h-3 w-3' />
                  </button>
                </span>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <p className='text-xs text-gray-500'>{files.length} file(s) selected</p>
          )}

          <div className='flex items-center gap-3 border-t border-gray-200 pt-3'>
            <button onClick={() => fileRef.current?.click()} className='rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-[#2C3248] transition-colors'>
              <ImageIcon className='h-4 w-4' />
            </button>
            <input ref={fileRef} type='file' multiple accept='image/*,video/*' className='hidden'
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
            <div className='flex items-center gap-1'>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder='Add tag...'
                className='w-24 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 placeholder-gray-400 outline-none'
              />
              <button onClick={addTag} className='rounded-full p-1 text-gray-400 hover:text-[#2C3248] transition-colors'>
                <Tag className='h-3 w-3' />
              </button>
            </div>
            <div className='ml-auto'>
              <Button onClick={submit} disabled={create.isPending || !title.trim() || !description.trim()} size='sm'>
                {create.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

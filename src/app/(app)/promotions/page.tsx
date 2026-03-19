'use client';

import { Button, Card, EmptyState, Input, SkeletonCard } from '@/components/common';
import {
    useActivatePromotion,
    useCreatePromotion,
    useDeactivatePromotion, useDeletePromotion,
    useDeletePromotionRequest,
    usePromotion,
    usePromotionForAd,
    usePromotionRequests,
    usePromotions,
    usePromotionStats,
    useUpdatePromotion,
} from '@/hooks/usePromotion';
import { apiMessage, cn } from '@/lib/utils';
import { BarChart2, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Tab = 'my-promotions' | 'requests' | 'stats' | 'ad';

export default function PromotionsPage() {
  const [tab, setTab] = useState<Tab>('my-promotions');
  const [selectedId, setSelectedId] = useState('');
  const [editingId, setEditingId] = useState('');

  const promos = usePromotions();
  const requests = usePromotionRequests();
  const stats = usePromotionStats();
  const ad = usePromotionForAd();
  const selectedPromo = usePromotion(selectedId);

  const create = useCreatePromotion();
  const update = useUpdatePromotion();
  const activate = useActivatePromotion();
  const deactivate = useDeactivatePromotion();
  const remove = useDeletePromotion();
  const deleteRequest = useDeletePromotionRequest();

  const createForm = useForm({ defaultValues: { title: '', description: '' } });
  const editForm = useForm({ defaultValues: { title: '', description: '' } });

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
        <h1 className='text-lg font-bold'>Promotions</h1>
      </div>

      <div className='flex border-b border-slate-200'>
        {([
          { id: 'my-promotions', label: 'My Promotions' },
          { id: 'requests', label: 'Requests' },
          { id: 'stats', label: 'Stats' },
          { id: 'ad', label: 'View Ad' },
        ] as { id: Tab; label: string }[]).map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn('flex-1 py-3 text-sm font-medium transition hover:bg-slate-50', tab === id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500')}>
            {label}
          </button>
        ))}
      </div>

      <div className='p-4 space-y-4'>
        {tab === 'my-promotions' && (
          <>
            <Card>
              <h3 className='mb-3 text-sm font-bold'>Create Promotion</h3>
              <form className='space-y-2' onSubmit={createForm.handleSubmit(async (v) => {
                try { await create.mutateAsync(v); toast.success('Promotion created'); createForm.reset(); } catch (err) { toast.error(apiMessage(err)); }
              })}>
                <Input placeholder='Title' {...createForm.register('title')} />
                <Input placeholder='Description (optional)' {...createForm.register('description')} />
                <Button type='submit' disabled={create.isPending}>Create</Button>
              </form>
            </Card>

            {promos.isLoading && <SkeletonCard />}
            {(promos.data ?? []).length === 0 && !promos.isLoading && <EmptyState title='No promotions' message='Create your first promotion.' />}

            <div className='space-y-3'>
              {(promos.data ?? []).map((item) => {
                const id = item._id ?? item.id ?? '';
                const isEditing = editingId === id;
                return (
                  <Card key={id}>
                    {isEditing ? (
                      <form className='space-y-2' onSubmit={editForm.handleSubmit(async (v) => {
                        try { await update.mutateAsync({ id, payload: v }); toast.success('Updated'); setEditingId(''); } catch (err) { toast.error(apiMessage(err)); }
                      })}>
                        <Input placeholder='Title' {...editForm.register('title')} />
                        <Input placeholder='Description' {...editForm.register('description')} />
                        <div className='flex gap-2'>
                          <Button type='submit' disabled={update.isPending}>Save</Button>
                          <Button type='button' variant='secondary' onClick={() => setEditingId('')}>Cancel</Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className='flex items-start justify-between'>
                          <div>
                            <p className='font-semibold text-slate-900'>{item.title ?? item.name}</p>
                            <span className={cn('mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium', item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600')}>
                              {item.status ?? 'pending'}
                            </span>
                          </div>
                          <Megaphone className='h-5 w-5 text-slate-300' />
                        </div>
                        <div className='mt-3 flex flex-wrap gap-2'>
                          <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => activate.mutate(id)}>Activate</Button>
                          <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => deactivate.mutate(id)}>Deactivate</Button>
                          <Button variant='ghost' className='text-xs px-3 py-1.5' onClick={() => { setEditingId(id); editForm.setValue('title', item.title ?? ''); editForm.setValue('description', ''); }}>Edit</Button>
                          <Button variant='danger' className='text-xs px-3 py-1.5' onClick={() => remove.mutate(id)}>Delete</Button>
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {tab === 'requests' && (
          <>
            {requests.isLoading && <SkeletonCard />}
            {(requests.data ?? []).length === 0 && !requests.isLoading && <EmptyState title='No requests' message='No pending promotion requests.' />}
            <div className='space-y-2'>
              {(requests.data ?? []).map((item) => {
                const id = item._id ?? item.id ?? '';
                return (
                  <Card key={id} className='flex items-center justify-between'>
                    <div>
                      <p className='font-semibold text-slate-900'>{item.title ?? item.name}</p>
                      <span className={cn('text-xs', item.status === 'approved' ? 'text-green-600' : item.status === 'rejected' ? 'text-red-500' : 'text-slate-500')}>
                        {item.status ?? 'pending'}
                      </span>
                    </div>
                    <Button variant='danger' className='text-xs px-3 py-1.5' onClick={() => deleteRequest.mutate(id)}>Delete</Button>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {tab === 'stats' && (
          <Card>
            <div className='flex items-center gap-2 mb-4'>
              <BarChart2 className='h-5 w-5 text-blue-600' />
              <h3 className='font-bold text-slate-900'>Promotion Statistics</h3>
            </div>
            {stats.isLoading && <SkeletonCard />}
            {stats.data && (
              <div className='grid grid-cols-3 gap-4'>
                <div className='rounded-xl bg-blue-50 p-4 text-center'>
                  <p className='text-2xl font-bold text-blue-700'>{stats.data.views ?? 0}</p>
                  <p className='text-xs text-slate-500 mt-1'>Views</p>
                </div>
                <div className='rounded-xl bg-purple-50 p-4 text-center'>
                  <p className='text-2xl font-bold text-purple-700'>{stats.data.clicks ?? 0}</p>
                  <p className='text-xs text-slate-500 mt-1'>Clicks</p>
                </div>
                <div className='rounded-xl bg-green-50 p-4 text-center'>
                  <p className='text-2xl font-bold text-green-700'>{stats.data.conversions ?? 0}</p>
                  <p className='text-xs text-slate-500 mt-1'>Conversions</p>
                </div>
              </div>
            )}
          </Card>
        )}

        {tab === 'ad' && (
          <Card>
            <div className='flex items-center gap-2 mb-4'>
              <Megaphone className='h-5 w-5 text-purple-600' />
              <h3 className='font-bold text-slate-900'>Featured Ad</h3>
            </div>
            {ad.isLoading && <SkeletonCard />}
            {!ad.isLoading && !ad.data && <EmptyState title='No ad available' message='Check back later.' />}
            {ad.data && (
              <div className='rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
                <p className='font-bold text-slate-900'>{ad.data.title ?? ad.data.name}</p>
                <span className='mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700'>Sponsored</span>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

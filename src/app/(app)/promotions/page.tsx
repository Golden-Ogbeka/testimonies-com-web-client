'use client';

import { Button, EmptyState, Input, PageHeader, SkeletonCard, StatusBadge, TabBar } from '@/components/common';
import {
  useActivatePromotion, useCreatePromotion, useDeactivatePromotion,
  useDeletePromotion, useDeletePromotionRequest,
  usePromotionForAd, usePromotionRequests, usePromotions,
  usePromotionStats, useUpdatePromotion,
} from '@/hooks/usePromotion';
import { apiMessage } from '@/lib/utils';
import { BarChart2, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Tab = 'my-promotions' | 'requests' | 'stats' | 'ad';

export default function PromotionsPage() {
  const [tab, setTab] = useState<Tab>('my-promotions');
  const [editingId, setEditingId] = useState('');

  const promos = usePromotions();
  const requests = usePromotionRequests();
  const stats = usePromotionStats();
  const ad = usePromotionForAd();

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
      <PageHeader icon={Megaphone} title='Promotions' />

      <TabBar
        tabs={[
          { id: 'my-promotions', label: 'My Promotions' },
          { id: 'requests', label: 'Requests' },
          { id: 'stats', label: 'Stats' },
          { id: 'ad', label: 'View Ad' },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

      <div className='p-4 space-y-4'>
        {tab === 'my-promotions' && (
          <>
            <div className='rounded-xl border border-gray-200 bg-white p-4'>
              <h3 className='mb-3 text-sm font-bold text-gray-900'>Create Promotion</h3>
              <form className='space-y-2' onSubmit={createForm.handleSubmit(async (v) => {
                try { await create.mutateAsync(v); toast.success('Promotion created'); createForm.reset(); } catch (err) { toast.error(apiMessage(err)); }
              })}>
                <Input placeholder='Title' {...createForm.register('title')} />
                <Input placeholder='Description (optional)' {...createForm.register('description')} />
                <Button type='submit' disabled={create.isPending}>Create</Button>
              </form>
            </div>

            {promos.isLoading && <SkeletonCard />}
            {(promos.data?.results ?? []).length === 0 && !promos.isLoading && <EmptyState title='No promotions' message='Create your first promotion.' icon={<Megaphone className='h-8 w-8' />} />}

            <div className='space-y-3'>
              {(promos.data?.results ?? []).map((item) => {
                const id = item._id ?? item.id ?? '';
                const isEditing = editingId === id;
                return (
                  <div key={id} className='rounded-xl border border-gray-200 bg-white p-4'>
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
                            <p className='font-semibold text-gray-900'>{item.title ?? item.name}</p>
                            <StatusBadge status={item.status} className='mt-1' />
                          </div>
                          <Megaphone className='h-5 w-5 text-gray-400' />
                        </div>
                        <div className='mt-3 flex flex-wrap gap-2'>
                          <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => activate.mutate(id)}>Activate</Button>
                          <Button variant='secondary' className='text-xs px-3 py-1.5' onClick={() => deactivate.mutate(id)}>Deactivate</Button>
                          <Button variant='ghost' className='text-xs px-3 py-1.5' onClick={() => { setEditingId(id); editForm.setValue('title', item.title ?? ''); editForm.setValue('description', ''); }}>Edit</Button>
                          <Button variant='danger' className='text-xs px-3 py-1.5' onClick={() => remove.mutate(id)}>Delete</Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'requests' && (
          <>
            {requests.isLoading && <SkeletonCard />}
            {(requests.data?.results ?? []).length === 0 && !requests.isLoading && <EmptyState title='No requests' message='No pending promotion requests.' icon={<Megaphone className='h-8 w-8' />} />}
            <div className='space-y-2'>
              {(requests.data?.results ?? []).map((item) => {
                const id = item._id ?? item.id ?? '';
                return (
                  <div key={id} className='flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4'>
                    <div>
                      <p className='font-semibold text-gray-900'>{item.title ?? item.name}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <Button variant='danger' className='text-xs px-3 py-1.5' onClick={() => deleteRequest.mutate(id)}>Delete</Button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'stats' && (
          <div className='rounded-xl border border-gray-200 bg-white p-4'>
            <div className='flex items-center gap-2 mb-4'>
              <BarChart2 className='h-5 w-5 text-[#2C3248]' />
              <h3 className='font-bold text-gray-900'>Promotion Statistics</h3>
            </div>
            {stats.isLoading && <SkeletonCard />}
            {stats.data && (
              <div className='grid grid-cols-3 gap-4'>
                {[
                  { label: 'Views', value: stats.data.views },
                  { label: 'Clicks', value: stats.data.clicks },
                  { label: 'Conversions', value: stats.data.conversions },
                ].map(({ label, value }) => (
                  <div key={label} className='rounded-lg border border-gray-200 bg-white p-4 text-center'>
                    <p className='text-2xl font-bold text-[#2C3248]'>{value ?? 0}</p>
                    <p className='text-xs text-gray-500 mt-1'>{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'ad' && (
          <div className='rounded-xl border border-gray-200 bg-white p-4'>
            <div className='flex items-center gap-2 mb-4'>
              <Megaphone className='h-5 w-5 text-[#2C3248]' />
              <h3 className='font-bold text-gray-900'>Featured Ad</h3>
            </div>
            {ad.isLoading && <SkeletonCard />}
            {!ad.isLoading && !ad.data && <EmptyState title='No ad available' message='Check back later.' icon={<Megaphone className='h-8 w-8' />} />}
            {ad.data && (
              <div className='rounded-lg border border-[#2C3248]/20 bg-[#2C3248]/5 p-4'>
                <p className='font-bold text-gray-900'>{ad.data.title ?? ad.data.name}</p>
                <span className='mt-1 inline-block rounded-full bg-[#2C3248]/5 px-2 py-0.5 text-xs text-[#2C3248]'>Sponsored</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

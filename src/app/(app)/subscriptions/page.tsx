'use client';

import { Button, EmptyState, Input, PageHeader, SelectableCard, SkeletonCard, TabBar } from '@/components/common';
import {
  useCancelSubscription, usePaySubscription, useSubscribe,
  useSubscriptionHistory, useSubscriptionPlans,
  useSubscriptionStatus, useVerifyPayment,
} from '@/hooks/useSubscription';
import { apiMessage } from '@/lib/utils';
import { CheckCircle, Clock, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Tab = 'plans' | 'status' | 'history';

export default function SubscriptionsPage() {
  const [tab, setTab] = useState<Tab>('plans');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [payRef, setPayRef] = useState('');

  const plans = useSubscriptionPlans();
  const status = useSubscriptionStatus();
  const history = useSubscriptionHistory();
  const subscribe = useSubscribe();
  const pay = usePaySubscription();
  const verify = useVerifyPayment();
  const cancel = useCancelSubscription();

  return (
    <div>
      <PageHeader icon={CreditCard} title='Subscription' />

      <TabBar
        tabs={[
          { id: 'plans', label: 'Plans' },
          { id: 'status', label: 'Status' },
          { id: 'history', label: 'History' },
        ]}
        activeTab={tab}
        onTabChange={(t) => setTab(t as Tab)}
      />

      <div className='p-4 space-y-4'>
        {tab === 'plans' && (
          <>
            {plans.isLoading && <SkeletonCard />}
            {(plans.data?.results ?? []).length === 0 && !plans.isLoading && <EmptyState title='No plans available' message='' icon={<CreditCard className='h-8 w-8' />} />}
            <div className='grid gap-4 sm:grid-cols-2'>
              {(plans.data?.results ?? []).map((plan) => {
                const id = plan._id ?? plan.id ?? '';
                return (
                  <SelectableCard key={id} selected={selectedPlanId === id} onClick={() => setSelectedPlanId(id)}>
                    <div className='flex items-start justify-between'>
                      <div>
                        <p className='font-bold text-gray-900'>{plan.name}</p>
                        <p className='mt-1 text-sm text-gray-500'>{plan.description}</p>
                      </div>
                      {plan.price !== undefined && (
                        <div className='text-right'>
                          <p className='text-lg font-bold text-[#2C3248]'>${plan.price}</p>
                          <p className='text-xs text-gray-500'>/{plan.interval ?? 'mo'}</p>
                        </div>
                      )}
                    </div>
                    <div className='mt-4 flex gap-2'>
                      <Button onClick={(e) => { e.stopPropagation(); subscribe.mutate({ planId: id }); toast.success('Subscribed!'); }} disabled={subscribe.isPending}>
                        Subscribe
                      </Button>
                      <Button variant='secondary' onClick={(e) => { e.stopPropagation(); pay.mutate({ planId: id }); }} disabled={pay.isPending}>
                        Pay
                      </Button>
                    </div>
                  </SelectableCard>
                );
              })}
            </div>

            <div className='rounded-xl border border-gray-200 bg-white p-4'>
              <h3 className='mb-3 text-sm font-bold text-gray-900'>Verify Payment</h3>
              <div className='flex gap-2'>
                <Input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder='Payment reference' />
                <Button onClick={async () => {
                  try { await verify.mutateAsync({ reference: payRef }); toast.success('Payment verified'); setPayRef(''); } catch (err) { toast.error(apiMessage(err)); }
                }} disabled={verify.isPending || !payRef.trim()}>Verify</Button>
              </div>
            </div>
          </>
        )}

        {tab === 'status' && (
          <div className='rounded-xl border border-gray-200 bg-white p-4'>
            <div className='flex items-center gap-3 mb-4'>
              <CreditCard className='h-5 w-5 text-[#2C3248]' />
              <h2 className='font-bold text-gray-900'>Current Subscription</h2>
            </div>
            {status.isLoading && <SkeletonCard />}
            {status.data && (
              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  <span className='font-medium capitalize text-gray-700'>
                    {(status.data as { data?: { status?: string }; status?: string }).data?.status ?? (status.data as { status?: string }).status ?? 'Active'}
                  </span>
                </div>
                <pre className='mt-2 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-500'>
                  {JSON.stringify((status.data as { data?: unknown }).data ?? status.data, null, 2)}
                </pre>
              </div>
            )}
            <Button variant='danger' className='mt-4' onClick={() => cancel.mutate({})} disabled={cancel.isPending}>
              Cancel Subscription
            </Button>
          </div>
        )}

        {tab === 'history' && (
          <>
            {history.isLoading && <SkeletonCard />}
            {(history.data?.results ?? []).length === 0 && !history.isLoading && <EmptyState title='No history' message='No subscription history yet.' icon={<Clock className='h-8 w-8' />} />}
            <div className='space-y-2'>
              {(history.data?.results ?? []).map((item) => (
                <div key={item._id} className='flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4'>
                  <div className='flex items-center gap-3'>
                    <Clock className='h-4 w-4 text-gray-400' />
                    <div>
                      <p className='text-sm font-medium capitalize text-gray-700'>{item.status ?? 'Unknown'}</p>
                      <p className='text-xs text-gray-500'>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  {item.amount !== undefined && <p className='font-bold text-gray-900'>${item.amount}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

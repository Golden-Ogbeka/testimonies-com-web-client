'use client';

import { Button, Card, EmptyState, Input, SkeletonCard } from '@/components/common';
import {
    useCancelSubscription, usePaySubscription, useSubscribe,
    useSubscriptionHistory, useSubscriptionPlan, useSubscriptionPlans,
    useSubscriptionStatus, useVerifyPayment,
} from '@/hooks/useSubscription';
import { apiMessage, cn } from '@/lib/utils';
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

  const selectedPlan = useSubscriptionPlan(selectedPlanId);

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
        <h1 className='text-lg font-bold'>Subscription</h1>
      </div>

      <div className='flex border-b border-slate-200'>
        {(['plans', 'status', 'history'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('flex-1 py-3 text-sm font-medium capitalize transition hover:bg-slate-50', tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500')}>
            {t}
          </button>
        ))}
      </div>

      <div className='p-4 space-y-4'>
        {tab === 'plans' && (
          <>
            {plans.isLoading && <SkeletonCard />}
            {(plans.data ?? []).length === 0 && !plans.isLoading && <EmptyState title='No plans available' message='' />}
            <div className='grid gap-4 sm:grid-cols-2'>
              {(plans.data ?? []).map((plan) => {
                const id = plan._id ?? plan.id ?? '';
                const isSelected = selectedPlanId === id;
                return (
                  <Card key={id} className={cn('cursor-pointer transition', isSelected && 'ring-2 ring-blue-600')} onClick={() => setSelectedPlanId(id)}>
                    <div className='flex items-start justify-between'>
                      <div>
                        <p className='font-bold text-slate-900'>{plan.name}</p>
                        <p className='mt-1 text-sm text-slate-500'>{plan.description}</p>
                      </div>
                      {plan.price !== undefined && (
                        <div className='text-right'>
                          <p className='text-lg font-bold text-blue-600'>${plan.price}</p>
                          <p className='text-xs text-slate-400'>/{plan.interval ?? 'mo'}</p>
                        </div>
                      )}
                    </div>
                    {isSelected && selectedPlan.data && (
                      <div className='mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600'>
                        {selectedPlan.data.description}
                      </div>
                    )}
                    <div className='mt-4 flex gap-2'>
                      <Button onClick={(e) => { e.stopPropagation(); subscribe.mutate({ planId: id }); toast.success('Subscribed!'); }} disabled={subscribe.isPending}>
                        Subscribe
                      </Button>
                      <Button variant='secondary' onClick={(e) => { e.stopPropagation(); pay.mutate({ planId: id }); }} disabled={pay.isPending}>
                        Pay
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card>
              <h3 className='mb-3 text-sm font-bold text-slate-900'>Verify Payment</h3>
              <div className='flex gap-2'>
                <Input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder='Payment reference' />
                <Button onClick={async () => {
                  try { await verify.mutateAsync({ reference: payRef }); toast.success('Payment verified'); setPayRef(''); } catch (err) { toast.error(apiMessage(err)); }
                }} disabled={verify.isPending || !payRef.trim()}>Verify</Button>
              </div>
            </Card>
          </>
        )}

        {tab === 'status' && (
          <Card>
            <div className='flex items-center gap-3 mb-4'>
              <CreditCard className='h-5 w-5 text-blue-600' />
              <h2 className='font-bold text-slate-900'>Current Subscription</h2>
            </div>
            {status.isLoading && <SkeletonCard />}
            {status.data && (
              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='h-4 w-4 text-green-500' />
                  <span className='font-medium capitalize'>{status.data?.data?.status ?? status.data?.status ?? 'Active'}</span>
                </div>
                <pre className='mt-2 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-600'>
                  {JSON.stringify(status.data?.data ?? status.data, null, 2)}
                </pre>
              </div>
            )}
            <Button variant='danger' className='mt-4' onClick={() => cancel.mutate({})} disabled={cancel.isPending}>
              Cancel Subscription
            </Button>
          </Card>
        )}

        {tab === 'history' && (
          <>
            {history.isLoading && <SkeletonCard />}
            {(history.data ?? []).length === 0 && !history.isLoading && <EmptyState title='No history' message='No subscription history yet.' />}
            <div className='space-y-2'>
              {(history.data ?? []).map((item) => (
                <Card key={item._id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Clock className='h-4 w-4 text-slate-400' />
                    <div>
                      <p className='text-sm font-medium capitalize'>{item.status ?? 'Unknown'}</p>
                      <p className='text-xs text-slate-500'>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  {item.amount !== undefined && <p className='font-bold text-slate-900'>${item.amount}</p>}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { Button, ConfirmModal } from '@/components/common';
import { useAuthState } from '@/app/providers';
import { useDeleteOtherSessions, useDeleteSession, useLogout, useSessions } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { useCallback, useState } from 'react';

export default function SessionsTab() {
  const { clearAuth } = useAuthState();
  const sessions = useSessions();
  const deleteSession = useDeleteSession();
  const deleteOthers = useDeleteOtherSessions();
  const logout = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout.mutateAsync();
    window.location.href = ROUTES.SIGNIN;
    clearAuth();
  }, [logout, clearAuth]);

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-sm font-bold text-gray-900'>Active Sessions</h2>
        <Button variant='secondary' onClick={() => deleteOthers.mutate()} disabled={deleteOthers.isPending} className='px-3 py-1.5 text-xs'>
          Logout other sessions
        </Button>
      </div>
      {(sessions.data?.results ?? []).length === 0 && <p className='text-sm text-gray-500'>No sessions</p>}
      <div className='space-y-2'>
        {(sessions.data?.results ?? []).map((s) => (
          <div key={s._id} className='flex items-center justify-between rounded-lg border border-gray-200 p-3'>
            <div>
              <p className='text-sm font-medium text-gray-700'>{(s as { userAgent?: string }).userAgent ?? 'Unknown device'}</p>
              <p className='text-xs text-gray-400'>{(s as { ip?: string }).ip ?? 'Unknown IP'} &middot; {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</p>
            </div>
            <button onClick={() => deleteSession.mutate(s._id)} aria-label='Revoke session' className='text-xs text-red-500 transition-colors hover:text-red-600'>Revoke</button>
          </div>
        ))}
      </div>
      <div className='mt-4 space-y-2'>
        <Button variant='danger' className='w-full' onClick={() => setShowLogoutConfirm(true)}>Logout</Button>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title='Logout'
        message='Are you sure you want to log out?'
        confirmLabel='Logout'
        variant='danger'
        isPending={logout.isPending}
      />
    </div>
  );
}

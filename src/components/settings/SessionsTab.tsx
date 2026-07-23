'use client';

import { Button, ConfirmModal } from '@/components/common';
import { useDeleteOtherSessions, useDeleteSession, useLogout, useSessions } from '@/hooks/useAuth';
import { useCallback, useState } from 'react';

export default function SessionsTab() {
  const sessions = useSessions();
  const deleteSession = useDeleteSession();
  const deleteOthers = useDeleteOtherSessions();
  const logout = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = useCallback(() => {
    logout.mutate();
  }, [logout]);

  return (
    <div className="rounded-none border border-border bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Active Sessions</h2>
        <Button variant="secondary" onClick={() => deleteOthers.mutate()} disabled={deleteOthers.isPending} className="px-3 py-1.5 text-xs">
          Logout other sessions
        </Button>
      </div>
      {(sessions.data?.results ?? []).length === 0 && <p className="text-sm text-muted">No sessions</p>}
      <div className="space-y-2">
        {(sessions.data?.results ?? []).map((s) => (
          <div key={s._id} className="flex items-center justify-between rounded-none border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">{s.userAgent ?? 'Unknown device'}</p>
              <p className="text-xs text-muted">
                {s.ipAddress ?? 'Unknown IP'} &middot; {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
            <button
              onClick={() => deleteSession.mutate(s._id)}
              aria-label="Revoke session"
              className="text-xs text-red-500 transition-colors hover:text-red-600"
            >
              Revoke
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Button variant="danger" className="w-full" onClick={() => setShowLogoutConfirm(true)}>
          Logout
        </Button>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        variant="danger"
        isPending={logout.isPending}
      />
    </div>
  );
}

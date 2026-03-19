'use client';

import { Avatar, Button, Card, EmptyState, Input } from '@/components/common';
import { useDeleteOtherSessions, useDeleteSession, useLogout, useMe, useSessions } from '@/hooks/useAuth';
import {
    useAcceptFollowRequest,
    useBlockedUsers,
    useDeleteProfile,
    useFollowRequests,
    useRejectFollowRequest,
    useResendEmailOtp,
    useUnblockUser,
    useUpdateEmail,
    useUpdateOrgProfile,
    useUpdatePassword,
    useUpdatePhone,
    useUpdateProfileVisibility,
    useUpdateUsername,
    useUpdateUserProfile,
    useUploadCoverPicture, useUploadProfilePicture,
    useVerifyEmailOtp,
} from '@/hooks/useProfile';
import { useDeleteAllReplies, useDeleteAllTestimonies } from '@/hooks/useTestimonies';
import { apiMessage, cn } from '@/lib/utils';
import { Eye, Lock, Shield, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type SideTab = 'profile' | 'account' | 'privacy' | 'sessions' | 'danger';

export default function SettingsPage() {
  const [tab, setTab] = useState<SideTab>('profile');
  const { data: me } = useMe();

  const profileForm = useForm({ defaultValues: { fullName: me?.fullName ?? '', bio: '' } });
  const orgForm = useForm({ defaultValues: { businessName: '', businessAddress: '', businessWebsite: '', businessBio: '' } });
  const emailForm = useForm({ defaultValues: { email: '' } });
  const usernameForm = useForm({ defaultValues: { username: '' } });
  const phoneForm = useForm({ defaultValues: { phoneNumber: '' } });
  const passwordForm = useForm({ defaultValues: { oldPassword: '', newPassword: '', confirmNewPassword: '' } });
  const deleteForm = useForm({ defaultValues: { password: '' } });

  const updateProfile = useUpdateUserProfile();
  const updateOrg = useUpdateOrgProfile();
  const uploadPic = useUploadProfilePicture();
  const uploadCover = useUploadCoverPicture();
  const updateEmail = useUpdateEmail();
  const resendEmailOtp = useResendEmailOtp();
  const verifyEmailOtp = useVerifyEmailOtp();
  const updateUsername = useUpdateUsername();
  const updatePhone = useUpdatePhone();
  const updatePassword = useUpdatePassword();
  const updateVisibility = useUpdateProfileVisibility();
  const deleteProfile = useDeleteProfile();
  const deleteAllTestimonies = useDeleteAllTestimonies();
  const deleteAllReplies = useDeleteAllReplies();

  const sessions = useSessions();
  const deleteSession = useDeleteSession();
  const deleteOthers = useDeleteOtherSessions();
  const logout = useLogout();

  const blockedUsers = useBlockedUsers();
  const unblock = useUnblockUser();
  const followRequests = useFollowRequests();
  const acceptFollow = useAcceptFollowRequest();
  const rejectFollow = useRejectFollowRequest();

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const tabs: { id: SideTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'sessions', label: 'Sessions', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <div>
      <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur'>
        <h1 className='text-lg font-bold'>Settings</h1>
      </div>

      <div className='flex'>
        {/* Side nav */}
        <nav className='w-48 shrink-0 border-r border-slate-200 p-3 space-y-1'>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100',
                tab === id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
              )}
            >
              <Icon className='h-4 w-4' /> {label}
            </button>
          ))}
        </nav>

        <div className='flex-1 p-6 space-y-6 max-w-xl'>
          {/* Profile tab */}
          {tab === 'profile' && (
            <>
              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Profile Picture & Cover</h2>
                <div className='flex items-center gap-4 mb-4'>
                  <Avatar src={me?.picture} name={me?.fullName ?? me?.username} className='h-16 w-16 text-xl' />
                  <div>
                    <label className='cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50'>
                      Change photo
                      <input type='file' accept='image/*' className='hidden' onChange={async (e) => {
                        const file = e.target.files?.[0]; if (!file) return;
                        try { await uploadPic.mutateAsync(file); toast.success('Photo updated'); } catch (err) { toast.error(apiMessage(err)); }
                      }} />
                    </label>
                  </div>
                </div>
                <div>
                  <p className='mb-1 text-xs text-slate-500'>Cover image</p>
                  <label className='cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50'>
                    Change cover
                    <input type='file' accept='image/*' className='hidden' onChange={async (e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      try { await uploadCover.mutateAsync(file); toast.success('Cover updated'); } catch (err) { toast.error(apiMessage(err)); }
                    }} />
                  </label>
                </div>
              </Card>

              {me?.kind === 'individual' ? (
                <Card>
                  <h2 className='mb-4 text-sm font-bold text-slate-900'>Personal Info</h2>
                  <form className='space-y-3' onSubmit={profileForm.handleSubmit(async (v) => {
                    try { await updateProfile.mutateAsync(v); toast.success('Profile updated'); } catch (err) { toast.error(apiMessage(err)); }
                  })}>
                    <Input placeholder='Full name' {...profileForm.register('fullName')} />
                    <Input placeholder='Bio' {...profileForm.register('bio')} />
                    <Button type='submit' disabled={updateProfile.isPending}>Save</Button>
                  </form>
                </Card>
              ) : (
                <Card>
                  <h2 className='mb-4 text-sm font-bold text-slate-900'>Organization Info</h2>
                  <form className='space-y-3' onSubmit={orgForm.handleSubmit(async (v) => {
                    try { await updateOrg.mutateAsync(v); toast.success('Organization updated'); } catch (err) { toast.error(apiMessage(err)); }
                  })}>
                    <Input placeholder='Business name' {...orgForm.register('businessName')} />
                    <Input placeholder='Business address' {...orgForm.register('businessAddress')} />
                    <Input placeholder='Website URL' {...orgForm.register('businessWebsite')} />
                    <Input placeholder='Business bio' {...orgForm.register('businessBio')} />
                    <Button type='submit' disabled={updateOrg.isPending}>Save</Button>
                  </form>
                </Card>
              )}
            </>
          )}

          {/* Account tab */}
          {tab === 'account' && (
            <>
              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Email</h2>
                <form className='space-y-3' onSubmit={emailForm.handleSubmit(async (v) => {
                  try { await updateEmail.mutateAsync(v); setOtpSent(true); toast.success('OTP sent to new email'); } catch (err) { toast.error(apiMessage(err)); }
                })}>
                  <Input placeholder='New email' type='email' {...emailForm.register('email')} />
                  <Button type='submit' disabled={updateEmail.isPending}>Update email</Button>
                </form>
                {otpSent && (
                  <div className='mt-3 flex gap-2'>
                    <Input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder='Enter OTP' />
                    <Button onClick={async () => {
                      try { await verifyEmailOtp.mutateAsync(otpCode); toast.success('Email verified'); setOtpSent(false); } catch (err) { toast.error(apiMessage(err)); }
                    }}>Verify</Button>
                    <Button variant='secondary' onClick={() => resendEmailOtp.mutate()}>Resend</Button>
                  </div>
                )}
              </Card>

              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Username</h2>
                <form className='space-y-3' onSubmit={usernameForm.handleSubmit(async (v) => {
                  try { await updateUsername.mutateAsync(v); toast.success('Username updated'); } catch (err) { toast.error(apiMessage(err)); }
                })}>
                  <Input placeholder='New username' {...usernameForm.register('username')} />
                  <Button type='submit' disabled={updateUsername.isPending}>Update username</Button>
                </form>
              </Card>

              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Phone</h2>
                <form className='space-y-3' onSubmit={phoneForm.handleSubmit(async (v) => {
                  try { await updatePhone.mutateAsync(v); toast.success('Phone updated'); } catch (err) { toast.error(apiMessage(err)); }
                })}>
                  <Input placeholder='+1234567890' {...phoneForm.register('phoneNumber')} />
                  <Button type='submit' disabled={updatePhone.isPending}>Update phone</Button>
                </form>
              </Card>

              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Password</h2>
                <form className='space-y-3' onSubmit={passwordForm.handleSubmit(async (v) => {
                  try { await updatePassword.mutateAsync(v); toast.success('Password updated'); passwordForm.reset(); } catch (err) { toast.error(apiMessage(err)); }
                })}>
                  <Input type='password' placeholder='Current password' {...passwordForm.register('oldPassword')} />
                  <Input type='password' placeholder='New password' {...passwordForm.register('newPassword')} />
                  <Input type='password' placeholder='Confirm new password' {...passwordForm.register('confirmNewPassword')} />
                  <Button type='submit' disabled={updatePassword.isPending}>Update password</Button>
                </form>
              </Card>
            </>
          )}

          {/* Privacy tab */}
          {tab === 'privacy' && (
            <>
              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Profile Visibility</h2>
                <div className='space-y-2'>
                  {(['public', 'private', 'secret'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => updateVisibility.mutate({ profileVisibility: v })}
                      className='flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm hover:bg-slate-50'
                    >
                      <span className='capitalize font-medium'>{v}</span>
                      <span className='text-xs text-slate-500'>
                        {v === 'public' ? 'Anyone can see your profile' : v === 'private' ? 'Only followers can see' : 'Hidden from everyone'}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Follow Requests</h2>
                {(followRequests.data ?? []).length === 0 && <EmptyState title='No pending requests' message='' />}
                <div className='space-y-2'>
                  {(followRequests.data ?? []).map((req) => (
                    <div key={req._id} className='flex items-center justify-between rounded-lg border border-slate-200 p-3'>
                      <div className='flex items-center gap-2'>
                        <Avatar src={req.requester?.picture} name={req.requester?.fullName ?? req.requester?.username} className='h-8 w-8' />
                        <p className='text-sm font-medium'>{req.requester?.fullName ?? req.requester?.username}</p>
                      </div>
                      <div className='flex gap-2'>
                        <Button onClick={() => acceptFollow.mutate(req._id)} className='px-3 py-1 text-xs'>Accept</Button>
                        <Button variant='secondary' onClick={() => rejectFollow.mutate(req._id)} className='px-3 py-1 text-xs'>Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className='mb-4 text-sm font-bold text-slate-900'>Blocked Users</h2>
                {(blockedUsers.data ?? []).length === 0 && <EmptyState title='No blocked users' message='' />}
                <div className='space-y-2'>
                  {(blockedUsers.data ?? []).map((item) => (
                    <div key={item._id} className='flex items-center justify-between rounded-lg border border-slate-200 p-3'>
                      <div className='flex items-center gap-2'>
                        <Avatar src={item.blockedUser?.picture} name={item.blockedUser?.fullName ?? item.blockedUser?.username} className='h-8 w-8' />
                        <p className='text-sm font-medium'>{item.blockedUser?.fullName ?? item.blockedUser?.username}</p>
                      </div>
                      <Button variant='secondary' onClick={() => unblock.mutate(item.blockedUser?._id ?? '')} className='px-3 py-1 text-xs'>Unblock</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Sessions tab */}
          {tab === 'sessions' && (
            <Card>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-sm font-bold text-slate-900'>Active Sessions</h2>
                <Button variant='secondary' onClick={() => deleteOthers.mutate()} disabled={deleteOthers.isPending} className='text-xs px-3 py-1.5'>
                  Logout other sessions
                </Button>
              </div>
              {(sessions.data ?? []).length === 0 && <EmptyState title='No sessions' message='' />}
              <div className='space-y-2'>
                {(sessions.data ?? []).map((s) => (
                  <div key={s._id} className='flex items-center justify-between rounded-lg border border-slate-200 p-3'>
                    <div>
                      <p className='text-sm font-medium text-slate-900'>{s.userAgent ?? 'Unknown device'}</p>
                      <p className='text-xs text-slate-500'>{s.ip ?? 'Unknown IP'} · {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</p>
                    </div>
                    <Button variant='ghost' onClick={() => deleteSession.mutate(s._id)} className='text-xs text-red-500 hover:bg-red-50'>Revoke</Button>
                  </div>
                ))}
              </div>
              <Button variant='danger' className='mt-4 w-full' onClick={() => logout.mutate()}>Logout</Button>
            </Card>
          )}

          {/* Danger zone */}
          {tab === 'danger' && (
            <>
              <Card className='border-red-200'>
                <h2 className='mb-1 text-sm font-bold text-red-700'>Delete All Testimonies</h2>
                <p className='mb-3 text-xs text-slate-500'>This will permanently delete all your testimonies.</p>
                <form className='flex gap-2' onSubmit={(e) => { e.preventDefault(); const pw = (e.currentTarget.elements.namedItem('pw') as HTMLInputElement).value; deleteAllTestimonies.mutate(pw); }}>
                  <Input name='pw' type='password' placeholder='Confirm password' />
                  <Button type='submit' variant='danger' disabled={deleteAllTestimonies.isPending}>Delete all</Button>
                </form>
              </Card>

              <Card className='border-red-200'>
                <h2 className='mb-1 text-sm font-bold text-red-700'>Delete All Replies</h2>
                <p className='mb-3 text-xs text-slate-500'>This will permanently delete all your replies.</p>
                <form className='flex gap-2' onSubmit={(e) => { e.preventDefault(); const pw = (e.currentTarget.elements.namedItem('pw') as HTMLInputElement).value; deleteAllReplies.mutate(pw); }}>
                  <Input name='pw' type='password' placeholder='Confirm password' />
                  <Button type='submit' variant='danger' disabled={deleteAllReplies.isPending}>Delete all</Button>
                </form>
              </Card>

              <Card className='border-red-200'>
                <h2 className='mb-1 text-sm font-bold text-red-700'>Delete Account</h2>
                <p className='mb-3 text-xs text-slate-500'>This action is irreversible. Your account will be permanently deleted.</p>
                <form className='flex gap-2' onSubmit={deleteForm.handleSubmit(async (v) => {
                  try { await deleteProfile.mutateAsync(v); toast.success('Account deleted'); } catch (err) { toast.error(apiMessage(err)); }
                })}>
                  <Input type='password' placeholder='Confirm password' {...deleteForm.register('password')} />
                  <Button type='submit' variant='danger' disabled={deleteProfile.isPending}>Delete account</Button>
                </form>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

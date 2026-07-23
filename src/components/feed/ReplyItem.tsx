'use client';

import { Avatar, ConfirmModal } from '@/components/common';
import { useMe } from '@/hooks/useAuth';
import { useDeleteReply, useLikeReply, useUnlikeReply } from '@/hooks/useTestimonies';
import { cn } from '@/lib/utils';
import type { Reply } from '@/types/testimony';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, Trash2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

function ReplyItem({ reply }: { reply: Reply }) {
  const { data: me } = useMe();
  const deleteReply = useDeleteReply();
  const likeReply = useLikeReply();
  const unlikeReply = useUnlikeReply();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const removeReply = useCallback(
    () => deleteReply.mutate({ id: reply._id, testimonyId: reply.testimonyId }),
    [deleteReply, reply._id, reply.testimonyId],
  );
  const toggleLike = useCallback(() => {
    if (reply.isLiked) {
      unlikeReply.mutate({ id: reply._id, testimonyId: reply.testimonyId });
      return;
    }
    likeReply.mutate({ id: reply._id, testimonyId: reply.testimonyId });
  }, [reply.isLiked, reply._id, reply.testimonyId, likeReply, unlikeReply]);

  const fullName = `${reply.userDetails.firstName} ${reply.userDetails.lastName}`;

  return (
    <div className="border-b border-border/60 px-5 py-3.5 transition-colors duration-300 hover:bg-card-hover/40">
      <div className="flex items-start gap-3">
        <Avatar src={reply.userDetails.profileImage} name={fullName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{fullName}</span>
            <span className="text-xs text-muted">@{reply.userDetails.username}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-muted">{formatDistanceToNowStrict(new Date(reply.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="mt-0.5 text-sm text-foreground break-all">{reply.content}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            <button
              onClick={toggleLike}
              aria-label={reply.isLiked ? 'Unlike reply' : 'Like reply'}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 transition-colors hover:text-foreground',
                reply.isLiked && 'text-foreground',
              )}
            >
              <Heart className={cn('h-3.5 w-3.5', reply.isLiked && 'fill-foreground')} strokeWidth={1.5} />
              {reply.likesCount}
            </button>
            {me?._id === reply.userDetails._id && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                aria-label="Delete reply"
                className="p-1 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}

            <ConfirmModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={() => {
                removeReply();
                setShowDeleteConfirm(false);
              }}
              title="Delete reply"
              message="Are you sure you want to delete this reply? This action cannot be undone."
              confirmLabel="Delete"
              variant="danger"
              isPending={deleteReply.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ReplyItem);

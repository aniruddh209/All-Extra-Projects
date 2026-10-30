import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';
import RoleBadge from '../../../components/shared/RoleBadge';
import { formatDate } from '../../../utils/formatDate';
import ROLES from '../../../constants/roles';

export const UserTable = ({
  users = [],
  currentUserId = '',
  isLoading = false,
  onToggleStatus,
  onDelete,
  onAddUser,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title="No team members"
        description="Add admins or staff members to collaborate on billing and customer management."
        actionLabel="Add Member"
        onAction={onAddUser}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#0D1017] border-b border-[#1E293F] text-[#94A3B8] uppercase tracking-wider font-semibold">
          <tr>
            <th className="py-3.5 px-4">Name</th>
            <th className="py-3.5 px-4">Email</th>
            <th className="py-3.5 px-4 text-center">Role</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4">Created</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1A2337]">
          {users.map((user) => {
            const isSelf = user._id === currentUserId;
            const isOwner = user.role === ROLES.OWNER;
            const isActive = user.isActive !== false;

            return (
              <tr
                key={user._id}
                className="hover:bg-[#111625] transition-colors group"
              >
                {/* Name */}
                <td className="py-3.5 px-4 font-semibold text-[#F8FAFC]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#6366F1]/20 border border-[#818CF8]/30 flex items-center justify-center text-xs font-bold text-[#A5B4FC]">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="font-semibold text-[#F8FAFC]">
                        {user.name}
                      </span>
                      {isSelf && (
                        <span className="ml-1.5 text-[10px] text-[#818CF8] font-mono bg-[#6366F1]/15 px-1.5 py-0.5 rounded border border-[#6366F1]/30">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-3.5 px-4 font-mono text-[#CBD5E1]">
                  {user.email}
                </td>

                {/* Role */}
                <td className="py-3.5 px-4 text-center">
                  <RoleBadge role={user.role} />
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => !isOwner && !isSelf && onToggleStatus && onToggleStatus(user)}
                    disabled={isOwner || isSelf}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 hover:bg-[#10B981]/25'
                        : 'bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30 hover:bg-[#EF4444]/25'
                    } ${isOwner || isSelf ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                    title={isOwner || isSelf ? 'Owner status cannot be toggled' : 'Click to toggle active status'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>

                {/* Created At */}
                <td className="py-3.5 px-4 text-[#94A3B8]">
                  {formatDate(user.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {!isOwner && (
                      <Link
                        to={`/users/${user._id}/edit`}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#818CF8] hover:bg-[#6366F1]/15 transition-colors"
                        title="Edit Member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {!isOwner && !isSelf && (
                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

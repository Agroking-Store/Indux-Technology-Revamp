'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  Edit2,
  Trash2,
  Plus,
  Users,
  Search,
  Eye,
  EyeOff,
  Globe,
  Share2,
  Link2,
  Mail,
  ArrowUpDown,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  TeamMember,
  getAdminTeamMembers,
  deleteTeamMember,
  updateTeamMemberStatus,
  getAdminImageUrl,
} from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminTeamMembers({
        search: searchTerm || undefined,
        department: selectedDepartment !== 'All' ? selectedDepartment : undefined,
      });
      const list = data?.teamMembers || (Array.isArray(data) ? data : []);
      setMembers(list);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDepartment]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteTeamMember(memberToDelete._id);
      toast.success('Team member deleted successfully');
      setMembers((prev) => prev.filter((m) => m._id !== memberToDelete._id));
      setMemberToDelete(null);
    } catch (error) {
      console.error('Failed to delete member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleToggleStatus = async (member: TeamMember) => {
    const newStatus = member.status === 'Published' ? 'Draft' : 'Published';
    try {
      await updateTeamMemberStatus(member._id, newStatus);
      toast.success(`Member status updated to ${newStatus}`);
      setMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, status: newStatus } : m))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update member status');
    }
  };

  // Extract unique departments for filter
  const departments = ['All', ...Array.from(new Set(members.map((m) => m.department).filter(Boolean)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="size-6 text-indigo-600 dark:text-indigo-400" />
            Our Team Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add, update, or remove leadership and engineering team members shown on the About Us page.
          </p>
        </div>
        <Link
          href="/team/create"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-sm shrink-0 cursor-pointer'
          )}
        >
          <Plus className="size-4" /> Add Team Member
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Department:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept as string)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                selectedDepartment === dept
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <TableHead className="w-16">Photo</TableHead>
              <TableHead>Member Details</TableHead>
              <TableHead>Department & Role</TableHead>
              <TableHead className="w-24 text-center">
                <span className="inline-flex items-center gap-1">
                  <ArrowUpDown className="size-3" /> Order
                </span>
              </TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="size-12 rounded-xl" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="size-8 text-slate-400 opacity-60" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No team members found
                    </p>
                    <p className="text-xs text-slate-400">
                      {searchTerm ? 'Try a different search query' : 'Get started by adding your first team member'}
                    </p>
                    {!searchTerm && (
                      <Link
                        href="/team/create"
                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-2 cursor-pointer')}
                      >
                        <Plus className="size-3.5 mr-1" /> Add Member
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member._id}
                  className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Photo Preview */}
                  <TableCell>
                    <div className="relative size-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      <Image
                        src={getAdminImageUrl(member.image)}
                        alt={member.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </TableCell>

                  {/* Name & Bio */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </span>
                      {member.bio && (
                        <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {member.bio}
                        </span>
                      )}
                      {/* Social icons indicator */}
                      <div className="flex items-center gap-2 mt-1.5 text-slate-400">
                        {member.socialLinks?.linkedin && (
                          <Globe className="size-3 hover:text-blue-500" />
                        )}
                        {member.socialLinks?.twitter && (
                          <Share2 className="size-3 hover:text-sky-500" />
                        )}
                        {member.socialLinks?.github && (
                          <Link2 className="size-3 hover:text-slate-800 dark:hover:text-white" />
                        )}
                        {member.socialLinks?.email && (
                          <Mail className="size-3 hover:text-emerald-500" />
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Role & Department */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {member.role}
                      </span>
                      <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                        {member.department || 'General'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Order */}
                  <TableCell className="text-center font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                    {member.order ?? 0}
                  </TableCell>

                  {/* Status Toggle */}
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(member)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer',
                        member.status === 'Published'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                      )}
                    >
                      {member.status === 'Published' ? (
                        <>
                          <Eye className="size-3" /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-3" /> Hidden
                        </>
                      )}
                    </button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/team/${member._id}/edit`}
                        className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                        title="Edit Member"
                      >
                        <Edit2 className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMemberToDelete(member)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete Member"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!memberToDelete}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null);
        }}
        title="Delete Team Member?"
        description={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone and will remove their photo from the About Us page.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

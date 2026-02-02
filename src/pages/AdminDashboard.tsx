import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminJobs, useCreateJob, useUpdateJob, useDeleteJob, useToggleJobStatus } from '@/hooks/useJobs';
import { JobFormModal } from '@/components/JobFormModal';
import { Job, JobFormData } from '@/types/job';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Search,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminDashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { data: jobs, isLoading } = useAdminJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();
  const toggleStatus = useToggleJobStatus();

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleCreateJob = (data: JobFormData) => {
    createJob.mutate(data, {
      onSuccess: () => setFormOpen(false),
    });
  };

  const handleUpdateJob = (data: JobFormData) => {
    if (!editingJob) return;
    updateJob.mutate(
      { id: editingJob.id, ...data },
      {
        onSuccess: () => {
          setEditingJob(null);
        },
      }
    );
  };

  const handleDeleteJob = () => {
    if (!deletingJob) return;
    deleteJob.mutate(deletingJob.id, {
      onSuccess: () => setDeletingJob(null),
    });
  };

  const handleToggleStatus = (job: Job) => {
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    toggleStatus.mutate({ id: job.id, status: newStatus });
  };

  const filteredJobs = jobs?.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.job_id.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = jobs?.filter((j) => j.status === 'active').length || 0;
  const inactiveCount = jobs?.filter((j) => j.status === 'inactive').length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">JobHub Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Jobs
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{jobs?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Jobs
              </CardTitle>
              <ToggleRight className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{activeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inactive Jobs
              </CardTitle>
              <ToggleLeft className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{inactiveCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>

        {/* Jobs Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !filteredJobs || filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {search ? 'No jobs match your search' : 'No jobs yet. Add your first job!'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.job_id}</TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={job.status === 'active' ? 'default' : 'secondary'}
                            className={
                              job.status === 'active'
                                ? 'bg-success hover:bg-success/90'
                                : 'bg-warning hover:bg-warning/90 text-warning-foreground'
                            }
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(job)}
                              title={job.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {job.status === 'active' ? (
                                <ToggleRight className="h-4 w-4 text-success" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingJob(job)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingJob(job)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Job Modal */}
      <JobFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateJob}
        isLoading={createJob.isPending}
      />

      {/* Edit Job Modal */}
      <JobFormModal
        job={editingJob}
        open={!!editingJob}
        onClose={() => setEditingJob(null)}
        onSubmit={handleUpdateJob}
        isLoading={updateJob.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingJob} onOpenChange={() => setDeletingJob(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingJob?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

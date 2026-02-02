import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job, JobFormData } from '@/types/job';
import { toast } from 'sonner';

// Fetch active jobs for public view
export function usePublicJobs(keyword?: string, location?: string) {
  return useQuery({
    queryKey: ['public-jobs', keyword, location],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (keyword) {
        query = query.or(`title.ilike.%${keyword}%,company.ilike.%${keyword}%,skills.cs.{${keyword}}`);
      }
      
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Job[];
    },
  });
}

// Fetch all jobs for admin
export function useAdminJobs() {
  return useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    },
  });
}

// Fetch single job
export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();
      
      if (error) throw error;
      return data as Job;
    },
    enabled: !!jobId,
  });
}

// Create job
export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (job: JobFormData) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert([job])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['public-jobs'] });
      toast.success('Job created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create job: ${error.message}`);
    },
  });
}

// Update job
export function useUpdateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...job }: Partial<Job> & { id: string }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update(job)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['public-jobs'] });
      toast.success('Job updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update job: ${error.message}`);
    },
  });
}

// Delete job
export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['public-jobs'] });
      toast.success('Job deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete job: ${error.message}`);
    },
  });
}

// Toggle job status
export function useToggleJobStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['public-jobs'] });
      toast.success(`Job ${data.status === 'active' ? 'activated' : 'deactivated'}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update job status: ${error.message}`);
    },
  });
}

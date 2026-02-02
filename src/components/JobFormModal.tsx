import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Job, JobFormData } from '@/types/job';

const jobSchema = z.object({
  job_id: z.string().min(1, 'Job ID is required').max(20, 'Job ID must be less than 20 characters'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must be less than 100 characters'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  experience: z.string().min(1, 'Experience is required').max(50, 'Experience must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be less than 5000 characters'),
  hr_email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  hr_phone: z.string().min(1, 'Phone is required').max(20, 'Phone must be less than 20 characters'),
  status: z.enum(['active', 'inactive']),
});

interface JobFormModalProps {
  job?: Job | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
  isLoading?: boolean;
}

export function JobFormModal({ job, open, onClose, onSubmit, isLoading }: JobFormModalProps) {
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(job?.skills || []);

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_id: job?.job_id || '',
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      experience: job?.experience || '',
      description: job?.description || '',
      hr_email: job?.hr_email || '',
      hr_phone: job?.hr_phone || '',
      status: job?.status || 'active',
    },
  });

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (data: z.infer<typeof jobSchema>) => {
    if (skills.length === 0) {
      form.setError('root', { message: 'At least one skill is required' });
      return;
    }
    const formData: JobFormData = {
      job_id: data.job_id,
      title: data.title,
      company: data.company,
      location: data.location,
      experience: data.experience,
      description: data.description,
      hr_email: data.hr_email,
      hr_phone: data.hr_phone,
      status: data.status,
      skills,
    };
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {job ? 'Edit Job' : 'Add New Job'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="job_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job ID</FormLabel>
                    <FormControl>
                      <Input placeholder="JOB-001" {...field} disabled={!!job} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior DevOps Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Required</FormLabel>
                  <FormControl>
                    <Input placeholder="3-5 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" variant="secondary" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground">Add at least one skill</p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the job responsibilities, requirements, and benefits..."
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hr_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HR Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="hr@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hr_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HR Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { Building2, MapPin, Clock, Mail, Phone, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Job } from '@/types/job';

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

export function JobDetailsModal({ job, open, onClose }: JobDetailsModalProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xs">
                {job.job_id}
              </Badge>
              <DialogTitle className="font-display text-2xl font-bold leading-tight">
                {job.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{job.experience}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground">Job Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-foreground">HR Contact</h4>
            <div className="flex flex-col gap-3">
              <a 
                href={`mailto:${job.hr_email}`} 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <span>{job.hr_email}</span>
              </a>
              <a 
                href={`tel:${job.hr_phone}`} 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <span>{job.hr_phone}</span>
              </a>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button asChild className="flex-1">
              <a href={`mailto:${job.hr_email}?subject=Application for ${job.title} (${job.job_id})`}>
                Apply via Email
              </a>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

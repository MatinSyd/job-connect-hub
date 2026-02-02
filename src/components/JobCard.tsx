import { Building2, MapPin, Clock, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h3 className="font-display text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{job.company}</span>
            </div>
          </div>
          <Badge variant="secondary" className="flex-shrink-0 text-xs">
            {job.job_id}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{job.experience}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <a href={`mailto:${job.hr_email}`} className="hover:text-primary transition-colors truncate">
              {job.hr_email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <a href={`tel:${job.hr_phone}`} className="hover:text-primary transition-colors">
              {job.hr_phone}
            </a>
          </div>
        </div>
        
        <Button 
          onClick={() => onViewDetails(job)} 
          className="w-full mt-2"
          variant="secondary"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

import { Search, Briefcase } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-jobs' | 'no-results';
  keyword?: string;
  location?: string;
}

export function EmptyState({ type, keyword, location }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No jobs found
        </h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any jobs matching 
          {keyword && <span className="font-medium"> "{keyword}"</span>}
          {keyword && location && ' in'}
          {location && <span className="font-medium"> {location}</span>}.
          <br />
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Briefcase className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        No active jobs
      </h3>
      <p className="text-muted-foreground max-w-md">
        There are currently no active job listings. Please check back later.
      </p>
    </div>
  );
}

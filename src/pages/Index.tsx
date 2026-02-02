import { useState } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { JobCard } from '@/components/JobCard';
import { JobDetailsModal } from '@/components/JobDetailsModal';
import { EmptyState } from '@/components/EmptyState';
import { usePublicJobs } from '@/hooks/useJobs';
import { Job } from '@/types/job';
import { Briefcase, Users, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const { data: jobs, isLoading } = usePublicJobs(keyword, location);

  const handleSearch = (newKeyword: string, newLocation: string) => {
    setKeyword(newKeyword);
    setLocation(newLocation);
  };

  const hasSearched = keyword || location;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl animate-fade-in">
              Find Your Dream Job
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Discover thousands of job opportunities from top companies. 
              Start your next career journey today.
            </p>
            <div className="mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="rounded-2xl bg-card/95 backdrop-blur p-4 shadow-xl">
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center gap-3 text-primary-foreground/90">
              <Briefcase className="h-6 w-6" />
              <span className="text-lg font-medium">{jobs?.length || 0}+ Active Jobs</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary-foreground/90">
              <Building className="h-6 w-6" />
              <span className="text-lg font-medium">Top Companies</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-primary-foreground/90">
              <Users className="h-6 w-6" />
              <span className="text-lg font-medium">No Sign-up Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {hasSearched ? 'Search Results' : 'Latest Job Openings'}
            </h2>
            {jobs && jobs.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <EmptyState 
              type={hasSearched ? 'no-results' : 'no-jobs'} 
              keyword={keyword}
              location={location}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className="animate-slide-up" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <JobCard job={job} onViewDetails={setSelectedJob} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} JobHub. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Job Details Modal */}
      <JobDetailsModal 
        job={selectedJob} 
        open={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
      />
    </div>
  );
};

export default Index;

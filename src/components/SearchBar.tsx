import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (keyword: string, location: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim(), location.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Job title, keyword, or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 h-12 text-base bg-background"
          />
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 h-12 text-base bg-background"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-8" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Jobs'}
        </Button>
      </div>
    </form>
  );
}

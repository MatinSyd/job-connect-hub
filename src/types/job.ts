export interface Job {
  id: string;
  job_id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  description: string;
  hr_email: string;
  hr_phone: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface JobFormData {
  job_id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  description: string;
  hr_email: string;
  hr_phone: string;
  status: 'active' | 'inactive';
}

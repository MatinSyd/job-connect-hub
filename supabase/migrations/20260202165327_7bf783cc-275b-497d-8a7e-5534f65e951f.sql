-- Create enum for job status
CREATE TYPE public.job_status AS ENUM ('active', 'inactive');

-- Create enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create jobs table
CREATE TABLE public.jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    experience TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    hr_email TEXT NOT NULL,
    hr_phone TEXT NOT NULL,
    status job_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin authorization
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for jobs table
-- Anyone can view active jobs (public access)
CREATE POLICY "Anyone can view active jobs" 
ON public.jobs 
FOR SELECT 
USING (status = 'active');

-- Admins can view all jobs
CREATE POLICY "Admins can view all jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert jobs
CREATE POLICY "Admins can insert jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update jobs
CREATE POLICY "Admins can update jobs" 
ON public.jobs 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete jobs
CREATE POLICY "Admins can delete jobs" 
ON public.jobs 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster job searches
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_title ON public.jobs USING gin(to_tsvector('english', title));
CREATE INDEX idx_jobs_company ON public.jobs USING gin(to_tsvector('english', company));
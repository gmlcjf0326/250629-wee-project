-- Wee Project Content Tables for Scraped Data

-- Table for general content from various pages
CREATE TABLE IF NOT EXISTS wee_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  category VARCHAR(100) NOT NULL, -- main, about, history, system, etc.
  subcategory VARCHAR(100), -- banner, quick_link, introduction, etc.
  metadata JSONB, -- Additional flexible data
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for announcements/news
CREATE TABLE IF NOT EXISTS wee_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  author VARCHAR(255),
  posted_date DATE,
  views INTEGER DEFAULT 0,
  attachments TEXT[], -- Array of attachment URLs
  category VARCHAR(100) NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Wee institutions (클래스, 센터, 스쿨)
CREATE TABLE IF NOT EXISTS wee_institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('class', 'center', 'school')),
  region VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  services TEXT[], -- Array of services offered
  coordinates JSONB, -- {lat: number, lng: number}
  operating_hours VARCHAR(255),
  capacity INTEGER,
  staff_count INTEGER,
  source_url TEXT,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for newsletters
CREATE TABLE IF NOT EXISTS wee_newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  issue_number VARCHAR(100),
  issue_date DATE,
  content TEXT,
  pdf_url TEXT,
  thumbnail_url TEXT,
  highlights TEXT[], -- Array of highlight points
  download_count INTEGER DEFAULT 0,
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for resources (매뉴얼, 자료집, etc.)
CREATE TABLE IF NOT EXISTS wee_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- manual, program, case_study
  subcategory VARCHAR(100),
  file_url TEXT,
  file_size VARCHAR(50),
  file_type VARCHAR(50),
  version VARCHAR(50),
  author VARCHAR(255),
  published_date DATE,
  download_count INTEGER DEFAULT 0,
  tags TEXT[],
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for statistics/metrics
CREATE TABLE IF NOT EXISTS wee_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(255) NOT NULL,
  metric_value NUMERIC,
  metric_unit VARCHAR(50),
  category VARCHAR(100),
  year INTEGER,
  month INTEGER,
  region VARCHAR(100),
  metadata JSONB,
  source_url TEXT,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_wee_contents_category ON wee_contents(category);
CREATE INDEX idx_wee_contents_scraped_at ON wee_contents(scraped_at DESC);

CREATE INDEX idx_wee_announcements_posted_date ON wee_announcements(posted_date DESC);
CREATE INDEX idx_wee_announcements_category ON wee_announcements(category);

CREATE INDEX idx_wee_institutions_type ON wee_institutions(type);
CREATE INDEX idx_wee_institutions_region ON wee_institutions(region);

CREATE INDEX idx_wee_newsletters_issue_date ON wee_newsletters(issue_date DESC);

CREATE INDEX idx_wee_resources_category ON wee_resources(category);
CREATE INDEX idx_wee_resources_published_date ON wee_resources(published_date DESC);

CREATE INDEX idx_wee_statistics_year_month ON wee_statistics(year, month);
CREATE INDEX idx_wee_statistics_metric_name ON wee_statistics(metric_name);

-- Enable Row Level Security
ALTER TABLE wee_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_statistics ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for wee_contents" ON wee_contents
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_announcements" ON wee_announcements
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_institutions" ON wee_institutions
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_newsletters" ON wee_newsletters
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_resources" ON wee_resources
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_statistics" ON wee_statistics
  FOR SELECT USING (true);

-- Admin write access policies
CREATE POLICY "Admin write access for wee_contents" ON wee_contents
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

CREATE POLICY "Admin write access for wee_announcements" ON wee_announcements
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Add similar admin policies for other tables...

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_wee_contents_updated_at BEFORE UPDATE ON wee_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_announcements_updated_at BEFORE UPDATE ON wee_announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_institutions_updated_at BEFORE UPDATE ON wee_institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_newsletters_updated_at BEFORE UPDATE ON wee_newsletters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_resources_updated_at BEFORE UPDATE ON wee_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
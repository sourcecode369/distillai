-- Weekly Reports Table
-- Stores weekly research reports/highlights that are displayed in the Weekly Dashboard
-- These reports showcase significant progress in AI/ML research and applications

CREATE TABLE IF NOT EXISTS weekly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start_date DATE NOT NULL, -- Start date of the week (e.g., April 22, 2025)
  week_end_date DATE NOT NULL, -- End date of the week (e.g., April 28, 2025)
  week_number INTEGER, -- Optional week number (e.g., Week 17)
  title TEXT NOT NULL, -- e.g., "Week 17: Advancements in LLM Capabilities and Applications"
  summary TEXT NOT NULL, -- Short summary/description
  tags TEXT[] DEFAULT '{}', -- Array of tags like ["LLMs", "Reasoning", "Agents"]
  content JSONB, -- Full content details (can store structured data)
  published BOOLEAN DEFAULT TRUE, -- Whether the report is published
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(week_start_date) -- One report per week
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week_start_date ON weekly_reports(week_start_date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week_number ON weekly_reports(week_number DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_published ON weekly_reports(published);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_created_at ON weekly_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_tags ON weekly_reports USING GIN(tags);

-- Row Level Security (RLS) Policies
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

-- Everyone can view published weekly reports
CREATE POLICY "Anyone can view published weekly reports"
  ON weekly_reports FOR SELECT
  USING (published = TRUE);

-- Only admins can view all reports (including unpublished)
CREATE POLICY "Admins can view all weekly reports"
  ON weekly_reports FOR SELECT
  USING (public.is_admin_user());

-- Only admins can insert weekly reports
CREATE POLICY "Admins can create weekly reports"
  ON weekly_reports FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Only admins can update weekly reports
CREATE POLICY "Admins can update weekly reports"
  ON weekly_reports FOR UPDATE
  USING (public.is_admin_user());

-- Only admins can delete weekly reports
CREATE POLICY "Admins can delete weekly reports"
  ON weekly_reports FOR DELETE
  USING (public.is_admin_user());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_weekly_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_weekly_reports_updated_at
  BEFORE UPDATE ON weekly_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_reports_updated_at();


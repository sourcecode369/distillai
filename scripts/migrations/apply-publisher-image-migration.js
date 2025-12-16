import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://qmafiaowsbabufgputsl.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYWZpYW93c2JhYnVmZ3B1dHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg5NTk3MCwiZXhwIjoyMDc5NDcxOTcwfQ.Ov-RouPcRlF4N1xOOYGBlZNYQO9so9OUpFW795V181s';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sql = `
ALTER TABLE public.models_catalog
ADD COLUMN IF NOT EXISTS publisher_image TEXT;

COMMENT ON COLUMN models_catalog.publisher_image IS 'Logo/avatar URL for the publisher organization';

CREATE INDEX IF NOT EXISTS idx_models_catalog_publisher_image ON models_catalog(publisher_image) WHERE publisher_image IS NOT NULL;
`;

console.log('Applying migration: Add publisher_image column...');

// Execute using rpc (if available) or direct query
try {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
    // Fallback: try direct execution via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql_query: sql })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Migration applied successfully!');
  }
} catch (err) {
  console.error('Failed to apply migration:', err.message);
  console.log('\nPlease run this SQL manually in your Supabase SQL editor:');
  console.log(sql);
}

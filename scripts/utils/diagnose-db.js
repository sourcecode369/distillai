
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Missing Supabase credentials in .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diagnose() {
  console.log('🔍 Diagnosing ai_models table...');
  
  const { count, error: countError } = await supabase
    .from('ai_models')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error('❌ Error counting rows:', countError);
    return;
  }
  
  console.log(`📊 Total rows: ${count}`);
  
  if (count === 0) {
    console.log('⚠️ Table is empty. No data to fetch.');
    return;
  }

  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .limit(5);

  if (error) {
    console.error('❌ Error fetching rows:', error);
    return;
  }

  console.log('📝 Sample Data (First 5 rows):');
  data.forEach((row, i) => {
    console.log(`\nRow ${i + 1}:`);
    console.log(`  ID: ${row.id}`);
    console.log(`  Name: ${row.name}`);
    console.log(`  Publisher: ${row.publisher} (${typeof row.publisher})`);
    console.log(`  Category: ${row.category} (${typeof row.category})`);
    console.log(`  Is API Only: ${row.is_api_only}`);
  });
  
  // Check distinctive categories
  const { data: categories } = await supabase
    .from('ai_models')
    .select('category');
    
  if (categories) {
    const unique = [...new Set(categories.map(c => c.category))];
    console.log('\n🗂️ Unique Categories Found:', unique);
  }
}

diagnose();

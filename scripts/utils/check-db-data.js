import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkDatabaseData() {
  console.log('📊 Checking database data...\n');

  // 1. Get all categories
  const { data: allModels, error: modelsError } = await supabase
    .from('models_catalog')
    .select('category, publisher, name');

  if (modelsError) {
    console.error('Error fetching models:', modelsError);
    return;
  }

  // Count categories
  const categoryCounts = {};
  allModels.forEach(model => {
    const cat = model.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  console.log('📁 Categories in database:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} models`);
    });

  // Count organizations
  const orgCounts = {};
  allModels.forEach(model => {
    const org = model.publisher || 'Unknown';
    orgCounts[org] = (orgCounts[org] || 0) + 1;
  });

  console.log('\n🏢 Organizations in database:');
  const sortedOrgs = Object.entries(orgCounts)
    .sort((a, b) => b[1] - a[1]);

  console.log(`  Total unique organizations: ${sortedOrgs.length}`);
  console.log('\n  Top 20 organizations:');
  sortedOrgs.slice(0, 20).forEach(([org, count]) => {
    console.log(`    ${org}: ${count} models`);
  });

  // Check for Vision models specifically
  const visionModels = allModels.filter(m => m.category === 'Vision');
  console.log(`\n👁️  Vision models: ${visionModels.length}`);
  if (visionModels.length > 0) {
    console.log('  Sample Vision models:');
    visionModels.slice(0, 5).forEach(m => {
      console.log(`    - ${m.publisher}/${m.name}`);
    });
  }

  console.log(`\n📦 Total models in database: ${allModels.length}`);
}

checkDatabaseData();

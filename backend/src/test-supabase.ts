import { supabaseAdmin, isSupabaseConfigured } from './config/supabase';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Check if configured
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not configured!');
    console.log('\nPlease set the following environment variables in .env file:');
    console.log('- SUPABASE_URL');
    console.log('- SUPABASE_ANON_KEY');
    console.log('- SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  console.log('✅ Supabase configuration found\n');

  try {
    // Test 1: Check if we can query the database
    console.log('📊 Test 1: Querying project_info table...');
    const { data: projectInfo, error: projectError } = await supabaseAdmin!
      .from('project_info')
      .select('*')
      .limit(1);

    if (projectError) {
      console.error('❌ Error querying project_info:', projectError.message);
      console.log('\nThis might mean:');
      console.log('1. The database tables have not been created yet');
      console.log('2. There is a connection issue');
      console.log('3. The credentials are incorrect');
    } else {
      console.log('✅ Successfully connected to database');
      console.log('Project info records found:', projectInfo?.length || 0);
    }

    // Test 2: Check services table
    console.log('\n📊 Test 2: Querying services table...');
    const { data: services, error: servicesError } = await supabaseAdmin!
      .from('services')
      .select('id, name, category')
      .limit(5);

    if (servicesError) {
      console.error('❌ Error querying services:', servicesError.message);
    } else {
      console.log('✅ Services table accessible');
      console.log('Services found:', services?.length || 0);
      if (services && services.length > 0) {
        console.log('Sample services:');
        services.forEach(service => {
          console.log(`  - ${service.name} (${service.category})`);
        });
      }
    }

    // Test 3: Test insert capability
    console.log('\n📊 Test 3: Testing insert capability...');
    const testInquiry = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Connection Test',
      message: 'This is a test inquiry from the connection test script',
      phone: '010-0000-0000'
    };

    const { data: insertResult, error: insertError } = await supabaseAdmin!
      .from('contact_inquiries')
      .insert([testInquiry])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting test data:', insertError.message);
    } else {
      console.log('✅ Successfully inserted test data');
      console.log('Test inquiry ID:', insertResult?.id);

      // Clean up test data
      if (insertResult?.id) {
        const { error: deleteError } = await supabaseAdmin!
          .from('contact_inquiries')
          .delete()
          .eq('id', insertResult.id);

        if (!deleteError) {
          console.log('🧹 Test data cleaned up successfully');
        }
      }
    }

    console.log('\n✅ All tests completed!');
    console.log('\nYour Supabase connection is working properly.');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
  }
}

// Run the test
testSupabaseConnection()
  .then(() => {
    console.log('\n👍 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
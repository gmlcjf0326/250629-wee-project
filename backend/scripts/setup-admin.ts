import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('===========================================');
console.log('🔐 WEE PROJECT - Admin Account Information');
console.log('===========================================\n');

console.log('To create an admin account, please use the following steps:\n');

console.log('1. Register a new account through the website with:');
console.log('   📧 Email: admin@weeproject.com');
console.log('   🔑 Password: Admin123!@#');
console.log('   👤 Full Name: System Administrator\n');

console.log('2. After registration, run this SQL query in Supabase:');
console.log('   UPDATE public.users SET role = \'admin\' WHERE email = \'admin@weeproject.com\';\n');

console.log('OR if you want to make an existing user an admin:\n');
console.log('   UPDATE public.users SET role = \'admin\' WHERE email = \'your-email@example.com\';\n');

console.log('===========================================');
console.log('Current Admin Roles in Database:');
console.log('- admin: Full system access');
console.log('- manager: Content management access');
console.log('- counselor: Counseling features access');
console.log('- user: Regular user access');
console.log('===========================================');

process.exit(0);
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const sampleResources = [
  // Manual Resources
  {
    title: 'Wee 클래스 운영 매뉴얼 2024',
    description: 'Wee 클래스 운영에 필요한 전반적인 가이드라인과 절차를 담은 종합 매뉴얼입니다.',
    category: 'manual',
    subcategory: 'operation',
    tags: ['운영', '매뉴얼', '2024'],
    version: 'v3.0',
    file_url: '/uploads/manual/wee-class-manual-2024.pdf',
    file_size: '12500000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 2341,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '학교폭력 예방 및 대응 매뉴얼',
    description: '학교폭력 사안 발생 시 단계별 대응 방법과 예방 프로그램 운영 지침입니다.',
    category: 'manual',
    subcategory: 'crisis',
    tags: ['학교폭력', '예방', '위기대응'],
    version: 'v2.5',
    file_url: '/uploads/manual/violence-prevention-manual.pdf',
    file_size: '8300000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 1892,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '개인상담 진행 가이드북',
    description: '효과적인 개인상담을 위한 상담 기법과 사례별 접근 방법을 제시합니다.',
    category: 'manual',
    subcategory: 'counseling',
    tags: ['개인상담', '상담기법'],
    version: 'v4.1',
    file_url: '/uploads/manual/counseling-guide.pdf',
    file_size: '5700000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 3421,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '집단상담 프로그램 매뉴얼',
    description: '다양한 주제의 집단상담 프로그램 운영 방법과 실제 활동 자료를 포함합니다.',
    category: 'manual',
    subcategory: 'program',
    tags: ['집단상담', '프로그램', '활동'],
    version: 'v2.0',
    file_url: '/uploads/manual/group-counseling-manual.pdf',
    file_size: '9200000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 2105,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },

  // Program Resources
  {
    title: '자존감 향상 프로그램',
    description: '초등학생 대상 8회기 자존감 향상 프로그램 활동지와 교사용 지도서입니다.',
    category: 'program',
    subcategory: 'emotion',
    tags: ['자존감', '초등', '8회기'],
    version: 'v1.5',
    file_url: '/uploads/program/self-esteem-program.zip',
    file_size: '15800000',
    file_type: 'application/zip',
    author: 'admin',
    download_count: 4521,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '진로탐색 워크북 - 중학생용',
    description: '중학생의 진로 탐색을 돕는 체계적인 워크북과 교사 가이드입니다.',
    category: 'program',
    subcategory: 'study',
    tags: ['진로', '중학생', '워크북'],
    file_url: '/uploads/program/career-workbook-middle.pdf',
    file_size: '7200000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 3892,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '학교폭력 예방 교육자료',
    description: '학급별 학교폭력 예방 교육을 위한 PPT 자료와 활동지 세트입니다.',
    category: 'program',
    subcategory: 'prevention',
    tags: ['학교폭력', '예방교육', 'PPT'],
    file_url: '/uploads/program/violence-prevention-materials.zip',
    file_size: '25600000',
    file_type: 'application/zip',
    author: 'admin',
    download_count: 5234,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '위기학생 개입 프로토콜',
    description: '자살·자해 위기 학생 발견 시 즉각적인 개입을 위한 단계별 프로토콜입니다.',
    category: 'program',
    subcategory: 'crisis',
    tags: ['위기개입', '자살예방', '프로토콜'],
    file_url: '/uploads/program/crisis-intervention-protocol.pdf',
    file_size: '3400000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 6789,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },

  // Case Resources
  {
    title: '학교부적응 학생 상담 사례집',
    description: '다양한 학교부적응 사례와 성공적인 상담 개입 과정을 담은 사례집입니다.',
    category: 'case',
    subcategory: 'counseling',
    tags: ['학교부적응', '상담사례', '개입'],
    file_url: '/uploads/case/school-maladjustment-cases.pdf',
    file_size: '4800000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 2156,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '정서행동특성검사 후속 지원 사례',
    description: '정서행동특성검사 관심군 학생들에 대한 효과적인 지원 사례 모음입니다.',
    category: 'case',
    subcategory: 'program',
    tags: ['정서행동', '관심군', '지원사례'],
    file_url: '/uploads/case/emotional-behavioral-support-cases.pdf',
    file_size: '5200000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 3421,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  },
  {
    title: '학교-가정-지역사회 연계 우수사례',
    description: '성공적인 협력 네트워크 구축 사례와 운영 노하우를 공유합니다.',
    category: 'case',
    subcategory: 'collaboration',
    tags: ['연계', '협력', '우수사례'],
    file_url: '/uploads/case/collaboration-best-practices.pdf',
    file_size: '6700000',
    file_type: 'application/pdf',
    author: 'admin',
    download_count: 1823,
    source_url: 'admin',
    scraped_at: new Date().toISOString()
  }
];

async function seedResources() {
  try {
    console.log('🌱 Starting to seed resources...');

    // First, check if resources already exist
    const { data: existingResources, error: checkError } = await supabase
      .from('wee_resources')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing resources:', checkError);
      return;
    }

    if (existingResources && existingResources.length > 0) {
      console.log('ℹ️  Resources already exist in database. Skipping seed.');
      return;
    }

    // Insert sample resources
    const { data, error } = await supabase
      .from('wee_resources')
      .insert(sampleResources)
      .select();

    if (error) {
      console.error('❌ Error inserting resources:', error);
      return;
    }

    console.log(`✅ Successfully inserted ${data.length} resources!`);
    
    // Display summary
    const categoryCounts = sampleResources.reduce((acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📊 Resource Summary:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} resources`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
seedResources();
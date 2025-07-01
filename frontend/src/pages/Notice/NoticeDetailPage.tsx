import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { noticeAPI } from '../../api/notices';
import { ChevronLeftIcon, CalendarIcon, EyeIcon, TagIcon } from '@heroicons/react/24/outline';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  is_pinned: boolean;
  is_published: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchNotice(id);
    }
  }, [id]);

  const fetchNotice = async (noticeId: string) => {
    try {
      setLoading(true);
      const data = await noticeAPI.getNotice(noticeId);
      setNotice(data);
    } catch (err) {
      console.error('Error fetching notice:', err);
      
      // Dummy data for demonstration
      const dummyNotices: Record<string, Notice> = {
        '1': {
          id: '1',
          title: '[중요] 2024년 하반기 Wee 프로젝트 연수 일정 안내',
          content: `안녕하세요, Wee 프로젝트 운영팀입니다.

2024년 하반기 Wee 프로젝트 관련 연수 일정을 안내드립니다.

1. 전문상담교사 역량강화 연수
   - 일시: 2024년 7월 15일(월) ~ 7월 19일(금)
   - 장소: 한국교원대학교 교육연수원
   - 대상: 전국 Wee 클래스 및 Wee 센터 전문상담교사
   - 신청기간: 2024년 6월 25일(화) ~ 7월 5일(금)

2. Wee 프로젝트 운영 실무자 연수
   - 일시: 2024년 8월 5일(월) ~ 8월 7일(수)
   - 장소: 서울특별시교육청교육연수원
   - 대상: Wee 프로젝트 업무 담당자 및 관리자
   - 신청기간: 2024년 7월 15일(월) ~ 7월 26일(금)

3. 연수 내용
   - 최신 상담 이론 및 기법
   - 위기학생 개입 전략
   - 학교폭력 예방 및 대응
   - 사례 연구 및 슈퍼비전
   - Wee 프로젝트 우수사례 공유

4. 신청 방법
   - 교육청 통합연수시스템을 통해 온라인 신청
   - 선착순 마감 (각 과정별 50명)

5. 문의사항
   - 전화: 1588-7179
   - 이메일: wee@education.kr

많은 관심과 참여 부탁드립니다.

감사합니다.`,
          category: '연수',
          author: '관리자',
          is_pinned: true,
          is_published: true,
          view_count: 523,
          published_at: '2024-06-25T10:00:00Z',
          created_at: '2024-06-25T10:00:00Z',
          updated_at: '2024-06-25T10:00:00Z',
        },
        '2': {
          id: '2',
          title: 'Wee 클래스 운영 매뉴얼 개정판 배포',
          content: `안녕하세요, Wee 프로젝트 운영지원팀입니다.

2024년 개정된 Wee 클래스 운영 매뉴얼을 배포합니다.

▣ 주요 개정 내용

1. 상담 프로세스 개선
   - 초기 상담 절차 간소화
   - 위기개입 프로토콜 강화
   - 사후관리 체계 보완

2. 문서 양식 업데이트
   - 상담일지 양식 개선
   - 동의서 및 신청서 통합
   - 통계 보고 양식 표준화

3. 프로그램 운영 가이드
   - 집단상담 프로그램 모듈화
   - 또래상담 운영 매뉴얼 추가
   - 부모교육 프로그램 확대

4. 안전관리 지침 강화
   - 개인정보보호 절차 강화
   - 상담실 안전관리 체크리스트
   - 비상상황 대응 매뉴얼

▣ 다운로드 방법
- Wee 프로젝트 홈페이지 자료실에서 다운로드
- 각 시·도교육청 업무포털 공지사항 첨부파일

▣ 적용 시기
- 2024년 7월 1일부터 전면 적용

▣ 교육 지원
- 온라인 설명회: 2024년 6월 28일(금) 15:00
- 녹화영상은 추후 홈페이지에 게시 예정

문의사항은 운영지원팀(02-1234-5678)으로 연락주시기 바랍니다.

감사합니다.`,
          category: '자료',
          author: '관리자',
          is_pinned: false,
          is_published: true,
          view_count: 342,
          published_at: '2024-06-24T14:30:00Z',
          created_at: '2024-06-24T14:30:00Z',
          updated_at: '2024-06-24T14:30:00Z',
        },
        '3': {
          id: '3',
          title: '7월 전문상담교사 역량강화 연수 신청 안내',
          content: `전국 Wee 프로젝트 관계자 여러분께,

7월에 진행되는 전문상담교사 역량강화 연수 신청을 받습니다.

◆ 연수 개요
- 과정명: 2024년 7월 전문상담교사 역량강화 연수
- 연수기간: 2024년 7월 15일(월) ~ 7월 19일(금), 5일간
- 연수시간: 30시간 (1학점)
- 연수장소: 한국교원대학교 교육연수원
- 모집인원: 50명 (선착순)

◆ 연수 대상
- 전국 Wee 클래스 전문상담교사
- 전국 Wee 센터 전문상담사
- 상담 관련 업무 담당 교사

◆ 연수 내용
1일차: 최신 상담이론과 기법
2일차: 청소년 정신건강의 이해
3일차: 위기상담 및 트라우마 개입
4일차: 집단상담 프로그램 설계와 운영
5일차: 사례연구 및 슈퍼비전

◆ 신청 방법
- 신청기간: 2024년 6월 23일(월) 09:00 ~ 7월 5일(금) 18:00
- 신청방법: 교육청 통합연수시스템(https://edu.go.kr)
- 승인발표: 2024년 7월 8일(월) 개별 통보

◆ 유의사항
- 연수비 무료 (교육청 지원)
- 숙박은 개별 해결 (인근 숙소 정보 제공)
- 중식 제공
- 이수 기준: 출석률 90% 이상

◆ 문의처
- 담당자: 교육지원팀 김○○
- 전화: 043-123-4567
- 이메일: training@wee.kr

많은 관심과 참여 부탁드립니다.`,
          category: '연수',
          author: '교육지원팀',
          is_pinned: false,
          is_published: true,
          view_count: 289,
          published_at: '2024-06-23T09:15:00Z',
          created_at: '2024-06-23T09:15:00Z',
          updated_at: '2024-06-23T09:15:00Z',
        },
        '4': {
          id: '4',
          title: '2024년 상반기 우수사례 공모전 결과 발표',
          content: `안녕하세요, Wee 프로젝트 운영팀입니다.

2024년 상반기 Wee 프로젝트 우수사례 공모전 결과를 발표합니다.

▶ 공모전 개요
- 공모기간: 2024년 5월 1일 ~ 5월 31일
- 응모작품: 총 127편
- 심사기간: 2024년 6월 1일 ~ 6월 20일

▶ 수상작 발표

【대상】 
- 작품명: "함께 성장하는 우리들의 이야기"
- 소속: ○○중학교 Wee 클래스
- 상금: 300만원 및 교육부장관상

【최우수상】
1. 작품명: "위기를 기회로, 한 걸음 더 나아가기"
   - 소속: △△고등학교 Wee 클래스
   - 상금: 200만원 및 교육감상

2. 작품명: "마음을 여는 열쇠, 공감과 소통"
   - 소속: □□교육지원청 Wee 센터
   - 상금: 200만원 및 교육감상

【우수상】 (5팀)
- 각 100만원 및 교육감상
- 수상작은 홈페이지에서 확인 가능

【장려상】 (10팀)
- 각 50만원 및 교육장상
- 수상작은 홈페이지에서 확인 가능

▶ 시상식 안내
- 일시: 2024년 7월 10일(수) 14:00
- 장소: 교육부 대강당
- 참석대상: 수상자 및 관계자

▶ 우수사례집 발간
- 수상작을 포함한 우수사례집 발간 예정
- 7월 중 전국 Wee 프로젝트 기관에 배포

▶ 향후 일정
- 2024년 하반기 공모전: 11월 예정
- 자세한 일정은 추후 공지

수상하신 모든 분들께 축하드리며, 
응모해주신 모든 분들께 감사드립니다.

문의: 공모전 담당자 (02-1234-5679)`,
          category: '공모',
          author: '관리자',
          is_pinned: true,
          is_published: true,
          view_count: 456,
          published_at: '2024-06-22T16:45:00Z',
          created_at: '2024-06-22T16:45:00Z',
          updated_at: '2024-06-22T16:45:00Z',
        },
        '5': {
          id: '5',
          title: 'Wee 센터 신규 개소 안내 (서울 강남구)',
          content: `안녕하세요, Wee 프로젝트 운영지원팀입니다.

서울 강남구에 새로운 Wee 센터가 개소함을 알려드립니다.

■ 센터 정보
- 센터명: 강남 Wee 센터
- 주소: 서울특별시 강남구 테헤란로 123, 교육빌딩 5층
- 전화: 02-567-8910
- 팩스: 02-567-8911
- 이메일: gangnam@wee.kr

■ 운영 시간
- 평일: 09:00 ~ 18:00
- 토요일: 09:00 ~ 13:00 (사전예약제)
- 일요일 및 공휴일: 휴무

■ 주요 시설
- 개인상담실 5개
- 집단상담실 2개
- 심리검사실 1개
- 놀이치료실 1개
- 대기실 및 휴게공간

■ 전문 인력
- 센터장 1명
- 전문상담사 5명
- 임상심리사 2명
- 사회복지사 1명
- 행정직원 2명

■ 제공 서비스
1. 개인상담 및 집단상담
2. 심리검사 및 평가
3. 위기개입 및 긴급지원
4. 학교 컨설팅 및 교육
5. 학부모 상담 및 교육
6. 지역사회 연계 서비스

■ 개소식 안내
- 일시: 2024년 7월 1일(월) 14:00
- 장소: 강남 Wee 센터
- 참석: 교육감, 구청장, 지역 교육관계자

■ 이용 안내
- 대상: 강남구 관내 초·중·고 학생, 학부모, 교사
- 비용: 무료
- 예약: 전화 또는 온라인 예약 시스템

새로운 Wee 센터 개소로 강남 지역 학생들의 
정신건강 증진과 학교적응력 향상에 기여할 것으로 기대합니다.

감사합니다.`,
          category: '안내',
          author: '운영지원팀',
          is_pinned: false,
          is_published: true,
          view_count: 198,
          published_at: '2024-06-21T11:20:00Z',
          created_at: '2024-06-21T11:20:00Z',
          updated_at: '2024-06-21T11:20:00Z',
        }
      };
      
      // Set dummy data based on noticeId
      if (dummyNotices[noticeId]) {
        setNotice(dummyNotices[noticeId]);
      } else {
        // Generate a generic dummy notice for any other ID
        setNotice({
          id: noticeId,
          title: `공지사항 #${noticeId}`,
          content: `이것은 공지사항 #${noticeId}의 샘플 내용입니다.\n\n자세한 내용은 추후 업데이트될 예정입니다.`,
          category: 'general',
          author: '관리자',
          is_pinned: false,
          is_published: true,
          view_count: Math.floor(Math.random() * 500),
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      general: '일반',
      update: '업데이트',
      event: '행사',
      maintenance: '점검',
    };
    return categories[category] || category;
  };

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      update: 'bg-blue-100 text-blue-800',
      event: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };
    return styles[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wee-main"></div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '공지사항을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/notice/announcement')}
            className="text-wee-main hover:text-wee-dark"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content-container">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/notice/announcement')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            <span>목록으로</span>
          </button>
        </div>

        {/* 공지사항 상세 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-wee-main to-wee-dark px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {notice.is_pinned && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      중요
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(notice.category)}`}>
                    <TagIcon className="w-3 h-3 mr-1" />
                    {getCategoryName(notice.category)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{notice.title}</h1>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span>{notice.author}</span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(notice.published_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {notice.view_count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {notice.content}
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                {notice.updated_at !== notice.created_at && (
                  <span>수정일: {new Date(notice.updated_at).toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/notice/announcement"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wee-main transition-colors"
                >
                  목록으로
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 이전/다음 공지사항 네비게이션 (선택사항) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 이전 공지사항 */}
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 mb-1">이전 공지사항</div>
            <p className="text-gray-400">이전 글이 없습니다</p>
          </div>
          
          {/* 다음 공지사항 */}
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-right">
            <div className="text-sm text-gray-500 mb-1">다음 공지사항</div>
            <p className="text-gray-400">다음 글이 없습니다</p>
          </div>
        </div>
      </div>
    </div>
  );
};
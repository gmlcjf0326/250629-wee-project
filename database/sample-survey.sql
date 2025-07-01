-- Sample Survey Data for WEE Project

-- Insert a sample survey
INSERT INTO public.surveys (
  id,
  title,
  description,
  start_date,
  end_date,
  target_audience,
  is_active,
  is_required,
  questions,
  instructions,
  status,
  is_anonymous,
  max_responses,
  allow_multiple_responses,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '2025년 위(Wee) 프로젝트 만족도 조사',
  '위(Wee) 프로젝트 서비스 개선을 위한 만족도 조사입니다. 여러분의 소중한 의견을 들려주세요.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  '위(Wee) 프로젝트 이용자',
  true,
  false,
  '[
    {
      "id": "q1",
      "type": "radio",
      "text": "위(Wee) 프로젝트 서비스를 이용하신 기간은 얼마나 되셨나요?",
      "options": ["6개월 미만", "6개월-1년", "1년-2년", "2년 이상"],
      "required": true,
      "order": 1
    },
    {
      "id": "q2",
      "type": "checkbox",
      "text": "주로 이용하시는 위(Wee) 프로젝트 서비스를 모두 선택해주세요.",
      "options": ["상담 서비스", "교육 프로그램", "온라인 자료실", "커뮤니티", "기타"],
      "required": true,
      "order": 2
    },
    {
      "id": "q3",
      "type": "scale",
      "text": "위(Wee) 프로젝트 서비스의 전반적인 만족도는 어떠신가요?",
      "min": 1,
      "max": 5,
      "minLabel": "매우 불만족",
      "maxLabel": "매우 만족",
      "required": true,
      "order": 3
    },
    {
      "id": "q4",
      "type": "text",
      "text": "위(Wee) 프로젝트에서 가장 도움이 되었던 서비스나 프로그램은 무엇인가요?",
      "required": false,
      "order": 4
    },
    {
      "id": "q5",
      "type": "textarea",
      "text": "위(Wee) 프로젝트 서비스 개선을 위한 제안사항이 있으시면 자유롭게 작성해주세요.",
      "required": false,
      "order": 5
    }
  ]'::jsonb,
  '본 설문조사는 위(Wee) 프로젝트 서비스 개선을 위해 실시됩니다. 수집된 정보는 서비스 개선 목적으로만 사용되며, 개인정보는 안전하게 보호됩니다.',
  'active',
  true,
  1000,
  false,
  NOW(),
  NOW()
);

-- Insert another sample survey (청소년 정서 지원 프로그램 효과성 조사)
INSERT INTO public.surveys (
  id,
  title,
  description,
  start_date,
  end_date,
  target_audience,
  is_active,
  is_required,
  questions,
  instructions,
  status,
  is_anonymous,
  max_responses,
  allow_multiple_responses,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '청소년 정서 지원 프로그램 효과성 조사',
  '청소년 정서 지원 프로그램 참여자를 대상으로 프로그램의 효과성을 평가하는 조사입니다.',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '23 days',
  '프로그램 참여 청소년',
  true,
  false,
  '[
    {
      "id": "q1",
      "type": "radio",
      "text": "프로그램에 참여하게 된 주된 이유는 무엇인가요?",
      "options": ["학업 스트레스", "대인관계 어려움", "가족 문제", "진로 고민", "기타"],
      "required": true,
      "order": 1
    },
    {
      "id": "q2",
      "type": "scale",
      "text": "프로그램 참여 전 정서적 어려움의 정도는 어느 정도였나요?",
      "min": 1,
      "max": 10,
      "minLabel": "전혀 어렵지 않음",
      "maxLabel": "매우 어려움",
      "required": true,
      "order": 2
    },
    {
      "id": "q3",
      "type": "scale",
      "text": "프로그램 참여 후 현재 정서적 상태는 어떠신가요?",
      "min": 1,
      "max": 10,
      "minLabel": "매우 나쁨",
      "maxLabel": "매우 좋음",
      "required": true,
      "order": 3
    },
    {
      "id": "q4",
      "type": "checkbox",
      "text": "프로그램을 통해 도움받은 부분을 모두 선택해주세요.",
      "options": ["스트레스 관리", "감정 조절", "대인관계 개선", "자존감 향상", "문제해결 능력"],
      "required": true,
      "order": 4
    },
    {
      "id": "q5",
      "type": "radio",
      "text": "이 프로그램을 다른 친구에게 추천하시겠습니까?",
      "options": ["적극 추천", "추천", "보통", "추천하지 않음", "전혀 추천하지 않음"],
      "required": true,
      "order": 5
    },
    {
      "id": "q6",
      "type": "textarea",
      "text": "프로그램에 대한 추가 의견이나 개선사항을 자유롭게 작성해주세요.",
      "required": false,
      "order": 6
    }
  ]'::jsonb,
  '본 설문은 익명으로 진행되며, 응답 내용은 프로그램 개선을 위한 목적으로만 사용됩니다. 솔직한 답변 부탁드립니다.',
  'active',
  true,
  500,
  false,
  NOW(),
  NOW()
);

-- Insert a past survey (completed)
INSERT INTO public.surveys (
  id,
  title,
  description,
  start_date,
  end_date,
  target_audience,
  is_active,
  is_required,
  questions,
  instructions,
  status,
  is_anonymous,
  max_responses,
  allow_multiple_responses,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '2024년 위(Wee) 센터 이용 실태 조사',
  '위(Wee) 센터 이용 현황 및 개선사항 파악을 위한 실태 조사입니다.',
  '2024-10-01'::date,
  '2024-10-31'::date,
  '위(Wee) 센터 이용자',
  false,
  false,
  '[
    {
      "id": "q1",
      "type": "radio",
      "text": "위(Wee) 센터를 얼마나 자주 이용하시나요?",
      "options": ["주 1회 이상", "월 2-3회", "월 1회", "필요시에만"],
      "required": true,
      "order": 1
    },
    {
      "id": "q2",
      "type": "scale",
      "text": "위(Wee) 센터 시설 만족도",
      "min": 1,
      "max": 5,
      "required": true,
      "order": 2
    }
  ]'::jsonb,
  '종료된 설문입니다.',
  'closed',
  false,
  200,
  false,
  '2024-10-01'::timestamp,
  '2024-10-31'::timestamp
);
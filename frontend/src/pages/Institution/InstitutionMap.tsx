import React, { useState } from 'react';

interface Institution {
  id: number;
  name: string;
  type: 'class' | 'center' | 'school';
  address: string;
  phone: string;
  lat: number;
  lng: number;
  services: string[];
}

const InstitutionMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('서울');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  const regions = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];

  const institutionTypes = [
    { value: 'all', label: '전체', icon: '🏢' },
    { value: 'class', label: 'Wee 클래스', icon: '🏫' },
    { value: 'center', label: 'Wee 센터', icon: '🏛️' },
    { value: 'school', label: 'Wee 스쿨', icon: '🎓' },
  ];

  // Dummy data for institutions
  const institutions: Institution[] = [
    {
      id: 1,
      name: '서울시교육청 Wee 센터',
      type: 'center',
      address: '서울특별시 종로구 송월길 48',
      phone: '02-3111-234',
      lat: 37.5665,
      lng: 126.9780,
      services: ['개인상담', '집단상담', '심리검사', '부모교육'],
    },
    {
      id: 2,
      name: '강남고등학교 Wee 클래스',
      type: 'class',
      address: '서울특별시 강남구 개포로 517',
      phone: '02-2222-345',
      lat: 37.4966,
      lng: 127.0657,
      services: ['개인상담', '또래상담', '진로상담'],
    },
    {
      id: 3,
      name: '서울 Wee 스쿨',
      type: 'school',
      address: '서울특별시 관악구 신림로 56',
      phone: '02-3333-456',
      lat: 37.4813,
      lng: 126.9528,
      services: ['위탁교육', '치유프로그램', '직업교육'],
    },
  ];

  const filteredInstitutions = institutions.filter(inst => {
    const matchesType = selectedType === 'all' || inst.type === selectedType;
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-700';
      case 'center': return 'bg-green-100 text-green-700';
      case 'school': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'class': return 'Wee 클래스';
      case 'center': return 'Wee 센터';
      case 'school': return 'Wee 스쿨';
      default: return '';
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">기관 찾기</h1>
          <p className="text-lg text-gray-600">
            가까운 Wee 프로젝트 기관을 찾아보세요
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Region Select */}
            <div>
              <label className="form-label">지역 선택</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="form-input"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="form-label">기관 유형</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-input"
              >
                {institutionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="form-label">검색</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="기관명 또는 주소 검색"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-6 h-[600px]">
              <div className="bg-gray-100 rounded-xl h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-500 text-lg">지도 영역</p>
                  <p className="text-gray-400 text-sm mt-2">
                    실제 구현 시 카카오맵 또는 네이버맵 API 연동
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Institution List */}
          <div>
            <div className="bg-white rounded-2xl shadow-soft p-6 h-[600px] overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                검색 결과 ({filteredInstitutions.length}개)
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {filteredInstitutions.map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => setSelectedInstitution(inst)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedInstitution?.id === inst.id
                        ? 'border-wee-main bg-wee-light'
                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{inst.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(inst.type)}`}>
                        {getTypeLabel(inst.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{inst.address}</p>
                    <p className="text-sm text-gray-500">📞 {inst.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Institution Details */}
        {selectedInstitution && (
          <div className="mt-6 bg-gradient-to-r from-wee-light to-blue-50 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedInstitution.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{selectedInstitution.address}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{selectedInstitution.phone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">제공 서비스</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInstitution.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button className="btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화 문의
              </button>
              <button className="btn-secondary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                길찾기
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="text-3xl font-bold text-wee-main mb-2">5,000+</div>
            <p className="text-gray-600">Wee 클래스</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="text-3xl font-bold text-wee-blue mb-2">200+</div>
            <p className="text-gray-600">Wee 센터</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="text-3xl font-bold text-wee-purple mb-2">15</div>
            <p className="text-gray-600">Wee 스쿨</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 text-center">
            <div className="text-3xl font-bold text-wee-green mb-2">전국</div>
            <p className="text-gray-600">서비스 지역</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionMap;
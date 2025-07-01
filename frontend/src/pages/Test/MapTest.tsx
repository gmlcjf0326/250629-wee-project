import React from 'react';
import KakaoMap from '../../components/map/KakaoMap';
import KakaoMapDebug from '../../components/map/KakaoMapDebug';

const MapTest: React.FC = () => {
  const testMarkers = [
    {
      id: '1',
      position: { lat: 37.566826, lng: 126.9786567 },
      title: '서울시청',
      type: 'wee-center' as const,
      address: '서울특별시 중구 세종대로 110',
      phone: '02-123-4567',
      description: '테스트 마커입니다.'
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="content-wide">
        <h1 className="text-3xl font-bold mb-8">카카오맵 테스트 페이지</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Debug Component */}
          <KakaoMapDebug />
          
          {/* Original Map Component */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">KakaoMap 컴포넌트</h2>
            <KakaoMap 
              markers={testMarkers}
              className="h-[400px]"
            />
          </div>
        </div>
        
        {/* Script Check */}
        <div className="mt-8 bg-yellow-50 rounded-xl p-6">
          <h3 className="font-bold mb-2">스크립트 확인</h3>
          <p className="text-sm text-gray-600 mb-2">
            index.html에 다음 스크립트가 포함되어 있는지 확인하세요:
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=91b88c84676c58293e9129326e59e32f&libraries=services,clusterer,drawing"></script>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MapTest;
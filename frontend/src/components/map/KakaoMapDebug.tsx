import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMapDebug: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('초기화 중...');
  const [error, setError] = useState<string | null>(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    const checkKakaoMaps = () => {
      console.log('Checking Kakao Maps...');
      console.log('window.kakao:', window.kakao);
      console.log('window.kakao?.maps:', window.kakao?.maps);
      
      if (window.kakao && window.kakao.maps) {
        setKakaoLoaded(true);
        setStatus('카카오맵 API 로드됨');
        initializeMap();
      } else {
        setStatus('카카오맵 API 로딩 대기 중...');
      }
    };

    const initializeMap = () => {
      if (!mapContainer.current) {
        setError('맵 컨테이너를 찾을 수 없습니다.');
        return;
      }

      try {
        const { kakao } = window;
        
        // 지도 옵션
        const options = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3
        };
        
        // 지도 생성
        const map = new kakao.maps.Map(mapContainer.current, options);
        setStatus('지도 생성 완료');
        
        // 마커 생성
        const markerPosition = new kakao.maps.LatLng(37.566826, 126.9786567);
        const marker = new kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
        
        setStatus('지도 및 마커 표시 완료');
      } catch (err) {
        console.error('Map initialization error:', err);
        setError(`지도 초기화 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      }
    };

    // 초기 체크
    checkKakaoMaps();

    // API 로드 대기
    if (!kakaoLoaded) {
      const interval = setInterval(() => {
        checkKakaoMaps();
      }, 100);

      // 10초 후 타임아웃
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!kakaoLoaded) {
          setError('카카오맵 API 로드 타임아웃 (10초)');
        }
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [kakaoLoaded]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">카카오맵 디버그</h2>
      
      <div className="mb-4 space-y-2">
        <div className="flex items-center">
          <span className="font-semibold mr-2">상태:</span>
          <span className={kakaoLoaded ? 'text-green-600' : 'text-yellow-600'}>
            {status}
          </span>
        </div>
        
        {error && (
          <div className="bg-red-50 p-3 rounded-lg">
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        <div className="text-sm text-gray-600 space-y-1">
          <div>API Key: 91b88c84676c58293e9129326e59e32f</div>
          <div>window.kakao 존재: {window.kakao ? '✅' : '❌'}</div>
          <div>window.kakao.maps 존재: {window.kakao?.maps ? '✅' : '❌'}</div>
        </div>
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full h-[400px] bg-gray-100 rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">문제 해결 방법:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>브라우저 콘솔에서 에러 메시지 확인</li>
          <li>네트워크 탭에서 카카오맵 스크립트 로드 확인</li>
          <li>API 키가 올바른지 확인</li>
          <li>도메인이 카카오 개발자 콘솔에 등록되어 있는지 확인</li>
        </ul>
      </div>
    </div>
  );
};

export default KakaoMapDebug;
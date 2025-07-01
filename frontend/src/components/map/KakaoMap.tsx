import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  type: 'wee-class' | 'wee-center' | 'wee-school' | 'wee-home';
  address?: string;
  phone?: string;
  description?: string;
}

interface KakaoMapProps {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  level?: number;
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  selectedMarkerId?: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  markers = [],
  center = { lat: 37.566826, lng: 126.9786567 }, // 서울시청 기본 좌표
  level = 8,
  className = '',
  onMarkerClick,
  selectedMarkerId
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 마커 아이콘 설정
  const getMarkerImage = useCallback((type: string) => {
    if (!window.kakao) return null;
    
    const markerImages = {
      'wee-class': {
        src: '/markers/wee-class.svg',
        size: { width: 36, height: 48 }
      },
      'wee-center': {
        src: '/markers/wee-center.svg',
        size: { width: 36, height: 48 }
      },
      'wee-school': {
        src: '/markers/wee-school.svg',
        size: { width: 36, height: 48 }
      },
      'wee-home': {
        src: '/markers/wee-home.svg',
        size: { width: 36, height: 48 }
      }
    };

    const image = markerImages[type as keyof typeof markerImages] || markerImages['wee-class'];
    return new window.kakao.maps.MarkerImage(
      image.src,
      new window.kakao.maps.Size(image.size.width, image.size.height),
      { offset: new window.kakao.maps.Point(18, 48) } // 마커의 중심점 설정
    );
  }, []);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = () => {
      try {
        const { kakao } = window;
        
        // 지도 생성
        const options = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: level
        };
        
        const map = new kakao.maps.Map(mapContainer.current, options);
        mapInstance.current = map;

        // 지도 컨트롤 추가
        const mapTypeControl = new kakao.maps.MapTypeControl();
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 마커 클러스터러 생성
        const clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 10,
          styles: [{
            width: '50px',
            height: '50px',
            background: 'rgba(59, 130, 246, .8)',
            borderRadius: '25px',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '51px'
          }]
        });
        clustererRef.current = clusterer;
        
        setIsLoading(false);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('지도를 초기화하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    // 카카오맵 API 로드 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      // API 로드 대기
      let attempts = 0;
      const maxAttempts = 50; // 5초 동안 시도
      
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkInterval);
          initializeMap();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          setError('카카오맵 API를 로드할 수 없습니다. 인터넷 연결을 확인해주세요.');
          setIsLoading(false);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []); // Empty dependency array - only run once

  // Update markers when they change
  useEffect(() => {
    if (!mapInstance.current || !clustererRef.current || !window.kakao) return;

    const { kakao } = window;
    const map = mapInstance.current;
    const clusterer = clustererRef.current;
    
    // Clear existing markers
    if (infowindowRef.current) {
      infowindowRef.current.close();
    }
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    clusterer.clear();
    
    // Add new markers
    const newMarkers: any[] = [];
    const bounds = new kakao.maps.LatLngBounds();
    
    markers.forEach((markerData) => {
      const markerPosition = new kakao.maps.LatLng(
        markerData.position.lat,
        markerData.position.lng
      );
      
      // bounds에 마커 위치 추가
      bounds.extend(markerPosition);

      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: getMarkerImage(markerData.type),
        title: markerData.title
      });

      // 마커 클릭 이벤트
      kakao.maps.event.addListener(marker, 'click', () => {
        // 이전 인포윈도우가 있으면 닫기
        if (infowindowRef.current) {
          infowindowRef.current.close();
        }

        if (onMarkerClick) {
          onMarkerClick(markerData);
        }

        // 새 인포윈도우 생성 및 표시
        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div style="padding: 15px; min-width: 250px; max-width: 300px;">
              <h4 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #1f2937;">${markerData.title}</h4>
              ${markerData.address ? `<p style="margin: 5px 0; font-size: 14px; color: #4b5563;">📍 ${markerData.address}</p>` : ''}
              ${markerData.phone ? `<p style="margin: 5px 0; font-size: 14px; color: #4b5563;">📞 ${markerData.phone}</p>` : ''}
              ${markerData.description ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280; line-height: 1.4;">${markerData.description}</p>` : ''}
            </div>
          `,
          removable: true,
          zIndex: 1
        });
        
        infowindow.open(map, marker);
        infowindowRef.current = infowindow;
        
        // 지도 중심을 마커 위치로 부드럽게 이동
        map.panTo(markerPosition);
      });

      newMarkers.push(marker);
    });

    // 클러스터러에 마커 추가
    clusterer.addMarkers(newMarkers);
    markersRef.current = newMarkers;
    
    // 모든 마커가 보이도록 지도 범위 조정 (초기 로드 시에만)
    if (markers.length > 0 && !selectedMarkerId) {
      map.setBounds(bounds);
    }
  }, [markers, onMarkerClick, getMarkerImage]);

  // Handle selected marker
  useEffect(() => {
    if (!mapInstance.current || !selectedMarkerId || !window.kakao) return;
    
    const { kakao } = window;
    const map = mapInstance.current;
    
    const selectedMarkerData = markers.find(m => m.id === selectedMarkerId);
    const selectedMarkerObj = markersRef.current.find((marker, index) => 
      markers[index]?.id === selectedMarkerId
    );
    
    if (selectedMarkerData && selectedMarkerObj) {
      // 선택된 마커로 지도 중심 이동
      const markerPosition = new kakao.maps.LatLng(
        selectedMarkerData.position.lat,
        selectedMarkerData.position.lng
      );
      map.panTo(markerPosition);
      
      // 마커 클릭 이벤트 트리거
      setTimeout(() => {
        kakao.maps.event.trigger(selectedMarkerObj, 'click');
      }, 300);
    }
  }, [selectedMarkerId, markers]);

  // Update center when it changes
  useEffect(() => {
    if (!mapInstance.current || !center || !window.kakao) return;
    
    const { kakao } = window;
    const map = mapInstance.current;
    const newCenter = new kakao.maps.LatLng(center.lat, center.lng);
    map.setCenter(newCenter);
  }, [center]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 font-semibold mb-2">지도 로드 오류</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
      />
      
      {/* 맵 범례 */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <h4 className="text-sm font-semibold mb-2">Wee 기관 유형</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#3B82F6' }}></div>
              <span>Wee 클래스</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#10B981' }}></div>
              <span>Wee 센터</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#8B5CF6' }}></div>
              <span>Wee 스쿨</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#F59E0B' }}></div>
              <span>가정형 Wee센터</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
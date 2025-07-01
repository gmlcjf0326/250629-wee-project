import React from 'react';
import { Html } from '@react-three/drei';

interface Text3DProps {
  children: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  fontWeight?: string;
  className?: string;
}

const Text3D: React.FC<Text3DProps> = ({
  children,
  position = [0, 0, 0],
  fontSize = 14,
  color = '#1f2937',
  backgroundColor = 'transparent',
  padding = '0',
  borderRadius = '0',
  fontWeight = 'normal',
  className = ''
}) => {
  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      style={{
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <div
        className={className}
        style={{
          fontSize: `${fontSize}px`,
          color,
          backgroundColor,
          padding,
          borderRadius,
          fontWeight,
          fontFamily: '"Noto Sans KR", sans-serif',
          whiteSpace: 'nowrap',
          textAlign: 'center'
        }}
      >
        {children}
      </div>
    </Html>
  );
};

export default Text3D;
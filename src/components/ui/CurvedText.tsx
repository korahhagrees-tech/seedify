"use client";

import { useEffect, useRef } from 'react';

interface CurvedTextProps {
  text: string;
  radius?: number;
  angle?: number;
  fontSize?: number;
  color?: string;
  className?: string;
  width?: number;
  height?: number;
  rotationOffset?: number; // Additional rotation offset in radians
}

export default function CurvedText({
  text,
  radius = 100,
  angle = Math.PI * 0.6,
  fontSize = 12,
  color = '#000000',
  className = '',
  width = 200,
  height = 200,
  rotationOffset = 0
}: CurvedTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas
    context.clearRect(0, 0, width, height);

    // Set text properties
    context.font = `${fontSize}px`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Calculate angle per character
    const anglePerChar = angle / text.length;

    // Move to center and rotate to start position
    context.translate(width / 2, height / 2);
    context.rotate(-angle / 2 + rotationOffset);

    // Draw each character
    for (let i = 0; i < text.length; i++) {
      context.rotate(anglePerChar);
      context.save();
      context.translate(0, -radius);
      context.fillText(text[i], 0, 0);
      context.restore();
    }

    // Reset transformations
    context.setTransform(1, 0, 0, 1, 0, 0);
  }, [text, radius, angle, fontSize, color, width, height, rotationOffset]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', pointerEvents: 'none' }}
    />
  );
}

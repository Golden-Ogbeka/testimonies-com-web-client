import { ImageResponse } from 'next/og';

export const alt = 'Testimonies — Share His Goodness';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2C3248',
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.67 19a2 2 0 0 0 1.41-.59l6.32-6.32a2.83 2.83 0 0 0-4-4L10 12.67a2 2 0 0 0-.59 1.41V17a1 1 0 0 0 1 1Z"/>
          <path d="m9.09 14.91-3.42 3.42a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l3.42-3.42"/>
          <path d="M14 6l4 4"/>
        </svg>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            margin: '20px 0 6px',
            letterSpacing: '-0.02em',
          }}
        >
          Testimonies
        </h1>
        <p
          style={{
            fontSize: 22,
            color: '#d1d5db',
            margin: 0,
          }}
        >
          Share His Goodness
        </p>
      </div>
    ),
    { ...size },
  );
}

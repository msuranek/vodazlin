import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VodaZlín – Kvalita pitné vody ve Zlíně';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Icon + Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {/* Water icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0284c7"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
              <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
            </svg>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
              <span
                style={{
                  fontSize: 100,
                  fontWeight: 700,
                  color: '#1e3a5f',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  fontFamily: 'sans-serif',
                }}
              >
                Voda
              </span>
              <span
                style={{
                  fontSize: 100,
                  fontWeight: 700,
                  color: '#0284c7',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  fontFamily: 'sans-serif',
                }}
              >
                Zlín
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: '#475569',
              letterSpacing: '0.5px',
              fontFamily: 'sans-serif',
            }}
          >
            Kvalita pitné vody ve Zlíně
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  width = 150,
  height = 60,
  href = '/',
}) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center relative transition-opacity hover:opacity-90 ${className}`}
      aria-label="LUMÉRA Home"
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <div
        style={{
          position: 'relative',
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <Image
          src="/images/lumera-logo.png"
          alt="LUMÉRA"
          fill
          priority
          sizes="(max-width: 768px) 130px, 160px"
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    </Link>
  );
};

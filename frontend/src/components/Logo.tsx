import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`drop-shadow-sm ${className}`}
    >
      <path d="M16 28L4 8H10L16 20L22 8H28L16 28Z" fill="currentColor"/>
      <path d="M16 20L8 8H14L16 12L18 8H24L16 20Z" fill="currentColor" fillOpacity="0.4"/>
      <circle cx="16" cy="13" r="1.5" fill="var(--color-cotton-bg)" />
    </svg>
  );
}

'uce client'
import React from 'react';
import Link from 'next/link';

const CTAButton = ({
  text,
  type = 'button',
  href,
  disabled = false,
  onClick,
  className = '',
  style = {},
}) => {
  const isCustom = className.trim().length > 0;

  const commonClassName = isCustom
    ? className
    : `px-4 py-2 text-sm text-background transition cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
      }`;

  const commonStyle = isCustom
    ? style
    : {
        backgroundColor: 'var(--cta-color)',
        borderRadius: '20px',
        ...style,
      };

  // Render as Link (Next.js 13+ compliant)
  if (href) {
    return (
      <Link
        href={href}
        className={commonClassName}
        style={commonStyle}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
      >
        {text}
      </Link>
    );
  }

  // Render as button otherwise
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={commonClassName}
      style={commonStyle}
    >
      {text}
    </button>
  );
};

export default CTAButton;

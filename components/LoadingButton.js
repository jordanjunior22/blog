'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';

export default function LoadingButton({
  onClick,
  loading = false,
  disabled = false,
  children,
  className = '',
  spinner = <Loader2 className="animate-spin w-5 h-5" />,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={clsx(
        'transition rounded py-2 px-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-60',
        className
      )}
      {...rest}
    >
      {loading ? spinner : children}
    </button>
  );
}

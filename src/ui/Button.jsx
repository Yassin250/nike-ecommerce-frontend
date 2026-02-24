import React from 'react';
import clsx from 'clsx';

const base =
    'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-colors disabled:opacity-50 disabled:pointer-events-none';

export const Button = ({
    variant = 'primary',
    className,
    children,
    ...props
}) => {
    const styles = {
        primary: 'bg-black text-white hover:bg-neutral-900',
        secondary:
            'border border-black text-black hover:bg-black hover:text-white',
        ghost: 'text-black hover:bg-neutral-100'
    };

    return (
        <button
            className={clsx(base, styles[variant] || styles.primary, className)}
            {...props}
        >
            {children}
        </button>
    );
};

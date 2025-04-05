'use client'

import { motion, useAnimate } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { ACCENT_COLOR } from "@/app/components/modal/modal";

interface GradientButtonProps {
    children: ReactNode;
    onClickAction: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

export default function GradientButton({
    children,
    onClickAction,
    disabled = false,
    variant = 'primary'
}: GradientButtonProps) {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        if (variant === 'primary' && !disabled) {
            animate(scope.current, { left: '-100%' }, { duration: 0 });

            const timeout = setTimeout(() => {
                animate(scope.current,
                    { left: ['-100%', '100%'] },
                    {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }
                );
            }, 10);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [scope, animate, disabled, variant]);

    const variantStyles = variant === 'primary'
        ? {
            background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_COLOR}cc)`,
            textColor: 'text-white'
        }
        : {
            background: 'bg-gray-800 hover:bg-gray-700',
            textColor: 'text-gray-300'
        };

    return (
        <motion.button
            onClick={onClickAction}
            disabled={disabled}
            className={`px-6 py-3 rounded-lg font-medium relative overflow-hidden ${
                variantStyles.textColor
            } ${disabled ? 'opacity-50 cursor-not-allowed line-through' : 'cursor-pointer'} 
            ${variant === 'secondary' ? variantStyles.background : ''}`}
            style={variant === 'primary' ? { background: variantStyles.background } : {}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            {variant === 'primary' && !disabled && (
                <motion.span
                    ref={scope}
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 skew-x-12"
                    initial={{ left: '-100%' }}
                />
            )}
            {children}
        </motion.button>
    );
}

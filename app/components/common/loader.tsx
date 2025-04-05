'use client'
import { motion } from 'framer-motion';

interface PercentageDisplayProps {
    value: number;
}

interface ProgressBarProps {
    color: string;
    value: number;
    width?: string;
}

interface ProcessingLoaderProps {
    color: string;
    progressValue: number;
    className?: string;
}

interface CircleDotsProps {
    color: string;
    radius: number;
}

interface CircleRingProps {
    color: string;
    size: string;
    isDashed?: boolean;
}

export const CircleRing = ({ color, size, isDashed = false }: CircleRingProps) => {
    return isDashed ? (
        <motion.div
            className="absolute rounded-full border-dashed border-2"
            style={{
                borderColor: color,
                width: size,
                height: size
            }}
            animate={{
                rotate: 360
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    ) : (
        <motion.div
            className="absolute rounded-full border-2"
            style={{
                borderColor: color,
                width: size,
                height: size
            }}
            animate={{
                scale: [1, 1.05, 1],
                opacity: [0.7, 0.9, 0.7],
                borderWidth: ['2px', '3px', '2px']
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
};

export const CircleDots = ({ color, radius }: CircleDotsProps) => {
    return (
        <>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((degree, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                        backgroundColor: color,
                        left: `calc(50% + ${radius * Math.cos(degree * (Math.PI / 180))}px)`,
                        top: `calc(50% + ${radius * Math.sin(degree * (Math.PI / 180))}px)`,
                        transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </>
    );
};

export const ProgressBar = ({ color, value, width = '200px' }: ProgressBarProps) => {
    return (
        <motion.div
            className="absolute -bottom-10 w-full h-1 bg-gray-800 rounded-full overflow-hidden"
            style={{ width }}
        >
            <motion.div
                className="h-full rounded-full"
                style={{
                    backgroundColor: color,
                    width: `${value}%`
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
};

export const PercentageDisplay = ({ value }: PercentageDisplayProps) => {
    return (
        <motion.div
            className="text-white text-xl font-bold"
            animate={{
                scale: [0.95, 1.05, 0.95]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {Math.round(value)}%
        </motion.div>
    );
};

export const ProcessingLoader = ({ color, progressValue, className }: ProcessingLoaderProps) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <CircleRing color={color} size="180px" />
            <CircleRing color={color} size="140px" isDashed={true} />

            <div className="relative z-20 bg-gray-900 rounded-full flex items-center justify-center"
                 style={{ width: '100px', height: '100px' }}>
                <CircleDots color={color} radius={48} />
                <PercentageDisplay value={progressValue} />
            </div>

            <ProgressBar color={color} value={progressValue} />
        </div>
    );
};

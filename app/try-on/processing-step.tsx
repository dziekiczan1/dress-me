'use client'

import { motion } from 'framer-motion';

import { useTryOn } from './try-on-context';
import {ACCENT_COLOR} from "@/app/components/modal/modal";
import {ProcessingLoader} from "@/app/components/common/loader";

export default function ProcessingStep() {
    const { progressValue } = useTryOn();

    return (<div className="p-8 flex flex-col items-center justify-center space-y-8">
        <ProcessingLoader color={ACCENT_COLOR} progressValue={progressValue} className={`w-80 h-80 mb-0`}/>

        <div className="text-center space-y-3">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                Creating your virtual look
            </h3>
            <p className={`text-sm text-gray-300`}>
                Our AI is working its magic to generate your virtual try-on
            </p>
        </div>

        <div className="w-full max-w-md">
            <motion.div
                className="text-center text-xs text-gray-500 dark:text-gray-400"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.5}}
            >
                <p>Analyzing clothing style and pattern...</p>
            </motion.div>
        </div>
    </div>);
}

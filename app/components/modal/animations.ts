export const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
};

export const modalVariants = {
    hidden: {
        scale: 0.9,
        opacity: 0,
        y: 10,
        rotateX: -5
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: 'spring',
            stiffness: 350,
            damping: 30,
            mass: 1.2,
            duration: 0.5
        }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        y: 10,
        rotateX: 5,
        transition: {
            duration: 0.25,
            ease: [0.32, 0, 0.67, 0]
        }
    }
};

export const contentVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 200 : -200,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 200 : -200,
        opacity: 0,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    })
};

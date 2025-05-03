// Các utility functions cho animation

/**
 * Animation variants cho các thành phần UI
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const scaleUpVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
};

export const slideInFromBottomVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export const buttonVariants = {
  default: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

/**
 * Tạo keyframe animation cho số đếm
 * @param {number} value - Giá trị hiện tại
 * @param {number} prevValue - Giá trị trước đó
 * @returns {object} - Animation object
 */
export function createCountAnimation(value, prevValue) {
  const isIncreasing = value > prevValue;

  return {
    initial: { y: isIncreasing ? 20 : -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: isIncreasing ? -20 : 20, opacity: 0 },
    transition: { duration: 0.3 },
  };
}

/**
 * Tạo hiệu ứng pulse cho thành phần UI
 * @returns {keyframes} - CSS keyframes cho animation
 */
export const pulseAnimation = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

/**
 * Tạo hiệu ứng wave cho chữ
 * @param {number} delay - Thời gian delay giữa các chữ cái
 * @returns {Function} - Hàm trả về style cho mỗi chữ cái
 */
export function createWaveAnimation(delay = 0.1) {
  return (index) => ({
    animation: `wave 1s ease-in-out ${index * delay}s infinite`,
    display: 'inline-block',
  });
}

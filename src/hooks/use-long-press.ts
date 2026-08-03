import { useCallback, useRef } from "react";

interface LongPressOptions {
  threshold?: number;
  onLongPress: (e: React.MouseEvent | React.TouchEvent) => void;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export function useLongPress({
  threshold = 600,
  onLongPress,
  onClick,
}: LongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressActive = useRef(false);

  const start = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Avoid text selection/context menu triggering during touch
      isLongPressActive.current = false;
      timerRef.current = setTimeout(() => {
        isLongPressActive.current = true;
        onLongPress(e);
      }, threshold);
    },
    [onLongPress, threshold],
  );

  const stop = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (!isLongPressActive.current) {
        onClick?.(e);
      }
    },
    [onClick],
  );

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
  };
}

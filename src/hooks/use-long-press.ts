import { useCallback, useRef } from "react";

interface LongPressOptions {
  threshold?: number;
  moveThreshold?: number;
  onLongPress: (e: React.MouseEvent | React.TouchEvent) => void;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export function useLongPress({
  threshold = 500,
  moveThreshold = 10,
  onLongPress,
  onClick,
}: LongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressActive = useRef(false);
  const isMoved = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const isTouchRef = useRef(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e && e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ("changedTouches" in e && e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    if ("clientX" in e && typeof e.clientX === "number") {
      return { x: e.clientX, y: e.clientY };
    }
    return null;
  };

  const start = useCallback(
    (e: React.MouseEvent | React.TouchEvent, isTouch: boolean) => {
      if (isTouch) {
        isTouchRef.current = true;
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }
      } else if (isTouchRef.current) {
        return;
      }

      isLongPressActive.current = false;
      isMoved.current = false;
      startPos.current = getCoordinates(e);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        isLongPressActive.current = true;
        onLongPress(e);
      }, threshold);
    },
    [onLongPress, threshold]
  );

  const move = useCallback(
    (e: React.MouseEvent | React.TouchEvent, isTouch: boolean) => {
      if (!isTouch && isTouchRef.current) return;

      if (!startPos.current) return;

      const currentPos = getCoordinates(e);
      if (!currentPos) return;

      const deltaX = Math.abs(currentPos.x - startPos.current.x);
      const deltaY = Math.abs(currentPos.y - startPos.current.y);

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        isMoved.current = true;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    },
    [moveThreshold]
  );

  const stop = useCallback(
    (e: React.MouseEvent | React.TouchEvent, isTouch: boolean) => {
      if (isTouch) {
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }
        touchTimeoutRef.current = setTimeout(() => {
          isTouchRef.current = false;
        }, 800);
      } else if (isTouchRef.current) {
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!isLongPressActive.current && !isMoved.current) {
        onClick?.(e);
      }

      startPos.current = null;
    },
    [onClick]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPos.current = null;
  }, []);

  return {
    onMouseDown: (e: React.MouseEvent) => start(e, false),
    onMouseUp: (e: React.MouseEvent) => stop(e, false),
    onMouseMove: (e: React.MouseEvent) => move(e, false),
    onMouseLeave: cancel,
    onTouchStart: (e: React.TouchEvent) => start(e, true),
    onTouchEnd: (e: React.TouchEvent) => stop(e, true),
    onTouchMove: (e: React.TouchEvent) => move(e, true),
  };
}

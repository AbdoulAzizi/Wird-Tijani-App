import { useRef, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native';

/**
 * useAutoScroll
 *
 * Measures the real Y position of each card via onLayout refs,
 * then scrolls precisely to the next card when the current one completes.
 *
 * Usage:
 *   const { scrollRef, registerCard } = useAutoScroll(completions);
 *
 *   <ScrollView ref={scrollRef}>
 *     <DhikrCard onLayout={registerCard(0)} ... />
 *     <DhikrCard onLayout={registerCard(1)} ... />
 *   </ScrollView>
 *
 * @param completions  boolean[] — true when step[i] is done
 * @param delay        ms to wait before scrolling after completion (default 700)
 */
export function useAutoScroll(completions: boolean[], delay = 700) {
  const scrollRef  = useRef<ScrollView>(null);
  // Store measured Y offset of each card
  const cardYs     = useRef<number[]>([]);
  const prevDone   = useRef<boolean[]>(completions.map(() => false));
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all pending timers on unmount
  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    completions.forEach((done, i) => {
      const wasDone    = prevDone.current[i];
      const nextIndex  = i + 1;

      if (done && !wasDone && nextIndex < completions.length) {
        const t = setTimeout(() => {
          const targetY = cardYs.current[nextIndex];
          if (targetY !== undefined) {
            scrollRef.current?.scrollTo({ y: targetY, animated: true });
          }
        }, delay);
        timers.current.push(t);
      }
    });

    prevDone.current = [...completions];
  }, [completions, delay]);

  /**
   * Returns an onLayout handler for the card at `index`.
   * Attach it to each DhikrCard's View wrapper.
   */
  const registerCard = useCallback(
    (index: number) =>
      (event: { nativeEvent: { layout: { y: number } } }) => {
        cardYs.current[index] = event.nativeEvent.layout.y;
      },
    [],
  );

  return { scrollRef, registerCard };
}
import { useRef, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native';

/**
 * useAutoScroll
 *
 * Measures the real Y position of each card via onLayout refs,
 * then scrolls precisely to the next card when the current one completes.
 *
 * @param completions  boolean[] — true when step[i] is done
 * @param delays       Scroll delay after a card completes, in ms.
 *                     - number    → same delay for every card (default: 700)
 *                     - number[]  → per-card delays; any missing index falls
 *                                   back to DEFAULT_DELAY
 *
 * @example
 *   // Uniform delay
 *   const { scrollRef, registerCard } = useAutoScroll(completions);
 *   const { scrollRef, registerCard } = useAutoScroll(completions, 500);
 *
 *   // Per-card: Jawhara (index 3) gets extra time, others are default
 *   const { scrollRef, registerCard } = useAutoScroll(completions, [700, 700, 700, 1400]);
 *
 * Usage:
 *   <ScrollView ref={scrollRef}>
 *     <View onLayout={registerCard(0)}> ... </View>
 *     <View onLayout={registerCard(1)}> ... </View>
 *   </ScrollView>
 */

const DEFAULT_DELAY = 700;

export function useAutoScroll(
  completions: boolean[],
  delays: number | number[] = DEFAULT_DELAY,
) {
  const scrollRef = useRef<ScrollView>(null);
  const cardYs    = useRef<number[]>([]);
  const prevDone  = useRef<boolean[]>(completions.map(() => false));
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const resolveDelay = useCallback(
    (index: number): number => {
      if (typeof delays === 'number') return delays;
      return delays[index] ?? DEFAULT_DELAY;
    },
    // delays is either a primitive or a new array ref — JSON.stringify lets us
    // memoize correctly even when the caller passes an inline array literal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeof delays === 'number' ? delays : JSON.stringify(delays)],
  );

  // Clear all pending timers on unmount
  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    completions.forEach((done, i) => {
      const wasDone   = prevDone.current[i];
      const nextIndex = i + 1;

      if (done && !wasDone && nextIndex < completions.length) {
        const t = setTimeout(() => {
          const targetY = cardYs.current[nextIndex];
          if (targetY !== undefined) {
            scrollRef.current?.scrollTo({ y: targetY, animated: true });
          }
        }, resolveDelay(i));

        timers.current.push(t);
      }
    });

    prevDone.current = [...completions];
  }, [completions, resolveDelay]);

  /**
   * Returns an onLayout handler for the card at `index`.
   * Attach it to each DhikrCard's wrapping View.
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
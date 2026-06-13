import type { TextFallbackValue } from '../types/social.types';

export type TextFallbackVariant = 'full' | 'short' | 'compact';

export function getTextFallbackValue(
  value: string | TextFallbackValue | undefined,
  variant: TextFallbackVariant = 'full',
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (variant === 'compact') {
    return value.compact ?? value.short ?? value.full;
  }

  if (variant === 'short') {
    return value.short ?? value.full;
  }

  return value.full;
}
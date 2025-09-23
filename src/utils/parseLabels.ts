import type { LabelItem } from '../models/models';

export function parseLabels(input: string): LabelItem[] {
    if (!input) return [];
    return input
        .split(';')
        .map((str) => str.trim())
        .filter((s) => s.length > 0)
        .map((text) => ({ text }));
}

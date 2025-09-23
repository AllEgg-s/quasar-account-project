import type { LabelItem } from '../models/models';

export function labelsToString(items: LabelItem[]): string {
    return items.map((i) => i.text).join(';');
}

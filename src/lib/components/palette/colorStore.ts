import type { HsvaColor } from 'colord';
import { writable } from 'svelte/store';

export const hsva = writable<HsvaColor>({ h: 0, s: 360, v: 0, a: 1 });

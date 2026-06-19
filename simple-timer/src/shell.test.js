import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('index.html shell', () => {
  const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');

  it('contains timer card with semantic roles', () => {
    expect(html).toContain('role="application"');
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-live="polite"');
  });

  it('includes all four preset buttons with data-minutes', () => {
    expect(html).toContain('data-minutes="1"');
    expect(html).toContain('data-minutes="5"');
    expect(html).toContain('data-minutes="10"');
    expect(html).toContain('data-minutes="25"');
  });

  it('includes control microcopy from EXPERIENCE.md', () => {
    expect(html).toContain("Let's go");
    expect(html).toContain('Pause for now');
    expect(html).toContain('Start over');
    expect(html).toContain("Time's up!");
  });

  it('includes idle hint for accessibility polish', () => {
    expect(html).toContain("Tap a preset or press Let's go");
  });

  it('announces completion via aria-live without atomic countdown spam', () => {
    expect(html).toContain('class="completion" aria-live="polite"');
    expect(html).not.toContain('aria-atomic="true"');
  });

  it('loads Source Serif 4 from Google Fonts', () => {
    expect(html).toContain('Source+Serif+4');
  });
});

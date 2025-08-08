import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add: normalize forwarded email subjects by stripping common prefixes
export function normalizeSubject(subject: string | undefined): string {
  if (!subject) return '';
  // Remove common forward/reply prefixes (case-insensitive, repeated)
  return subject
    .replace(/^\s*((re|fwd?|fw)\s*:\s*)+/i, '')
    .trim();
}

// Add: unwrap forwarded content heuristically from HTML or text
export function unwrapForwardedContent(params: {
  html?: string;
  text?: string;
}): { html?: string; text?: string } {
  const { html, text } = params;

  // Heuristic markers commonly seen in forwarded emails
  const markers = [
    'Begin forwarded message',
    'Forwarded message',
    '-------- Forwarded message --------',
    'Original Message',
  ];

  let processedHtml = html;
  let processedText = text;

  // Text unwrapping: take the section after a marker if it makes content longer and likely relevant
  if (processedText) {
    for (const marker of markers) {
      const idx = processedText.indexOf(marker);
      if (idx !== -1) {
        const candidate = processedText.slice(idx + marker.length).trim();
        if (candidate.length > processedText.length * 0.5) {
          processedText = candidate;
          break;
        }
      }
    }
  }

  // HTML unwrapping: try to find the largest content block that contains likely retailer signals
  if (processedHtml) {
    const signals = [
      'myntra', 'myntra.com',
      'zara', 'zara.com',
      'h&amp;m', 'h&m', 'hm.com', 'www2.hm.com', 'delivery.hm.com'
    ];

    // Prefer parts after forwarded separators
    const separators = [
      '-------- Forwarded message --------',
      '<hr',
    ];

    let candidate = processedHtml;
    for (const sep of separators) {
      const idx = candidate.toLowerCase().indexOf(sep.toLowerCase());
      if (idx !== -1) {
        const after = candidate.slice(idx + sep.length);
        if (signals.some(s => after.toLowerCase().includes(s))) {
          candidate = after;
          break;
        }
      }
    }

    // If we found a candidate with stronger signals, use it
    if (signals.some(s => candidate.toLowerCase().includes(s))) {
      processedHtml = candidate;
    }
  }

  return { html: processedHtml, text: processedText };
}

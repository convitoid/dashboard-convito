import DOMPurify from "dompurify";

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input);
}

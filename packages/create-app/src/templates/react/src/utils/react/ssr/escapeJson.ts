import { escapeHtml } from './escapeHtml';

export function escapeJson(obj: Record<string, unknown>): string {
  return escapeHtml(JSON.stringify(JSON.stringify(obj)));
}

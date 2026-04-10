import { escapeHtml } from './escapeHtml';

export function escapeJson(value: unknown): string {
  return escapeHtml(JSON.stringify(JSON.stringify(value)));
}

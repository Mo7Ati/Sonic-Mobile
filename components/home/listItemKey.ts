/** FlatList key when `id` may be missing from the API. */
export function listItemKey(id: unknown, index: number): string {
  if (id !== null && id !== undefined && id !== '') {
    return String(id);
  }
  return `i${index}`;
}

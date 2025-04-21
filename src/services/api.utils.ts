// Take a sortable and an accessor fn, return sorted in descending order
export function sortDescending<T>(arr: T[], getKey: (item: T) => number): T[] {
  return [...arr].sort((a, b) => getKey(b) - getKey(a));
}

export function sortAscending<T>(arr: T[], getKey: (item: T) => number): T[] {
  return [...arr].sort((a, b) => getKey(a) - getKey(b));
}

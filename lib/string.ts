// lib/string.ts
export const capitalizeFirst = (value: string) =>
  value
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase())
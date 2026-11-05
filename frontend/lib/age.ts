export function ageOn(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const part = (name: string) =>
    Number(parts.find((p) => p.type === name)?.value);
  const year = part("year"),
    month = part("month"),
    day = part("day");
  return year - 2003 - (month < 7 || (month === 7 && day < 11) ? 1 : 0);
}
export function formatAge(age: number): string {
  const last = age % 10,
    lastTwo = age % 100;
  return `${age} ${last === 1 && lastTwo !== 11 ? "год" : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? "года" : "лет"}`;
}

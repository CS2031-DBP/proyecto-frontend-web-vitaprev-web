export function formatDateForDisplay(isoDate: string) {
  // yyyy-MM-dd → dd-MM-yyyy
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export function formatTimeForDisplay(time: string) {
  // HH:mm:ss → HH:mm
  return time?.slice(0, 5) ?? time;
}

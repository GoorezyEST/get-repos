export function formatDateToCountryFormat(
  dateString: string,
  locale: string
): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
  return formattedDate;
}

export function extractYearFromDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  return year;
}

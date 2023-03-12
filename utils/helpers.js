/**function will return a new date with an offset from the provided original date based on the provided interval - will accept an object {OriginalDate: DateObject, interval: string(defaults to 'week')}
 * 
 if the originalDate day was 31 then the returned date will be the last day of the month + interval
  - Mar 31 + 'month' ===> Apr 30 --- not May 1
  - Mar 31 + '3-months' ===> Jun 30 --- not Jul 1
  - Mar 31 + '6-months' ===> Sep 30 --- not Oct 1
  */
export function getNextDate({ originalDate, interval = 'week' }) {
  const newDate = new Date(originalDate.getTime());

  switch (interval) {
    case 'week':
      newDate.setDate(newDate.getDate() + 7);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + 1);
      if (originalDate.getDate() === 31) {
        newDate.setDate(0);
      }
      break;
    case '3-months':
      newDate.setMonth(newDate.getMonth() + 3);
      if (originalDate.getDate() === 31) {
        newDate.setDate(0);
      }
      break;
    case '6-months':
      newDate.setMonth(newDate.getMonth() + 6);
      if (originalDate.getDate() === 31) {
        newDate.setDate(0);
      }
      break;
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
    default:
      console.log(
        '@getNextDate function -- function was called with interval which is not defined'
      );
      break;
  }

  return new Date(newDate.getTime());
}

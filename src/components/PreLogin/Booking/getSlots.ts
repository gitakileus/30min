const dayjs = require('dayjs');

const isToday = require('dayjs/plugin/isToday');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);

const getMinutesFromMidnight = date => date.hour() * 60 + date.minute();

const getSlots = ({
  calendarTimeZone,
  eventLength,
  selectedTimeZone,
  selectedDate,
  availabilityWindows,
}) => {
  if (!selectedDate) return [];

  const lowerBound = selectedDate.startOf('day');
  const upperBound = selectedDate.endOf('day');

  const slots: number[] = [];
  const now = dayjs();

  if (calendarTimeZone === selectedTimeZone) {
    for (let i = 0; i < availabilityWindows?.length; i++) {
      const availabilityWindow = availabilityWindows[i];
      const {start} = availabilityWindow;
      const {end} = availabilityWindow;

      const startDateTime = lowerBound.tz(calendarTimeZone).startOf('day').add(start, 'minutes');
      const endDateTime = lowerBound.tz(calendarTimeZone).startOf('day').add(end, 'minutes');

      const maxMinutes = endDateTime.diff(startDateTime, 'minutes');

      for (let minutes = 0; minutes <= maxMinutes; minutes += parseInt(eventLength, 10)) {
        const slot = startDateTime.add(minutes, 'minutes');

        if (slot > now) {
          slots.push(slot);
        }
      }
    }

    return slots;
  }

  for (let i = 0; i < availabilityWindows?.length; i++) {
    const availabilityWindow = availabilityWindows[i];
    const {start} = availabilityWindow;
    const {end} = availabilityWindow;

    const startDateTime = lowerBound.tz(calendarTimeZone).startOf('day').add(start, 'minutes');
    const endDateTime = upperBound.tz(calendarTimeZone).subtract(eventLength, 'minutes');

    let phase = 0;
    if (startDateTime < lowerBound) {
      const diff = lowerBound.diff(startDateTime, 'minutes');

      phase = diff + eventLength - (diff % eventLength);
    }

    const maxMinutes = endDateTime.diff(startDateTime, 'minutes');

    for (let minutes = phase; minutes <= maxMinutes; minutes += parseInt(eventLength, 10)) {
      const slot = startDateTime.add(minutes, 'minutes');

      const minutesFromMidnight = getMinutesFromMidnight(slot);

      if (minutesFromMidnight < start || minutesFromMidnight > end - eventLength || slot < now) {
        // eslint-disable-next-line no-continue
        continue;
      }

      slots.push(slot.tz(selectedTimeZone));
    }
  }
  return slots;
};

export default getSlots;

export const tsRgex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
export const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const toLowerCase = (key) => key.toString().toLowerCase();
const isValidDay = (key) => dayKeys.includes(key);

export type Complete<T> = {
  [P in keyof Required<T>]: Complete<T[P]>;
};

function isTimeslotValid(slot: any = {}) {
  const validHourRegex = /(?:^[01]\d:[0-5]\d$)|(?:^2[0-3]:[0-5]\d$)/;

  if (!slot.start || !slot.end) {
    return false;
  }

  return validHourRegex.test(slot.start) && validHourRegex.test(slot.end);
}

function areTimeslotValid(timeslot = {}) {
  return Object.entries(timeslot)
    .filter(
      ([day, slots = []]) =>
        isValidDay(toLowerCase(day)) && Array.isArray(slots)
    )
    .reduce((isValid, [, slots = []]: any) => {
      return (
        isValid &&
        slots.reduce((previousSlotValid, slot) => {
          return previousSlotValid && isTimeslotValid(slot);
        }, !!slots.length)
      );
    }, true);
}

function areGeocoordinatePointsValid(points) {
  points
    .map((point) => !!parseFloat(point.lat) && !!parseFloat(point.lng))
    .reduce((isValid, current) => isValid && current, !!points.length);
}

export const hasTimeslotValidKeys = function(slot: any = {}) {
  return slot.start && slot.end;
};

export const isArrayOfPrimitives = (arr) =>
  arr.reduce((acc, item) => {
    return acc && !isObjectOrArray(item);
  }, true);

export const isHourValid = function(string) {
  const validHourRegex = /(?:^[01]\d:[0-5]\d$)|(?:^2[0-3]:[0-5]\d$)/;
  return validHourRegex.test(string);
};

export const isObjectOrArray = (item) =>
  (typeof item === "object" || Array.isArray(item)) && item !== null;

export const isObject = (item) =>
  typeof item === "object" && !Array.isArray(item) && item !== null;

export const isEmptyObject = (item) =>
  isObject(item) && !Object.keys(item).length;

export const isNonEmptyObject = (item) =>
  isObject(item) && Object.keys(item).length;

export const isNonEmptyArray = (item) => Array.isArray(item) && !!item.length;

export const areTimeslotKeysValid = function(timeslot = {}) {
  const timeslotKeys = Object.keys(timeslot);
  return (
    timeslotKeys.map(toLowerCase).filter(isValidDay).length ===
    timeslotKeys.length
  );
};

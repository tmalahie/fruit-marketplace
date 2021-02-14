import knex from "../db/knex";

export function dateToText(d: Date) {
  const twoDigits = (d) => d.toString().padStart(2, "0");
  return (
    d.getUTCFullYear() +
    "-" +
    twoDigits(1 + d.getUTCMonth()) +
    "-" +
    twoDigits(d.getUTCDate()) +
    " " +
    twoDigits(d.getUTCHours()) +
    ":" +
    twoDigits(d.getUTCMinutes()) +
    ":" +
    twoDigits(d.getUTCSeconds())
  );
}
export function dayToText(d: Date) {
  const twoDigits = (d) => d.toString().padStart(2, "0");
  return (
    d.getUTCFullYear() +
    "-" +
    twoDigits(1 + d.getUTCMonth()) +
    "-" +
    twoDigits(d.getUTCDate())
  );
}

export function dataToPolygon(data: any[]) {
  const polygonArgs = [...data, data[0]].map(
    (point) => `${point.lat} ${point.lng}`
  );
  return knex.raw(`ST_PolygonFromText("POLYGON((${polygonArgs.join(",")}))")`);
}

export function polygonToData(data: any[]) {
  const [polygon] = data;
  const getLatLng = (point) => ({ lat: point.x, lng: point.y });
  return polygon.slice(0, -1).map(getLatLng);
}

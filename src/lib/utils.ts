import { autoType, csvParse, csvParseRows } from 'd3-dsv';

export async function getJSON(file: string) {
  const res = await fetch(`https://cod-data.fieldmaps.io/${file}.json`);
  const data = await res.json();
  return data;
}

export async function getCSV(file: string) {
  const res = await fetch(`https://cod-data.fieldmaps.io/${file}.csv`);
  const text = await res.text();
  return csvParse(text, autoType);
}

export async function getCSVRows(file: string) {
  const res = await fetch(`https://cod-data.fieldmaps.io/${file}.csv`);
  const text = await res.text();
  return csvParseRows(text, autoType);
}

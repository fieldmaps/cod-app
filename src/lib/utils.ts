import { baseURL } from '$lib/consts';
import { autoType, csvParse, csvParseRows } from 'd3-dsv';

export async function getJSON(file: string) {
  const res = await fetch(`${baseURL}/${file}.json`);
  const data = await res.json();
  return data;
}

export async function getCSV(file: string) {
  const res = await fetch(`${baseURL}/${file}.csv`);
  const text = (await res.text()).replace(/true/gi, 'true').replace(/false/gi, 'false');
  return csvParse(text, autoType);
}

export async function getCSVRows(file: string) {
  const res = await fetch(`${baseURL}/${file}.csv`);
  const text = (await res.text()).replace(/true/gi, 'true').replace(/false/gi, 'false');
  return csvParseRows(text, autoType);
}

export function classifyScore(score: number) {
  if (score <= 0.333) return 'low';
  if (score <= 0.667) return 'medium';
  if (score < 1) return 'high';
}

export function getCodQuality(service: string) {
  if (service === 'COD_External') return 'Enhanced';
  if (service === 'COD_NO_GEOM_CHECK') return 'Standard';
  return 'Not Available';
}

export function range(stop = 0, start = 0, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
}

export function mergeArrays(arr1: any[], arr2: any[], key: string) {
  const merged = [];
  for (let i = 0; i < arr1.length; i++) {
    merged.push({ ...arr1[i], ...arr2.find((x) => x[key] === arr1[i][key]) });
  }
  return merged;
}

export function getMean(array: number[]) {
  return array.reduce((sum, cur) => sum + cur, 0) / array.length;
}

import axios from 'axios';

const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;
const INCLUDED_CONFIG_KEYS = ['headers', 'params'];

export const API_HEADERS = Object.freeze({
  'X-Api-Key': process.env.REACT_APP_API_KEY,
  Accept: 'application/json',
});

function stableSerialize(value) {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(item => stableSerialize(item)).join(',')}]`;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value).sort();
    const serialized = keys.map(key => `${JSON.stringify(key)}:${stableSerialize(value[key])}`);
    return `{${serialized.join(',')}}`;
  }

  if (typeof value === 'function') {
    return value.toString();
  }

  return JSON.stringify(value);
}

function createCacheKey(url, config = {}) {
  if (!config || typeof config !== 'object') {
    return url;
  }

  const relevantConfig = {};

  INCLUDED_CONFIG_KEYS.forEach(key => {
    if (config[key]) {
      relevantConfig[key] = config[key];
    }
  });

  if (Object.keys(relevantConfig).length === 0) {
    return url;
  }

  return `${url}::${stableSerialize(relevantConfig)}`;
}

export function clearCache() {
  cache.clear();
}

export function removeFromCache(url, config = {}) {
  cache.delete(createCacheKey(url, config));
}

export function getWithCache(url, config = {}, options = {}) {
  const { ttl = DEFAULT_TTL, forceRefresh = false } = options;

  if (forceRefresh || ttl <= 0) {
    return axios.get(url, config);
  }

  const cacheKey = createCacheKey(url, config);
  const now = Date.now();
  const existingEntry = cache.get(cacheKey);

  if (existingEntry) {
    if (existingEntry.data && (existingEntry.expiresAt === Infinity || existingEntry.expiresAt > now)) {
      return Promise.resolve(existingEntry.data);
    }

    if (existingEntry.promise) {
      return existingEntry.promise;
    }

    cache.delete(cacheKey);
  }

  const expiresAt = ttl === Infinity ? Infinity : now + ttl;

  const requestPromise = axios.get(url, config)
    .then(response => {
      cache.set(cacheKey, { data: response, expiresAt });
      return response;
    })
    .catch(error => {
      cache.delete(cacheKey);
      throw error;
    });

  cache.set(cacheKey, { promise: requestPromise, expiresAt });

  return requestPromise;
}

export function cacheSize() {
  return cache.size;
}


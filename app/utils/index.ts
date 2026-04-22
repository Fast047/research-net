export * from './number';
export * from './date';
export * from './string';
export * from './mockData';
export * from './network-helpers';

export const TC = (t: string) => THEMES[t as keyof typeof THEMES]?.color || '#6b7280';
export const TI = (t: string) => THEMES[t as keyof typeof THEMES]?.icon || '📋';
export const TN = (t: string) => THEMES[t as keyof typeof THEMES]?.name || t;

export const statusClass = (status:number) => {
    return ['', {
        'badge-glass-baseColor-success': status === 1,
        'badge-glass-baseColor-warning': status === 2,
        'badge-glass-baseColor-danger': [3,16].includes(status),
        'badge-glass-baseColor-secondary': ![1,2,3,16].includes(status),
    }];
};

export const getDataPromiseSettled = (res: PromiseSettledResult<ApiResponse>, fallback: any, firstData: boolean = false) => {
  if (
      res.status === 'fulfilled' &&
      res.value?.success &&
      Array.isArray(res.value.data)
  ) {
      return firstData
      ? res.value.data[0] ?? fallback
      : res.value.data ?? fallback;
  }
  return fallback;
};
export const formatDateTime = (value: any, cond:any = false): any => {
    if (!value) return '-';
    const date = Intl.DateTimeFormat('th').format(new Date(value)) ?? '-';
    const time = cond ? new Date(value).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : null;
    return cond ? `${date} (${time} น.)` : date;
}
export const formatDate2Digit = (value: any, cond:boolean = false): string => {
    if (!value) return '-';
    const date = new Date(value).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' }) ?? '-'
    const time = cond ? new Date(value).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : null;
    return cond ? `${date} (${time} น.)` : date;
}
export const formatDateTimeFull = (value: any, cond:boolean = false): string => {
    if (!value) return '-';
    const dateTh = new Date(value).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) ?? '-';
    const timeTh = cond ? new Date(value).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : null;
    return cond ? `${dateTh} (${timeTh} น.)` : dateTh;
}
export const formatDateShort = (value: any, cond:boolean = false): string => {
    if (!value) return '-';
    const dateTh = new Date(value).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) ?? '-';
    const timeTh = cond ? new Date(value).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : null;
    return cond ? `${dateTh} (${timeTh} น.)` : dateTh;
}
export const formatTime = (value: any): string => {
    if (!value) return '-';
    const timeTh = new Date(value).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) ?? '-';
    return `${timeTh} น.`;
}
export const formatShowDate = (value: any, cond:any = { hour: '2-digit', minute: '2-digit' }): string => {
  if(!value) return '-';
  return new Date(value).toLocaleDateString('th-TH', cond) ?? '-';
}
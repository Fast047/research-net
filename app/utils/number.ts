export const { format: nFormatter } = Intl.NumberFormat('en-GB', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatComma = (value: number, decimals = 2): string => {
    if (isNaN(value)) return '0.00'
        return (Intl.NumberFormat('th-TH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value) !== 'NaN') 
            ? Intl.NumberFormat('th-TH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value) 
            : '-'
}
export const formatNumNonDigit = (value: number): string => {
  if (!value) return '0'
  else if (isNaN(value)) return '0'
  return (Intl.NumberFormat('th-TH').format(value) !== 'NaN') ? Intl.NumberFormat('th-TH').format(value) : '.'
}
export const formatNumber = (value: number, decimals = 2): string => {
    if (isNaN(value)) return '0.00'
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

export const numberToTHB = (value: number) => {
  return value.toLocaleString('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  });
}
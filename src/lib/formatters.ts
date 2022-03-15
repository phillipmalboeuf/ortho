export const date = (value: string | Date, time=false, lang='fr') =>
  value !== undefined && value !== null ? new Date(value)
    .toLocaleDateString(
      lang === 'fr' ? 'fr-CA' : 'en-us',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...time && {
          hour: '2-digit',
          minute: '2-digit'
        }
      }
    )
  : '–'

export const money = (value: number | string) => 
  value !== undefined && value !== null ? `$${parseFloat(value as string).toFixed(2)}` : `–`

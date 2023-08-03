

export const format = ( value: number ) => {

    const formatter = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,

    });

    return formatter.format( value )
}
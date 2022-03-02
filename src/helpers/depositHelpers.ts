const FixedDepositRateTable = [
    { min: 50000, max: 499999, rates: { 30: 12, 90: 13, 180: 14, 360: 15 }},
    { min: 500000, max: 999999, rates: { 30: 12.5, 90: 13.5, 180: 15, 360: 16 }},
    { min: 1000000, max: 1999999, rates: { 30: 13, 90: 14.5, 180: 17, 360: 18 }},
    { min: 2000000, max: 10000000, rates: { 30: 13.5, 90: 15.5, 180: 18, 360: 19 }}
]

export const getDepositRate = (amount: number, term: number): number => {
    if (amount >= 50000 && amount <= 10000000 ) {
        const rateCell = FixedDepositRateTable.filter(item => {
            if (amount >= item.min && amount <= item.max) {
                return item
            }
        })
        return rateCell[0].rates[term]
    }
    return 0
}

export const getKeyByValue = (object: object, value: string): string => {
    return Object.keys(object).find(key => object[key] === value);
}
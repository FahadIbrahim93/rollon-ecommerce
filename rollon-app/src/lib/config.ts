export const config = {
    currency: {
        symbol: import.meta.env.VITE_CURRENCY_SYMBOL || '৳',
        code: import.meta.env.VITE_CURRENCY_CODE || 'BDT',
        locale: import.meta.env.VITE_CURRENCY_LOCALE || 'bn-BD',
    },
    shipping: {
        freeThreshold: 3000,
        defaultCost: 100,
        zones: [
            { name: 'Dhaka Metro', cost: 60 },
            { name: 'Dhaka Suburb', cost: 100 },
            { name: 'Outside Dhaka', cost: 150 },
        ],
    },
    pagination: {
        defaultPageSize: 12,
    },
};

export const formatPrice = (price: number): string => {
    return `${config.currency.symbol}${price.toLocaleString()}`;
};

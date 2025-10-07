// utils/pricing.ts

export const SECURITY_DEPOSIT = 1000;
const BASE_PRICE_RULES = [
    { days: 90, price: 300 },
    { days: 0, price: 350 },
];
const LENGTH_RULES = [
    { days: 14, adjustment: -100 },
    { days: 7, adjustment: -50 },
    { days: 3, adjustment: 0 },
    { days: 1, adjustment: 50 },
];
const DEMAND_RULES = {
    HIGH_SEASON_FEE: 50,
    HIGH_SEASON_MONTHS: [6, 7], // 6 = Lipiec, 7 = Sierpień
};

export const isWeekend = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6; 
};

const getBaseAndSeasonComponents = (startDate: Date): { base: number, season: number } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let basePrice = BASE_PRICE_RULES[BASE_PRICE_RULES.length - 1].price;
    for (const rule of BASE_PRICE_RULES) {
        if (diffDays >= rule.days) {
            basePrice = rule.price;
            break;
        }
    }
    
    let seasonFee = 0;
    const month = startDate.getMonth();
    if (DEMAND_RULES.HIGH_SEASON_MONTHS.includes(month)) {
        seasonFee = DEMAND_RULES.HIGH_SEASON_FEE;
    }
    
    return { base: basePrice, season: seasonFee };
};

const getDailyPrice = (startDateStr: string, totalRentalDays: number = 1): number => {
    const startDate = new Date(startDateStr);
    const { base, season } = getBaseAndSeasonComponents(startDate);
    
    let lengthAdjustment = 0;
    for (const rule of LENGTH_RULES) {
        if (totalRentalDays >= rule.days) {
            lengthAdjustment = rule.adjustment;
            break;
        }
    }

    return Math.max(100, base + lengthAdjustment + season); 
};

export const calculateTotalCost = (startStr: string, endStr: string, quantity: number): number => {
    if (!startStr || !endStr || quantity < 1) return 0;

    const selectedStart = new Date(startStr);
    const finalEnd = new Date(endStr);

    if (selectedStart > finalEnd) return 0;
    
    const oneDay = 1000 * 60 * 60 * 24;
    const totalRentalDays = Math.round(Math.abs((finalEnd.getTime() - selectedStart.getTime()) / oneDay)) + 1;

    let totalCost = 0;
    let currentDate = new Date(selectedStart);

    while (currentDate <= finalEnd) {
        const dateStr = currentDate.toISOString().slice(0, 10);
        
        const dailyPrice = getDailyPrice(dateStr, totalRentalDays);
        totalCost += dailyPrice;

        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return Math.round(totalCost * quantity); 
};
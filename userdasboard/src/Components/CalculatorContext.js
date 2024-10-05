import React, { createContext, useContext, useCallback } from 'react';

const CalculationContext = createContext();

export const CalculationProvider = ({ children }) => {
    const calculateReturns = useCallback((months, investment, roi) => {
        const monthlyRoi = roi / 12 / 100;
        const monthlyReturns = [];

        if (isNaN(months) || isNaN(investment) || isNaN(monthlyRoi)) return monthlyReturns;

        for (let i = 1; i <= months; i++) {
            const totalReturns = investment * monthlyRoi * i;
            const displayMonth = i % 12 === 0 ? `${i / 12} year${i / 12 > 1 ? 's' : ''}` : `${i} month${i > 1 ? 's' : ''}`;

            monthlyReturns.push({
                month: i,
                displayMonth,
                investment: investment.toFixed(2),
                returns: totalReturns.toFixed(2),
                totalAmount: (investment + totalReturns).toFixed(2),
            });
        }
        return monthlyReturns;
    }, []);

    return (
        <CalculationContext.Provider value={{ calculateReturns }}>
            {children}
        </CalculationContext.Provider>
    );
};

export const useCalculation = () => useContext(CalculationContext);

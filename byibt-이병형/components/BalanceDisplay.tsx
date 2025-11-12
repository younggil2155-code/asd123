import React from 'react';

interface BalanceDisplayProps {
  balance: string | null;
  loading: boolean;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, loading }) => {
    const formattedBalance = balance ? parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">총 자산 (USDT)</h2>
            {loading && !balance ? (
                <div className="animate-pulse h-10 bg-gray-700 rounded w-3/4"></div>
            ) : (
                <p className="text-4xl font-bold text-white tracking-tight">${formattedBalance}</p>
            )}
        </div>
    );
};

export default BalanceDisplay;
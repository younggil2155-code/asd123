import React from 'react';
import type { CoinBalance } from '../types';

interface AssetsBreakdownProps {
  assets: CoinBalance[];
  loading: boolean;
}

const AssetsBreakdown: React.FC<AssetsBreakdownProps> = ({ assets, loading }) => {
  const renderLoadingSkeleton = () => {
    return Array.from({ length: 2 }).map((_, index) => (
      <div key={index} className="flex justify-between items-center py-3 animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-20"></div>
        <div className="h-5 bg-gray-700 rounded w-28"></div>
      </div>
    ));
  };

  const hasAssets = assets && assets.length > 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-400 mb-2">자산별 잔고</h2>
      <div className="divide-y divide-gray-700">
        {loading && !hasAssets ? renderLoadingSkeleton() :
         !loading && !hasAssets ? (
            <p className="text-center py-4 text-gray-500">자산 정보가 없습니다.</p>
         ) : (
          assets.map((asset) => (
            <div key={asset.coin} className="flex justify-between items-center py-3">
              <span className="font-medium text-gray-200">{asset.coin}</span>
              <span className="font-mono text-white">
                {parseFloat(asset.equity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssetsBreakdown;

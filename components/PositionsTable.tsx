import React from 'react';
import type { Position } from '../types';

interface PositionsTableProps {
  positions: Position[];
  loading: boolean;
}

const PositionsTable: React.FC<PositionsTableProps> = ({ positions, loading }) => {
  const renderLoadingSkeleton = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <tr key={index} className="border-b border-gray-700 animate-pulse">
        <td className="px-4 py-4"><div className="h-5 bg-gray-700 rounded w-24"></div></td>
        <td className="px-4 py-4"><div className="h-5 bg-gray-700 rounded w-16"></div></td>
        <td className="px-4 py-4"><div className="h-5 bg-gray-700 rounded w-20"></div></td>
      </tr>
    ));
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-400">포지션</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-300 uppercase tracking-wider">종목</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-300 uppercase tracking-wider">방향</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-300 uppercase tracking-wider">미실현 손익 (P&L)</th>
            </tr>
          </thead>
          <tbody>
            {loading && positions.length === 0 ? renderLoadingSkeleton() :
            !loading && positions.length === 0 ? (
                <tr>
                    <td colSpan={3} className="text-center py-10 text-gray-500">열려있는 포지션이 없습니다.</td>
                </tr>
            ) : (
              positions.map((pos) => {
                const pnl = parseFloat(pos.unrealisedPnl);
                const pnlColor = pnl > 0 ? 'text-green-400' : pnl < 0 ? 'text-red-400' : 'text-gray-300';
                const sideText = pos.side === 'Buy' ? '롱' : '숏';
                const sideColor = pos.side === 'Buy' ? 'text-green-400' : 'text-red-400';
                
                return (
                  <tr key={pos.symbol} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-4 py-4 font-medium">{pos.symbol}</td>
                    <td className={`px-4 py-4 font-bold ${sideColor}`}>{sideText}</td>
                    <td className={`px-4 py-4 font-mono ${pnlColor}`}>{pnl.toFixed(4)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsTable;
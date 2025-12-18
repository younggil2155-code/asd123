import React, { useState, useEffect, useCallback } from 'react';
import { getWalletBalance, getPositions } from '../services/bybitService';
import type { Position } from '../types';
import BalanceDisplay from '../components/BalanceDisplay';
import PositionsTable from '../components/PositionsTable';

// --- 7번 계정 API 설정 ---
const apiKey = "yVNniOVxeBu6kPiLwA"; 
const apiSecret = "MQ4ZRbs1wR29w2OS0MLSIsaNSBLj7n14zzdy"; 
// -------------------------

const ACCOUNT_NUMBER = 7;
const BALANCE_MULTIPLIER = 1000;

function Page7() {
  const [balance, setBalance] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = useCallback(async () => {
    if (!apiKey || !apiSecret) {
      setError(`${ACCOUNT_NUMBER}번 계정의 API 키와 시크릿이 코드에 설정되지 않았습니다.`);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [balanceRes, positionsRes] = await Promise.all([
        getWalletBalance(apiKey, apiSecret),
        getPositions(apiKey, apiSecret),
      ]);

      const totalEquity = balanceRes?.list?.[0]?.totalEquity;
      if (totalEquity) {
        const multipliedBalance = parseFloat(totalEquity) * BALANCE_MULTIPLIER;
        setBalance(multipliedBalance.toString());
      } else {
        setBalance(null);
      }
      
      const openPositions = (positionsRes?.list || [])
        .filter(p => parseFloat(p.size) > 0)
        .map(p => ({
          ...p,
          unrealisedPnl: (parseFloat(p.unrealisedPnl) * BALANCE_MULTIPLIER).toString(),
        }));
      setPositions(openPositions);
      setLastUpdated(new Date());

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      setBalance(null);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-cyan-400">
          Bybit이병형자동매매
        </h1>
        <p className="text-base font-semibold text-gray-400 mt-2">
          {currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          {' '}
          {currentTime.toLocaleTimeString('ko-KR', { hour12: false })}
        </p>
      </header>
      <main className="space-y-6">
        <BalanceDisplay balance={balance} loading={loading} />
        <PositionsTable positions={positions} loading={loading} />

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">오류: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {lastUpdated && !error && (
          <p className="text-center text-gray-500 text-sm mt-4">
            마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
          </p>
        )}
      </main>
    </div>
  );
}

export default Page7;
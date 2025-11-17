import React, { useState, useEffect, useCallback } from 'react';
import { getWalletBalance, getPositions } from '../services/bybitService';
import type { Position } from '../types';
import BalanceDisplay from '../components/BalanceDisplay';
import PositionsTable from '../components/PositionsTable';

// --- 2번 계정 API 설정 ---
// 아래 "" 안에 실제 API 키와 시크릿을 입력하세요.
const apiKey = ""; 
const apiSecret = ""; 
// -------------------------

const ACCOUNT_NUMBER = 2;

function Page2() {
  const [balance, setBalance] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
      setBalance(totalEquity || null);

      const openPositions = (positionsRes?.list || []).filter(p => parseFloat(p.size) > 0);
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

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">
          Bybit 이병형 계정 {ACCOUNT_NUMBER}
        </h1>
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

export default Page2;
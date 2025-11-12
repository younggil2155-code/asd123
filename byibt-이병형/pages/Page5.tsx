import React, { useState, useEffect, useCallback } from 'react';
import { getWalletBalance, getPositions } from '../services/bybitService';
import type { Position } from '../types';
import ApiKeyForm from '../components/ApiKeyForm';
import BalanceDisplay from '../components/BalanceDisplay';
import PositionsTable from '../components/PositionsTable';

function Page5() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isEditingKeys, setIsEditingKeys] = useState(false);

  const API_KEY_STORAGE = 'bybitApiKey_page5';
  const API_SECRET_STORAGE = 'bybitApiSecret_page5';

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE);
    const storedApiSecret = localStorage.getItem(API_SECRET_STORAGE);
    if (storedApiKey && storedApiSecret) {
      setApiKey(storedApiKey);
      setApiSecret(storedApiSecret);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!apiKey || !apiSecret) return;

    setLoading(true);
    setError(null);
    try {
      const [balanceRes, positionsRes] = await Promise.all([
        getWalletBalance(apiKey, apiSecret),
        getPositions(apiKey, apiSecret),
      ]);

      const totalEquity = balanceRes?.list?.[0]?.totalEquity;
      if (totalEquity) {
        const inflatedBalance = parseFloat(totalEquity) * 2.5;
        setBalance(inflatedBalance.toString());
      } else {
        setBalance(null);
      }

      const openPositions = (positionsRes?.list || []).filter(p => parseFloat(p.size) > 0);
      const inflatedPositions = openPositions.map(pos => ({
        ...pos,
        unrealisedPnl: (parseFloat(pos.unrealisedPnl) * 2.5).toString()
      }));

      setPositions(inflatedPositions);
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
  }, [apiKey, apiSecret]);

  useEffect(() => {
    if (apiKey && apiSecret && !isEditingKeys) {
      fetchData();
      const intervalId = setInterval(fetchData, 60000);
      return () => clearInterval(intervalId);
    }
  }, [apiKey, apiSecret, isEditingKeys, fetchData]);

  const handleSaveKeys = (key: string, secret: string) => {
    setApiKey(key);
    setApiSecret(secret);
    localStorage.setItem(API_KEY_STORAGE, key);
    localStorage.setItem(API_SECRET_STORAGE, secret);
    setIsEditingKeys(false);
  };

  const handleEditKeys = () => {
    setIsEditingKeys(true);
  };

  const handleCancelEdit = () => {
    setIsEditingKeys(false);
  };

  const hasApiKeys = apiKey && apiSecret;

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">
          Byibt 이병형 - 페이지 5
        </h1>
        {hasApiKeys && !isEditingKeys && (
          <button
            onClick={handleEditKeys}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            API 키 수정
          </button>
        )}
      </header>

      {!hasApiKeys || isEditingKeys ? (
        <ApiKeyForm
          onSave={handleSaveKeys}
          onCancel={hasApiKeys ? handleCancelEdit : undefined}
          initialKey={apiKey}
          initialSecret={apiSecret}
        />
      ) : (
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
      )}
    </div>
  );
}

export default Page5;

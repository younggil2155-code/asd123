import React, { useState, useEffect, useCallback } from 'react';
import { getWalletBalance, getPositions } from './services/bybitService';
import type { Position } from './types';
import ApiKeyForm from './components/ApiKeyForm';
import BalanceDisplay from './components/BalanceDisplay';
import PositionsTable from './components/PositionsTable';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isEditingKeys, setIsEditingKeys] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('bybitApiKey');
    const storedApiSecret = localStorage.getItem('bybitApiSecret');
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
      setBalance(totalEquity);

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
  }, [apiKey, apiSecret]);

  useEffect(() => {
    if (apiKey && apiSecret && !isEditingKeys) {
      fetchData();
      const intervalId = setInterval(fetchData, 60000); // 1분에 한번 갱신
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, apiSecret, isEditingKeys, fetchData]);

  const handleSaveKeys = (key: string, secret: string) => {
    setApiKey(key);
    setApiSecret(secret);
    localStorage.setItem('bybitApiKey', key);
    localStorage.setItem('bybitApiSecret', secret);
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
        <div>
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">Bybit 대시보드 1.5</h1>
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
      </div>
    </div>
  );
}

export default App;
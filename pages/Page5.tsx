import React, { useState, useEffect } from 'react';

function Page5() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <header className="flex justify-between items-start mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">
          Bybit 이병형 계정 5
        </h1>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-sm font-semibold text-gray-400">{currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
          <p className="text-3xl font-mono font-bold text-gray-100">{currentTime.toLocaleTimeString('ko-KR', { hour12: false })}</p>
        </div>
      </header>
      <main className="flex items-center justify-center h-64 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-300">프로그램 준비중입니다.</p>
          <p className="text-gray-500 mt-2">곧 새로운 기능으로 찾아뵙겠습니다.</p>
        </div>
      </main>
    </div>
  );
}

export default Page5;
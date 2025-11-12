
import React, { useState, useEffect } from 'react';

interface ApiKeyFormProps {
  onSave: (apiKey: string, apiSecret: string) => void;
  onCancel?: () => void;
  initialKey?: string | null;
  initialSecret?: string | null;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave, onCancel, initialKey, initialSecret }) => {
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  
  useEffect(() => {
    setKey(initialKey || '');
    setSecret(initialSecret || '');
  }, [initialKey, initialSecret]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim() && secret.trim()) {
      onSave(key.trim(), secret.trim());
    }
  };

  const isEditing = !!initialKey;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">{isEditing ? 'Bybit API 키 수정' : 'Bybit API 키 입력'}</h2>
      <p className="text-sm text-gray-400 mb-6 text-center">
        API 키와 시크릿은 브라우저에만 저장되며, 외부로 전송되지 않습니다.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
            API Key
          </label>
          <input
            id="apiKey"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="API 키를 입력하세요"
            required
          />
        </div>
        <div>
          <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-300 mb-1">
            API Secret
          </label>
          <input
            id="apiSecret"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="API 시크릿을 입력하세요"
            required
          />
        </div>
        <div className="flex gap-4 pt-2">
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    취소
                </button>
            )}
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
            >
              {isEditing ? '저장' : '저장하고 조회하기'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ApiKeyForm;

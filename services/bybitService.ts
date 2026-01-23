import type { BybitResponse, WalletBalance, PositionList } from '../types';

const API_URL = 'https://api.bybit.com';
const RECV_WINDOW = '20000'; // 시간차 오차 허용 범위를 넓힘

async function createSignature(apiSecret: string, payload: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(apiSecret.trim()),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await window.crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function fetchBybit<T>(endpoint: string, apiKey: string, apiSecret: string, params: Record<string, string>): Promise<T> {
    const timestamp = Date.now().toString();
    const cleanApiKey = apiKey.trim();
    const cleanApiSecret = apiSecret.trim();

    const queryString = Object.entries(params)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    // Bybit V5 GET signature: timestamp + api_key + recv_window + query_string
    const signaturePayload = timestamp + cleanApiKey + RECV_WINDOW + queryString;
    const signature = await createSignature(cleanApiSecret, signaturePayload);

    const url = `${API_URL}${endpoint}?${queryString}`;

    const headers = {
        'X-BAPI-API-KEY': cleanApiKey,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': RECV_WINDOW,
        'X-BAPI-SIGN': signature,
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(`인증 실패(401): API 키 또는 시크릿을 확인하세요.`);
        }
        throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    const data: BybitResponse<T> = await response.json();

    if (data.retCode !== 0) {
        throw new Error(`Bybit API 오류: ${data.retMsg} (코드: ${data.retCode})`);
    }

    return data.result;
}

export const getWalletBalance = (apiKey: string, apiSecret: string) => {
    return fetchBybit<WalletBalance>('/v5/account/wallet-balance', apiKey, apiSecret, {
        accountType: 'UNIFIED',
    });
};

export const getPositions = (apiKey: string, apiSecret: string) => {
    return fetchBybit<PositionList>('/v5/position/list', apiKey, apiSecret, {
        category: 'linear',
        settleCoin: 'USDT',
    });
};
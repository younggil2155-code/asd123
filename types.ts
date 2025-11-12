
export interface BybitResponse<T> {
  retCode: number;
  retMsg: string;
  result: T;
  retExtInfo: object;
  time: number;
}

export interface WalletBalance {
  list: {
    totalEquity: string;
    coin: {
        equity: string;
        coin: string;
    }[];
  }[];
}

export interface Position {
  symbol: string;
  side: 'Buy' | 'Sell' | 'None';
  unrealisedPnl: string;
  size: string;
}

export interface PositionList {
  list: Position[];
}

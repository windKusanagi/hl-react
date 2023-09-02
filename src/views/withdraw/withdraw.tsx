import { globalCtx, RoutePropT } from '@/context';
import React, { useContext } from 'react';

export const WithDraw: React.FC = () => {
  const { web3, htlcAddr, accounts, resError, resSuccess, resetRes } = useContext(globalCtx);
  return <div>with Draw</div>;
};

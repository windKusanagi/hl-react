import { globalCtx, RoutePropT } from '@/context';
import React, { useContext, useEffect, useState } from 'react';

export const NewTrans: React.FC = () => {
  const { web3, htlcAddr, accounts, resError, resSuccess, resetRes } = useContext(globalCtx);

  const [hash, setHash] = useState<any>(null);
  const [hashSecret, setHashSecret] = useState<any>(null);
  const [sender, setSender] = useState<any>(null);
  const [receiver, setReceiver] = useState<any>(null);
  const [hashlock, setHashLock] = useState<any>(null);
  const [time, setTime] = useState<any>(null);
  const [timeLock, setTimeLock] = useState<any>(null);
  const [value, setValue] = useState<any>(null);

  // const genHashAndSecret = () => {
  //   const  hashPair = newSecretHashPair()
  //   this.hash = hashPair.hash
  //   this.hashSecret = hashPair.secret
  //   this.hashlock = this.hash
  // },

  // useEffect(() => {
  //   setCaller(null);
  // }, [htlcAddr]);

  return <div>new Trans</div>;
};

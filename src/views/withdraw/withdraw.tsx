import { globalCtx, HTLC } from '@/context';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, message, Select } from 'antd';
import { sendContract } from '@/utils';

export const WithDraw: React.FC = () => {
  const { web3, htlcAddr, accounts, resError, resSuccess, resetRes } = useContext(globalCtx);

  const [sender, setSender] = useState<any>(null);
  const [txId, setTxId] = useState<any>(null);
  const [hashSecret, setHashSecret] = useState<any>(null);

  useEffect(() => {
    resetRes();
  }, []);

  useEffect(() => {
    setSender(null);
  }, [htlcAddr]);

  const withdraw = () => {
    resetRes();
    if (!web3) {
      message.info('no chain selected');
      return;
    }
    if (!sender || !txId || !hashSecret) {
      message.info('not enough params');
      return;
    }
    const op = {
      web3: web3,
      from: sender,
    };
    sendContract(op, htlcAddr, HTLC, 'withdraw', txId, hashSecret)
      .then(receipt => {
        resSuccess(receipt, 'sendType');
      })
      .catch(e => {
        console.error(e);
        resError(e);
      });
  };

  return (
    <div>
      <h3>==withdraw==</h3>
      <br />
      sender:
      <Select
        onChange={v => {
          setSender(v);
        }}
        options={accounts.map((a, idx) => ({
          value: a,
          label: a,
          key: idx,
        }))}
      />
      <br />
      txId:
      <Input value={txId} onChange={e => setTxId(e.target.value)} />
      <br />
      hashSecret:
      <Input value={hashSecret} onChange={e => setHashSecret(e.target.value)} />
      <br />
      <Button onClick={withdraw}> refund </Button>
    </div>
  );
};

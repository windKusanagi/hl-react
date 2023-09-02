import { globalCtx, HTLC, RoutePropT } from '@/context';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Input, message, Select } from 'antd';
import { callContract } from '@/utils';

export const GetTrans: React.FC = () => {
  const { web3, htlcAddr, accounts, resError, resSuccess, resetRes } = useContext(globalCtx);
  const [caller, setCaller] = useState<any>(null);
  const [txId, setTxId] = useState('');

  const getTransaction = (caller: any, txId: string) => {
    resetRes();
    if (!web3) {
      message.info('no chain selected');
      return;
    }
    if (!caller || txId) {
      message.info('not enough params');
      return;
    }
    const op = {
      web3,
      from: caller,
    };
    callContract(op, htlcAddr, HTLC, 'getTransaction', txId)
      .then(res => {
        resSuccess(res);
      })
      .catch(e => {
        resError(e);
      });
  };

  useEffect(() => {
    setCaller(null);
  }, [htlcAddr]);

  return (
    <Card>
      <h3>==getTx==</h3>
      <p> caller: </p>
      <Select
        onChange={v => {
          setCaller(v);
        }}
        options={accounts.map((a, idx) => ({
          value: a,
          label: a,
          key: idx,
        }))}
      />
      <Input value={txId} onChange={e => setTxId(e.target.value)}></Input>

      <Button onClick={() => getTransaction(caller, txId)}> get transaction</Button>
    </Card>
  );
};

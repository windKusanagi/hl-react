import { globalCtx, HTLC, OneOther } from '@/context';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, DatePicker, Input, message, Select } from 'antd';
import { newSecretHashPair, sendContract } from '@/utils';

export const NewTrans: React.FC = () => {
  const { web3, htlcAddr, accounts, resError, resSuccess, resetRes } = useContext(globalCtx);

  const [hash, setHash] = useState<any>(null);
  const [hashSecret, setHashSecret] = useState<any>(null);
  const [sender, setSender] = useState<any>(null);
  const [receiver, setReceiver] = useState<any>(null);
  const [hashlock, setHashLock] = useState<any>(null);
  const [time, setTime] = useState<any>(null);
  const [timelock, setTimelock] = useState<any>(null);
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    resetRes();
  }, []);

  useEffect(() => {
    setSender(null);
    setReceiver(null);
    setValue(null);
  }, [htlcAddr]);

  const genHashAndSecret = () => {
    const hashPair = newSecretHashPair();
    setHash(hashPair.hash);
    setHashSecret(hashPair.secret);
    setHashLock(hashPair.hash);
  };

  const newTransaction = () => {
    resetRes();
    if (!web3) {
      message.info('no chain selected');
      return;
    }
    if (!receiver || !hashlock || !time || !value) {
      message.info('not enough params');
      return;
    }
    if (receiver === sender) {
      message.info('receiver and sender can not be same');
    }
    setTimelock(Math.floor(Date.parse(time) / 1000));
    const op = {
      web3: web3,
      from: sender,
      value: value * (OneOther as any),
    };
    sendContract(op, htlcAddr, HTLC, 'newTransaction', receiver, hashlock, timelock)
      .then(receipt => {
        resSuccess(receipt, 'sendType');
      })
      .catch(e => {
        console.error(e);
        resError(e);
      });
  };

  return (
    <>
      <Card>
        <h3>==newTx==</h3>
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
        receiver:
        <Select
          onChange={v => {
            setReceiver(v);
          }}
          options={accounts.map((a, idx) => ({
            value: a,
            label: a,
            key: idx,
          }))}
        />
        <br />
        hashlock:
        <Input value={hashlock} onChange={e => setHashLock(e.target.value)} />
        <br />
        timelock:
        <DatePicker showTime onChange={e => setTime(e?.valueOf())} />
        <br />
        value(either)
        <Input value={value} onChange={e => setValue(e.target.value)} />
        <br />
        <Button onClick={newTransaction}>newTransaction </Button>
      </Card>

      <br />
      <li>hash: {hash}</li>
      <li>hashSecret(please remember this!! And DO NOT tell anyone!!): {hashSecret}</li>
      <Button onClick={genHashAndSecret}>genHashAndSecret </Button>
    </>
  );
};

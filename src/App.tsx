import React, { useState, useMemo, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import type Web3 from 'web3';
import { globalCtx, WEB3S } from './context';
import { Card, MenuProps } from 'antd';
import { Button } from 'antd';
import { Dropdown } from 'antd';

export const App = () => {
  const [web3, setWeb3] = useState<Web3>(WEB3S[0].web3);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [htlcAddr, setHtlcAddr] = useState(WEB3S[0].htlcAddr);
  const [resShow, setResShow] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [resTitle, setResTitle] = useState<string | null>(null);
  const [resType, setResType] = useState<any>(null);

  const resetRes = () => {
    setResShow(false);
    setResTitle(null);
    setResType(null);
    setRes(null);
  };

  const resSuccess = (res: any, resType: any) => {
    setResShow(true);
    setRes(res);
    setResType(resType);
    setResTitle('success');
  };

  const resError = (e: any) => {
    setResShow(true);
    setRes(e);
    setResType(null);
    setResTitle('error');
  };

  const dpMenu = useMemo<MenuProps['items']>(
    () =>
      WEB3S.map((w, idx) => ({
        key: idx + '',
        label: w.label + ': ' + w.url,
        onClick: () => {
          setWeb3(w.web3);
          setHtlcAddr(w.htlcAddr);
          setAccounts([]);
          w.web3.eth.getAccounts().then(res => {
            setAccounts(res || []);
          });
        },
      })),
    [],
  );

  return (
    <globalCtx.Provider
      value={{
        web3,
        htlcAddr,
        accounts,
        resetRes,
        resSuccess,
        resError,
      }}
    >
      <div>
        <Dropdown trigger={['click']} menu={{ items: dpMenu }}>
          <Button> 选择 chain </Button>
        </Dropdown>
        <Outlet />

        {resShow && (
          <Card>
            <h3>{resTitle}</h3>
            <Button onClick={resetRes}> close </Button>

            {resType === 'sendType' ? (
              <>
                <p>txHash: {res.transactionHash}</p>
                <p>blockHash: {res.blockHash}</p>
                <p>
                  events: <br />
                  {/* <span v-for="(event, eventName) in res.events"
                :key="eventName">
            {{ eventName }}:
            <li v-for="(paramValue, paramName) in event.returnValues"
                v-if="isNaN(paramName)"
                :key="paramName">
              {{ paramName }}: {{ paramValue }}
            </li>
          </span> */}
                  {/* {res?.events?.length &&
                    res.events.map(({ evt, eventName }, idx) => (
                      <>
                        <span key={idx}>{eventName}</span>
                        {evt?.returnValues?.length &&
                          evt.returnValues.map(({ paramValue,   }, _idx) => (
                            <li key={_idx}>{`${} : ${}`}</li>
                          ))}
                      </>
                    ))} */}
                </p>
              </>
            ) : (
              <pre>{res}</pre>
            )}
          </Card>
        )}
      </div>
    </globalCtx.Provider>
  );
};

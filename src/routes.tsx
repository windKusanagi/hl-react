import React from 'react';
import { App } from '@/App';
import { GetTrans, NewTrans, Refund, WithDraw } from './views';
import type { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/newTx',
        element: <NewTrans />,
      },
      {
        path: '/getTx',
        element: <GetTrans />,
      },
      {
        path: '/withdraw',
        element: <WithDraw />,
      },
      {
        path: '/refund',
        element: <Refund />,
      },
    ],
  },
];

import { createContext } from 'react';
import Web3 from 'web3';

export type RoutePropT = {
  web3: Web3;
  htlcAddr?: string;
  accounts: any[];
  resetRes: CB;
  resSuccess: CB;
  resError: CB;
};

export const globalCtx = createContext<RoutePropT>({} as any);

export const WEB3S = [
  {
    label: 'chainA',
    url: process.env.WEB3A_URL,
    web3: new Web3('http://' + window.location.host + '/web3A'),
    htlcAddr: process.env.HTLC_ADDRA, // hashed time lock contract address on chainA
  },
  {
    label: 'chainB',
    url: process.env.WEB3B_URL,
    web3: new Web3('http://' + window.location.host + '/web3B'),
    htlcAddr: process.env.HTLC_ADDRB, // hashed time lock contract address on chainB
  },
];

export const HTLC = {
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'txId',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'hashlock',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'LogNewTransaction',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'txId',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
      ],
      name: 'LogRefund',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'txId',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
      ],
      name: 'LogWithdraw',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '_txId',
          type: 'bytes32',
        },
      ],
      name: 'getTransaction',
      outputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'receiver',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'bytes32',
          name: 'hashlock',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'withdrawn',
          type: 'bool',
        },
        {
          internalType: 'bool',
          name: 'refunded',
          type: 'bool',
        },
        {
          internalType: 'bytes32',
          name: 'key',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: '_receiver',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: '_hashlock',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: '_timelock',
          type: 'uint256',
        },
      ],
      name: 'newTransaction',
      outputs: [
        {
          internalType: 'bytes32',
          name: 'txId',
          type: 'bytes32',
        },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '_txId',
          type: 'bytes32',
        },
      ],
      name: 'refund',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '_txId',
          type: 'bytes32',
        },
        {
          internalType: 'bytes32',
          name: '_key',
          type: 'bytes32',
        },
      ],
      name: 'withdraw',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};

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
      constant: false,
      inputs: [
        {
          internalType: 'bytes32',
          name: '_transactionID',
          type: 'bytes32',
        },
        {
          internalType: 'bytes32',
          name: '_secret',
          type: 'bytes32',
        },
      ],
      name: 'claimFunds',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'transactionID',
          type: 'bytes32',
        },
      ],
      name: 'FundsClaimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'transactionID',
          type: 'bytes32',
        },
      ],
      name: 'FundsSentBack',
      type: 'event',
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address',
          name: '_beneficiary',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: '_secretHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: '_duration',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_tokenContractAddress',
          type: 'address',
        },
      ],
      name: 'initiateTransfer',
      outputs: [
        {
          internalType: 'bytes32',
          name: 'transactionID',
          type: 'bytes32',
        },
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'bytes32',
          name: '_transactionID',
          type: 'bytes32',
        },
      ],
      name: 'sendBackFunds',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'transactionID',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'initiator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'secretHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'expiryTime',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'tokenContract',
          type: 'address',
        },
      ],
      name: 'TransferInitiated',
      type: 'event',
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'pendingTransfers',
      outputs: [
        {
          internalType: 'address',
          name: 'initiator',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'beneficiary',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'bytes32',
          name: 'secretHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'expiryTime',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'isFundsClaimed',
          type: 'bool',
        },
        {
          internalType: 'bool',
          name: 'isFundsSentBack',
          type: 'bool',
        },
        {
          internalType: 'bytes32',
          name: 'preimage',
          type: 'bytes32',
        },
        {
          internalType: 'address',
          name: 'tokenContractAddress',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
};

const w3 = new Web3();
export const OneOther = w3.utils.toWei(w3.utils.toBN(1), 'ether');

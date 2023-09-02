import crypto from 'crypto';

export function bufToStr(b) {
  return '0x' + b.toString('hex');
}

export function sha256(x) {
  return crypto.createHash('sha256').update(x).digest();
}

export function random32() {
  return crypto.randomBytes(32);
}

export function newSecretHashPair() {
  const secret = random32();
  const hash = sha256(secret);
  return {
    secret: bufToStr(secret),
    hash: bufToStr(hash),
  };
}

export async function callContract(op, contractAddr, contractJson, methodName, ...params) {
  const contractInst = new op.web3.eth.Contract(contractJson.abi, contractAddr);
  const contractInstMethod = !!params
    ? contractInst.methods[methodName](...params)
    : contractInst.methods[methodName]();
  return contractInstMethod.call({
    from: op.from,
  });
}

export async function sendContract(op, contractAddr, contractJson, methodName, ...params) {
  const contractInst = new op.web3.eth.Contract(contractJson.abi, contractAddr);
  const contractInstMethod = !!params
    ? contractInst.methods[methodName](...params)
    : contractInst.methods[methodName]();
  const gasAmount = await contractInstMethod.estimateGas({
    from: op.from,
    value: op.value,
    gasPrice: 1,
  });
  return contractInstMethod.send({
    from: op.from,
    value: op.value,
    gas: gasAmount,
    gasPrice: 1,
  });
}

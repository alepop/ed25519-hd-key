import { sha512 } from '@noble/hashes/sha2.js';
import { hmac } from '@noble/hashes/hmac.js';
import { concatBytes, hexToBytes } from '@noble/hashes/utils.js';
import * as ed from '@noble/ed25519';
import { replaceDerive, pathRegex } from './utils.js';

ed.hashes.sha512 = sha512;

type Hex = string;
type Path = string;

type Keys = {
  key: Uint8Array;
  chainCode: Uint8Array;
};

const ED25519_CURVE = new TextEncoder().encode('ed25519 seed');
const HARDENED_OFFSET = 0x80000000;

export const getMasterKeyFromSeed = (seed: Hex): Keys => {
  const I = hmac(sha512, ED25519_CURVE, hexToBytes(seed));
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
};

export const CKDPriv = ({ key, chainCode }: Keys, index: number): Keys => {
  const indexBuffer = new Uint8Array(4);
  const view = new DataView(indexBuffer.buffer);
  view.setUint32(0, index, false);
  const data = concatBytes(new Uint8Array([0]), key, indexBuffer);
  const I = hmac(sha512, chainCode, data);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
};

export const getPublicKey = (privateKey: Uint8Array, withZeroByte = true): Uint8Array => {
  const { publicKey } = ed.keygen(privateKey);
  return withZeroByte ? concatBytes(new Uint8Array([0]), publicKey) : publicKey;
};

export const isValidPath = (path: string): boolean => {
  if (!pathRegex.test(path)) {
    return false;
  }
  return !path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .some(isNaN as any);
};

export const derivePath = (path: Path, seed: Hex, offset = HARDENED_OFFSET): Keys => {
  if (!isValidPath(path)) {
    throw new Error('Invalid derivation path');
  }

  const { key, chainCode } = getMasterKeyFromSeed(seed);
  const segments = path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .map((el) => parseInt(el, 10));

  return segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), {
    key,
    chainCode,
  });
};

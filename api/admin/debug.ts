import { RECEIPT_ORIGIN, json } from '../_lib/receipt.js';

export const config = { runtime: 'edge' };

export default async function handler() {
  return json({ receiptOrigin: RECEIPT_ORIGIN });
}

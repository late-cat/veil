export const PREVIEW_CONTRACT_ADDRESS = '';
export const PREPROD_CONTRACT_ADDRESS = 'f6532d62d3991079b4aea42544ae744ee0d5f3462be8a75c62cbf514ffa5a974';

export const FALLBACK_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK_ID === 'preview'
    ? PREVIEW_CONTRACT_ADDRESS
    : PREPROD_CONTRACT_ADDRESS;

export const getContractAddress = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('DEPLOYED_CONTRACT_ADDRESS');
    if (stored && stored.trim()) return stored.trim();
  }
  return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || FALLBACK_CONTRACT_ADDRESS;
};

export const CONTRACT_ADDRESS = getContractAddress();

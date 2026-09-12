export const PREVIEW_CONTRACT_ADDRESS = '';
export const PREPROD_CONTRACT_ADDRESS = '36ed22ab9631cdf349dc72984573028bfcf4de6cc57024caa1a96e496d1379c4';

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

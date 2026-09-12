export const MOCK_ISSUER_KEY_BASE64 = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI="; // 32 bytes when decoded ('12345678901234567890123456789012')

// Convert string to ArrayBuffer
function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Get the static AES key
async function getCryptoKey() {
  const rawKey = Uint8Array.from(atob(MOCK_ISSUER_KEY_BASE64), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFeedback(answers: Record<string, any>): Promise<{ ciphertext: string, iv: string }> {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(answers));
  
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  
  const ciphertext = btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer)));
  const ivStr = btoa(String.fromCharCode(...iv));
  
  return { ciphertext, iv: ivStr };
}

export async function decryptFeedback(ciphertextStr: string, ivStr: string): Promise<Record<string, any> | null> {
  try {
    const key = await getCryptoKey();
    const ciphertext = Uint8Array.from(atob(ciphertextStr), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0));
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
    
    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
}

// Utility functions for ArrayBuffer <-> Base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// 1. Generate Issuer RSA Key Pair
export async function generateIssuerKeyPair(): Promise<{ publicKey: string, privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedPublicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: arrayBufferToBase64(exportedPublicKey),
    privateKey: arrayBufferToBase64(exportedPrivateKey),
  };
}

// 2. Encrypt Feedback (Hybrid Encryption: AES-256-GCM + RSA-OAEP)
export async function encryptFeedback(
  answers: Record<string, any>, 
  issuerPublicKeyBase64: string
): Promise<{ ciphertext: string, iv: string, encryptedAesKey: string }> {
  
  // A. Import Issuer's Public RSA Key
  const publicKeyBuffer = base64ToArrayBuffer(issuerPublicKeyBase64);
  const rsaPublicKey = await crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  // B. Generate a random AES-256 key for this specific submission
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // C. Encrypt the feedback payload with the AES key
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedAnswers = new TextEncoder().encode(JSON.stringify(answers));
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encodedAnswers
  );

  // D. Encrypt the AES key with the Issuer's RSA Public Key
  const exportedAesKey = await crypto.subtle.exportKey("raw", aesKey);
  const encryptedAesKeyBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    rsaPublicKey,
    exportedAesKey
  );

  // E. Return all components as Base64
  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv.buffer),
    encryptedAesKey: arrayBufferToBase64(encryptedAesKeyBuffer)
  };
}

// 3. Decrypt Feedback
export async function decryptFeedback(
  ciphertextStr: string, 
  ivStr: string, 
  encryptedAesKeyStr: string, 
  issuerPrivateKeyBase64: string
): Promise<Record<string, any> | null> {
  try {
    // A. Import Issuer's Private RSA Key
    const privateKeyBuffer = base64ToArrayBuffer(issuerPrivateKeyBase64);
    const rsaPrivateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );

    // B. Decrypt the AES Key
    const encryptedAesKeyBuffer = base64ToArrayBuffer(encryptedAesKeyStr);
    const rawAesKey = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      rsaPrivateKey,
      encryptedAesKeyBuffer
    );

    // C. Import the decrypted AES Key
    const aesKey = await crypto.subtle.importKey(
      "raw",
      rawAesKey,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // D. Decrypt the actual payload
    const ciphertextBuffer = base64ToArrayBuffer(ciphertextStr);
    const ivBuffer = base64ToArrayBuffer(ivStr);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
      aesKey,
      ciphertextBuffer
    );
    
    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Hybrid Decryption failed", e);
    return null;
  }
}

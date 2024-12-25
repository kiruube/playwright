import CryptoJS from 'crypto-js';

export function encrypt(text: string): string {
  if (!text) {
    throw new Error('Text to encrypt cannot be empty');
  }
  
  const SALT = process.env.SALT;
  if (!SALT) {
    throw new Error('SALT environment variable is not defined');
  }

  // Simple encryption
  return CryptoJS.AES.encrypt(text, SALT).toString();
}

export function decrypt(cipherText: string): string {
  if (!cipherText) {
    throw new Error('Ciphertext is empty');
  }

  const SALT = process.env.SALT;
  if (!SALT) {
    throw new Error('SALT environment variable is not defined');
  }

  try {
    // Simple decryption
    const bytes = CryptoJS.AES.decrypt(cipherText, SALT);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption produced an empty result');
    }

    return decrypted;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
    throw new Error('Decryption failed with unknown error');
  }
}

export function verifyEnvironment(): boolean {
  const issues: string[] = [];

  if (!process.env.username) issues.push('Username environment variable is not set');
  if (!process.env.password) issues.push('Password environment variable is not set');
  if (!process.env.SALT) issues.push('SALT environment variable is not set');

  if (issues.length > 0) {
    throw new Error('Environment verification failed:\n- ' + issues.join('\n- '));
  }

  try {
    // Only decrypt if both values exist
    if (process.env.username && process.env.password) {
      const username = decrypt(process.env.username);
      const password = decrypt(process.env.password);

      if (!username || !password) {
        throw new Error('Decrypted credentials are invalid or empty');
      }
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Environment verification failed during decryption: ${error.message}`);
    }
    throw new Error('Environment verification failed with an unknown error');
  }
}

export function generateTestCredentials(username: string, password: string): void {
  const encryptedUsername = encrypt(username);
  const encryptedPassword = encrypt(password);
  
  console.log('Test Credentials:');
  console.log(`username=${encryptedUsername}`);
  console.log(`password=${encryptedPassword}`);
}
import * as CryptoJS from 'crypto-js';

// CryptoJS Ciphers
// · AES (the default)
// · DES
// · TripleDES
// · Rabbit
// · RC4

// CryptoJS supports the following modes:
// · CBC (the default)
// · CFB
// · CTR
// · OFB
// · ECB

// CryptoJS supports the following padding schemes:
// · Pkcs7 (the default)
// · Iso97971
// · AnsiX923
// · Iso10126
// · ZeroPadding
// · NoPadding

export type EncryptionMethod = 'AES' | 'DES' | 'TripleDES' | 'Rabbit' | 'RC4';
export type EncryptionMode = 'CBC' | 'CFB' | 'CTR' | 'OFB' | 'ECB';
export type EncryptionPadding =
  | 'Pkcs7'
  | 'Iso97971'
  | 'AnsiX923'
  | 'Iso10126'
  | 'ZeroPadding'
  | 'NoPadding';

export interface EncryptionOptions {
  /**
   * @description has to be a string with length of multiple of 4
   * @link https://juejin.cn/post/6844904198677463053
   */
  key: string;
  iv: string;
  method?: EncryptionMethod;
  mode?: EncryptionMode;
  padding?: EncryptionPadding;
}

export class Encryption {
  private key: CryptoJS.lib.WordArray;
  private iv: CryptoJS.lib.WordArray;
  private method: any;
  private mode: EncryptionMode;
  private padding: EncryptionPadding;

  constructor(opt: EncryptionOptions = { key: '', iv: '' }) {
    const { key, iv, method = 'AES', mode = 'CBC', padding = 'Pkcs7' } = opt!;

    if (key && iv) {
      if (key.length % 4 !== 0) {
        throw new Error('key length must be multiple of 4');
      }

      this.key = CryptoJS.enc.Utf8.parse(key);
      this.iv = CryptoJS.enc.Utf8.parse(iv);
    }

    this.method = CryptoJS[method];
    this.mode = mode;
    this.padding = padding;

    this.encrypt = this.encrypt;
    this.decrypt = this.decrypt;
  }

  encrypt(value: any, key?: string, iv?: string) {
    if (!value) return;

    if (!(this.key || key)) {
      throw new Error('Please provide a key');
    }

    if (!(this.iv || iv)) {
      throw new Error('Please provide a iv');
    }

    const encrypted = this.method.encrypt(
      JSON.stringify(value),
      this.key ?? CryptoJS.enc.Utf8.parse(key),
      {
        iv: this.iv ?? CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode[this.mode],
        padding: CryptoJS.pad[this.padding],
      },
    );
    return encrypted.toString();
  }

  decrypt(encrypted: any, key?: string, iv?: string) {
    if (!encrypted) return;

    if (!(this.key || key)) {
      throw new Error('Please provide a key');
    }

    if (!(this.iv || iv)) {
      throw new Error('Please provide a iv');
    }

    try {
      const decrypted = this.method.decrypt(
        encrypted,
        this.key ?? CryptoJS.enc.Utf8.parse(key),
        {
          iv: this.iv ?? CryptoJS.enc.Utf8.parse(iv),
          mode: CryptoJS.mode[this.mode],
          padding: CryptoJS.pad[this.padding],
        },
      );

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      return null;
    }
  }
}

export const ResponseEncryption = new Encryption();
export const RequestEncryption = new Encryption();

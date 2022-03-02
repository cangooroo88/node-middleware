import {randomBytes} from 'crypto';

/**
 * Generate token of n characters containing only letters.
 *
 * @param length length of token
 */
export const tokenFullAplhabetGenerate = (length: number = 6): string => {
    let rb = randomBytes(length);
    let outStr = '';
    rb.forEach((byte) => {
        outStr += (byte % 36).toString(36);
    });
    return outStr.substr(0, length);
}

/**
 * Generate token of n characters containing numbers only.
 *
 * @param length length of token
 */
export const tokenNumericGenerate = (length: number = 6): string => {
    let rb = randomBytes(length);
    let outStr = '';
    rb.forEach((byte) => {
        outStr += (byte % 10).toString(10);
    });
    return outStr.substr(0, length);
}
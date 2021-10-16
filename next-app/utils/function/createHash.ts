// @ts-nocheck
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const createHash = (message: string, key:string) => {
    const hashDigest = sha256(message)
    const hmacDigest = Base64.stringify(hmacSHA512(hashDigest, key))
    console.log(hmacDigest)
    return hmacDigest
}

const createAccessToken = (roomId:string, nickname:string) => {
    const message = `${process.env.ACCESS_TOKEN_SEED_MESSAGE}room${roomId}${nickname}:`
    const key = process.env.ACCESS_TOKEN_SEED_KEY
    const token = createHash(message, key)
    return token
}

export default createAccessToken
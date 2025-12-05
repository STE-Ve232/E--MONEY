const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

function generateSecret(username) {
  const secret = speakeasy.generateSecret({ name: `E-Money (${username})` });
  return secret; // {ascii, hex, base32, otpauth_url}
}

function generateQRCodeDataURL(otpauth_url) {
  return qrcode.toDataURL(otpauth_url);
}

function verifyToken(secretBase32, token) {
  return speakeasy.totp.verify({
    secret: secretBase32,
    encoding: "base32",
    token,
    window: 1,
  });
}

module.exports = { generateSecret, generateQRCodeDataURL, verifyToken };

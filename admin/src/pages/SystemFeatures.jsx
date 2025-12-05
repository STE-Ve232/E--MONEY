import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiCheckCircle } from 'react-icons/fi';

const featuresData = [
  { title: 'Biometric Login', description: 'Face ID / Touch ID / Windows Hello', benefit: 'Post-Password', status: 'LIVE' },
  { title: 'WebAuthn Passkeys', description: 'Phishing-proof authentication', benefit: 'Military-grade Security', status: 'LIVE' },
  { title: 'Wallet Connect v5 + Wagmi', description: 'Ethereum-native login', benefit: 'Unphishable', status: 'LIVE' },
  { title: 'Invisible CAPTCHA', description: 'hCaptcha + reCAPTCHA v3', benefit: 'Bot-Proof', status: 'LIVE' },
  { title: 'Rate Limiting (7 Layers)', description: 'Global + Per-User + Adaptive', benefit: 'DDoS-Proof', status: 'LIVE' },
  { title: 'Account Lockout', description: 'Exponential backoff', benefit: 'Brute-force proof', status: 'LIVE' },
  { title: 'JWT + Refresh Tokens', description: 'Short-lived access tokens', benefit: 'Session hijack proof', status: 'LIVE' },
  { title: '2FA (TOTP + Backup Codes)', description: 'Google Authenticator', benefit: 'Account takeover proof', status: 'LIVE' },
  { title: 'Email + Phone Verification', description: 'SMS + Email OTP', benefit: 'Fake accounts blocked', status: 'LIVE' },
  { title: 'KYC Verification', description: 'Onfido + Jumio', benefit: 'Identity fraud blocked', status: 'LIVE' },
  { title: 'Tax Compliance Engine', description: 'Auto 1099, WHT, TDS', benefit: 'Legal compliance', status: 'LIVE' },
  { title: 'ML Fraud Brain v5', description: 'TensorFlow + Real-time', benefit: '99.998% fraud detection', status: 'LIVE' },
  { title: 'Graph Sybil Detection', description: 'Neo4j + Clustering', benefit: 'Fake account rings', status: 'LIVE' },
  { title: 'On-Chain Fraud Ban', description: 'Permanent ban on Ethereum', benefit: 'Immutable justice', status: 'LIVE' },
  { title: 'Ethereum Mainnet Tokens', description: 'ERC-20 HOUR token', benefit: 'Cannot be seized', status: 'LIVE' },
  { title: 'Oracle + Multi-Sig', description: 'Token minting control', benefit: 'No single point of failure', status: 'LIVE' },
  { title: 'Offline-First PWA', description: 'Works without internet', benefit: 'Survives network failure', status: 'LIVE' },
  { title: 'Encrypted Local Storage', description: 'IndexedDB + Crypto', benefit: 'Data safe offline', status: 'LIVE' },
  { title: 'Session Management', description: 'List + Revoke sessions', benefit: 'Account takeover protection', status: 'LIVE' },
  { title: 'Dark Mode + Humane UX', description: 'No dark patterns', benefit: 'Ethical design', status: 'LIVE' },
];

export default function SystemFeatures() {
  return (
    <div className="p-8 text-white">
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-8"
      >
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiShield className="text-cyan-400" />
          System Features & Security
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresData.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col"
          >
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-cyan-300 pr-4">{feature.title}</h2>
                <span className="flex-shrink-0 text-xs font-bold bg-green-500/20 text-green-400 py-1 px-2 rounded-full">
                  {feature.status}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-2">{feature.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm">
              <FiCheckCircle className="text-green-400" />
              <span className="text-gray-400">{feature.benefit}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
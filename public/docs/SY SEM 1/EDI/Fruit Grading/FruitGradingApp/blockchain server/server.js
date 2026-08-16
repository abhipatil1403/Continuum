// server.js (CommonJS)
const express = require('express');
const { ethers } = require('ethers');
const AppleGradingRegistryABI = require('./AppleGradingRegistryABI.json');

const app = express();
app.use(express.json());

const RPC_URL = 'https://sepolia.infura.io/v3/76317534298e478c94df9a5cd79ddd67'; // or Alchemy etc.
const PRIVATE_KEY = 'd45308a6496ca8a9db648da5fa23dcbabe4ce41851bce1c944103b4967c397a8';
const CONTRACT_ADDRESS = '0xA0cc82DD5a1EA28d4b3bA5471E24c83dA4457794';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, AppleGradingRegistryABI, wallet);

app.post('/blockchain/farmer-registration', async (req, res) => {
  try {
    const {
      name,
      aadhaarNumber,
      farmLocation,
      warehouseLocation,
      address,
    } = req.body;

    // Hash Aadhaar before sending on-chain
    const aadhaarHash = ethers.keccak256(ethers.toUtf8Bytes(aadhaarNumber));

    // You can choose a farmerId format; here we use the name as ID for demo
    const farmerId = name;

    const tx = await contract.addRecord(
      farmerId,
      aadhaarHash,
      farmLocation,
      warehouseLocation, // using as locationShortId placeholder
      'N/A' // initial grade placeholder; real grading happens on /blockchain/grading
    );

    await tx.wait();
    console.log('Farmer registration tx:', tx.hash);
    return res.json({ ok: true, txHash: tx.hash });
  } catch (e) {
    console.error('Blockchain error:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Store apple grading result on-chain
app.post('/blockchain/grading', async (req, res) => {
  try {
    const {
      farmerShortId,
      aadhaarNumber,
      farmLocation,
      grade,
    } = req.body;

    if (!aadhaarNumber || !farmLocation || !grade || !farmerShortId) {
      return res.status(400).json({ ok: false, error: 'Missing required grading fields' });
    }

    // Hash Aadhaar before sending on-chain
    const aadhaarHash = ethers.keccak256(ethers.toUtf8Bytes(aadhaarNumber));

    // Use short_id as farmerId to keep it compact
    const farmerId = farmerShortId;
    const locationShortId = farmerShortId; // reuse shortId as a short location/batch identifier

    const tx = await contract.addRecord(
      farmerId,
      aadhaarHash,
      farmLocation,
      locationShortId,
      grade
    );

    await tx.wait();
    console.log('Grading tx:', tx.hash);
    return res.json({ ok: true, txHash: tx.hash });
  } catch (e) {
    console.error('Blockchain grading error:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(3000, () => {
  console.log('Blockchain relay listening on port 3000');
});
import React, { useState } from 'react';
import { ethers } from 'ethers';
import WalletManager from '../Components/WalletManager';
import { useUser } from '../context/UserContext';

function Donor({ account }) {
	const [ensName, setEnsName] = useState('');
	const [resolvedAddress, setResolvedAddress] = useState('');
	const [donationAmount, setDonationAmount] = useState('');
	const [donationBalance, setDonationBalance] = useState('');
	const [lastDonation, setLastDonation] = useState(null);

	const { currentUser, userProfile, connectWallet, isLoading } = useUser();
	console.log(currentUser);

	const contractAddress = '0xe9350d0023B3E94D892d4a0c15c6Ae0A5D5132d8';
	const contractABI = ['function donate() public payable', 'function getDonation(address donor) view returns (uint256)'];

	async function resolveENS() {
		if (!ensName) {
			alert('Please enter an ENS name.');
			return;
		}
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x1' }],
			});

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const address = await provider.resolveName(ensName);
			if (!address) {
				alert('❌ ENS not found.');
				setResolvedAddress('');
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0xa4b1' }],
				});
				return;
			}
			setResolvedAddress(address);
			alert(`✅ ENS resolved: ${address}`);

			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0xa4b1' }],
			});
		} catch (error) {
			console.error('ENS resolve error:', error);
			alert(`❌ ${error.message || 'Operation failed.'}`);
		}
	}

	async function donate() {
		if (!donationAmount) {
			alert('Please enter an amount.');
			return;
		}
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, contractABI, signer);
		const tx = await contract.donate({
			value: ethers.utils.parseEther(donationAmount),
		});
		await tx.wait();
		const now = new Date();
		setLastDonation({
			amount: donationAmount,
			donor: account,
			date: now.toLocaleString(),
		});
		alert(`✅ Donation of ${donationAmount} ETH successful!`);
	}

	async function fetchEthPriceInUSD() {
		const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
		const data = await response.json();
		return data.ethereum.usd;
	}

	async function getBalance() {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const contract = new ethers.Contract(contractAddress, contractABI, provider);
		const balance = await contract.getDonation(account);
		const ethAmount = ethers.utils.formatEther(balance);
		const ethPrice = await fetchEthPriceInUSD();
		const usdAmount = (parseFloat(ethAmount) * ethPrice).toFixed(2);
		setDonationBalance(`${ethAmount} ETH ($${usdAmount})`);
	}

	if (!currentUser) {
		return (
			<div className="flex flex-col items-center gap-4 justify-center mt-10">
				You must connect your wallet to access donor features.
				<button className="btn btn-accent" onClick={() => connectWallet()}>
					Connect Wallet
				</button>
			</div>
		);
	}

	return (
		<div style={{ marginTop: '28px', width: '100%', maxWidth: '800px' }} className="mx-auto">
			{/* ✅ Verify Donation Profile Button */}
			<div style={{ textAlign: 'center', marginBottom: '20px' }}>
				<button
					onClick={() => window.open('/profile', '_blank')}
					style={{
						display: 'inline-block',
						padding: '12px 24px',
						background: 'linear-gradient(90deg, #4CAF50, #81C784)',
						color: '#fff',
						fontWeight: 'bold',
						fontSize: '16px',
						border: 'none',
						borderRadius: '6px',
						cursor: 'pointer',
						boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
						transition: 'transform 0.2s, box-shadow 0.2s',
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = 'scale(1.05)';
						e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = 'scale(1)';
						e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
					}}>
					🔍 Verify Donation Profile
				</button>
			</div>

			{/* ENS Resolve */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '10px',
					marginBottom: '10px',
					justifyContent: 'center',
				}}>
				<input
					type="text"
					placeholder="Search ENS name (e.g., vitalik.eth)"
					value={ensName}
					onChange={(e) => setEnsName(e.target.value)}
					style={{
						padding: '10px',
						flex: '1',
						minWidth: '220px',
						borderRadius: '4px',
						border: '1px solid #555',
						background: '#0F1924',
						color: '#ffffff',
					}}
				/>
				<button
					onClick={resolveENS}
					style={{
						padding: '10px 16px',
						backgroundColor: '#2196F3',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						flexShrink: 0,
					}}>
					Resolve ENS
				</button>
			</div>
			{resolvedAddress && (
				<p style={{ wordBreak: 'break-all' }}>
					<strong>Resolved Address:</strong> {resolvedAddress}
				</p>
			)}

			{/* Donation Input */}
			<textarea className="textarea textarea-primary w-full" placeholder="Enter donation data" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)}></textarea>

			{/* Check Donation */}
			<div style={{ textAlign: 'center', marginTop: '10px' }}>
				<button
					onClick={getBalance}
					style={{
						padding: '10px 16px',
						backgroundColor: '#9C27B0',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						width: '100%',
						maxWidth: '250px',
					}}>
					Check My Donation
				</button>
				{donationBalance && (
					<p style={{ marginTop: '10px' }}>
						🎉 <strong>Your Total Donation:</strong> {donationBalance}
					</p>
				)}
			</div>
		</div>
	);
}

export default Donor;

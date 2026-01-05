// src/context/UserContext.jsx
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { ethers } from 'ethers';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null); // Wallet Address
	const [userProfile, setUserProfile] = useState(null); // Firebase Data (Name, Email, etc.)
	const [isLoading, setIsLoading] = useState(true);
	const [walletSigner, setWalletSigner] = useState(null);

	// Helper: Fetch or Create User Profile in Firestore
	const fetchUserProfile = async (address) => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUserProfile(currentUser);
			if (currentUser) {
				console.log('Your User ID is:', currentUser.uid); // You need this for the ESP32 code!
			}
		});
		return () => unsubscribe();
	};

	// 1. Check Wallet on Load
	useEffect(() => {
		const checkWallet = async () => {
			if (window.ethereum) {
				try {
					const accounts = await window.ethereum.request({ method: 'eth_accounts' });
					if (accounts.length > 0) {
						setCurrentUser(accounts[0]);

						// const provider = new ethers.BrowserProvider(window.ethereum);
						const provider = new ethers.providers.Web3Provider(window.ethereum);
						console.log(accounts);
						// const signer = await provider.getSigner();
						const signer = provider.getSigner();
						setWalletSigner(signer);
					}
				} catch (error) {
					console.error('Error checking wallet:', error);
				}
			}
			setIsLoading(false);
		};
		checkWallet();

		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUserProfile(currentUser);
			if (currentUser) {
				console.log('Your User ID is:', currentUser.uid); // You need this for the ESP32 code!
			}
		});
		return () => {
			unsubscribe();
			if (window.ethereum && window.ethereum.removeListener) {
				window.ethereum.removeListener('accountsChanged', () => {});
			}
		};
	}, []);

	// 2. Connect Wallet Function
	const connectWallet = async () => {
		if (!window.ethereum) return alert('Please install MetaMask!');

		setIsLoading(true);
		try {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			const address = accounts[0];

			setCurrentUser(address);
			await fetchUserProfile(address); // <--- Fetch Firebase Data
		} catch (error) {
			console.error('Connection rejected:', error);
		}
		setIsLoading(false);
	};

	// 3. Disconnect Function
	const disconnectWallet = () => {
		setCurrentUser(null);
		setUserProfile(null); // Clear Firebase data
	};

	return <UserContext.Provider value={{ currentUser, userProfile, walletSigner, isLoading, connectWallet, disconnectWallet }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

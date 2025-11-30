import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';

function WalletManager() {
	const { currentUser, userProfile, isLoading, connectWallet, disconnectWallet } = useUser();
	console.log(currentUser);

	useEffect(() => {
		connectWallet();
	}, []);

	return (
		<div style={{ marginTop: '20px' }}>
			{!currentUser ? (
				<button
					onClick={connectWallet}
					style={{
						padding: '10px 20px',
						backgroundColor: '#4CAF50',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						fontSize: '1rem',
					}}>
					Connect Wallet
				</button>
			) : (
				<>
					<p>
						<strong>Connected:</strong> {currentUser}
					</p>
					<button
						onClick={disconnectWallet}
						style={{
							padding: '8px 12px',
							backgroundColor: '#f44336',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginTop: '5px',
						}}>
						Disconnect
					</button>
				</>
			)}
		</div>
	);
}

export default WalletManager;

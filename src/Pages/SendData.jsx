import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../utils/SensorContract.json';
import { useUser } from '../context/UserContext';

// ====== CONFIGURATION ======
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';
const PINATA_JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMjRjMjc1ZC1kY2YwLTQ1MGUtOTZjZS1hOGI2YWIyOGY2YmYiLCJlbWFpbCI6Im1kemFoaWRoYXNhbnBhdHdhcnlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjA1ZjJkNDJlZjVmY2NjM2EwOTczIiwic2NvcGVkS2V5U2VjcmV0IjoiOTk5YzlmNWE0MTQyNzJlMmQ0NDA4YjQ5ZDQwMDk3OTA2Zjc1Mzc5NDE4ODJiMGVmNGNlYTZmYjk4MTkwMDBhOSIsImV4cCI6MTc5NjU3MDYxMH0.UdVTeFdue9qDvfy9yvKTaSUTtNFDY_Hcjl4JhqDZJk8';

function SendData() {
	// --- STATE ---
	const [espIp, setEspIp] = useState('192.168.0.241');
	const [temp, setTemp] = useState('');
	const [hum, setHum] = useState('');

	const { currentUser, walletSigner } = useUser(); // Removed unused variables for cleaner code
	console.log(walletSigner);

	// UI State
	const [status, setStatus] = useState('');
	const [statusType, setStatusType] = useState('info');
	const [isLoading, setIsLoading] = useState(false);
	const [ipfsCid, setIpfsCid] = useState('');
	const [txHash, setTxHash] = useState('');

	// Recent Pins State
	const [recentPins, setRecentPins] = useState([]);

	useEffect(() => {
		document.title = 'Sensor Dashboard';
		fetchRecentPins(); // Load pins on page load
	}, []);

	// --- HELPERS ---
	const showStatus = (msg, type = 'info') => {
		setStatus(msg);
		setStatusType(type);
		setTimeout(() => setStatus(''), 5000);
	};

	// --- API: FETCH RECENT PINS FROM PINATA ---
	const fetchRecentPins = async () => {
		try {
			// Fetch last 5 pinned items
			const res = await fetch('https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=5', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${PINATA_JWT}`,
				},
			});
			const data = await res.json();
			if (data.rows) {
				setRecentPins(data.rows);
			}
		} catch (error) {
			console.error('Error fetching pins:', error);
		}
	};

	// --- 2. FETCH FROM ESP32 ---
	const fetchFromESP32 = async () => {
		if (!espIp) return showStatus('Enter IP Address', 'warning');

		setIsLoading(true);
		try {
			const cleanIp = espIp.replace('http://', '').replace('/', '');
			const response = await fetch(`http://${cleanIp}/sensors`);

			if (!response.ok) throw new Error('Device Unreachable');

			const data = await response.json();
			setTemp(data.temp);
			setHum(data.hum);
			showStatus('Data fetched from Sensor', 'success');
		} catch (err) {
			console.error(err);
			showStatus('Error connecting to ESP32. Check CORS.', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	// --- 3. UPLOAD TO PINATA (IPFS) ---
	const uploadToPinata = async () => {
		if (!temp || !hum) return showStatus('No data to upload', 'warning');

		setIsLoading(true);
		showStatus('Uploading to IPFS...', 'info');

		try {
			const body = {
				pinataOptions: { cidVersion: 1 },
				pinataMetadata: { name: `Sensor_${Date.now()}` },
				pinataContent: {
					timestamp: Date.now(),
					temperature: temp,
					humidity: hum,
					uploadedBy: currentUser,
				},
			};

			const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${PINATA_JWT}`,
				},
				body: JSON.stringify(body),
			});

			const resData = await res.json();
			if (resData.IpfsHash) {
				setIpfsCid(resData.IpfsHash);
				showStatus('Pinned to IPFS! CID: ' + resData.IpfsHash, 'success');
				// Refresh the list immediately after upload
				fetchRecentPins();
			} else {
				throw new Error('Pinata upload failed');
			}
		} catch (err) {
			console.error(err);
			showStatus('IPFS Upload Failed', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	// --- 4. SEND TO BLOCKCHAIN ---
	// const sendToBlockchain = async () => {
	// 	if (!walletSigner) return showStatus('Connect Wallet First', 'warning');

	// 	setIsLoading(true);
	// 	showStatus('Please sign transaction in MetaMask...', 'info');

	// 	try {
	// 		const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, walletSigner);
	// 		const tempInt = Math.round(parseFloat(temp) * 100);
	// 		const humInt = Math.round(parseFloat(hum) * 100);

	// 		const tx = await contract.storeData(tempInt, humInt);
	// 		showStatus('Tx Sent! Waiting for block...', 'info');

	// 		await tx.wait();
	// 		showStatus('Confirmed on Blockchain! ✅', 'success');
	// 	} catch (error) {
	// 		console.error(error);
	// 		showStatus('Transaction Failed: ' + error.message, 'error');
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };
	// --- 4. SEND JSON TO TESTNET (NO SMART CONTRACT) ---
	console.log(currentUser);
	const sendToBlockchain = async () => {
		// 1. Basic Checks
		if (!walletSigner) return showStatus('Connect Wallet First', 'warning');
		if (!temp || !hum) return showStatus('No sensor data to send', 'warning');

		setIsLoading(true);
		showStatus('Preparing transaction...', 'info');
		setTxHash('');

		try {
			// 2. Prepare the JSON Payload
			const payload = {
				temp: temp,
				hum: hum,
				timestamp: Date.now(),
				source: 'ESP32_React_App',
			};
			const jsonString = JSON.stringify(payload);

			// 3. Encode to Hex (Ethers v5 Syntax)
			// We convert the string to bytes, then bytes to hex
			const hexData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(jsonString));

			// 4. Send Transaction
			// We send it to 'currentUser' (yourself) so you don't lose assets, just pay gas.
			const tx = await walletSigner.sendTransaction({
				to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
				value: 0, // Sending 0 ETH
				data: hexData, // <--- Your JSON data goes here
			});

			setTxHash(tx.hash);
			showStatus('Tx Sent! Waiting for confirmation...', 'info');
			console.log('Transaction Hash:', tx.hash);

			// 5. Wait for Block Confirmation
			await tx.wait();

			showStatus('JSON Data stored on Testnet! ✅', 'success');
		} catch (error) {
			console.error('Blockchain Error:', error);
			// Handle "User rejected" specifically for better UX
			if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
				showStatus('Transaction rejected by user', 'error');
			} else {
				showStatus('Transaction Failed: ' + error.message, 'error');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-base-200 font-sans pb-10">
			{/* MAIN CONTENT */}
			<div className="container mx-auto p-4 flex flex-col lg:flex-row gap-5 justify-between items-start pt-6">
				{/* --- CONTROL CARD --- */}
				<div className="card w-full max-w-lg bg-base-100 shadow-xl mb-8">
					<div className="card-body">
						<h2 className="card-title justify-center text-2xl mb-4">Device Control</h2>

						{/* IP CONFIG */}
						<div className="form-control w-full">
							<label className="label mr-2">
								<span className="label-text font-bold">ESP32 IP Address:</span>
							</label>
							<div className="join">
								<input type="text" value={espIp} onChange={(e) => setEspIp(e.target.value)} className="input input-bordered join-item w-full" placeholder="192.168.1.50" />
								<button onClick={fetchFromESP32} disabled={isLoading} className="btn btn-secondary join-item">
									{isLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Fetch'}
								</button>
							</div>
						</div>

						<div className="divider">DATA</div>

						{/* SENSOR INPUTS */}
						<div className="flex gap-4">
							<div className="form-control w-1/2">
								<label className="label">
									<span className="label-text">Temp (°C)</span>
								</label>
								<input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} className="input input-bordered input-primary" />
							</div>
							<div className="form-control w-1/2">
								<label className="label">
									<span className="label-text">Humidity (%)</span>
								</label>
								<input type="number" value={hum} onChange={(e) => setHum(e.target.value)} className="input input-bordered input-primary" />
							</div>
						</div>

						{/* ACTIONS */}
						<div className="card-actions flex-col mt-6 gap-3">
							<button onClick={uploadToPinata} disabled={isLoading || !temp} className="btn btn-outline btn-accent w-full">
								Upload JSON to Pinata
							</button>

							{ipfsCid && (
								<div className="alert alert-xs alert-success shadow-lg">
									<span className="text-xs truncate">CID: {ipfsCid}</span>
									<a href={`https://ipfs.io/ipfs/${ipfsCid}`} target="_blank" className="link link-hover text-xs font-bold">
										View
									</a>
								</div>
							)}

							{/* Disabled if no wallet signer */}
							<button onClick={sendToBlockchain} disabled={isLoading || !walletSigner} className="btn btn-primary w-full">
								Write to Blockchain
							</button>
							{txHash && (
								<div className="alert alert-info shadow-sm mt-2 p-2 text-xs">
									<div>
										<span className="font-bold">Tx Hash:</span>
										<br />
										<span className="break-all">{txHash}</span>
									</div>
									<a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="btn btn-xs btn-ghost border-white text-white mt-1 whitespace-nowrap">
										View on Etherscan
									</a>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* --- RECENT PINS TABLE (NEW) --- */}
				<div className="w-full max-w-2xl">
					<h3 className="text-xl font-bold mb-3 pl-2 text-base-content/70">Recent Uploads</h3>
					<div className="overflow-x-auto bg-base-100 rounded-box shadow-lg">
						<table className="table table-zebra w-full">
							{/* Head */}
							<thead>
								<tr>
									<th>Date</th>
									<th>Name</th>
									<th className="text-right">Link</th>
								</tr>
							</thead>
							<tbody>
								{recentPins.length === 0 ? (
									<tr>
										<td colSpan="3" className="text-center text-gray-500 py-4">
											No recent uploads found
										</td>
									</tr>
								) : (
									recentPins.map((pin) => (
										<tr key={pin.id}>
											<td className="text-xs">{new Date(pin.date_pinned).toLocaleString()}</td>
											<td className="font-semibold text-sm">{pin.metadata.name || 'Untitled'}</td>
											<td className="text-right">
												<a href={`https://ipfs.io/ipfs/${pin.ipfs_pin_hash}`} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-outline btn-info">
													View
												</a>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* TOAST NOTIFICATION */}
				{status && (
					<div className="toast toast-end z-50">
						<div className={`alert alert-${statusType}`}>
							<span>{status}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default SendData;

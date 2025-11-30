// src/components/RoleSelector.js
import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelector({ setRole }) {
	return (
		<div
			style={{
				background: '#0F1924',
				padding: '3rem 1rem',
				borderRadius: '8px',
				width: '100%',
				maxWidth: '600px',
				color: '#fff',
				textAlign: 'center',
				boxShadow: '0 0 10px rgba(0,0,0,0.3)',
			}}>
			<p style={{ marginBottom: '2rem', color: '#aaa' }}>How would you like to participate?</p>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '1rem',
					flexWrap: 'wrap',
				}}>
				<Link to="/donor">
					<button
						onClick={() => setRole('donor')}
						style={{
							padding: '0.8rem 1.5rem',
							background: '#1976d2',
							border: 'none',
							borderRadius: '4px',
							color: '#fff',
							fontWeight: 'bold',
							cursor: 'pointer',
							transition: '0.3s',
						}}
						onMouseEnter={(e) => (e.target.style.background = '#1565c0')}
						onMouseLeave={(e) => (e.target.style.background = '#1976d2')}>
						I Want to Donate (Donor)
					</button>
				</Link>

				<button
					onClick={() => setRole('needy')}
					style={{
						padding: '0.8rem 1.5rem',
						background: '#2e7d32',
						border: 'none',
						borderRadius: '4px',
						color: '#fff',
						fontWeight: 'bold',
						cursor: 'pointer',
						transition: '0.3s',
					}}
					onMouseEnter={(e) => (e.target.style.background = '#1b5e20')}
					onMouseLeave={(e) => (e.target.style.background = '#2e7d32')}>
					I Need Support (Needy)
				</button>

				<button
					onClick={() => setRole('organization')}
					style={{
						padding: '0.8rem 1.5rem',
						background: '#6a1b9a',
						border: 'none',
						borderRadius: '4px',
						color: '#fff',
						fontWeight: 'bold',
						cursor: 'pointer',
						transition: '0.3s',
					}}
					onMouseEnter={(e) => (e.target.style.background = '#4a148c')}
					onMouseLeave={(e) => (e.target.style.background = '#6a1b9a')}>
					I'm an Organization
				</button>
			</div>
		</div>
	);
}

export default RoleSelector;

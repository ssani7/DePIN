import React, { useState } from 'react';
import RoleSelector from '../Components/Home/RoleSelector';

const Home = () => {
	const [role, setRole] = useState('');

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				background: 'linear-gradient(270deg, rgb(1, 24, 16), rgb(4, 21, 16))',
				backgroundSize: '400% 400%',
				animation: 'gradientBG 15s ease infinite',
				fontFamily: 'Arial, sans-serif',
				color: 'white',
				textAlign: 'center',
				padding: '1rem',
			}}>
			<h1
				style={{
					fontSize: '1.8rem',
					marginBottom: '1rem',
					lineHeight: '1.4',
					maxWidth: '90%',
					color: 'white',
					textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
				}}>
				Welcome to DePIN World <br />
				Via Blockchain Show the Real World
			</h1>

			<>
				{!role && <RoleSelector setRole={setRole} />}

				{role && (
					<div
						style={{
							width: '100%',
							maxWidth: '600px',
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
						}}>
						<WalletManager account={account} setAccount={setAccount} />

						{account && (
							<>
								{role === 'donor' && (
									<>
										<DonationSection account={account} />
										{/* Verify Donation Profile button removed */}
									</>
								)}
								{role === 'needy' && <KYCSection />}
								{role === 'organization' && (
									<>
										<WalletInfo account={account} />
										<OrganizationDashboard />
									</>
								)}
							</>
						)}
					</div>
				)}
			</>

			<style>{`
          @keyframes gradientBG {
            0% {background-position:0% 50%;}
            50% {background-position:100% 50%;}
            100% {background-position:0% 50%;}
          }
        `}</style>
		</div>
	);
};

export default Home;

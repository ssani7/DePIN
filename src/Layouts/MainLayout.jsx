// src/layouts/MainLayout.tsx
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../Components/UI/Navbar';

const MainLayout = () => {
	return (
		<div className="relative min-h-screen">
			<Navbar />

			{/* 2. The Dynamic Content */}
			<main className="min-h-[75vh]">
				{/* The Outlet renders the current route's element (Home, Dashboard, etc.) */}
				<Outlet />
			</main>

			{/* 3. Persistent Footer */}
			<footer style={{ padding: '1rem', textAlign: 'center' }} className="bg-base-200 mt-auto w-full">
				© 2025 DePIN App
			</footer>
		</div>
	);
};

export default MainLayout;

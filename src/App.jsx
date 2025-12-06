import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Donor from './Pages/Donor';
import MainLayout from './Layouts/MainLayout';
import Dashboard from './Pages/Dashboard';
import SendData from './Pages/SendData';

function App() {
	return (
		<div>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/donor" element={<Donor />} />
					<Route path="/send-data" element={<SendData />} />
					<Route path="/dashboard" element={<Dashboard />} />
					{/* <Route path="/dashboard" element={<Dashboard />} /> */}
				</Route>

				{/* 404 Fallback */}
				<Route path="*" element={<h2>404 - Page Not Found</h2>} />
			</Routes>
		</div>
	);
}

export default App;

import React from 'react';
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

// --- DATA CONSTANTS (Same as before) ---
const monthlyData = [
	{ month: 'July', aqi: 120, co2: 400, waterPH: 6.8 },
	{ month: 'Aug', aqi: 135, co2: 410, waterPH: 6.9 },
	{ month: 'Sept', aqi: 90, co2: 380, waterPH: 7.2 },
	{ month: 'Oct', aqi: 150, co2: 450, waterPH: 6.5 },
	{ month: 'Nov', aqi: 110, co2: 405, waterPH: 7.0 },
];

const wasteData = [
	{ month: 'July', recycled: 40, compost: 24, landfill: 24 },
	{ month: 'Aug', recycled: 30, compost: 13, landfill: 50 },
	{ month: 'Sept', recycled: 50, compost: 30, landfill: 20 },
	{ month: 'Oct', recycled: 45, compost: 25, landfill: 30 },
	{ month: 'Nov', recycled: 60, compost: 30, landfill: 10 },
];

const pollutionSourceData = [
	{ name: 'Industrial', value: 450 },
	{ name: 'Vehicle', value: 300 },
	{ name: 'Construction', value: 200 },
	{ name: 'Domestic', value: 100 },
];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']; // Tailwind colors converted to Hex

const radarData = [
	{ subject: 'Air', A: 120, B: 90, fullMark: 150 },
	{ subject: 'Water', A: 98, B: 130, fullMark: 150 },
	{ subject: 'Green', A: 86, B: 130, fullMark: 150 },
	{ subject: 'Noise', A: 99, B: 100, fullMark: 150 },
	{ subject: 'Waste', A: 85, B: 90, fullMark: 150 },
	{ subject: 'Soil', A: 65, B: 85, fullMark: 150 },
];

const reportLog = [
	{ id: 101, date: '2023-11-28', location: 'Turag River', type: 'Water', status: 'Critical', source: 'Industrial' },
	{ id: 102, date: '2023-11-25', location: 'Sector 10', type: 'Air', status: 'Warning', source: 'Construction' },
	{ id: 103, date: '2023-11-20', location: 'Khagan', type: 'Noise', status: 'Safe', source: 'Vehicle' },
	{ id: 104, date: '2023-11-19', location: 'Madhumati River', type: 'Water', status: 'Safe', source: 'Industrial' },
];

const Dashboard = () => {
	// Helper for conditional Tailwind classes
	const getStatusBadge = (status) => {
		switch (status) {
			case 'Critical':
				return 'bg-red-100 text-red-800';
			case 'Warning':
				return 'bg-yellow-100 text-yellow-800';
			case 'Safe':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 ';
		}
	};

	return (
		<div className="min-h-screen bg-base-100 p-6 font-sans">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<header className="mb-8">
					<h1 className="text-3xl font-bold ">Environmental Analytics</h1>
				</header>

				{/* --- ROW 1: Summary Cards --- */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-base-200 rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
						<h3 className=" text-sm font-medium uppercase tracking-wider">Average AQI</h3>
						<div className="flex items-end gap-2 mt-2">
							<span className="text-4xl font-bold ">121</span>
							<span className="text-orange-500 text-sm font-semibold mb-1">Unhealthy</span>
						</div>
					</div>

					<div className="bg-base-200 rounded-xl shadow-sm p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
						<h3 className=" text-sm font-medium uppercase tracking-wider">Recycling Rate</h3>
						<div className="flex items-end gap-2 mt-2">
							<span className="text-4xl font-bold ">58%</span>
							<span className="text-green-600 text-sm font-semibold mb-1">↑ 12% vs last month</span>
						</div>
					</div>

					<div className="bg-base-200 rounded-xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
						<h3 className=" text-sm font-medium uppercase tracking-wider">Active Alerts</h3>
						<div className="flex items-end gap-2 mt-2">
							<span className="text-4xl font-bold ">3</span>
							<span className="text-red-500 text-sm font-semibold mb-1">Requires Action</span>
						</div>
					</div>
				</div>

				{/* --- ROW 2: Main Area Chart + Radar --- */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{/* Main Trend */}
					<div className="lg:col-span-2 bg-base-200 rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-bold  mb-4">Air Quality vs CO2</h3>
						<div className="h-80 w-full">
							<ResponsiveContainer>
								<AreaChart data={monthlyData}>
									<defs>
										<linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
											<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
									<XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
									<YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
									<Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
									<Area type="monotone" dataKey="aqi" stroke="#8884d8" fillOpacity={1} fill="url(#colorAqi)" />
									<Area type="monotone" dataKey="co2" stroke="#82ca9d" fillOpacity={0} fill="#82ca9d" />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Radar Comparison */}
					<div className="bg-base-200 rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-bold  mb-4">Zone Comparison</h3>
						<div className="h-80 w-full">
							<ResponsiveContainer>
								<RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
									<PolarGrid stroke="#E5E7EB" />
									<PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12 }} />
									<PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#9CA3AF" />
									<Radar name="Rural" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.5} />
									<Radar name="Urban" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
									<Legend />
									<Tooltip />
								</RadarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>

				{/* --- ROW 3: Stacked Bar + Pie --- */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{/* Stacked Bar */}
					<div className="lg:col-span-2 bg-base-200 rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-bold  mb-4">Waste Management</h3>
						<div className="h-72 w-full">
							<ResponsiveContainer>
								<BarChart data={wasteData}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
									<XAxis dataKey="month" axisLine={false} tickLine={false} />
									<YAxis axisLine={false} tickLine={false} />
									<Tooltip cursor={{ fill: '#1a1e24' }} contentStyle={{ borderRadius: '8px', background: '#1a1e24' }} />
									<Legend />
									<Bar dataKey="recycled" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
									<Bar dataKey="compost" stackId="a" fill="#F59E0B" />
									<Bar dataKey="landfill" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Donut Chart */}
					<div className="bg-base-200 rounded-xl shadow-sm p-6">
						<h3 className="text-lg font-bold  mb-4">Pollution Sources</h3>
						<div className="h-72 w-full">
							<ResponsiveContainer>
								<PieChart>
									<Pie data={pollutionSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
										{pollutionSourceData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#1a1e24" />
										))}
									</Pie>
									<Tooltip />
									<Legend verticalAlign="bottom" height={36} iconType="circle" />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>

				{/* --- ROW 4: Data Table --- */}
				<div className="bg-base-200 rounded-xl shadow-sm overflow-hidden">
					<div className="p-6 border-b border-gray-100 flex justify-between items-center">
						<h3 className="text-lg font-bold ">Recent Critical Reports</h3>
					</div>

					<div className="">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-gray-100 text-xs uppercase  font-semibold">
									<th className="p-4">Date</th>
									<th className="p-4">Location</th>
									<th className="p-4">Type</th>
									<th className="p-4">Source</th>
									<th className="p-4">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{reportLog.map((row) => (
									<tr key={row.id} className="hover:bg-gray-50 hover:text-gray-900 transition-colors">
										<td className="p-4 text-sm">{row.date}</td>
										<td className="p-4 font-medium">{row.location}</td>
										<td className="p-4 text-sm">{row.type}</td>
										<td className="p-4 text-sm">{row.source}</td>
										<td className="p-4">
											<span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(row.status)}`}>{row.status}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;

import { signInWithPopup } from 'firebase/auth';
import { useUser } from '../../context/UserContext';
import { auth, logout, provider } from '../../firebase';
import { Link } from 'react-router-dom';

const Navbar = () => {
	const { currentUser, userProfile, isLoading, disconnectWallet } = useUser();

	const loginGoogle = async () => {
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error('Google Login Error:', error);
		}
	};

	console.log(userProfile?.photoURL);

	return (
		<div className="navbar bg-base-100 shadow-sm">
			<div className="flex-1">
				<Link to="/" className="text-xl">
					DePIN
				</Link>
			</div>
			<div className="flex-none">
				<div className="dropdown dropdown-end">
					{userProfile ? (
						<>
							<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
								<div className="w-10 rounded-full">
									<img alt="Tailwind CSS Navbar component" src={userProfile?.photoURL} />
								</div>
							</div>
							<ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
								<li>
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li>
									<a onClick={logout}>Logout</a>
								</li>
							</ul>
						</>
					) : (
						<button className="btn btn-primary" onClick={loginGoogle}>
							Login
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;

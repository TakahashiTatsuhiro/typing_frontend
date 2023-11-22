import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
	const navigate = useNavigate();
	const { isAuthenticated, logout, userName } = useAuth();

	const handleTitle = () => {
		isAuthenticated ? navigate('/UserHome') : navigate('/login');
	};

	const handleLogout = async () => {
		try {
			// バックエンドのログアウトエンドポイントにリクエストを送信
			const response = await fetch('https://typing-backend-kj2p.onrender.com/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				logout();
				navigate('/login');
			}
		} catch (error) {
			console.error('ログアウトに失敗しました', error);
		}
	};

	const handleSignup = () => {
		navigate('/signup');
	};


	return (
		<div className='navbar'>
			<h2 className='navbar-header' onClick={handleTitle}>
				Let's Type
			</h2>
			{isAuthenticated ? (
				<div className='navbar-rightDiv'>
					<h2 className='navbar-elem'>{userName}</h2>
					<button className='navbar-elem' onClick={handleLogout}>
						ログアウト
					</button>
				</div>
			) : (
				<button className='navbar-elem' onClick={handleSignup}>
					新規登録
				</button>
			)}
		</div>
	);
};

export default Navbar;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/styles.css';
import Navbar from './Navbar';


const SignupForm = () => {
	const navigate = useNavigate();
	const { login, setUserId, setUserName } = useAuth();

	const [username, setUsername] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (username === '' || password1 !== password2) {
			setMessage('記入内容が不正です');
			return;
		}

		try {
			const password = password1;
			const response = await fetch('https://typing-backend-kj2p.onrender.com/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			if (response.ok) {
				setUserId(data.user.id);
				setUserName(data.user.username);
				login(); // ログイン状態を更新
				navigate('/userhome'); // ログイン成功時にUserHome画面に遷移
			} else {
				setMessage(data.message);
			}
		} catch (error) {
			setMessage('サーバーとの通信に失敗しました。');
		}
	};

	return (
		<div>
			<Navbar />
			<form className='form' onSubmit={handleSubmit}>
				<input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder='ユーザー名'
				/>
				<input
					type='password'
					value={password1}
					onChange={(e) => setPassword1(e.target.value)}
					placeholder='パスワード'
				/>
				<input
					type='password'
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					placeholder='パスワード確認'
				/>
				<button type='submit'>新規登録</button>
				<div>{message && <p>{message}</p>}</div>
			</form>
		</div>
	);
};

export default SignupForm;

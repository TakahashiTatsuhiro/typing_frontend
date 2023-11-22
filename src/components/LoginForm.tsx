import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/styles.css';
import Navbar from './Navbar';

const LoginForm = () => {
	const navigate = useNavigate();
	const { login, setUserId, setUserName } = useAuth();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			const response = await fetch('https://typing-backend-kj2p.onrender.com/login', {
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
			console.log('frontError',error);
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
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='パスワード'
				/>
				<button type='submit'>ログイン</button>
				{message && <p>{message}</p>}
			</form>
		</div>
	);
};

export default LoginForm;

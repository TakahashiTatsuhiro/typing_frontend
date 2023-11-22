import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { Score, midData, finalData } from '../../../globals';
import '../styles/scores.css';

const Scores = () => {
	// グラフサイズ-----------------------------------------------------
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);
	const handleResize = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	};
	useEffect(
		//第１引数…副作用
		() => {
			window.addEventListener('resize', handleResize);

			//returnでクリーンアップ処理を記述
			return () => {
				window.removeEventListener('resize', handleResize);
			};
		},
		[]
	);

	//グラフ表示対象(全員か自分だけか)------------------------------------
	const { userId } = useAuth();
	const [displayAll, setDisplayAll] = useState(false);
	const handleButton = () => {
		setDisplayAll(!displayAll);
	};

	// サーバーから取れる全得点データ -------------------------------------
	const [scores, setScores] = useState<Score[]>();
	useEffect(() => {
		const getScores = async () => {
			try {
				const getData = async () => {
					//サーバーからデータを取ってくる
					const response = await fetch('https://typing-backend-kj2p.onrender.com/scores');
					const data = await response.json();

					if (response.ok) {
						const scores: Score[] = data.scores;
						if (displayAll) {
							setScores(scores);
						} else {
							setScores(scores.filter((item) => item.user_id === userId));
						}
					} else {
						setScores([]);
					}
				};
				getData();
			} catch (error) {
				console.log('error', error);
			}
		};
		getScores();
	}, [displayAll]);

	// ユーザーの最新スコアを表示----------------------------------------
	const [message, SetMessage] = useState('');
	const { userName } = useAuth();
	useEffect(() => {
		if (scores) {
			const userScores = scores.filter((score) => score.username === userName);
			if (userScores.length > 0) {
				const latestScore = userScores[userScores.length - 1].score;
				SetMessage(`あなたの最新WPMスコアは ${latestScore} だよ`);
			} else {
				SetMessage('全スコアのグラフだよ');
			}
		}
	}, [scores, userName]);

	//ヘルパー(グラフ色生成)　https://qiita.com/anchoor/items/5edd2a67340770a8ca44
	const generateColor = (index: number, total: number) => {
		const step = 360 / total;
		const hue = step * index;
		return `hsl(${hue}, 100%, 50%)`;
	};

	//グラフ描画 https://zenn.dev/acha_n/articles/how-to-customize-recharts
	const makeChart = () => {
		//中間データに置き換える
		const midData = scores?.reduce((acc: midData[], { username, score }) => {
			const found = acc.find((item) => item.username == username);
			if (found) {
				found.scores.push(score);
			} else {
				acc.push({ username, scores: [score] });
			}
			return acc;
		}, []);

		// 描画する
		if (midData) {
			//メンバー別で最多プレイ数を調べる
			let maxPlays = 0;
			for (const user of midData) {
				if (maxPlays < user.scores.length) {
					maxPlays = user.scores.length;
				}
			}

			//最終データに変換する
			const finalData: finalData[] = [];
			for (let i = 0; i <= maxPlays; i++) {
				const playObj: finalData = { play: i + 1 };
				for (const user of midData) {
					if (user.scores[i] !== undefined) {
						playObj[user.username] = user.scores[i];
					}
				}
				finalData.push(playObj);
			}
			console.log('finalData', finalData);

			//色生成
			const colors: string[] = [];
			for (let i = 0; i < midData.length; i++) {
				colors.push(generateColor(i, midData.length));
			}

			return (
				<LineChart
					className='graph'
					width={Math.floor(width * 0.7)}
					height={Math.floor(height * 0.7)}
					data={finalData}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='play' />
					<YAxis />
					<Legend />
					<Tooltip />
					{midData.map((mid, idx) => {
						return <Line type='monotone' dataKey={mid.username} stroke={colors[idx]}  strokeWidth={2}></Line>;
					})}
				</LineChart>
			);
		} else {
			return <></>;
		}
	};

	// render---------------------------------------------------------
	return (
		<>
			<Navbar />
			<div className='upperContents'>
				{message && <p className='message'>{message}</p>}
				<button onClick={handleButton}>表示切替</button>
			</div>
			{makeChart()}
		</>
	);
};

export default Scores;

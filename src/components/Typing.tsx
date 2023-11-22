import React from 'react';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/typing.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Typing = () => {
	const navigate = useNavigate();
	const { userId } = useAuth();

	//ステート宣言------------------------------------
	const [sampleArr, setSampleArr] = useState<string[]>([]); //正解の単語配列
	const [sampleStr, setSampleStr] = useState(''); //正解の文字列
	const [spans, setSpans] = useState<React.ReactElement[]>([]); //画面表示用のspanタグが入った配列
	const [rawInput, setRawInput] = useState(''); //ユーザーの打った内容そのもの
	const [input, setInput] = useState(''); //rawInputを結果集計のために加工したもの('?'を空文字に変換して、空文字でsplitする)
	const [state, setState] = useState<number>(0); //プレイ状態のステートマシン(0:開始前、1:プレイ中、2:プレイ終了後)
	const limitSec = 10; //時間制限(秒)
	const [countDown, setCountDown] = useState(limitSec);

	//正解配列--------------------------------------
	useEffect(() => {
		const getWords = async () => {
			try {
				const response = await fetch('http://localhost:3001/words');
				const data = await response.json();
				if (response.ok) {
					setSampleArr(data);
				} else {
					setSampleArr(['test', 'apple', 'banana', 'fish', 'meet']);
				}
			} catch (error) {}
		};
		getWords();
	}, []);

	//正解文字列-------------------------------------
	useEffect(() => {
		setSampleStr(sampleArr.join(' '));
	}, [sampleArr]);

	//画面表示用span要素作成----------------------------
	useEffect(() => {
		setSpans(
			sampleStr.split('').map((char, idx) => (
				<span key={idx} className='wait'>
					{char}
				</span>
			))
		);
	}, [sampleStr]);

	//キー入力----------------------------------------
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			//開始判定
			if (state === 0) {
				setState(1);
			}

			//キー入力を受け入れ
			if (e.key === 'Backspace') {
				setRawInput((prev) => prev.slice(0, -1));
			} else if (e.key.length === 1) {
				setRawInput((prev) => prev + e.key);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const latestRawInput = rawInput.slice(-1);
		const sampleChar = sampleStr[rawInput.length - 1];
		if (sampleChar === ' ') {
			if (latestRawInput === ' ') {
				setInput((prev) => prev + latestRawInput);
			} else {
				setInput((prev) => prev + '?');
			}
		} else {
			setInput((prev) => prev + latestRawInput);
		}
	}, [rawInput]);

	useEffect(() => {
		checkResult();
	}, [input]);

	//spans更新--------------------------------------
	const createSpans = () => {
		setInput('');
		return sampleStr.split('').map((char, idx) => {
			let className = 'wait';
			let displayChar = char; // 表示する文字

			if (idx < rawInput.length) {
				if (rawInput[idx] === sampleStr[idx]) {
					className = 'correct';
					setInput((prev) => prev + rawInput[idx]);
				} else {
					className = 'incorrect';
					if (sampleStr[idx] === ' ') {
						displayChar = '?'; // スペースのタイプミスの場合、?を表示
						setInput((prev) => prev + '?');
					} else {
						setInput((prev) => prev + rawInput[idx]);
					}
				}
			}

			return (
				<span key={idx} className={className}>
					{displayChar}
				</span>
			);
		});
	};
	useEffect(() => {
		setSpans(createSpans()); // 画面マウント時とキー打鍵時にspansを更新
	}, [sampleStr, rawInput]);

	//タイマー処理------------------------------------
	const checkResult = () => {
		//入力結果を配列にして、正解した単語数を調べる
		let numOK = 0;
		const inputWords = input.replace('?', ' ').split(' ');
		for (let i = 0; i < inputWords.length; i++) {
			if (sampleArr[i] === inputWords[i]) {
				numOK += 1;
			}
		}

		//wpsを計算して保存
		const resultWpm = Math.floor(numOK / (limitSec / 60));
		return resultWpm;
	};
	const sendResult = async (wpm: number) => {
		try {
			const response = await fetch('http://localhost:3001/result', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: userId, wpm: wpm }),
			});

			if (response.ok) {
				navigate('/scores');
			} else {
				navigate('userhome');
			}
		} catch (error) {
			console.log('postWpmError', error);
		}
	};
	useEffect(() => {
		//https://jp-seemore.com/web/13310/#toc8
		let countdown: number;
		if (state === 1) {
			// カウントダウンの開始時間を10秒と設定
			let count = limitSec;

			// タイマー処理を1秒ごとに繰り返し行う
			countdown = setInterval(() => {
				// カウントをデクリメント
				count--;
				setCountDown(count);

				// カウントが0になったらタイマーを終了し、終了メッセージを表示
				if (count === 0) {
					clearInterval(countdown);
					setState(2);
				}
			}, 1000);
		} else if (state === 2) {
			sendResult(checkResult()); //タイマーのコード内で実行すると上手く動かないみたい
		}
		// クリーンアップ関数
		return () => {
			if (countdown) {
				clearInterval(countdown);
			}
		};
	}, [state]);

	//リターン----------------------------------------
	return (
		<>
			<Navbar />
			<div className='message'>残り {countDown}秒 だよ</div>
			<div className='spans'>
				<p>{spans}</p>
			</div>
			{/* <p>{rawInput}</p> */}
			{/* <p>{input}</p> */}
		</>
	);
};

export default Typing;

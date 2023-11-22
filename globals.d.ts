export type User = {
	id: number;
	username: string;
	password: string;
};

export type Score = {
	user_id: number;
	username: string;
	date: Date;
	score: number;
};

export type midData = {
	username: string;
	scores: number[];
};

export type finalData = { 
	[key: string]: number | undefined 
};

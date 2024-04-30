import { Part } from './part';

export interface Configure {
	user_id: number;
	options: string;
	date: number;
	budget: number;
	result: string;
	created_at: number;
}

export interface ConfigureData {
	time: Part[];
	cost: Part[];
	quality: Part[];
	time_rate: string[];
	cost_rate: string[];
	quality_rate: string[];
	created_at: number;
}

export interface GetConfigureRes {
	is_process: boolean;
	error: string;
	data: ConfigureData;
}

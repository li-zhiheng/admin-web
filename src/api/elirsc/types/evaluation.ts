import { Part } from './part';

export interface Evaluation {
	user_id: number;
	part_id: number;
	rank: number;
	part: Part;
}

export interface AllEvaluation {
	is_process: boolean;
	error: string;
	list: Evaluation[];
}

import axios from 'axios';
import { AllEvaluation } from './types/evaluation';

export function allEvaluation() {
	return axios.get<AllEvaluation>('/elirsc/v1/evaluations');
}

export default null;

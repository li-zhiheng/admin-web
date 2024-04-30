import axios from 'axios';
import { Indicator } from './types/indicator';

export function getIndicator() {
	return axios.get<Indicator>('/elirsc/v1/indicator');
}

export function setIndicator(value: string) {
	return axios.post('/elirsc/v1/indicator', { value });
}

import axios from 'axios';
import { ConfigureData, GetConfigureRes } from './types/configure';

export function addConfigure(data) {
	return axios.post('/elirsc/v1/configure', data);
}

export function getConfigure() {
	return axios.get<GetConfigureRes>('/elirsc/v1/configure');
}

export function pageConfigure(params) {
	return axios.get<{ list: ConfigureData[]; total: number }>('/elirsc/v1/configures', { params });
}

export default null;

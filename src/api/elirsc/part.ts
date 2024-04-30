import axios from 'axios';
import { PagePartReq, PagePartRes, Part, PartName } from './types/part';

export function pagePart(req: PagePartReq) {
	return axios.get<PagePartRes>('/elirsc/v1/parts', { params: { ...req } });
}

export function allPartName() {
	return axios.get<{ list: PartName[] }>('/elirsc/v1/part/names');
}

export function addPart(data: Part) {
	return axios.post('/elirsc/v1/part', data);
}

export function updatePart(data: Part) {
	return axios.put('/elirsc/v1/part', data);
}

export function deletePart(id: number) {
	return axios.delete('/elirsc/v1/part', { params: { id } });
}

import axios from 'axios';
import { PageSupplierReq, PageSupplierRes, Supplier } from './types/supplier';

export function pageSupplier(req: PageSupplierReq) {
	return axios.get<PageSupplierRes>('/elirsc/v1/suppliers', { params: { ...req } });
}

export function addSupplier(data: Supplier) {
	return axios.post('/elirsc/v1/supplier', data);
}

export function importSupplier(data: Supplier) {
	return axios.post('/elirsc/v1/suppliers', { list: data });
}

export function updateSupplier(data: Supplier) {
	return axios.put('/elirsc/v1/supplier', data);
}

export function deleteSupplier(id: number) {
	return axios.delete('/elirsc/v1/supplier', { params: { id } });
}

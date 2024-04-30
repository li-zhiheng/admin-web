import { Supplier } from './supplier';

export interface Part {
	supplier_id: number;
	name: string;
	quality: number;
	cost: number;
	time: number;
	ori_time: number;
	ori_cost: number;
	ori_quality: number;
	link: string;
	Supplier: Supplier;
}

export interface PartName {
	name: string;
	link: string;
}

export interface PagePartReq {
	page: number;
	page_size: number;
	name?: string;
	link?: string;
	supplier_id?: number;
	variable?: boolean;
}

export interface PagePartRes {
	list: Part[];
	total: number;
}

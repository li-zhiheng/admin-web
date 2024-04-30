export interface Supplier {
	id: number;
	name: string;
	contact: string;
	contact_way: string;
	created_at: number;
	updated_at: number;
}

export interface PageSupplierReq {
	page: number;
	page_size: number;
	name?: string;
}

export interface PageSupplierRes {
	list: Supplier[];
	total: number;
}

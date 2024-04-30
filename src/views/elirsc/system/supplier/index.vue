<template>
	<div class="container">
		<Breadcrumb />
		<a-card class="general-card">
			<Search @search="handleSearch"></Search>
			<Tool v-model:size="size" v-model:columns="columns" @refresh="handleGet" @add="handleToolAdd" @import="handleImport"></Tool>
			<Table
				:columns="columns"
				:loading="loading"
				:data="tableData"
				:size="size"
				:total="total"
				:pagination="{
					current: searchForm.page,
					pageSize: searchForm.page_size
				}"
				@page-change="handlePageChange"
				@update="handleTableUpdate"
				@delete="handleDelete"
				@part="handleTablePart"
			></Table>
			<Form ref="formRef" :data="form" @add="handleAdd" @update="handleUpdate"></Form>
			<Part ref="partRef"></Part>
		</a-card>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { TableData } from '@arco-design/web-vue/es/table/interface';
import { Pagination, TableCloumn, TableSize } from '@/types/global';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';

import { pageSupplier, addSupplier, deleteSupplier, updateSupplier, importSupplier } from '@/api/elirsc/supplier';
import { PageSupplierReq, Supplier } from '@/api/elirsc/types/supplier';
import Tool from './components/tool.vue';
import Table from './components/table.vue';
import Form from './components/form.vue';
import Search from './components/search.vue';
import Part from './components/part.vue';

const partRef = ref();
const formRef = ref();
const form = ref<Supplier>({} as Supplier);
const { setLoading } = useLoading(true);
const loading = ref(false);
const tableData = ref<TableData[]>();
const size = ref<TableSize>('medium');
const total = ref(0);
const searchForm = ref<PageSupplierReq>({
	page: 1,
	page_size: 10
});

const columns = ref<TableCloumn[]>([
	{
		title: '供应商名称',
		dataIndex: 'name'
	},
	{
		title: '联系人',
		dataIndex: 'contact'
	},
	{
		title: '联系方式',
		dataIndex: 'contact_way'
	},
	{
		title: '创建时间',
		dataIndex: 'created_at',
		slotName: 'createdAt',
		width: 170
	},
	{
		title: '更新时间',
		dataIndex: 'updated_at',
		slotName: 'updatedAt',
		width: 170
	},
	{
		title: '操作',
		dataIndex: 'operations',
		slotName: 'operations',
		fixed: 'right',
		width: 200
	}
]);

// handleGet 处理查询
const handleGet = async () => {
	setLoading(true);
	try {
		const { data } = await pageSupplier(searchForm.value);
		tableData.value = data.list as unknown as TableData[];
		total.value = data.total;
	} finally {
		setLoading(false);
	}
};

handleGet();

// 处理查询
const handleSearch = async (req: PageSupplierReq) => {
	const pageSize = searchForm.value.page_size;
	searchForm.value = {
		...req,
		page: 1,
		page_size: pageSize
	};

	handleGet();
};

// 处理页面变更
const handlePageChange = async (page: Pagination) => {
	searchForm.value.page = page.current;
	searchForm.value.page_size = page.pageSize;
	handleGet();
};

// 处理新增
const handleAdd = async (data: Supplier) => {
	await addSupplier(data);
	handleGet();
	Message.success('创建成功');
};

// 处理导入
const handleImport = async (data) => {
	console.log(data);
	await importSupplier(data);
	handleGet();
	Message.success('导入成功');
};

// 处理修改
const handleUpdate = async (data: Supplier) => {
	await updateSupplier(data);
	handleGet();
	Message.success('更新成功');
};

// 处理数据删除
const handleDelete = async (id: number) => {
	await deleteSupplier(id);
	handleGet();
	Message.success('删除成功');
};

//  处理tool按钮新建
const handleToolAdd = () => {
	form.value = {} as Supplier;
	formRef.value.showAddDrawer();
};

const handleTablePart = (data: Supplier) => {
	partRef.value.show(data.id, data.name);
};

// 处理table点击更新
const handleTableUpdate = async (data: Supplier) => {
	form.value = { ...data };
	formRef.value.showUpdateDrawer();
};
</script>

<script lang="ts">
export default {
	name: 'ManagerSupplier'
};
</script>

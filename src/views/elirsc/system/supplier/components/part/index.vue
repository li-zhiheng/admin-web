<template>
	<div class="container">
		<Search @search="handleSearch"></Search>
		<Tool v-model:size="size" v-model:columns="columns" @refresh="handleGet" @add="handleToolAdd"></Tool>
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
			@add="handleTableAdd"
			@update="handleTableUpdate"
			@delete="handleDelete"
		></Table>
		<Form ref="formRef" :data="form" @add="handleAdd" @update="handleUpdate"></Form>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { TableData } from '@arco-design/web-vue/es/table/interface';
import { Pagination, TableCloumn, TableSize } from '@/types/global';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';

import { addPart, deletePart, pagePart, updatePart } from '@/api/elirsc/part';
import { Part, PagePartReq } from '@/api/elirsc/types/part';
import Tool from './components/tool.vue';
import Table from './components/table.vue';
import Form from './components/form.vue';
import Search from './components/search.vue';

const props = defineProps<{ id: number }>();
const formRef = ref();
const form = ref<Part>({} as Part);
const { setLoading } = useLoading(true);
const loading = ref(false);
const tableData = ref<TableData[]>();
const size = ref<TableSize>('medium');
const total = ref(0);
const searchForm = ref<PagePartReq>({
	page: 1,
	page_size: 10,
	supplier_id: props.id
});

const columns = ref<TableCloumn[]>([
	{
		title: '环节',
		dataIndex: 'link',
		slotName: 'link'
	},
	{
		title: '名称',
		dataIndex: 'name'
	},
	{
		title: '时间指标',
		dataIndex: 'time'
	},
	{
		title: '成本指标',
		dataIndex: 'cost'
	},
	{
		title: '质量指标',
		dataIndex: 'quality'
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
		const { data } = await pagePart(searchForm.value);
		tableData.value = data.list as unknown as TableData[];
		total.value = data.total;
	} finally {
		setLoading(false);
	}
};

handleGet();

// 处理查询
const handleSearch = async (req: PagePartReq) => {
	searchForm.value = {
		...searchForm.value,
		...req
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
const handleAdd = async (data: Part) => {
	data.supplier_id = props.id as unknown as number;
	await addPart(data);
	handleGet();
	Message.success('创建成功');
};

// 处理修改
const handleUpdate = async (data: Part) => {
	data.supplier_id = props.id as unknown as number;
	await updatePart(data);
	handleGet();
	Message.success('更新成功');
};

// 处理数据删除
const handleDelete = async (id: number) => {
	await deletePart(id);
	handleGet();
	Message.success('删除成功');
};

//  处理tool按钮新建
const handleToolAdd = () => {
	form.value = {} as Part;
	formRef.value.showAddDrawer();
};

// 处理table点击更新
const handleTableUpdate = async (data: Part) => {
	form.value = { ...data };
	formRef.value.showUpdateDrawer();
};

// 处理table点击添加
const handleTableAdd = (id: number) => {
	formRef.value.showAddDrawer();
};
</script>

<script lang="ts">
export default {
	name: 'ManagerPart'
};
</script>

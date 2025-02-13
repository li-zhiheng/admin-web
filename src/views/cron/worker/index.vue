<template>
	<div class="container">
		<Breadcrumb />
		<a-card class="general-card">
			<Search :groups="groups" @search="handleSearch"></Search>
			<Tool v-model:size="size" v-model:columns="columns" @refresh="handleGet" @add="handleToolAdd" @show-group="showGroup = true"></Tool>
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
				@enable="handleEnable"
				@disable="handleDisable"
			></Table>
			<Form ref="formRef" :data="form" :groups="groups" @add="handleAdd" @update="handleUpdate"></Form>
		</a-card>
		<a-modal v-model:visible="showGroup" title="节点分组" width="780px" :body-style="{ padding: 0 }" :footer="false">
			<Group />
		</a-modal>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { TableData } from '@arco-design/web-vue/es/table/interface';
import { Pagination, TableCloumn, TableSize } from '@/types/global';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';

import { WorkerGroup, Worker, PageWorkerReq } from '@/api/cron/types/worker';
import { addWorker, allWorkerGroup, deleteWorker, disableWorker, enableWorker, pageWorker, updateWorker } from '@/api/cron/worker';
import Tool from './components/tool.vue';
import Table from './components/table.vue';
import Form from './components/form.vue';
import Search from './components/search.vue';
import Group from './components/group/index.vue';

const formRef = ref();
const form = ref<Worker>({} as Worker);
const { setLoading } = useLoading(true);
const loading = ref(false);
const tableData = ref<TableData[]>();
const size = ref<TableSize>('medium');
const groups = ref<WorkerGroup[]>([]);
const total = ref(0);
const showGroup = ref(false);
const searchForm = ref<PageWorkerReq>({
	page: 1,
	page_size: 10
});

const columns = ref<TableCloumn[]>([
	{
		title: '节点名称',
		dataIndex: 'name'
	},
	{
		title: '节点ip',
		dataIndex: 'ip'
	},
	{
		title: '节点分组',
		dataIndex: 'group_id',
		slotName: 'group'
	},
	{
		title: '节点描述',
		dataIndex: 'description'
	},
	{
		title: '节点状态',
		dataIndex: 'status',
		slotName: 'status'
	},
	{
		title: '创建时间',
		dataIndex: 'created_at',
		slotName: 'createdAt'
	},
	{
		title: '更新时间',
		dataIndex: 'updated_at',
		slotName: 'updatedAt'
	},
	{
		title: '操作',
		dataIndex: 'operations',
		slotName: 'operations',
		fixed: 'right',
		width: 100
	}
]);

const handleGetGroup = async () => {
	const { data } = await allWorkerGroup();
	groups.value = data.list;
};

// handleGet 处理查询
const handleGet = async () => {
	setLoading(true);
	try {
		const { data } = await pageWorker(searchForm.value);
		tableData.value = data.list as unknown as TableData[];
		total.value = data.total;
	} finally {
		setLoading(false);
	}
};

handleGet();
handleGetGroup();

// 处理查询
const handleSearch = async (req: PageWorkerReq) => {
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
const handleAdd = async (data: Worker) => {
	await addWorker(data);
	handleGet();
	Message.success('创建成功');
};

// 处理禁用节点
const handleDisable = (worker: Worker) => {
	disableWorker(worker.id)
		.then(() => {
			Message.success('禁用成功');
		})
		.catch(() => {
			worker.status = !worker.status;
		});
};

// 处理启用节点
const handleEnable = (worker: Worker) => {
	enableWorker(worker.id as number)
		.then(() => {
			Message.success('启用成功');
		})
		.catch(() => {
			worker.status = !worker.status;
		});
};

// 处理修改
const handleUpdate = async (data: Worker) => {
	await updateWorker(data);
	handleGet();
	Message.success('更新成功');
};

// 处理数据删除
const handleDelete = async (id: number) => {
	await deleteWorker(id);
	handleGet();
	Message.success('删除成功');
};

//  处理tool按钮新建
const handleToolAdd = () => {
	form.value = {} as Worker;
	formRef.value.showAddDrawer();
};

// 处理table点击更新
const handleTableUpdate = async (worker: Worker) => {
	form.value = { ...worker };
	formRef.value.showUpdateDrawer();
};

// 处理table点击添加
const handleTableAdd = (id: number) => {
	form.value = { id } as Worker;
	formRef.value.showAddDrawer();
};
</script>

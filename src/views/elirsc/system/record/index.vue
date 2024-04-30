<template>
	<div class="container">
		<Breadcrumb />
		<a-card class="general-card">
			<a-row v-permission="'elirsc:supplier:query'">
				<a-col :flex="1">
					<a-form :model="params" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left" auto-label-width>
						<a-row :gutter="16">
							<a-col :span="8">
								<a-form-item field="name" label="所属环节">
									<a-select v-model="params.link" placeholder="请选择环节" :options="links"></a-select>
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
				</a-col>
				<a-col :flex="'220px'" style="text-align: right">
					<a-space :size="18">
						<a-button type="primary" @click="handleGet">
							<template #icon>
								<icon-search />
							</template>
							搜索
						</a-button>
						<a-button @click="reset">
							<template #icon>
								<icon-refresh />
							</template>
							重置
						</a-button>
					</a-space>
				</a-col>
			</a-row>
			<a-space direction="vertical" fill>
				<a-table
					v-permission="'elirsc:supplier:query'"
					row-key="id"
					:loading="loading"
					:columns="columns"
					:data="list"
					:bordered="false"
					:pagination="false"
					:size="size"
					:span-method="spanMethod"
				>
					<template #createdAt="{ record }">
						{{ $formatTime(record.created_at) }}
					</template>

					<template #updatedAt="{ record }">
						{{ $formatTime(record.updated_at) }}
					</template>
				</a-table>
				<a-pagination
					:total="total"
					:current="params.page"
					:page-size="params.page_size"
					show-total
					show-jumper
					show-page-size
					@change="pageChange"
					@page-size-change="pageSizeChange"
				/>
			</a-space>
		</a-card>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { TableCloumn, TableSize } from '@/types/global';
import useLoading from '@/hooks/loading';

import { pageConfigure } from '@/api/elirsc/configure';
import { links, getLinkName } from '@/api/elirsc/global';
import { ConfigureData } from '@/api/elirsc/types/configure';

const { setLoading } = useLoading(true);
const loading = ref(false);
const size = ref<TableSize>('medium');
const total = ref(0);
const list = ref();
const params = ref({
	page: 1,
	page_size: 10,
	link: ''
});

const columns = ref<TableCloumn[]>([
	{
		title: '方案',
		dataIndex: 'type'
	},
	{
		title: '零件/业务',
		dataIndex: 'name'
	},
	{
		title: '环节',
		dataIndex: 'link',
		slotName: 'link'
	},
	{
		title: '供应商',
		dataIndex: 'supplier.name'
	},
	{
		title: '时间',
		dataIndex: 'time_rate'
	},
	{
		title: '成本',
		dataIndex: 'cost_rate'
	},
	{
		title: '创建时间',
		dataIndex: 'created_at',
		slotName: 'createdAt',
		width: 170
	}
]);

const handleList = (list: ConfigureData[]) => {
	const reply: any[] = [];
	let index = 0;
	list.forEach((item) => {
		index += 1;
		item.time.forEach((part) => {
			const temp = {
				...part,
				type: '时间最优方案',
				link: getLinkName(part.link),
				time_rate: item.time_rate[0],
				cost_rate: item.time_rate[1],
				created_at: item.created_at,
				index,
				item_count: item.time.length,
				count: item.time.length + item.cost.length + item.quality.length
			};
			reply.push(temp);
		});

		item.cost.forEach((part) => {
			const temp = {
				...part,
				type: '成本最优方案',
				link: getLinkName(part.link),
				time_rate: item.cost_rate[0],
				cost_rate: item.cost_rate[1],
				created_at: item.created_at,
				index,
				item_count: item.cost.length,
				count: item.time.length + item.cost.length + item.quality.length
			};
			reply.push(temp);
		});

		item.quality.forEach((part) => {
			const temp = {
				...part,
				type: '质量最优方案',
				link: getLinkName(part.link),
				time_rate: item.quality_rate[0],
				cost_rate: item.quality_rate[1],
				created_at: item.created_at,
				index,
				item_count: item.quality.length,
				count: item.time.length + item.cost.length + item.quality.length
			};
			reply.push(temp);
		});
	});
	return reply;
};

const spanMethod = ({ rowIndex, columnIndex }) => {
	const data = list.value;

	if (rowIndex === 0 || data[rowIndex].index !== data[rowIndex - 1].index) {
		if (columnIndex === 0 || columnIndex === 4 || columnIndex === 5) {
			return {
				rowspan: data[rowIndex].item_count
			};
		}

		if (columnIndex === 6) {
			return {
				rowspan: data[rowIndex].count
			};
		}
	}

	if (rowIndex !== 0 && data[rowIndex].type !== data[rowIndex - 1].type) {
		if (columnIndex === 0 || columnIndex === 4 || columnIndex === 5) {
			return {
				rowspan: data[rowIndex].item_count
			};
		}
	}

	return {
		rowspan: 1
	};
};

// handleGet 处理查询
const handleGet = async () => {
	setLoading(true);
	try {
		const { data } = await pageConfigure(params.value);
		list.value = handleList(data.list);
		total.value = data.total;
	} finally {
		setLoading(false);
	}
};

handleGet();

// 处理页面变更

const pageChange = (current: number) => {
	params.value.page = current;
	handleGet();
};

const pageSizeChange = (size: number) => {
	params.value.page_size = size;
	handleGet();
};

const reset = () => {
	params.value.link = '';
};
</script>

<script lang="ts">
export default {
	name: 'ManagerSupplier'
};
</script>

<template>
	<div class="container">
		<Breadcrumb />
		<!-- :body-style="{ paddingTop: '0px' }" -->
		<a-card class="general-card" title="生态资源指标异常变动" :body-style="{ paddingTop: '0px' }">
			<a-space direction="vertical" fill>
				<a-table :bordered="false" :pagination="false" :columns="columns" :data="list">
					<template #time="{ record }">
						<div class="flex" :class="changeStatsu(record.time, record.ori_time)">
							{{ record.time }}
							<template v-if="changeStatsu(record.time, record.ori_time) != ''">
								<icon-arrow-up v-if="changeStatsu(record.time, record.ori_time) == 'up'" size="14px" />
								<icon-arrow-down v-if="changeStatsu(record.time, record.ori_time) == 'down'" size="14px" />
								({{ changeRate(record.time, record.ori_time) }}%)
							</template>
						</div>
					</template>

					<template #cost="{ record }">
						<div class="flex" :class="changeStatsu(record.cost, record.ori_cost)">
							{{ record.cost }}
							<template v-if="changeStatsu(record.cost, record.ori_cost) != ''">
								<icon-arrow-up v-if="changeStatsu(record.cost, record.ori_cost) == 'up'" size="14px" />
								<icon-arrow-down v-if="changeStatsu(record.cost, record.ori_cost) == 'down'" size="14px" />
								({{ changeRate(record.cost, record.ori_cost) }}%)
							</template>
						</div>
					</template>

					<template #quality="{ record }">
						<div class="flex" :class="changeStatsu(record.quality, record.ori_quality)">
							{{ record.quality }}
							<template v-if="changeStatsu(record.quality, record.ori_quality) != ''">
								<icon-arrow-up v-if="changeStatsu(record.quality, record.ori_quality) == 'up'" size="14px" />
								<icon-arrow-down v-if="changeStatsu(record.quality, record.ori_quality) == 'down'" size="14px" />
								({{ changeRate(record.quality, record.ori_quality) }}%)
							</template>
						</div>
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
import { pagePart } from '@/api/elirsc/part';
import { PagePartReq, Part } from '@/api/elirsc/types/part';
import { ref } from 'vue';

const list = ref<Part[]>([]);
const total = ref(0);
const params = ref<PagePartReq>({
	page: 1,
	page_size: 10,
	variable: true
});

const changeStatsu = (s1, s2) => {
	if (s1 - s2 > 0) {
		return 'up';
	}
	if (s1 - s2 < 0) {
		return 'down';
	}
	return '';
};

const changeRate = (s1, s2) => {
	let variable = s1 - s2;
	if (s2 - s1 > 0) {
		variable = s2 - s1;
	}

	return Math.round((variable / s2) * 100);
};

const columns = [
	{
		title: '生态资源名',
		dataIndex: 'supplier.name'
	},
	{
		title: '零件/业务名',
		dataIndex: 'name'
	},
	{
		title: '时间',
		dataIndex: 'time',
		slotName: 'time'
	},
	{
		title: '成本',
		dataIndex: 'cost',
		slotName: 'cost'
	},
	{
		title: '质量',
		dataIndex: 'quality',
		slotName: 'quality'
	}
];

const handleGet = async () => {
	const { data } = await pagePart(params.value);
	list.value = data.list;
	total.value = data.total;
};
handleGet();

// eslint-disable-next-line @typescript-eslint/no-empty-function
const pageChange = () => {
	handleGet();
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const pageSizeChange = () => {
	handleGet();
};
</script>

<style lang="less">
.arco-collapse-item-content-box {
	padding: 0;
}

.arco-collapse-item-content {
	padding-right: 0 !important;
	padding-left: 0 !important;
}
</style>

<style lang="less" scoped>
.flex {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}

.up {
	color: rgb(var(--green-6));
}

.down {
	color: rgb(var(--red-6));
}
</style>

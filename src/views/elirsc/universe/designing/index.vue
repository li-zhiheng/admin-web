<template>
	<div class="container">
		<Breadcrumb />
		<div v-if="isProcess || error != '' || !hasKeys()" class="empty">
			<a-empty v-if="isProcess">
				<template #image>
					<icon-loading />
				</template>
				数据正在计算中，请稍等～
			</a-empty>
			<a-empty v-else-if="error != ''">
				<template #image>
					<icon-exclamation-circle-fill />
				</template>
				{{ error }}
			</a-empty>
			<a-empty v-else-if="!hasKeys()">
				<template #image>
					<icon-exclamation-circle-fill />
				</template>
				请先进行偏好设置
			</a-empty>
		</div>
		<a-space v-else direction="vertical" fill size="medium">
			<a-collapse :default-active-key="[0]" :accordion="false" :bordered="false">
				<div v-for="(item, index) in links" :key="index">
					<a-collapse-item v-if="list[item.value]" :key="index" :header="item.label" :style="{ paddingLeft: '0px' }">
						<a-table :bordered="false" :pagination="false" :columns="columns" :data="list[item.value]" :span-method="spanMethod" />
					</a-collapse-item>
				</div>
			</a-collapse>
		</a-space>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { links } from '@/api/elirsc/global';
import { allEvaluation } from '@/api/elirsc/evaluation';

const timer = ref();
const isProcess = ref(false);
const error = ref('');
const list = ref<Record<string, any[]>>({});

const handleGet = async () => {
	const { data } = await allEvaluation();
	isProcess.value = data.is_process;

	const m: Record<string, any[]> = {};
	data.list.forEach((item) => {
		if (!m[item.part.link]) {
			m[item.part.link] = [];
		}
		m[item.part.link].push(item);
	});
	list.value = m;
};

handleGet();

timer.value = setInterval(() => {
	if (isProcess.value) {
		handleGet();
	} else {
		clearInterval(timer.value);
	}
}, 1000);

const spanMethod = ({ rowIndex, columnIndex }) => {
	if (rowIndex % 5 === 0 && columnIndex === 0) {
		return {
			rowspan: 5
		};
	}
	return {
		rowspan: 1
	};
};

const hasKeys = () => {
	return Object.keys(list.value).length !== 0;
};

const columns = [
	{
		title: '零件/业务名',
		dataIndex: 'part.name'
	},
	{
		title: '评估排名',
		dataIndex: 'rank'
	},
	{
		title: '供应商名',
		dataIndex: 'part.supplier.name'
	},
	{
		title: '联系人',
		dataIndex: 'part.supplier.contact'
	},
	{
		title: '联系方式',
		dataIndex: 'part.supplier.contact_way'
	}
];
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
.container {
	height: 100%;
}

.empty {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}
</style>

<template>
	<div class="container">
		<Breadcrumb />
		<div v-if="isProcess || error != '' || !result" class="empty">
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
			<a-empty v-else-if="!result">
				<template #image>
					<icon-exclamation-circle-fill />
				</template>
				请先进行资源重构
			</a-empty>
		</div>
		<a-row v-else :gutter="16">
			<a-col :span="8">
				<a-space direction="vertical" fill>
					<a-card class="general-card" title="时间最优的方案" :body-style="{ paddingTop: '0px' }">
						<a-space direction="vertical" fill>
							<a-table :bordered="false" :pagination="false" :columns="columns" :data="result.time">
								<template #link="{ record }">
									{{ getLinkName(record.link) }}
								</template>
							</a-table>
							<a-table
								:bordered="false"
								:pagination="false"
								:columns="resultColumns"
								:data="[
									{ label: '时间', value: result.time_rate[0] },
									{ label: '成本', value: result.time_rate[1] }
								]"
							></a-table>
						</a-space>
					</a-card>
				</a-space>
			</a-col>

			<a-col :span="8">
				<a-space direction="vertical" fill>
					<a-card class="general-card" title="成本最优的方案" :body-style="{ paddingTop: '0px' }">
						<a-space direction="vertical" fill>
							<a-table :bordered="false" :pagination="false" :columns="columns" :data="result.cost">
								<template #link="{ record }">
									{{ getLinkName(record.link) }}
								</template>
							</a-table>
							<a-table
								:bordered="false"
								:pagination="false"
								:columns="resultColumns"
								:data="[
									{ label: '时间', value: result.cost_rate[0] },
									{ label: '成本', value: result.cost_rate[1] }
								]"
							></a-table>
						</a-space>
					</a-card>
				</a-space>
			</a-col>

			<a-col :span="8">
				<a-space direction="vertical" fill>
					<a-card class="general-card" title="质量最优的方案" :body-style="{ paddingTop: '0px' }">
						<a-space direction="vertical" fill>
							<a-table :bordered="false" :pagination="false" :columns="columns" :data="result.quality">
								<template #link="{ record }">
									{{ getLinkName(record.link) }}
								</template>
							</a-table>
							<a-table
								:bordered="false"
								:pagination="false"
								:columns="resultColumns"
								:data="[
									{ label: '时间', value: result.quality_rate[0] },
									{ label: '成本', value: result.quality_rate[1] }
								]"
							></a-table>
						</a-space>
					</a-card>
				</a-space>
			</a-col>
		</a-row>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getLinkName } from '@/api/elirsc/global';
import { getConfigure } from '@/api/elirsc/configure';
import { ConfigureData } from '@/api/elirsc/types/configure';

const timer = ref();
const isProcess = ref(false);
const error = ref('');

const result = ref<ConfigureData>();

const resultColumns = [
	{
		title: '指标',
		dataIndex: 'label'
	},
	{
		title: '提升值',
		dataIndex: 'value'
	}
];

const columns = [
	{
		title: '环节名',
		dataIndex: 'link',
		slotName: 'link'
	},
	{
		title: '生态资源名',
		dataIndex: 'supplier.name'
	},
	{
		title: '零件/业务名',
		dataIndex: 'name'
	}
];

const handleGet = async () => {
	const { data } = await getConfigure();
	isProcess.value = data.is_process;
	error.value = data.error;
	result.value = data.data;
};

handleGet();

timer.value = setInterval(() => {
	if (isProcess.value) {
		handleGet();
	} else {
		clearInterval(timer.value);
	}
}, 1000);
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
	justify-content: space-around;
}

.up {
	color: rgb(var(--green-6));
}

.down {
	color: rgb(var(--red-6));
}

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

<template>
	<a-row v-permission="'cron:worker:query'">
		<a-col :flex="1">
			<a-form :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left" auto-label-width>
				<a-row :gutter="16">
					<a-col :span="8">
						<a-form-item field="group_id" label="节点分组">
							<a-select
								v-model="form.group_id"
								placeholder="请选择节点分组"
								:scrollbar="true"
								:options="groups"
								:field-names="{ value: 'id', label: 'name' }"
								allow-clear
							/>
						</a-form-item>
					</a-col>

					<a-col :span="8">
						<a-form-item field="name" label="节点名称">
							<a-input v-model="form.name" allow-clear placeholder="请输入节点名称" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-col>
		<a-col :flex="'220px'" style="text-align: right">
			<a-space :size="18">
				<a-button type="primary" @click="handleSearch">
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
</template>

<script lang="ts" setup>
import { PageWorkerReq } from '@/api/cron/types/worker';
import { CascaderOption } from '@arco-design/web-vue/es/cascader/interface';
import { ref } from 'vue';

defineProps<{
	groups: CascaderOption[];
}>();

const form = ref<PageWorkerReq>({} as PageWorkerReq);
const emit = defineEmits(['search']);

const handleSearch = () => {
	emit('search', form.value);
};

const reset = () => {
	form.value = {} as PageWorkerReq;
};
</script>

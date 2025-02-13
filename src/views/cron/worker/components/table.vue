<template>
	<a-space direction="vertical" fill>
		<a-table
			v-permission="'cron:worker:query'"
			row-key="id"
			:loading="loading"
			:columns="columns"
			:data="data"
			:bordered="false"
			:pagination="false"
			:size="size"
		>
			<template #group="{ record }">
				<template v-if="record.group">{{ record.group.name }}</template>
				<template v-else>暂无分组</template>
			</template>

			<template #status="{ record }">
				<a-switch v-model="record.status" :disabled="!$hasPermission('cron:worker:status')" type="round" @change="changeStatus(record)">
					<template #checked>启用</template>
					<template #unchecked>禁用</template>
				</a-switch>
			</template>
			<template #createdAt="{ record }">
				{{ $formatTime(record.created_at) }}
			</template>
			<template #updatedAt="{ record }">
				{{ $formatTime(record.updated_at) }}
			</template>

			<template #operations="{ record }">
				<a-space class="cursor-pointer">
					<a-tag v-permission="'cron:worker:update'" color="orangered" @click="emit('update', record)">
						<template #icon><icon-edit /></template>
						修改
					</a-tag>

					<a-popconfirm content="您确认删除此节点？" type="warning" @ok="emit('delete', record.id)">
						<a-tag v-permission="'cron:worker:delete'" color="red">
							<template #icon><icon-delete /></template>
							删除
						</a-tag>
					</a-popconfirm>
				</a-space>
			</template>
		</a-table>
		<a-pagination
			:total="total"
			:current="page.current"
			:page-size="page.pageSize"
			show-total
			show-jumper
			show-page-size
			@change="pageChange"
			@page-size-change="pageSizeChange"
		/>
	</a-space>
</template>

<script lang="ts" setup>
import { TableSize, TableCloumn, Pagination } from '@/types/global';
import { TableData } from '@arco-design/web-vue/es/table/interface';
import { watch, ref } from 'vue';
import { Worker } from '@/api/cron/types/worker';
import Modal from '@arco-design/web-vue/es/modal';

const emit = defineEmits(['delete', 'update', 'add', 'pageChange', 'disable', 'enable']);

const props = defineProps<{
	columns: TableCloumn[];
	loading: boolean;
	data?: TableData[];
	size: TableSize;
	pagination: Pagination;
	total: number;
}>();

const page = ref({
	current: 1,
	pageSize: 10
});

watch(
	() => props.pagination,
	(val) => {
		page.value = { ...val };
	},
	{ deep: true, immediate: true }
);

const pageChange = (current: number) => {
	page.value.current = current;
	emit('pageChange', page.value);
};

const pageSizeChange = (size: number) => {
	page.value.pageSize = size;
	emit('pageChange', page.value);
};

const changeStatus = (record: Worker) => {
	const status = record.status ? '启用' : '禁用';
	Modal.info({
		title: '状态变更提示',
		content: () => `您确认要 '${status}'此用户？`,
		closable: true,
		hideCancel: false,
		onOk: async () => {
			if (record.status) {
				emit('enable', record);
			} else {
				emit('disable', record);
			}
		},
		onCancel: () => {
			record.status = !record.status;
		}
	});
};
</script>

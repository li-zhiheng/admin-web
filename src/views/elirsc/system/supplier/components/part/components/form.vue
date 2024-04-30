<template>
	<a-drawer v-model:visible="visible" :title="isAdd ? '新建' : '修改'" width="380px" @cancel="visible = false" @before-ok="handleSubmit">
		<a-form ref="formRef" :model="form" label-align="left" layout="horizontal" auto-label-width>
			<a-form-item
				field="link"
				label="环节"
				:rules="[
					{
						required: true,
						message: '环节是必填项'
					}
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-select v-model="form.link" placeholder="请选择环节" :options="links"></a-select>
			</a-form-item>

			<a-form-item
				field="name"
				label="名称"
				:rules="[
					{
						required: true,
						message: '名称是必填项'
					}
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-input v-model="form.name" allow-clear placeholder="请输入名称" />
			</a-form-item>

			<a-form-item
				field="time"
				label="时间"
				:rules="[
					{
						required: true,
						message: '时间指标是必填项'
					}
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-input-number v-model="form.time" allow-clear placeholder="请输入时间指标" />
			</a-form-item>
			<a-form-item
				field="cost"
				label="成本"
				:rules="[
					{
						required: true,
						message: '成本指标是必填项'
					}
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-input-number v-model="form.cost" allow-clear placeholder="请输入成本指标" />
			</a-form-item>
			<a-form-item
				field="quality"
				label="质量"
				:rules="[
					{
						required: true,
						message: '质量指标是必填项'
					}
				]"
				:validate-trigger="['change', 'input']"
			>
				<a-input-number v-model="form.quality" allow-clear placeholder="请输入质量指标" />
			</a-form-item>
		</a-form>
	</a-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Part } from '@/api/elirsc/types/part';
import { links } from '@/api/elirsc/global';

const formRef = ref();
const visible = ref(false);
const isAdd = ref(false);

const props = defineProps<{
	data: Part;
}>();

const form = ref({} as Part);
const emit = defineEmits(['add', 'update']);

watch(
	() => props.data,
	(val) => {
		form.value = val;
	}
);

const showAddDrawer = () => {
	visible.value = true;
	isAdd.value = true;
};

const showUpdateDrawer = () => {
	visible.value = true;
	isAdd.value = false;
};

const closeDrawer = () => {
	visible.value = false;
};

defineExpose({ showAddDrawer, showUpdateDrawer, closeDrawer });

const handleSubmit = async () => {
	const isError = await formRef.value.validate();
	if (isError) {
		return false;
	}

	if (isAdd.value) {
		emit('add', { ...form.value });
	} else {
		emit('update', { ...form.value });
	}
	return true;
};
</script>

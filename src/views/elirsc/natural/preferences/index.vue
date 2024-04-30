<template>
	<div class="container">
		<Breadcrumb />
		<a-card class="general-card" title="生态资源重构">
			<template #extra>
				<a-link @click="handleSwitchType">
					<icon-swap />
					切换
				</a-link>
			</template>
			<div class="center">
				<a-form v-if="!loading" :model="form" layout="vertical" width="100%">
					<template v-for="(item, index) in links" :key="index">
						<a-form-item label="研发设计环节" :label-col-style="labelStyle">
							<a-checkbox-group v-if="tp == 'radio'" v-model="form.names[item.value]">
								<a-checkbox v-for="(ite, ind) in list[item.value]" :key="ind" :value="ite.value">{{ ite.lable }}</a-checkbox>
							</a-checkbox-group>
							<a-select
								v-else
								v-model="form.names[item.value]"
								multiple
								placeholder="请选择"
								:style="{ maxWidth: '600px' }"
								:options="list[item.value]"
							></a-select>
						</a-form-item>
					</template>

					<a-form-item field="date" label="需求交货日期" required :label-col-style="labelStyle">
						<a-date-picker v-model="form.date" :style="{ width: '320px' }" placeholder="请选择" format="YYYY-MM-DD" value-format="timestamp" />
					</a-form-item>
					<a-form-item field="budget" label="需求总预算" required :label-col-style="labelStyle">
						<a-input-number v-model="form.budget" :style="{ width: '320px' }" placeholder="请输入" mode="button" />
					</a-form-item>
					<a-form-item>
						<a-button type="primary" @click="submit">确 认</a-button>
					</a-form-item>
				</a-form>
			</div>
		</a-card>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { allPartName } from '@/api/elirsc/part';
import { links } from '@/api/elirsc/global';
import { addConfigure } from '@/api/elirsc/configure';
import Message from '@arco-design/web-vue/es/message';
import { useRouter } from 'vue-router';

interface Form {
	names: Record<string, string[]>;
	date: number;
	budget: number;
	options: string;
}

const router = useRouter();
const loading = ref(true);
const tp = ref('select');
const form = ref<Form>({ names: {} } as Form);
const labelStyle = { fontWeight: 800 };

interface Item {
	lable: string;
	value: string;
}
const list = ref<Record<string, Item[]>>({});

const handleSwitchType = () => {
	if (tp.value === 'radio') {
		tp.value = 'select';
	} else {
		tp.value = 'radio';
	}
};

const handleGet = async () => {
	const { data } = await allPartName();
	const m: Record<string, Item[]> = {};
	data.list.forEach((item) => {
		if (!m[item.link]) {
			m[item.link] = [];
		}
		if (!form.value.names[item.link]) {
			form.value.names[item.link] = [];
		}
		m[item.link].push({
			lable: item.name,
			value: item.name
		});
	});
	list.value = m;
	loading.value = false;
};
handleGet();

const submit = async () => {
	const data = { ...form.value };
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const timestamp = today.getTime();
	data.date = (form.value.date - timestamp) / (1000 * 3600 * 24);
	data.options = JSON.stringify(form.value.names);
	await addConfigure(data);
	Message.success('提交成功');
	router.push({ path: '/elirsc/natural/config' });
};
</script>

<script lang="ts">
export default {
	name: 'Workplace'
};
</script>

<style lang="less" scoped>
.center {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
}
</style>

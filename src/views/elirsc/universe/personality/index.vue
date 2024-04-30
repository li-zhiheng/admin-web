<template>
	<div class="container">
		<Breadcrumb />
		<a-card class="general-card" title="用户个性化指标偏好数据采集">
			<template #extra>
				<a-link @click="handleSwitchType">
					<icon-swap />
					切换
				</a-link>
			</template>
			<div class="center">
				<a-form :model="form" layout="vertical" width="100%">
					<a-form-item field="budget" label="您认为交货日期对销售价格有多重要？" required>
						<a-radio-group v-if="tp == 'radio'" v-model="form.budget">
							<a-radio v-for="item of list" :key="item.value" :value="item.value">{{ item.label }}</a-radio>
						</a-radio-group>
						<a-select v-else v-model="form.budget" placeholder="请选择" :style="{ maxWidth: '600px' }">
							<a-option v-for="item of list" :key="item.value" :value="item.value" :label="item.label" />
						</a-select>
					</a-form-item>
					<a-form-item field="quality" label="您认为交货日期对设备质量有多重要？" required>
						<a-radio-group v-if="tp == 'radio'" v-model="form.quality">
							<a-radio v-for="item of list" :key="item.value" :value="item.value">{{ item.label }}</a-radio>
						</a-radio-group>
						<a-select v-else v-model="form.quality" placeholder="请选择" :style="{ maxWidth: '600px' }">
							<a-option v-for="item of list" :key="item.value" :value="item.value" :label="item.label" />
						</a-select>
					</a-form-item>
					<a-form-item field="budgetQuality" label="您认为销售价格对设备质量有多重要？" required>
						<a-radio-group v-if="tp == 'radio'" v-model="form.budgetQuality">
							<a-radio v-for="item of list" :key="item.value" :value="item.value">{{ item.label }}</a-radio>
						</a-radio-group>
						<a-select v-else v-model="form.budgetQuality" placeholder="请选择" :style="{ maxWidth: '600px' }">
							<a-option v-for="item of list" :key="item.value" :value="item.value" :label="item.label" />
						</a-select>
					</a-form-item>
					<a-form-item>
						<a-button type="primary" @click="handleSubmit">确 认</a-button>
					</a-form-item>
				</a-form>
			</div>
		</a-card>
	</div>
</template>

<script lang="ts" setup>
import { getIndicator, setIndicator } from '@/api/elirsc/indicator';
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Form {
	budget: number;
	quality: number;
	budgetQuality: number;
}

const tp = ref('select');
const form = ref<Form>({} as Form);
const list = [
	{ label: '极端重要', value: 0.9 },
	{ label: '强烈重要', value: 0.8 },
	{ label: '明显重要', value: 0.7 },
	{ label: '稍微重要', value: 0.6 },
	{ label: '同样重要', value: 0.5 },
	{ label: '稍微不重要', value: 0.4 },
	{ label: '明显不重要', value: 0.3 },
	{ label: '强烈不重要', value: 0.2 },
	{ label: '极端不重要', value: 0.1 }
];

const handleSwitchType = () => {
	if (tp.value === 'radio') {
		tp.value = 'select';
	} else {
		tp.value = 'radio';
	}
};

// handleGet 处理查询
const handleGet = async () => {
	const { data } = await getIndicator();
	if (data.value) {
		form.value = JSON.parse(data.value);
	}
};

handleGet();

const handleSubmit = async () => {
	await setIndicator(JSON.stringify(form.value));
	Message.success('提交成功');
	router.push({ path: '/elirsc/universe/designing' });
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

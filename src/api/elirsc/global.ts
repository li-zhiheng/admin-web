export const links = [
	{ label: '研发设计', value: 'research' },
	{ label: '生产制造', value: 'production' },
	{ label: '配套供应', value: 'device' },
	{ label: '运维服务', value: 'devops' }
];

export const getLinkName = (key: string) => {
	let value = '';
	links.forEach((item) => {
		if (key === item.value) {
			value = item.label;
		}
	});
	return value;
};
export default null;

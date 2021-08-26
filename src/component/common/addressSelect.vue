<template>
	<div class="address_select">
		<!-- <el-cascader
			ref="addressSelect"
			v-if="cascaderShow"
			v-model="codeValue"
			:props="props"
			@change="handleChange"
			style="width: 100%"
			clearable
		></el-cascader> -->
		<el-row type="flex" ref="address-selector-group">
			<el-select
				ref="address-selector"
				v-model="chooseData.provinceCode"
				placeholder="请选择省份"
				:disabled="disabled"
				@change="chooseProvince"
				:class="[isStyle ? 'marginright' : '']"
				:size="size"
			>
				<el-option v-for="(item, index) in provinces" :key="index" :label="item" :value="index"></el-option>
			</el-select>
			<el-select
				:disabled="disabled"
				ref="address-selector"
				v-model="chooseData.cityCode"
				placeholder="请选择市"
				@change="chooseCity"
				:class="[isStyle ? 'marginright' : '']"
				:size="size"
			>
				<el-option v-for="(item, index) in citys" :key="index" :label="item" :value="index"></el-option>
			</el-select>
			<el-select
				:disabled="disabled"
				ref="address-selector"
				v-model="chooseData.areaCode"
				placeholder="请选择区"
				@change="chooseArea"
				:class="[isStyle ? 'marginright' : '']"
				:size="size"
			>
				<el-option v-for="(item, index) in areas" :key="index" :label="item" :value="index"></el-option>
			</el-select>
			<el-select
				:disabled="disabled"
				ref="address-selector"
				v-model="chooseData.streetCode"
				placeholder="请选择街道"
				@change="chooseStreet"
				:class="[isStyle ? 'marginright' : '']"
				:size="size"
				v-if="isStreetCode"
			>
				<el-option v-for="(item, index) in streets" :key="index" :label="item" :value="index"></el-option>
			</el-select>
		</el-row>
		<div class="valid-tips" v-if="needValid && showTips">请选择{{ pcaName }}</div>
	</div>
</template>
<script>
// import {changeJSONToCity} from 'util/changeCity'
// let defaultDataSwitch = true;
export default {
	name: 'addressSelect',
	props: {
		defalutData: {
			default: () => {
				return [];
			},
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		city: {
			// 传入的自定义json, 多级, json数据格式参考默认的json
			type: Array,
			default: () => [],
		},
		needValid: {
			type: Boolean,
			default: false,
		},
		isStyle: {
			type: Boolean,
			default: false,
		},
		isStreetCode: {
			type: Boolean,
			default: true,
		},
		size: {
			type: String,
			default: 'medium',
			// medium / small / mini
		},
	},
	data() {
		return {
			codeValue: [],
			options: [],
			props: {
				lazy: true,
				lazyLoad: this.lazyLoad,
			},
			cascaderShow: true,
			provinces: [],
			citys: [],
			areas: [],
			streets: [],
			chooseData: {
				provinceCode: '',
				cityCode: '',
				areaCode: '',
				streetCode: '',
			},
		};
	},
	watch: {
		defalutData: {
			handler(v) {
				this.setDefalutData(v);
			},
		},
		'chooseData.provinceCode'(val) {
			this.loadCitys(val);
		},
		'chooseData.cityCode'(val) {
			this.loadAreas(val);
		},
		'chooseData.areaCode'(val) {
			this.loadStreets(val);
		},
	},
	computed: {
		pcaName() {
			const { provinceCode, cityCode, areaCode } = this.chooseData;
			return (!provinceCode && '省份') || (!cityCode && '市') || (!areaCode && '区');
		},
		showTips() {
			const { provinceCode, cityCode, areaCode } = this.chooseData;
			if (!provinceCode || !cityCode || !areaCode) {
				return true;
			} else {
				return false;
			}
		},
	},
	mounted() {
		//获取城市数据
		// this.options = changeJSONToCity(this.city);
		// this.setDefalutData(this.defalutData);
		this.loadProvinces();
	},
	methods: {
		// 懒加载
		lazyLoad(node, resolve) {
			const { level } = node;
			if (level == 0) {
				this.loadProvinces().then(() => {
					resolve(this.provinces);
				});
			} else if (level == 1) {
				const id = node.data.value;
				this.loadCitys(id).then(() => {
					resolve(this.citys);
				});
			} else if (level == 2) {
				const id = node.data.value;
				this.loadAreas(id).then(() => {
					resolve(this.areas);
				});
			} else if (level == 3) {
				const id = node.data.value;
				this.loadStreets(id).then(() => {
					resolve(this.streets);
				});
			}
		},
		setDefalutData(v) {
			// this.codeValue = (v || []).map((item) => item);
			// this.cascaderShow = false;
			// const timer = setTimeout(() => {
			// 	this.cascaderShow = true;
			// 	clearTimeout(timer);
			// }, 100);
			const [provinceCode, cityCode, areaCode, streetCode] = v;
			this.chooseData = { ...this.chooseData, provinceCode, cityCode, areaCode, streetCode };
		},
		handleChange() {
			const nodes = this.$refs.addressSelect.getCheckedNodes();
			const data = nodes && nodes.length > 0 && nodes[0].pathNodes.map(item => item.data);
			this.$emit('chooseAddress', data);
		},
		validTipsFn() {},
		chooseProvince() {
			this.getSetChooseData();
			this.chooseData = { ...this.chooseData, cityCode: '', areaCode: '', streetCode: '' };
		},
		chooseCity() {
			this.getSetChooseData();
			this.chooseData = { ...this.chooseData, areaCode: '', streetCode: '' };
		},
		chooseArea() {
			this.getSetChooseData();
			this.chooseData = { ...this.chooseData, streetCode: '' };
		},
		chooseStreet() {
			this.getSetChooseData();
		},
		// 获取选中的值
		getSetChooseData() {
			this.$nextTick(() => {
				const data = this.$refs['address-selector-group'].$children.map(({ selectedLabel, value }) => ({
					label: selectedLabel,
					value,
				}));
				this.$emit('chooseAddress', data);
			});
		},
		// 获取省
		async loadProvinces() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.code === 200) {
				const data = {};
				res.data.map(({ provinceName, provinceCode }) => {
					data[provinceCode] = provinceName;
				});
				this.provinces = data;
			} else {
				this.$message.warning('获取省份信息失败');
			}
		},
		// 获取市
		async loadCitys(provinceCode) {
			const res = await this.$fetch(`/mgmt/sys/listCityAndDistrict?provinceCode=${provinceCode}`);
			if (res && res.code === 200) {
				const data = {};
				res.data.map(({ cityName, cityCode }) => {
					data[cityCode] = cityName;
				});
				this.citys = data;
			} else {
				this.$message.warning('获取市信息失败');
			}
		},
		// 获取区
		async loadAreas(cityCode) {
			const res = await this.$fetch(`/mgmt/sys/getRegionListByCity?cityCode=${cityCode}`);
			if (res && res.code === 200) {
				const data = {};
				res.data.map(({ districtName, districtCode }) => {
					data[districtCode] = districtName;
				});
				this.areas = data;
			} else {
				this.$message.warning('获取区信息失败');
			}
		},
		// 获取街道
		async loadStreets(districtCode) {
			const res = await this.$fetch(`/mgmt/sys/getStreetListByDistrictCode?districtCode=${districtCode}`);
			if (res && res.code === 200) {
				const data = {};
				res.data.map(({ streetName, streetCode }) => {
					data[streetCode] = streetName;
				});
				this.streets = data;
			} else {
				this.$message.warning('获取街道信息失败');
			}
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep.el-select {
	flex: 1;
}
.adress_select {
	.adress_input {
		border-color: #eee;
		height: 40px;
	}
}
.valid-tips {
	position: absolute;
	bottom: -28px;
	color: $error;
}

.marginright {
	margin-right: 20px;
}
</style>
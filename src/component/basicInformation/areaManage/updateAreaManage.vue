<template>
	<div class="update-areamanage">
		<guideBar />
		<el-card class="box-card">
			<el-form
				:inline="true"
				ref="ruleForm"
				:rules="REGION_RULES"
				class="form--label-left"
				:model="detail"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<!-- 省份 -->
				<div class="min-width">
					<el-form-item label="省份" prop="provinceCode">
						<el-select
							placeholder="请选择省份"
							v-model="detail.provinceCode"
							@change="getCityList(detail.provinceCode)"
							size="medium"
							:disabled="!isAddData"
						>
							<el-option
								v-for="item in provinceList"
								:key="item.provinceCode"
								:label="item.provinceName"
								:value="item.provinceCode"
							></el-option>
						</el-select>
					</el-form-item>
				</div>
				<!-- 城市 -->
				<div class="min-width">
					<el-form-item label="城市" prop="cityCode">
						<el-select
							placeholder="请选择城市"
							v-model="detail.cityCode"
							@change="cityClick(detail.cityCode)"
							size="medium"
							:disabled="!isAddData"
						>
							<el-option
								v-for="item in cityList"
								:key="item.cityCode"
								:label="item.cityName"
								:value="item.cityCode"
							></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="min-width">
					<el-form-item label="城市名称" prop="cityName" class="mr-0">
						<el-input
							placeholder="请输入城市名称"
							v-model="detail.cityName"
							@change="editChange('district')"
							size="medium"
							:disabled="!isAddData || isAdd"
						/>
					</el-form-item>
					<el-form-item label="城市编码" prop="newCityCode" class="pr-100">
						<el-input
							placeholder="请输入城市编码"
							v-model="detail.newCityCode"
							size="medium"
							maxlength="2"
							show-word-limit
							:disabled="!isAddData || isAdd"
							@change="regionCodeChange"
						/>
					</el-form-item>
				</div>
				<!--区/县  -->
				<div class="min-width">
					<el-form-item label="区/县" prop="districtCode" class="mr-0">
						<el-select placeholder="请选择区/县" v-model="detail.districtCode" @change="districtClick" size="medium">
							<el-option
								v-for="item in districtList"
								:key="item.districtCode"
								:label="item.districtName"
								:value="item.districtCode"
							></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="min-width">
					<el-form-item label="区/县名称" prop="districtName" class="mr-0">
						<el-input
							placeholder="请输入区/县名称"
							v-model="detail.districtName"
							@change="editChange('district')"
							size="medium"
						/>
					</el-form-item>
					<!-- 区/县编码 -->
					<el-form-item label="区/县编码" prop="newDistrictCode" class="pr-100">
						<el-input
							placeholder="新增请输入2位数字"
							v-model="detail.newDistrictCode"
							@change="regionCodeChange"
							size="medium"
							maxlength="2"
							show-word-limit
						/>
					</el-form-item>
					<div class="tip-title1 pl-60" v-if="districtTip">
						提醒：已经修改该区/县的名称为{{ detail.districtName }}，将会影响所有该区下辖的乡镇街道
					</div>
				</div>
				<!-- 街乡镇 -->
				<div class="min-width">
					<el-form-item label="街乡镇" class="mr-0">
						<el-select placeholder="请选择街乡镇" v-model="detail.streetCode" @change="getStreetCode" size="medium">
							<el-option
								v-for="item in streetList"
								:key="item.streetCode"
								:label="item.streetName"
								:value="item.streetCode"
							></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="min-width">
					<el-form-item label="街乡镇名称" class="mb-0 mr-0">
						<el-input
							placeholder="请输入街乡镇名称"
							v-model="detail.streetName"
							@change="editChange('street')"
							size="medium"
						/>
					</el-form-item>
					<!-- 街乡镇编码 -->
					<el-form-item label="街乡镇编码" class="pr-100 mb-0">
						<el-input
							placeholder="新增请输入3位数字"
							v-model="detail.newStreetCode"
							@change="regionCodeChange"
							size="medium"
							maxlength="3"
							show-word-limit
						/>
					</el-form-item>
					<div class="tip-title2 pl-60" v-if="streetTip">提醒：已经修改该街乡镇的名称为{{ detail.streetName }}</div>
				</div>
				<!-- 地区编码 -->
				<div class="min-width">
					<el-form-item label="地区编码">
						<el-input placeholder="地区编码" disabled v-model="detail.region" size="medium" class="total-code" />
					</el-form-item>
				</div>
				<div class="tip">
					提示：该编码由省、市、区/县、街/乡/镇的编码组成，省2位数，市2位数，区/县2位数，街乡镇3位数；例：北京市朝阳区亚运村街道的地区编码为：110105009
				</div>
			</el-form>
			<actionBar>
				<template>
					<el-button type="primary" plain @click="handleSave">保存</el-button>
					<el-button type="primary" plain @click="handleCancel('ruleForm')">取消</el-button>
				</template>
			</actionBar>
		</el-card>
	</div>
</template>
<script>
import { REGION_RULES } from './config';
export default {
	name: 'updateAreaManage',
	data() {
		return {
			REGION_RULES,
			detail: {
				cityCode: '',
				cityId: '',
				cityName: '',
				districtCode: '',
				districtId: '',
				districtName: '',
				provinceCode: '',
				streetCode: '',
				streetId: '',
				streetName: '',
				newDistrictCode: '',
				newStreetCode: '',
				newCityCode: null,
			},
			editDistrict: true, // 区/县修改
			editStreet: true, // 街乡镇修改
			districtTip: false, // 区/县提示
			streetTip: false, // 街乡镇提示
			provinceList: [], // 省数据
			cityList: [], // 市数据
			districtList: [], // 区/县数据
			streetList: [
				{
					streetCode: 1,
					streetName: '新增',
				},
			], // 街乡镇数据
			ruleForm: {}, // 页面表单对象
			isAddData: true, // 新增or编辑页面
			isAdd: false, // 新增or编辑页面
		};
	},
	watch: {
		'detail.newCityCode'(val) {
			let { newDistrictCode, newStreetCode, provinceCode } = this.detail;
			if (val.length == 2 && newDistrictCode.length == 2) {
				this.detail.region = `${provinceCode.substring(0, 2)}${val}${newDistrictCode}${newStreetCode || '000'}000`;
			}
		},
		'detail.newDistrictCode'(val) {
			let { newCityCode, newStreetCode, provinceCode } = this.detail;
			if (val.length == 2 && newCityCode.length == 2) {
				this.detail.region = `${provinceCode.substring(0, 2)}${newCityCode}${val}${newStreetCode || '000'}000`;
			}
		},
		'detail.newStreetCode'(val) {
			let { newCityCode, newDistrictCode, provinceCode } = this.detail;
			if (newCityCode.length == 2 && newDistrictCode.length == 2) {
				this.detail.region = `${provinceCode.substring(0, 2)}${newCityCode}${newDistrictCode}${val || '000'}000`;
			}
		},
	},
	methods: {
		cityClick(cityCode) {
			this.restData(2);
			this.citySelect(cityCode);
			this.getRegionListByCity(cityCode);
		},
		districtClick(districtCode) {
			this.restData();
			this.districtSelect(districtCode);
			this.getStreetListByDistrictCode(districtCode);
		},
		// 新增自定义地区编码
		regionCodeChange() {},
		// 区/县名称/街乡镇名称修改提示
		editChange(region) {
			if (!this.isAddData) {
				// 区/县
				if (region == 'district') {
					this.districtTip = true;
				} else {
					this.streetTip = true;
				}
			}
		},
		// 提交
		handleSave() {
			// let { state } = this.$route.query;
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					let { cityId, cityName, newDistrictCode, districtId, newStreetCode } = this.detail;
					let { districtName, provinceCode, streetId, streetName, newCityCode } = this.detail;
					if (!/^[0-9]*$/.test(newStreetCode)) return this.$message.warning('乡镇编码只支持输入数字');
					let streetDTO = null;
					if (newStreetCode || streetName) {
						streetDTO = {
							streetCode: newStreetCode
								? provinceCode.substring(0, 2) + newCityCode + newDistrictCode + newStreetCode + '000'
								: null,
							streetId: streetId || null,
							streetName: streetName || null,
						};
					} else {
						streetDTO = null;
					}
					const params = {
						cityId: cityId || null,
						cityCode: provinceCode.substring(0, 2) + newCityCode + '00000000',
						cityName: cityName,
						districtDTO: {
							districtCode: newDistrictCode
								? provinceCode.substring(0, 2) + newCityCode + newDistrictCode + '000000'
								: null,
							districtId: districtId || null,
							districtName: districtName,
						},
						provinceCode: provinceCode,
						streetDTO: streetDTO,
					};
					this.saveRegion(params);
				} else {
					this.$message({
						type: 'warning',
						message: '请把信息填写完整',
					});
					return false;
				}
			});
		},
		// 取消
		handleCancel(formName) {
			this.$refs[formName].resetFields();
			this.$closeSelf();
		},
		restData(type) {
			if (type == 1) {
				this.detail.cityName = '';
				this.detail.newCityCode = '';
				this.detail.cityCode = '';
				this.cityList = [];
				this.detail.districtName = '';
				this.detail.newDistrictCode = '';
				this.detail.districtCode = '';
				this.districtList = [];
			} else if (type == 2) {
				this.detail.districtName = '';
				this.detail.newDistrictCode = '';
				this.detail.districtCode = '';
				this.districtList = [];
			}
			this.detail.streetName = '';
			this.detail.streetCode = '';
			this.detail.newStreetCode = '';
			this.streetList = [];
		},
		// 获取省份信息
		async getProvinceList() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.data) {
				this.provinceList = res.data;
			}
		},
		// 根据省份编码获取下属城市
		async getCityList(provinceCode) {
			this.isAdd = false;
			if (this.isAddData) this.restData(1);
			const res = await this.$fetch(`/mgmt/sys/getCityList?provinceCode=${provinceCode}`);
			if (res && res.data) {
				this.cityList = res.data;
				this.cityList.unshift({ ...res.data[0], cityCode: '0', cityName: '新增' });
			}
		},
		citySelect(cityCode) {
			let code = cityCode ? cityCode : this.detail.cityCode;
			let obj = this.cityList.filter(e => e.cityCode === code)[0];
			this.detail.cityName = 1 * obj.cityCode ? obj.cityName : null;
			this.detail.cityId = 1 * obj.cityCode ? obj.cityId : null;
			this.detail.newCityCode = obj.cityCode.length > 3 ? obj.cityCode.substring(2, 4) : '';
			this.isAdd = !!Number(obj.cityCode);
		},
		// 根据城市编码获取下属地区
		async getRegionListByCity(cityCode) {
			const res = await this.$fetch(`/mgmt/sys/getRegionListByCity?cityCode=${cityCode}`);
			if (res && res.data) {
				this.districtList = res.data;
				this.districtList.unshift({ ...res.data[0], districtCode: '0', districtName: '新增' });
			}
		},
		districtSelect(districtCode) {
			let code = districtCode ? districtCode : this.detail.districtCode;
			let obj = this.districtList.filter(e => e.districtCode === code)[0];
			this.detail.districtName = 1 * obj.districtCode ? obj.districtName : null;
			this.detail.districtId = 1 * obj.districtCode ? obj.districtId : null;
			this.detail.newDistrictCode = obj.districtCode.length > 3 ? obj.districtCode.substring(4, 6) : '';
		},
		// 获取下属街道
		async getStreetListByDistrictCode(districtCode) {
			const res = await this.$fetch(`/mgmt/sys/getStreetListByDistrictCode?districtCode=${districtCode}`);
			if (res && res.data) {
				this.streetList = res.data;
				this.streetList.unshift({ ...res.data[0], streetCode: '0', streetName: '新增' });
			}
		},
		getStreetCode(val) {
			let code = val ? val : this.detail.streetCode;
			let obj = this.streetList.filter(e => e.streetCode === code)[0];
			this.detail.streetName = 1 * obj.streetCode ? obj.streetName : null;
			this.detail.streetId = 1 * obj.streetCode ? obj.streetId : null;
			this.detail.newStreetCode = obj.streetCode.length > 3 ? obj.streetCode.substring(6, 9) : '';
			let { newCityCode, provinceCode, newDistrictCode, newStreetCode } = this.detail;
			if (newDistrictCode.length == 2 && newCityCode.length == 2 && newStreetCode.length == 3) {
				this.detail.region = provinceCode.substring(0, 2) + newCityCode + newDistrictCode + newStreetCode + '000';
			}
		},
		// 新增或修改
		async saveRegion(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/saveRegion',
				data: params,
			});
			if (res && res.code === 200) {
				this.$dispatch('UPDATE_AREA_LIST');
				this.$closeSelf();
			}
		},
	},
	created() {
		// 获取省份信息
		this.getProvinceList();
		let data = (this.$route.query.data && JSON.parse(this.$route.query.data)) || '';
		if (data) {
			let { districtCode, streetCode, cityCode, provinceCode } = data;
			this.isAddData = false;
			this.detail = Object.assign(this.detail, data);
			this.detail.newCityCode = cityCode.length > 3 ? cityCode.substring(2, 4) : '';
			this.detail.newDistrictCode = districtCode.length > 3 ? districtCode.substring(4, 6) : '';
			this.detail.newStreetCode = streetCode && streetCode.length > 3 ? streetCode.substring(6, 9) : '';
			let { newCityCode, newDistrictCode, newStreetCode } = this.detail;
			this.detail.region =
				provinceCode.substring(0, 2) +
				(newCityCode ? cityCode.substring(2, 4) : '00') +
				(newDistrictCode ? districtCode.substring(4, 6) : '00') +
				(newStreetCode ? streetCode.substring(6, 9) : '000') +
				'000';
			this.editDistrict = false;
			this.editStreet = false;
			this.getProvinceList();
			this.getCityList(data.provinceCode);
			this.getRegionListByCity(data.cityCode);
			this.getStreetListByDistrictCode(data.districtCode);
		} else {
			this.isAddData = true;
		}
	},
};
</script>

<style lang="scss" scoped>
.update-areamanage {
	.box-card {
		margin: 24px 0;
	}
	.el-form-item {
		// width: 100%;
		margin-bottom: 10px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.tr {
		background-color: rgb(239, 240, 242);
		margin-right: 0;
	}
	::v-deep.el-dialog {
		min-width: 400px;
	}
}
::v-deep.add-rate {
	.el-form-item {
		margin-bottom: 25px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.flex {
		display: flex;
		justify-content: center;
	}
}

.dialog-footer {
	display: flex;
	justify-content: center;
}
.min-width {
	min-width: 1124px;
	margin-bottom: 36px;
}
.ml-16 {
	margin-left: 16px;
}
.mr-16 {
	margin-right: 16px;
}
.mt-36 {
	margin-top: 36px;
}
.pr-100 {
	padding-right: 100px;
}
.pl-60 {
	padding-left: 60px;
}
.mb-0 {
	margin-bottom: 0px !important;
}
.mr-0 {
	margin-right: 0px;
}
.total-code {
	width: 464px !important;
}
.tip {
	color: #ff6600;
	padding-left: 60px;
	margin-bottom: 16px;
}
.tip-title1 {
	color: #ff3b37;
	// margin-top: 16px;
}
.tip-title2 {
	color: #ff3b37;
	margin: 16px 0;
}
</style>

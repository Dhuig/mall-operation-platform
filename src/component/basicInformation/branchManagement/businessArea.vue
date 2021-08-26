<template>
	<div class="buseness-area">
		<!-- <guideBar /> -->
		<el-card class="box-card">
			<div>
				<el-button v-if="!allDisabled" type="primary" @click="addProvinces">添加省份</el-button>
			</div>
			<div>
				<el-tabs>
					<el-tab-pane v-for="(item, index) in data" :key="index" :label="format(item, index)" class="fade">
						<div class="table-header">
							<div>
								<el-checkbox
									class="check-box"
									@change="handleCheckAllChange(item, $event)"
									v-model="item.check"
									:indeterminate="item.indeterminate"
									:disabled="item.disabled || allDisabled"
								/>
							</div>
							<div class="city">城市</div>
							<div class="region">地区</div>
						</div>
						<div class="table-content" v-for="(child, idx) in item.childrenList" :key="idx">
							<div>
								<el-checkbox
									class="check-box"
									v-model="child.check"
									@change="handleCheckAllCity(child, item, $event)"
									:disabled="child.disabled || allDisabled"
								/>
							</div>
							<div class="city">{{ child.name }}</div>
							<div class="region">
								<div v-for="(cd, i) in child.childrenList" :key="i" class="mr-16">
									<el-checkbox
										:label="cd.name"
										v-model="cd.check"
										@change="handleCheckEvery(child)"
										:disabled="cd.disabled || allDisabled"
									/>
								</div>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-card>
		<!-- <div class="eidt-btn-footer">
			<div class="eidt-btn-footer-box">
				<el-button type="primary" plain @click="handleSaveSelectArea">保存</el-button>
				<el-button type="primary" plain @click="handleCancelSelectArea">返回</el-button>
			</div>
		</div> -->
		<!-- 添加省份弹窗 -->
		<el-dialog title="添加省份" :visible.sync="showProvincesMoudel" width="30%" v-drag>
			<el-form :model="ruleForm" ref="ruleForm" label-width="110px" label-position="right" label-suffix=":">
				<el-form-item label="请选择" prop="provice">
					<el-select v-model="ruleForm.provice" multiple placeholder="请选择" size="medium" :multiple-limit="3">
						<el-option
							v-for="item in options"
							:key="item.provinceCode"
							:label="item.provinceName"
							:value="item.provinceCode"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('ruleForm')" class="save">确定</el-button>
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'businessArea',
	data() {
		return {
			showProvincesMoudel: false,
			isAddData: true,
			id: '',
			options: [],
			ruleForm: {
				provice: [],
			},
			data: [],
			selfCodes: [], // 勾选的地区
			othersCodes: [], // 禁用的地区
			regionCodes: [], // 地区编码
			proviceArray: [], // 详情地区部分展示数据
			allDisabled: false,
		};
	},
	props: {
		areaSelectProp: {
			type: Object,
			deep: true,
			immediate: true,
		},
	},
	watch: {
		areaSelectProp(newAreaSelectProp) {
			const { isAddData, id, codeArr = '[]', proviceArr = '[]' } = newAreaSelectProp;
			this.isAddData = isAddData;
			this.id = id || '';

			this.getAllCity(codeArr);
			// 添加省份弹窗回显
			this.ruleForm.provice = JSON.parse(codeArr);
			const params = {
				companyId: this.id,
				provinceCodes: this.ruleForm.provice,
			};
			this.getChoiceDistricts(params);
			// 处理
			this.proviceArray = JSON.parse(proviceArr);
			this.allDisabled = newAreaSelectProp.allDisabled;
		},
	},
	created() {
		this.getProvincesData();
	},
	methods: {
		async getProvincesData() {
			const res = await this.$fetch('/mgmt/sys/getProvinceList');
			if (res && res.code === 200) {
				this.options = res.data;
			}
		},
		// 添加省份
		addProvinces() {
			this.showProvincesMoudel = true;
		},
		// 确定弹窗按钮
		save(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const arr = JSON.stringify(this.ruleForm.provice);
					this.getAllCity(arr);
					this.showProvincesMoudel = false;
					// 调接口对应省份已被其他公司选择的地区
					const params = {
						companyId: this.id,
						provinceCodes: this.ruleForm.provice,
					};
					this.getChoiceDistricts(params);
				}
			});
		},
		// 取消弹窗
		cacel(formName) {
			this.showProvincesMoudel = false;
			this.$refs[formName].resetFields();
			const arr = JSON.stringify(this.ruleForm.provice);
			this.getAllCity(arr);
		},
		// 此省份已被其他公司选择的地区接口
		async getChoiceDistricts(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/getChoiceDistricts',
				data: params,
			});
			if (res && res.code === 200) {
				const { selfCodes, othersCodes } = res.data;
				this.selfCodes = selfCodes || []; // 勾选的
				this.othersCodes = othersCodes || []; // 禁用的
				// 绑定勾选和禁用状态
				!this.ruleForm.provice.length > 0 || this.disabledData();
			}
		},
		//
		async disabledData() {
			const res = await this.$fetch('/mgmt/sys/listProvinceDetails?provinceCodes=' + this.ruleForm.provice.join(','));
			if (res && res.code === 200) {
				this.data = res.data.map(item => {
					return {
						// ...item,
						name: item.provinceName,
						code: item.provinceCode,
						disabled: this.isContain(item.provinceCode, this.othersCodes),
						check: this.isContain(item.provinceCode, this.selfCodes),
						childrenList:
							item.cityList &&
							item.cityList.length > 0 &&
							item.cityList.map(a => {
								return {
									// ...a,
									name: a.cityName,
									code: a.cityCode,
									disabled: this.isContain(a.cityCode, this.othersCodes),
									check: this.isContain(a.cityCode, this.selfCodes),
									childrenList:
										a.districtList &&
										a.districtList.length > 0 &&
										a.districtList.map(b => {
											return {
												// ...b,
												name: b.districtName,
												code: b.districtCode,
												disabled: this.isContain(b.districtCode, this.othersCodes),
												check: this.isContain(b.districtCode, this.selfCodes),
												childrenList: b.childrenList || [],
											};
										}),
								};
							}),
					};
				});
				this.data.forEach(item => {
					if (item.childrenList && item.childrenList.length > 0) {
						item.check = item.childrenList.length == item.childrenList.filter(e => e.check).length;
						item.childrenList.forEach(a => {
							a.check = a.childrenList.length == a.childrenList.filter(e => e.check).length;
							a.childrenList &&
								a.childrenList.some(child => child.disabled === true) &&
								((a.disabled = true), (item.disabled = true));
						});
					}
				});
			}
		},
		//bindCheck
		async bindCheck() {
			// return arr;
		},
		// 是否存在
		isContain(code, arr) {
			return arr.indexOf(code) >= 0;
		},
		// tab头部内容格式化
		format(val) {
			// let arr = [];
			// this.proviceArray.forEach(item=>{
			// 	if(item.provinceCode===val.code) {
			// 		arr.push(item.regionNo);
			// 	}
			// })
			// return `${val.name} (${arr[index]||0})`;
			return `${val.name}`;
		},
		/**
		 * 数组的扁平化处理
		 * @param {Array} list
		 */
		getFormData(list) {
			let queen = [...list];
			let result = [];
			queen.forEach(e => {
				result.push(e);
				if (e.childrenList.length > 0) {
					e.childrenList.forEach(el => {
						result.push(el);
						if (el.childrenList.length > 0) {
							el.childrenList.forEach(a => {
								result.push(a);
							});
						}
					});
				}
			});
			// let queen = [...list];
			// let result = [];
			// while (queen.length) {
			// 	let first = queen.shift();
			// 	if (first.childrenList && first.childrenList.length > 0 && first.l < 3) {
			// 		queen = queen.concat(first.childrenList);
			// 	}
			// 	result.push(first);
			// }
			return result;
		},
		// 保存
		handleSaveSelectArea() {
			const checkArray = this.getFormData(this.data).filter(i => i.check);
			let permissionArray = checkArray.map(v => v.code);
			this.regionCodes = permissionArray;

			const obj = {
				regionCodes: this.regionCodes,
			};
			this.$dispatch('SAVE_REGION_CODES', obj);
		},
		// 取消
		handleCancelSelectArea() {
			this.$closeSelf();
		},
		// 全选
		handleCheckAllChange(val, check) {
			// 有下级去处理下级
			if (val.childrenList && val.childrenList.length > 0) {
				// 递归设置子级选中状态
				this.findChildren(val.childrenList, check);
			} else {
				// 无下级处理本级
			}
			// 设置全选的未全部选中的状态
			val.indeterminate = false;
			this.handleSaveSelectArea();
		},
		// 递归查询子集
		findChildren(list, check) {
			list.forEach(children => {
				children.check = check;
				if (children.childrenList && children.childrenList.length > 0) {
					this.findChildren(children.childrenList, check);
				}
			});
		},
		// 勾选城市
		handleCheckAllCity(val, fatherObj, check) {
			this.handleCheckAllChange(val, check);
			// 处理上级状态
			let checkLength = 0;
			fatherObj.childrenList.forEach(item => {
				if (item.check) {
					checkLength++;
				} else {
					checkLength--;
				}
			});
			fatherObj.check = fatherObj.childrenList.length === checkLength;
			this.isControl();
			this.handleSaveSelectArea();
		},
		// 每个地区
		handleCheckEvery(fatherObj) {
			// 控制上级状态
			let checkLength = 0;
			fatherObj.childrenList.forEach(item => {
				if (item.check) {
					checkLength++;
				} else {
					checkLength--;
				}
			});
			fatherObj.check = fatherObj.childrenList.length === checkLength;
			this.isControl();
			this.handleSaveSelectArea();
		},
		// 是否控制顶级
		isControl() {
			this.data.map(item => {
				if (item.childrenList.length && item.childrenList.every(child => child.check === true)) {
					item.check = true;
					item.indeterminate = false;
				} else if (item.childrenList.length && item.childrenList.some(child => child.check === true)) {
					item.check = false;
					item.indeterminate = true;
				} else {
					item.check = false;
					item.indeterminate = false;
				}
			});
		},
		// 是否存在
		isIndexOf(v, arr) {
			return arr.findIndex(item => item === v) >= 0;
		},
		// 通过code获取城市数据
		getAllCity(codeArr) {
			let arr = JSON.parse(codeArr);
			let list = this.options.filter(item => this.isIndexOf(item.c, arr));
			this.$nextTick(() => {
				this.data = this.formatList(list);
			});
		},
		// 格式化city数据
		formatList(list) {
			return list.map(item => {
				return {
					...item,
					name: item.n,
					code: item.c,
					check: false,
					childrenList:
						item.r &&
						item.r.length > 0 &&
						item.r.map(a => {
							return {
								...a,
								name: a.n,
								code: a.c,
								check: false,
								childrenList:
									a.r &&
									a.r.length > 0 &&
									a.r.map(b => {
										return {
											...b,
											name: b.n,
											code: b.c,
											check: false,
											childrenList: b.r,
										};
									}),
							};
						}),
				};
			});
			// list.forEach(item=>{
			// 	item.name = item.n;
			// 	item.code = item.c;
			// 	item.check = false;
			// 	item.childrenList = item.r;
			// 	if(item.r&&item.r.length>0) {
			// 		this.formatList(item.r)
			// 	}
			// })
			// return list
		},
	},
};
</script>
<style lang="scss" scoped>
.buseness-area {
	.box-card {
		margin: 24px 0;
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
	.add-content {
		display: flex;
		justify-content: center;
		align-items: center;
		.add-label {
			margin-right: 10px;
		}
	}
	.table-header {
		width: 100%;
		height: 48px;
		border: 1px solid #eee;
		background: #eee;
		display: flex;
		align-items: center;
		line-height: 48px;
	}
	.table-content {
		width: 100%;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #eee;
		min-height: 48px;
		div {
			font-size: 14px;
		}
	}
	.check-box {
		width: 70px;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.city {
		width: 20%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		word-break: break-all;
	}
	.region {
		width: 80%;
		height: 100%;
		padding: 10px;
		overflow: hidden;
		div {
			float: left;
		}
	}
	.fade {
		animation: bounceInLeft 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
	}
	@keyframes bounceInLeft {
		0% {
			opacity: 0;
			transform: translate3d(-3000px, 0, 0);
		}
		60% {
			opacity: 1;
			transform: translate3d(25px, 0, 0);
		}
		75% {
			transform: translate3d(-10px, 0, 0);
		}
		90% {
			transform: translate3d(5px, 0, 0);
		}
		100% {
			transform: none;
		}
	}
	.eidt-btn-footer {
		z-index: 1;
		background: #fff;
		padding: 16px 38px;
		box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.2);
		position: fixed;
		bottom: 0;
		left: 264px;
		right: 0;
		.eidt-btn-footer-box {
			text-align: center;
			.el-button--default {
				background: rgba(255, 255, 255, 1);
				border-radius: 4px;
				border: 1px solid rgba(211, 217, 226, 1);
				color: #303336;
				font-size: 14px;
			}
			.el-button--primary {
				background: rgba(56, 131, 248, 1);
				border-radius: 2px;
				color: #fff;
				font-size: 14px;
			}
			button {
				padding: 9px 16px;
			}
		}
	}
	.mr-16 {
		margin-right: 16px;
	}
	.save {
		width: 100px;
		margin-right: 16px;
	}
	.cacel {
		width: 100px;
	}
}
</style>

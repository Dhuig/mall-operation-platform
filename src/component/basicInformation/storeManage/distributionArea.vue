<template>
	<div class="distribution-area">
		<guideBar />
		<el-card class="box-card">
			<div class="my">
				<!-- v-if="isShowBtn" -->
				<el-button type="primary" v-permission="'distribution_area_add_province'" @click="addProvinces">
					添加省份
				</el-button>
			</div>
			<div>
				<el-tabs v-model="activeName">
					<el-tab-pane v-for="item in data" :key="item.name" :name="item.name" :label="format(item)" class="fade">
						<div class="table-header">
							<div>
								<el-checkbox
									class="check-box"
									@change="handleCheckAllChange(item, $event)"
									v-model="item.check"
									:disabled="item.disabled"
									:indeterminate="item.indeterminate"
								/>
							</div>
							<div class="city">市</div>
							<div class="region">区</div>
						</div>
						<div class="table-content" v-for="(child, idx) in item.childrenList" :key="idx">
							<div class="first-col">
								<el-checkbox
									class="check-box"
									v-model="child.check"
									:disabled="child.disabled"
									@change="handleCheckAllCity(child, item, $event)"
								/>
							</div>
							<div class="city">{{ child.name }}</div>
							<div class="region">
								<div v-for="(cd, i) in child.childrenList" :key="i" class="mr-16">
									<el-checkbox
										:label="cd.name"
										v-model="cd.check"
										@change="handleCheckEvery(child)"
										:disabled="cd.disabled"
									/>
								</div>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			<!-- 按钮 -->
			<div class="btn-footer">
				<el-button type="primary" v-permission="'distribution_area_add_save'" @click="onSubmit">保存选择</el-button>
				<!-- v-if="isShowBtn" -->
			</div>
		</el-card>
		<!-- 添加省份弹窗 -->
		<el-dialog title="添加省份" :visible.sync="showProvincesMoudel" width="520px" v-drag>
			<el-form
				class="add-rate"
				:model="ruleForm"
				ref="ruleForm"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="选择地区" prop="applyUser">
						<el-checkbox-group v-model="ruleForm.applyUser">
							<el-checkbox
								v-for="item in options"
								:key="item.regionCode"
								:checked="item.disabled"
								:label="item.regionCode"
							>
								<!-- :disabled="" -->
								{{ item.regionName }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('ruleForm')" class="save">确定</el-button>
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import cityList from 'config/city';
import qs from 'querystring';

export default {
	name: 'distributionArea',
	data() {
		return {
			activeName: '',
			provinceList: [], //省份
			bindCodeList: [], //待绑定
			untieCodeList: [], // 待解绑
			regionbind: [],
			regionuntieCode: [],
			provice: [],
			showProvincesMoudel: false,
			data: [],
			ruleForm: {
				applyUser: [], // 选择地区
			},
			isShowBtn: false, // 控制编辑页还是查看页
			options: cityList.map(({ c, n }) => ({ regionCode: c, regionName: n, disabled: false })), // 添加省份弹窗数据
			rowId: '', // 储存数据id
			selfSelectCodes: [], // 已经勾选的地区
			otherSelectCodes: [], // 其他仓库已使用的地区
		};
	},
	methods: {
		// 添加省份
		async addProvinces() {
			this.showProvincesMoudel = true;
			this.init();
		},
		// 绑定勾选地区
		bindCheck() {
			return [...this.options].map(item => {
				return {
					...item,
					disabled: this.isContain(item.c, this.otherSelectCodes),
				};
			});
		},
		// 是否存在
		isContain(code, arr) {
			return arr.indexOf(code) >= 0;
		},
		// 获取添加省份勾选接口
		async getProvinceInfo(params) {
			const res = await this.$fetch(`/mgmt/sys/getProvinceInfo?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				const { selfSelectCodes, otherSelectCodes } = res.data;
				this.selfSelectCodes = selfSelectCodes;
				this.otherSelectCodes = otherSelectCodes;
				this.ruleForm.applyUser = this.selfSelectCodes;
				this.options = this.bindCheck();
			}
		},
		// 确定弹窗按钮
		save(formName) {
			this.$refs[formName].validate(async valid => {
				let { id, businessRange } = this.$route.query;
				if (valid) {
					this.untieCodeList = [];
					this.bindCodeList.forEach(e => {
						if (this.ruleForm.applyUser.indexOf(e) == -1) {
							this.untieCodeList.push(e);
						}
					});
					this.bindCodeList = this.ruleForm.applyUser;
					const res = await this.$fetch({
						method: 'post',
						url: '/mgmt/sys/depot/province/save',
						data: { bindCodeList: this.bindCodeList, untieCodeList: this.untieCodeList, depotId: id, businessRange },
					});
					if (res && res.code === 200) {
						this.showProvincesMoudel = false;
						this.init();
						this.$message.success(res.message);
					}
				}
			});
		},
		getFormData(list) {
			let queen = [...list];
			let result = [];
			queen.forEach(e => {
				result.push(e);
				if (Array.isArray(e.childrenList) && e.childrenList.length > 0) {
					e.childrenList.forEach(el => {
						result.push(el);
						if (Array.isArray(el.childrenList) && el.childrenList.length > 0) {
							el.childrenList.forEach(a => {
								result.push(a);
							});
						}
					});
				}
			});
			return result;
		},
		// 取消弹窗
		cacel(formName) {
			this.showProvincesMoudel = false;
			this.$refs[formName].resetFields();
			// const arr = JSON.stringify(this.ruleForm.applyUser);
			// this.getAllCity(arr);
		},
		// tab头部内容格式化
		format(val) {
			return `${val.name}`;
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
		// 保存选择
		async onSubmit() {
			let { id, businessRange } = this.$route.query;
			let bindCodeList = this.getFormData(this.data)
				.filter(i => {
					return i.check;
				})
				.map(e => e.code);
			let untieCodeList = [];
			this.regionbind.forEach(e => {
				if (bindCodeList.indexOf(e) === -1) {
					untieCodeList.push(e);
				}
			});
			bindCodeList.forEach((e, i) => {
				if (this.provinceList.indexOf(e) != -1) {
					bindCodeList.splice(i, 1);
				}
			});
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/depot/region/save',
				data: { bindCodeList, depotId: id, untieCodeList, businessRange },
			});
			if (res && res.code === 200) {
				this.$dispatch('UP_LIST');
				this.$closeSelf();
				this.$message.success(res.message);
			}
		},
		// 新增仓库省份接口
		async addWarOfRegion(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/addWarOfRegion',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 是否存在
		isIndexOf(v, arr) {
			return arr.findIndex(item => item === v) >= 0;
		},
		// 通过code获取城市数据
		getAllCity(codeArr) {
			let arr = codeArr;
			let list = cityList.filter(item => this.isIndexOf(item.c, arr));
			this.data = this.formatList(list);
		},
		// 格式化city数据
		formatList(list) {
			list.forEach(item => {
				item.name = item.n;
				item.code = item.c;
				item.check = false;
				item.childrenList = item.r;
				item.indeterminate = false;
				if (item.r && item.r.length > 0) {
					this.formatList(item.r);
				}
			});
			return list;
		},
		async getTab(provinceCodes) {
			let { id, businessRange } = this.$route.query;
			let res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/sys/depot/region/list',
				params: { depotId: id, businessRange, provinceCodes: provinceCodes.map(e => e.regionCode).join(',') },
			});
			if (res && res.code == 200) {
				this.provinceList = [];
				this.data = res.data.map(item => {
					this.provinceList.push(item.provinceCode);
					return {
						name: item.provinceName,
						code: item.provinceCode,
						disabled: false,
						check: false,
						childrenList:
							item.cityList &&
							item.cityList.length > 0 &&
							item.cityList.map(a => {
								return {
									// ...a,
									name: a.regionName,
									code: a.regionCode,
									disabled: a.other,
									check: a.self,
									childrenList:
										a.childList &&
										a.childList.length > 0 &&
										a.childList.map(b => {
											return {
												// ...b,
												name: b.regionName,
												code: b.regionCode,
												disabled: b.other,
												check: b.self,
												childrenList: b.childrenList || [],
											};
										}),
								};
							}),
					};
				});
				this.tabsDataInit();
			}
		},
		// 初始化
		async init() {
			let { id, businessRange } = this.$route.query;
			let res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/sys/depot/province/list',
				params: { depotId: id, businessRange },
			});
			if (res && res.code == 200) {
				this.ruleForm.applyUser = res.data.map(({ regionCode }) => regionCode);
				this.bindCodeList = res.data.map(({ regionCode }) => regionCode);
				this.options.forEach(e => {
					this.ruleForm.applyUser.forEach(a => {
						if (e.regionCode == a.regionCode) {
							e.disabled = true;
						}
					});
				});
				if (res.data.length !== 0) {
					this.getTab(res.data);
				} else {
					this.data = [];
				}
			}
		},
		tabsDataInit() {
			this.regionbind = this.getFormData(this.data)
				.filter(i => i.check)
				.map(e => e.code);
			if (this.data.map(e => e.name).indexOf(this.activeName) == -1) {
				this.activeName = this.data.map(e => e.name)[this.data.map(e => e.name).length - 1];
			}
			if (this.activeName === '0') this.activeName = this.data.length > 0 ? this.data[0].name : '';
			this.data.forEach(item => {
				if (item.childrenList && item.childrenList.length > 0) {
					if (item.childrenList.length === item.childrenList.filter(e => e.check === true).length) {
						item.check = true;
					}
					if (item.childrenList.length === item.childrenList.filter(e => e.disabled === true).length) {
						item.disabled = true;
					}
					item.childrenList.forEach(el => {
						if (
							Array.isArray(el.childrenList) &&
							el.childrenList.length === el.childrenList.filter(e => e.check).length
						) {
							el.check = true;
						} else if (el.childrenList == null && el.check) {
							el.check = true;
						} else if (
							Array.isArray(el.childrenList) &&
							el.childrenList.length > item.childrenList.filter(e => e.check).length &&
							el.childrenList.filter(e => e.check).length > 0
						) {
							el.check = false;
						} else {
							el.check = false;
						}
					});
				}
			});
		},
	},
	created() {
		this.init();
	},
	watch: {},
};
</script>
<style lang="scss" scoped>
::v-deep.distribution-area {
	.box-card {
		margin: 24px 0;
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
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
		border-left: 1px solid #eee;
		border-right: 1px solid #eee;
		box-sizing: border-box;
		min-height: 48px;
		div {
			font-size: 14px;
		}
	}
	.first-col {
		height: 100%;
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
	.btn-footer {
		margin-top: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.add-rate {
		.el-checkbox {
			margin-right: 16px;
		}
		.flex {
			display: flex;
			justify-content: center;
		}
	}
	.el-dialog__body {
		max-height: 614px;
		overflow: auto;
	}
	/*滚动条样式*/
	.el-dialog__body::-webkit-scrollbar {
		width: 4px;
		/*height: 4px;*/
	}
	.el-dialog__body::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
	}
	.el-dialog__body::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 0;
		background: rgba(0, 0, 0, 0.1);
	}
	.save {
		width: 100px;
		margin-right: 16px;
	}
	.cacel {
		width: 100px;
	}
	.mr-16 {
		margin-right: 16px;
	}
	.my {
		text-align: right;
	}
}
</style>

<template>
	<div class="reason-manage">
		<guideBar>
			<el-button v-permission="'reason_manage_add_primary_reason'" type="primary" @click="addFirstReason">
				新增一级原因
			</el-button>
			<el-button v-permission="'reason_manage_add_secondary_reason'" type="primary" @click="addTwoReason">
				新增二级原因
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel :config="REASON_MANAGE_CONFIG" @search="searChgetList" @reset="init" v-model="searchConfig" />
			<div class="add-reason-box">
				<div class="tip">说明：一级原因商城顾客与服务中心可见；一、二级原因运营后台均可见</div>
			</div>
		</el-card>
		<!-- 表格部分 -->
		<div>
			<el-table
				:data="tableData"
				row-key="ids"
				border
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column prop="returnReason" label="原因"></el-table-column>
				<el-table-column label="操作" width="200px">
					<template slot-scope="scope">
						<el-button
							v-permission="'reason_manage_edit'"
							@click="handleEdit(scope.row)"
							v-if="scope.row.returnType"
							type="text"
							size="small"
						>
							编辑
						</el-button>
						<el-button
							type="text"
							size="small"
							v-if="scope.row.returnType"
							@click.native.prevent="deleteRow(scope.row)"
							v-permission="'reason_manage_delete'"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 新增原因/编辑一级原因 -->
		<el-dialog
			:title="isAddFirstReason ? '新增一级原因' : '编辑一级原因'"
			:visible.sync="showFirstReason"
			width="30%"
			v-drag
			:before-close="cacelFirstReason"
		>
			<el-form
				class="add-exchange"
				:model="ruleFormFirstReason"
				:rules="rulesFirstReason"
				ref="ruleFormFirstReason"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="退换货类型" prop="returnType">
						<el-select v-model="ruleFormFirstReason.returnType" :disabled="!isAddFirstReason">
							<el-option v-for="item in returnTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="一级原因" prop="returnReason">
						<el-input v-model="ruleFormFirstReason.returnReason" show-word-limit maxlength="40" />
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveFirstReason('ruleFormFirstReason')" class="save">保存</el-button>
				<el-button @click="cacelFirstReason('ruleFormFirstReason')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 新增原因/编辑二级原因 -->
		<el-dialog
			:title="isAddTwoReason ? '新增二级原因' : '编辑二级原因'"
			:visible.sync="showTwoReason"
			width="30%"
			v-drag
			:before-close="cacelTwoReason"
		>
			<el-form
				class="add-exchange"
				:model="ruleFormTwoReason"
				:rules="rulesTwoReason"
				ref="ruleFormTwoReason"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="退换货类型" prop="returnType">
						<el-select v-model="ruleFormTwoReason.returnType" @change="selectReturnType" :disabled="!isAddTwoReason">
							<el-option v-for="item in returnTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="一级原因" prop="parentReasonId">
						<el-select v-model="ruleFormTwoReason.parentReasonId" :disabled="!isAddTwoReason">
							<el-option v-for="item in firstReasonList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="二级原因" prop="returnReason">
						<el-input v-model="ruleFormTwoReason.returnReason" show-word-limit maxlength="100" />
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveTwoReason('ruleFormTwoReason')" class="save">保存</el-button>
				<el-button @click="cacelTwoReason('ruleFormTwoReason')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { REASON_MANAGE_CONFIG, RETURN_EXCHANGE_TYPE } from './config';
// , RETURN_EXCHANGE_TYPE

import qs from 'querystring';

export default {
	name: 'reasonManage',
	data() {
		var validatorReturnType = (rule, value, callback) => {
			if (value.trim() === '') {
				callback(new Error('请输入一级原因'));
			} else {
				callback();
			}
		};
		var validatorReturnReason = (rule, value, callback) => {
			if (value.trim() === '') {
				callback(new Error('请输入二级原因'));
			} else {
				callback();
			}
		};
		return {
			REASON_MANAGE_CONFIG,
			isAddFirstReason: true, // 新增or编辑一级原因
			isAddTwoReason: true, // 新增or编辑二级原因
			showFirstReason: false, // 显示一级原因-弹窗
			showTwoReason: false, // 显示二级原因-弹窗
			ruleFormFirstReason: {
				// 一级原因-表单数据
				returnType: '',
				returnReason: '',
			},
			ruleFormTwoReason: {
				// 二级原因-表单数据
				returnType: '',
				parentReasonId: '',
				returnReason: '',
			},
			rulesFirstReason: {
				returnType: [{ required: true, message: '请选择退换货类型', trigger: 'change' }],
				returnReason: [{ required: true, validator: validatorReturnType, trigger: 'blur' }],
			},
			rulesTwoReason: {
				returnType: [{ required: true, message: '请选择退换货类型', trigger: 'change' }],
				parentReasonId: [{ required: true, message: '请选择一级原因', trigger: 'change' }],
				returnReason: [{ required: true, validator: validatorReturnReason, trigger: 'blur' }],
			},
			tableData: [],
			firstReasonList: [], // 一级原因下拉数据
			searchConfig: {
				returnType: 0,
			},
			firstRow: {}, // 保存一级每行数据
			twoRow: {}, // 保存二级每行数据
			RETURN_EXCHANGE_TYPE,
		};
	},
	computed: {
		returnTypeOptions() {
			return REASON_MANAGE_CONFIG.form[0].options;
		},
	},
	methods: {
		// 获取一级原因数据
		selectReturnType(val) {
			const params = {
				returnType: val * 1,
			};
			this.getReturnReasonList(params);
		},
		// 一级原因接口
		async getReturnReasonList(params) {
			this.ruleFormTwoReason.parentReasonId = '';
			const res = await this.$fetch(`/mgmt/sys/getReturnReasons?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.firstReasonList = res.data.map((v) => {
					return {
						label: v.returnReason,
						value: v.id,
					};
				});
			} else {
				this.firstReasonList = [];
			}
		},
		// 新增-一级原因
		addFirstReason() {
			this.showFirstReason = true;
			this.isAddFirstReason = true;
			this.returnTypeOptions.shift();
		},
		// 保存-一级原因
		saveFirstReason(formName) {
			if (this.isAddFirstReason) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const params = {
							...this.ruleFormFirstReason,
							parentReasonId: 0,
						};
						await this.addReturnReason(params);
						this.$refs[formName].resetFields();
						this.showFirstReason = false;
						this.getList();
					}
				});
			} else {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const { id, parentReasonId } = this.firstRow;
						const params = {
							...this.ruleFormFirstReason,
							id,
							parentReasonId,
						};
						await this.updateReturnReason(params);
						this.$refs[formName].resetFields();
						this.showFirstReason = false;
						this.getList();
					}
				});
			}
		},
		// 取消-一级原因
		cacelFirstReason(formName) {
			this.$refs[formName].resetFields();
			this.ruleFormFirstReason = {
				returnType: '',
				returnReason: '',
			};
			this.showFirstReason = false;
			this.returnTypeOptions.unshift({ value: 0, label: '全部' });
		},
		// 新增二级原因
		addTwoReason() {
			this.showTwoReason = true;
			this.isAddTwoReason = true;
			this.returnTypeOptions.shift();
		},
		// 保存-新增/编辑二级原因
		saveTwoReason(formName) {
			if (this.isAddTwoReason) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						await this.addReturnReason(this.ruleFormTwoReason);
						this.$refs[formName].resetFields();
						this.showTwoReason = false;
						this.getList();
					}
				});
			} else {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const { id } = this.twoRow;
						const params = {
							...this.ruleFormTwoReason,
							id,
						};
						console.log(this.twoRow);
						await this.updateReturnReason(params);
						this.$refs[formName].resetFields();
						this.showTwoReason = false;
						this.getList();
					}
				});
			}
		},
		// 取消-新增/编辑二级原因
		cacelTwoReason(formName) {
			if (formName) this.$refs[formName].resetFields();
			this.showTwoReason = false;
			this.returnTypeOptions.unshift({ value: 0, label: '全部' });
		},
		// 添加原因接口
		async addReturnReason(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/addReturnReason',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 编辑原因接口
		async updateReturnReason(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/updateReturnReason',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 表格-删除
		async deleteRow(row) {
			const params = {
				id: row.id,
			};
			await this.delete(params);
			this.getList();
		},
		searChgetList({ returnType }) {
			this.searchConfig.returnType = returnType === 0 ? null : returnType;
			this.getList();
		},
		// 删除接口
		async delete(params) {
			const res = await this.$fetch(`/mgmt/sys/deleteReturnReason?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 表格-编辑
		async handleEdit(row) {
			if (String(row.parentReasonId) === '0') {
				// 编辑一级原因
				this.showFirstReason = true;
				this.isAddFirstReason = false;
				this.ruleFormFirstReason = {
					returnType: row.returnType,
					returnReason: row.returnReason,
				};
				this.firstRow = row;
			} else {
				// 编辑二级原因
				this.showTwoReason = true;
				this.isAddTwoReason = false;
				// 通过退换货类型获取一级原因下拉数据源
				// this.ruleFormFirstReason = {
				// 	returnType: ,
				// 	returnReason: this.RETURN_EXCHANGE_TYPE[row.returnReason],
				// };
				const obj = {
					returnType: row.returnType,
				};
				await this.getReturnReasonList(obj);
				this.ruleFormTwoReason = {
					returnType: row.returnType,
					parentReasonId: row.parentReasonId,
					returnReason: row.returnReason,
				};
				this.twoRow = row;
			}
		},
		// 请求数据
		async getList() {
			if (!this.searchConfig.returnType) {
				this.searchConfig.returnType = this.returnTypeOptions[0].value === 0 ? null : this.returnTypeOptions[0].value;
			}
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/sys/getReasonsByType`,
				params: this.searchConfig,
			});
			const { data } = res;
			this.tableData = data;
			this.tableData = data.map((item, index) => {
				return {
					ids: index,
					disabled: true,
					grade: 1,
					returnType: item.returnType,
					parentReasonId: item.parentReasonId,
					returnReason: item.returnReason,
					children: this.formatData(item, 2),
				};
			});
		},
		func(tdata, resData) {
			let arrs = [];
			if (Array.isArray(tdata) && tdata.length > 0) {
				for (let index = 0; index < tdata.length; index++) {
					if (resData === tdata[index].grade) {
						arrs = tdata[index].children;
						break;
					}
					this.func(tdata[index].children, resData);
				}
			}
			return arrs;
		},
		random(n) {
			// 生成n位长度的字符串
			var str = 'abcdefghijklmnopqrstuvwxyz0123456789'; // 可以作为常量放到random外面
			var result = '';
			for (var i = 0; i < n; i++) {
				result += str[parseInt(Math.random() * str.length)];
			}
			return result;
		},
		formatData(item, grade) {
			if (!item.reasonList) return [];
			let arr = item.reasonList.map((el) => {
				return {
					id: el.id,
					ids: this.random(12),
					disabled: true,
					returnReason: el.returnReason,
					grade: grade,
					children: this.formatData(el, grade + 1),
					returnType: el.returnType ? el.returnType : '',
					parentReasonId: el.parentReasonId ? el.parentReasonId : '',
				};
			});
			// arr.push(item);
			// arr.forEach((v) => {
			// 	v.children = v.reasonRanks || [];
			// });
			return arr;
		},
		// 初始化
		init() {
			this.$nextTick(() => {
				// 默认选中下拉第一条数据
				this.getList();
			});
		},
	},
	created() {
		this.init();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.reason-manage {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.search-header .search-header_button {
		width: 30%;
	}
	.add-reason-box {
		padding: 32px 0 16px 0;
		overflow: hidden;
		.tip {
			float: right;
			font-size: 14px;
			color: #aaa;
		}
	}
	.add-exchange {
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
}
.save {
	width: 100px;
	margin-right: 16px;
}
.cacel {
	width: 100px;
}
</style>

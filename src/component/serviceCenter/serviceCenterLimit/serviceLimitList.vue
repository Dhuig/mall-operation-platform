<template>
	<div class="distributionList">
		<guideBar />
		<el-card>
			<searchPanel
				v-model="searchConfig"
				:config="SERVICE_CENTER_LIMIT_CONFIG"
				@search="handleSearch"
				:showExpand="true"
			/>
		</el-card>
		<el-card>
			<tableList
				:dataSource="dataSource"
				:columns="SERVICE_CENTER_LIMIT_COLUMS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'service_limit_list_edit_permission'" type="text" @click="editLimit(row.data)">
						修改权限
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 编辑弹窗 -->
		<el-dialog title="权限修改" label-suffix=":" :visible.sync="showUpdateLimit" width="55%" v-drag>
			<el-form
				ref="ruleForm"
				:model="ruleForm"
				:disabled="disqualified"
				label-width="120px"
				label-suffix=":"
				class="add-user"
			>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="服务中心编号" prop="storeCode">
							<span>{{ ruleForm.storeCode }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务中心名称" prop="storeName">
							<span>{{ ruleForm.storeName }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="12">
						<el-form-item label="负责人" prop="leaderName">
							<span>{{ ruleForm.leaderName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="网点类型" prop="shopType">
							<el-select v-model="ruleForm.shopType" @change="shopTypeChange">
								<el-option v-for="(item, index) in DOTTYPE" :key="index" :label="item" :value="index"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24">
					<el-col :span="24">
						<el-form-item label="服务中心权限" prop="permission" style="marginbottom: 24px">
							<el-checkbox-group v-model="ruleForm.permission">
								<el-checkbox
									v-for="(item, index) in SERVICEAUTHORITY"
									:key="index"
									:label="item.value"
									:disabled="item.disabled"
									@change="dealPermission(item.value)"
								>
									{{ item.label }}
									<el-popover placement="top-start" width="120" trigger="hover" :content="item.tips">
										<i slot="reference" class="el-icon-question" />
									</el-popover>
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
					<template v-if="isCancelStatus">
						<el-col :span="24">
							<el-form-item label="取消时间" prop="cancelTime">
								<el-date-picker
									v-model="ruleForm.cancelTime"
									type="date"
									value-format="timestamp"
									placeholder="选择日期"
								></el-date-picker>
							</el-form-item>
						</el-col>
					</template>
					<template v-if="isFrozenStatus">
						<el-col :span="24">
							<el-form-item label="冻结/解冻时间" prop="frozenTime">
								<el-date-picker
									v-model="ruleForm.frozenTime"
									type="date"
									value-format="timestamp"
									placeholder="选择日期"
								></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="冻结/解冻原因" prop="frozenReason">
								<el-input
									type="textarea"
									v-model="ruleForm.frozenReason"
									placeholder="请输入冻结/解冻原因"
									maxlength="100"
									show-word-limit
								/>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					:disabled="disqualified"
					@click="submitForm('ruleForm')"
					style="width: 100px; margin-right: 16px"
				>
					修改
				</el-button>
				<el-button @click="showUpdateLimit = false" style="width: 100px">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	SERVICE_CENTER_LIMIT_CONFIG,
	SUBCOMPANY,
	SERVICEAUTHORITY,
	DOTTYPE,
	SERVICE_CENTER_LIMIT_COLUMS,
} from './config.js';
import qs from 'querystring';
import { deepCopy } from '../serviceCenterData/util';
export default {
	name: 'serviceLimitList',
	data() {
		return {
			SERVICE_CENTER_LIMIT_COLUMS,
			SERVICE_CENTER_LIMIT_CONFIG,
			SUBCOMPANY,
			SERVICEAUTHORITY,
			DOTTYPE,
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			searchConfig: {
				storeCode: '',
				storeName: '',
				leaderCardNo: '',
				leaderName: '',
				companyCode: '',
				isMainShop: '',
				shopType: '',
				provinceCode: null,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			dataSource: [],
			loading: false,
			showUpdateLimit: false,
			ruleForm: {
				storeCode: '',
				storeName: '',
				leaderName: '',
				frozenTime: '',
				frozenReason: '',
				cancelTime: '',
				permission: [],
			},
			disqualified: false, // 是否有资格
			isFrozenStatus: false, //网点类型是否选择了冻结状态
			controlledArr: [1, 2, 4, 5], //受控权限按钮集合
			isCancelStatus: false, //网点类型是否选择了取消状态
		};
	},
	watch: {
		'ruleForm.shopType'(val) {
			if (val) {
				this.isFrozenStatus = this.DOTTYPE[val].indexOf('冻结') != -1;
				this.isCancelStatus = this.DOTTYPE[val].indexOf('取消') != -1;
			}
		},
	},
	mounted() {
		this.loadData();
		this.loadProvinces();
		this.shopType();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
			};
		},
	},
	methods: {
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(pageSize) {
			this.pagination = { currentPage: 1, pageSize };
			this.loadData();
		},
		//修改权限
		editLimit(row) {
			this.showUpdateLimit = true;
			this.$nextTick(() => {
				const { code: storeCode } = row;
				this.getMainStoreInfo(storeCode);
				this.ruleForm.permission = row.permission.split(',').map(Number);
				this.dealPermissionDisabled();
			});
		},
		// 处理权限选项是否置灰规则
		dealPermissionDisabled() {
			const {
				ruleForm: { permission },
				controlledArr,
			} = this;
			let SERVICEAUTHORITY = deepCopy(this.SERVICEAUTHORITY);
			if (permission.includes(6) || permission.includes(7)) {
				SERVICEAUTHORITY.map(item => {
					if (controlledArr.includes(item.value)) {
						item.disabled = true;
					}
				});
			} else {
				SERVICEAUTHORITY.map(item => {
					if (controlledArr.includes(item.value)) {
						item.disabled = false;
					}
				});
			}
			this.SERVICEAUTHORITY = SERVICEAUTHORITY;
		},
		// 处理修改权限规则
		dealPermission(val) {
			const temp = [...this.ruleForm.permission];
			const { controlledArr } = this;
			let result;
			if (val == 7 || val == 6) {
				result = temp.filter(item => !controlledArr.includes(item));
				if (val == 7) {
					if (temp.includes(7)) {
						!result.includes(6) ? result.push(6) : '';
					} else {
						result.includes(6) ? result.splice(result.indexOf(6), 1) : '';
					}
				}
			} else {
				result = temp.map(item => item);
			}
			this.ruleForm.permission = result;
			this.dealPermissionDisabled();
		},
		// 修改网点类型调用
		shopTypeChange() {
			this.$nextTick(() => {
				if (this.isFrozenStatus) {
					this.ruleForm.frozenTime = new Date().getTime();
					this.ruleForm.cancelTime = null;
				}
				if (this.isCancelStatus) {
					this.ruleForm.cancelTime = new Date().getTime();
					this.ruleForm.frozenTime = null;
					this.ruleForm.frozenReason = null;
				}
			});
		},
		// 请求数据
		async loadData() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchFields,
			} = this;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/mgmt/store/listStore?${qs.stringify(params)}`);
			this.loading = false;
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
		},
		// 根据产品编码查询产品
		async getMainStoreInfo(storeCode) {
			const params = {
				storeCode,
			};
			const res = await this.$fetch(`/mgmt/store/getByParms?${qs.stringify(params)}`);
			if (res && res.code === 200 && res.data) {
				const {
					code: storeCode,
					name: storeName,
					shopType,
					leaderName,
					cancelTime,
					frozenTime,
					frozenReason,
				} = res.data[0];
				this.ruleForm = {
					...this.ruleForm,
					leaderName,
					storeCode,
					storeName,
					frozenTime,
					cancelTime,
					frozenReason,
					shopType: String(shopType),
				};
			} else {
				this.$message.error('获取数据失败，请查询服务是否可用');
			}
		},
		// 网点类型列表
		async shopType() {
			this.$store.getters['system/getOptions'].shopTypeOptions.map(({ label, value }) => {
				this.DOTTYPE[value] = label;
			});
		},
		// 服务中心权限编辑修改
		async updatePermission(params) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/updatePermission',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				if (params.permission.indexOf('7') != -1) {
					this.$message.warning('服务中心被取消资格，请把门店管理员从云商微店降级为优惠顾客', 5000);
				}
				this.loadData();
			} else {
				this.$message.error((res && res.data.message) || '权限修改失败, 请验证服务是否可用');
			}
			this.$refs['ruleForm'].resetFields();
		},
		// 获取省份数据
		async loadProvinces() {
			const res = await this.$fetch(`/mgmt/sys/getProvinceList`);
			if (res && res.code === 200) {
				SERVICE_CENTER_LIMIT_CONFIG.form[7].options = res.data.map(({ provinceName: label, provinceCode: value }) => ({
					label,
					value,
				}));
			} else {
				this.$message.warning('获取省份数据失败');
			}
		},
		// 提交
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.showUpdateLimit = false;
					const { permission } = this.ruleForm;
					permission.includes(0) && this.ruleForm.permission.splice(permission.indexOf(0), 1);
					this.ruleForm.permission = this.ruleForm.permission.join(',');
					this.ruleForm.shopType = Number(this.ruleForm.shopType);
					let params = this.ruleForm;
					this.updatePermission(params);
				}
			});
		},
	},
};
</script>

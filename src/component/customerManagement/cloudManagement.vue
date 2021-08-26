<template>
	<div>
		<guideBar>
			<el-button v-permission="'cloud_management_batch_export'" type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card style="margin-bottom: 16px;">
			<searchPanel v-model="searchConfig" :config="CLOUD_MANAGEMENT_SEARCH" @search="search" />
		</el-card>
		<el-card>
			<tableList
				:loading="loading"
				:dataSource="data"
				:columns="CLOUD_MANAGEMENT_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'cloud_management_account_manage|account_management_cloud'"
						type="text"
						@click="accountMange(scope.data.memberId)"
					>
						账户管理
					</el-button>
					<el-button
						v-permission="'cloud_management_business_detail'"
						type="text"
						@click="businessDetail(scope.data.memberId)"
					>
						业务详情
					</el-button>
					<el-button
						type="text"
						v-if="scope.data.businessType == 2"
						v-permission="'cloud_management_change_delivery_unit'"
						@click="changeDeliveryUnit(scope.data)"
					>
						更换服务单位
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 更换服务单位 对话框 -->
		<el-dialog title="更换服务单位" :visible.sync="deliveryType.show" width="450px" v-drag>
			<el-form
				class="delivery-form"
				:inline="true"
				label-suffix=":"
				:rules="deliveryRules"
				ref="deliveryForm"
				:model="deliveryType.data"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="油葱微店卡号">
							<span>{{ deliveryType.data.cardNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="原服务中心">
							<span>{{ deliveryType.data.oldCenter }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col>
						<el-form-item label="服务单位" prop="delivery" required label-width="115px">
							<el-select v-model="deliveryType.data.delivery" placeholder="请选择" @change="changeDeliveryType()">
								<el-option
									v-for="item in DELIVERY_TYPE"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item
					label="关联服务中心"
					prop="serviceCenter"
					label-width="115px"
					v-if="deliveryType.data.delivery === '1'"
				>
					<el-input
						v-model="deliveryType.data.serviceCenter"
						placeholder="请输入服务中心编码"
						size="medium"
						maxlength="20"
						clearable
						@change="changeServiceCode()"
					/>
				</el-form-item>
				<el-form-item label="服务中心名称" label-width="115px" v-if="deliveryType.data.delivery === '1'">
					<el-input
						class="delivery-disabled-input"
						v-model="deliveryType.data.serviceCenterName"
						placeholder="根据编号自动生成"
						size="medium"
						disabled
					/>
				</el-form-item>
				<el-form-item label="对应分公司" label-width="115px" v-if="deliveryType.data.delivery === '1'">
					<el-input
						class="delivery-disabled-input"
						v-model="deliveryType.data.serviceCompanyName"
						placeholder="根据编号自动生成"
						size="medium"
						disabled
						width="217px"
					/>
				</el-form-item>
				<el-form-item label="关联分公司编号" label-width="115px" v-if="deliveryType.data.delivery === '2'">
					<el-input class="delivery-disabled-input" v-model="deliveryType.data.companyCode" size="medium" disabled />
				</el-form-item>
				<el-form-item label="分公司名称" label-width="115px" v-if="deliveryType.data.delivery === '2'">
					<el-input
						class="delivery-disabled-input"
						v-model="deliveryType.data.companyName"
						placeholder="根据编号自动生成"
						size="medium"
						disabled
						width="217px"
					/>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<span>
					<el-button @click.stop="deliveryType.show = false">取消</el-button>
					<el-button type="primary" @click="confirmModifyDeliveryUnit">确认</el-button>
				</span>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { timeEndFormat } from 'util';
import { CLOUD_MANAGEMENT_SEARCH, CLOUD_MANAGEMENT_COLUMNS, DELIVERY_TYPE } from './config';
import qs from 'querystring';

export default {
	name: 'cloudManagement',
	data() {
		return {
			CLOUD_MANAGEMENT_SEARCH,
			CLOUD_MANAGEMENT_COLUMNS,
			DELIVERY_TYPE,
			searchConfig: {
				companyNo: '',
				cardNo: '',
				businessType: '',
				status: '',
				registrationTime: [],
				openCardTime: [],
			},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			loading: false,
			data: [],
			deliveryType: {
				show: false,
				status: 0,
				data: {
					memberId: '',
					cardNo: '',
					oldCenter: '',
					delivery: '1',
					serviceCenter: '',
					serviceCenterName: '',
					serviceCompanyName: '',
					companyName: '',
					companyCode: '',
				},
			},
			deliveryRules: {
				delivery: [{ required: true, message: '请选择服务单位', trigger: 'change' }],
				serviceCenter: [
					{ required: true, message: '请输入服务中心编号', trigger: 'blur' },
					{ min: 1, max: 20, message: '请输入 1 ~ 20 个字符', trigger: 'change' },
				],
			},
			selectCloudRow: {},
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { registrationTime },
				searchConfig: { openCardTime },
			} = this;
			let isRegistrationTime =
					registrationTime && registrationTime[0] ? `${registrationTime[0]},${timeEndFormat(registrationTime[1])}` : '',
				isOpenCardTime = openCardTime && openCardTime[0] ? `${openCardTime[0]},${timeEndFormat(openCardTime[1])}` : '';
			return {
				...searchConfig,
				registrationTime: isRegistrationTime,
				openCardTime: isOpenCardTime,
			};
		},
	},
	methods: {
		// 批量导出
		async batchExport() {
			const { searchConfig } = this;
			let parsms = {
				...searchConfig,
				registrationTime: (searchConfig.registrationTime || ['', '']).join(','),
				openCardTime: (searchConfig.openCardTime || ['', '']).join(','),
			};
			// exportExcel('/member/mgmt/exportBusinessList', parsms);
			const res = await this.$fetch(`/member/mgmt/exportBusinessList?${qs.stringify(parsms)}`);
			if (res && res.code === 200) {
				this.$message.success('excel表格正在生成中，请在下载管理查看');
			} else {
				this.$message.warning(res.message);
			}
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		search() {
			this.pagination.currentPage = 1;
			this.loadData();
		},
		// 获取公司的信息
		async getBranComByType() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			let companyList = serviceCompanyOptions.map(({ label, value }) => {
				return {
					label: `${label} ${value}`,
					value,
				};
			});
			this.CLOUD_MANAGEMENT_SEARCH.form[0].options = companyList;
		},
		// 请求云商/云+列表
		async loadData() {
			this.loading = true;
			const {
				searchFields,
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};

			const res = await this.$fetch(`/member/mgmt/getBusinessList?${qs.stringify(params)}`);

			if (res && res.data) {
				const { list, total } = res.data;
				this.data = list;
				this.total = total;
			} else {
				this.data = [];
				this.total = 0;
			}
			this.loading = false;
		},
		// 帐号管理
		accountMange(id) {
			if (!id) return this.$message('该用户的 memberId 参数无效, 无法查询账户详细信息!');
			this.$go('account_management_cloud', { id, type: 'customer', state: 'microShop' });
		},
		// 业务详情
		businessDetail(id) {
			this.$go('business_and_customer_detail', { id, type: 'customer' });
		},
		// 更换服务单位
		changeDeliveryUnit(row) {
			this.selectCloudRow = row;
			let { data } = this.deliveryType;
			data.delivery = '2';
			data.cardNo = row.cardNo;
			data.memberId = row.memberId;
			data.oldCenter = row.rdcNo || '--';
			data.companyName = row.rdcCompanyName;
			data.companyCode = row.rdcCompanyNo;
			this.deliveryType.show = true;
			this.$refs['deliveryForm'] ? this.$refs['deliveryForm'].clearValidate() : '';
		},
		// 切换配送中心
		changeDeliveryType() {
			let { data } = this.deliveryType;
			if (data.delivery === '2') {
				this.$refs['deliveryForm'].clearValidate();
			}
		},
		// 根据服务中心编码查询服务中心和分公司
		async changeServiceCode() {
			let { serviceCenter, companyCode } = this.deliveryType.data;
			let params = {
				ServiceCentreCode: serviceCenter,
				companyCode: companyCode,
			};
			if (serviceCenter && serviceCenter.length > 2 && serviceCenter.length < 21) {
				let res = await this.$fetch({
					method: 'GET',
					url: `/member/mgmt/queryServiceCentreInfoByCode?${qs.stringify(params)}`,
				});
				if (res && res.data) {
					let { data } = res;
					this.deliveryType.data.companyName = data.companyName;
					this.deliveryType.data.serviceCompanyName = data.companyName;
					this.deliveryType.data.serviceCenterName = data.serviceCentreName;
					this.deliveryType.data.companyCode = data.companyCode;
				}
			}
		},
		// 修改服务单位校验
		confirmModifyDeliveryUnit() {
			this.$refs['deliveryForm'].validate(valid => {
				if (valid) {
					this.changeMemberCenter();
				} else {
					return false;
				}
			});
		},
		// 修改服务单位
		async changeMemberCenter() {
			let { delivery, serviceCenter, memberId, companyCode, companyName } = this.deliveryType.data;
			// if (delivery === '2') {
			// 	this.deliveryType.show = false;
			// 	return;
			// }
			let data = {
				distributionCenterNo: serviceCenter,
				distributionCenterType: delivery,
				distributionCompanyName: companyName,
				distributionCompanyNo: companyCode,
				id: memberId,
			};
			let res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/updateDistributionCenterNo',
				data: data,
			});
			if (res && res.code === 200) {
				this.loadData();
				this.deliveryType.show = false;
				this.$message.success('修改成功');
				this.deliveryType.data = {
					memberId: '',
					cardNo: '',
					oldCenter: '',
					delivery: '1',
					serviceCenter: '',
					serviceCenterName: '',
					serviceCompanyName: '',
					companyName: '',
					companyCode: '',
				};
			} else {
				this.$message.error('修改失败');
			}
		},
	},
	mounted() {
		this.$nextTick(this.loadData);
		this.getBranComByType(); // 分公司数据
	},
};
</script>
<style lang="scss" scoped>
.delivery-form {
	text-align: center;
}
::v-deep .delivery-disabled-input {
	width: 217px;
}
</style>

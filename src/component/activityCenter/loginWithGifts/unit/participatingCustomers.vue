<template>
	<div class="participating-customers">
		<el-card>
			<div class="section-title">参与顾客设置</div>
			<el-form
				ref="customerLimitForm"
				:model="customerLimitForm"
				:rules="customerLimitFormRules"
				label-width="100px"
				label-suffix=":"
			>
				<el-form-item label="顾客限制" prop="participants">
					<el-radio-group v-model="customerLimitForm.participants">
						<el-radio :label="1">所有顾客</el-radio>
						<el-radio :label="2">按照顾客身份</el-radio>
						<el-radio :label="4">按顾客名单导入</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card v-if="customerLimitForm.participants == 1">
			<el-row type="flex" justify="center" align="middle">所有顾客都可以参与活动</el-row>
		</el-card>
		<el-card v-if="customerLimitForm.participants == 2">
			<div class="section-title">选择顾客身份</div>
			<el-form ref="customerForm" :model="customerForm" :rules="customerFormRules" label-width="100px" label-suffix=":">
				<el-form-item label="顾客身份" prop="memberTypes">
					<el-checkbox-group v-model="customerForm.memberTypes">
						<el-checkbox :label="1">普通顾客</el-checkbox>
						<el-checkbox :label="2">优惠顾客</el-checkbox>
						<el-checkbox :label="3">云商</el-checkbox>
						<el-checkbox :label="4">微店</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="办卡时间" prop="limitCardTime">
					<el-radio-group v-model="customerForm.limitCardTime">
						<el-radio :label="false">不限制</el-radio>
						<el-radio :label="true">限制办卡月份</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" prop="cardTime" v-if="customerForm.limitCardTime">
					限制办卡月份为
					<el-date-picker
						v-model="customerForm.cardTime"
						type="monthrange"
						range-separator="至"
						start-placeholder="开始月份"
						end-placeholder="结束月份"
						value-format="yyyy-MM"
					></el-date-picker>
					才能获得优惠券
				</el-form-item>
			</el-form>
		</el-card>
		<el-card v-if="customerLimitForm.participants == 4">
			<div class="section-title">按顾客名单导入</div>
			<el-row class="section-body" type="flex" align="middle">
				<el-col :span="3">搜索已导入顾客:</el-col>
				<el-col :span="11">
					<el-input v-model="keyword" style="width: 180px"></el-input>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
					<el-button type="text" @click="clearImportList">清空导入列表</el-button>
				</el-col>
				<el-col :span="10">
					<el-row type="flex" justify="end" class="button-group">
						<el-button type="text" @click="templateDownload">下载模板</el-button>
						<el-upload
							class="upload-demo"
							action="/mgmt/prmt/loginGift/importMemberList"
							:show-file-list="false"
							:http-request="uploadCustom"
						>
							<el-button type="primary">导入新增</el-button>
						</el-upload>
						<el-button type="primary" @click="addManually">手动新增</el-button>
					</el-row>
				</el-col>
			</el-row>
			<tableList
				:dataSource="customerList"
				:columns="LOGIN_WITH_GIFTS_ADD_CUSTOMER_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button type="text" @click="customerDelete(scope.data)">删除</el-button>
				</template>
			</tableList>
		</el-card>

		<!-- 手动添加顾客名单 -->
		<el-dialog v-drag title="手动添加" :visible.sync="customerAddVisible" width="500px">
			<el-form ref="customerAddForm" :model="customerAddForm" label-width="100px" label-suffix=":">
				<el-form-item label="搜索顾客" prop="cardNo">
					<el-row type="flex">
						<el-input
							v-model="customerAddForm.cardNo"
							placeholder="输入会员卡号，精准搜索"
							style="margin-right: 10px"
						></el-input>
						<el-button type="primary" @click="searchCustomer">搜索</el-button>
					</el-row>
				</el-form-item>
				<el-form-item label="会员卡号" prop="cardNo">{{ customerAddForm.cardNo }}</el-form-item>
				<el-form-item label="会员身份" prop="memberType">
					{{ MEMBER_TYPE[customerAddForm.memberType] || '' }}
				</el-form-item>
				<el-form-item label="会员姓名" prop="realname">{{ customerAddForm.realname }}</el-form-item>
				<el-form-item label="注册手机号" prop="mobile">{{ customerAddForm.mobile }}</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button @click="customerAddCancel('customerAddForm')">取消</el-button>
				<el-button type="primary" @click="customerAddSave('customerAddForm')">添加</el-button>
			</el-row>
		</el-dialog>

		<!-- 导入新增成功弹窗 -->
		<el-dialog v-drag title="导入结果" :visible.sync="uploadVisible" width="500px">
			<div>成功导入{{ uploadCustomResponse.trueCount || 0 }}条，失败{{ uploadCustomResponse.falseCount || 0 }}条</div>
			<el-button type="text" @click="downloadCustomFail" v-if="uploadCustomResponse.falseCount > 0">
				下载失败列表
			</el-button>
			<el-row type="flex" justify="end">
				<el-button type="primary" @click="uploadVisible = false">确 定</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { LOGIN_WITH_GIFTS_ADD_CUSTOMER_COLUMNS } from './config';
import { MEMBER_TYPE } from '@/component/accountsManagement/cardVoucherManagement/config';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	name: 'participatingCustomers',
	props: {
		promotion: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			LOGIN_WITH_GIFTS_ADD_CUSTOMER_COLUMNS,
			MEMBER_TYPE,
			importKey: '', //上传key
			keyword: '', //搜索的会员卡号或者手机号
			customerList: [], //顾客名单list
			pagination: { currentPage: 1, pageSize: 10 },
			dataTotal: 0,
			customerLimitForm: {
				participants: '',
			}, //顾客限制form
			customerLimitFormRules: {
				//顾客限制form rules
				participants: [{ required: true, message: '请选择顾客限制', trigger: 'blur' }],
			},
			customerForm: {
				memberTypes: [],
				limitCardTime: '',
				cardTime: '',
			}, // 顾客身份form
			customerFormRules: {
				memberTypes: [{ required: true, message: '请选择顾客身份', trigger: 'blur' }],
				limitCardTime: [{ required: true, message: '请选择办卡时间', trigger: 'blur' }],
				cardTime: [{ required: true, message: '请选择办卡时间', trigger: 'blur' }],
			},
			customerAddVisible: false, // 手动添加顾客弹窗状态
			customerAddForm: { cardNo: '' }, //手动添加顾客弹窗form
			uploadVisible: false, //导入成功弹窗状态
			uploadCustomResponse: {
				trueCount: '',
				falseCount: '',
			}, //导入成功后返回数据
		};
	},
	watch: {
		promotion: {
			immediate: true,
			deep: true,
			handler(data) {
				const { participants, memberTypes, limitCardTime, cardStartTime, cardEndTime } = data;
				this.customerLimitForm = { participants };
				this.customerForm = {
					memberTypes: memberTypes || [],
					limitCardTime,
					cardTime: [cardStartTime || '', cardEndTime || ''],
				};
				if (participants == 4) {
					this.loadCustomerData();
				}
			},
		},
	},
	computed: {
		loadDataPost() {
			const {
				promotion: { id },
				importKey,
				pagination: { currentPage: pageNum, pageSize },
				keyword,
			} = this;
			return {
				id,
				importKey,
				keyword,
				pageNum,
				pageSize,
			};
		},
	},
	methods: {
		addManually() {
			this.customerAddVisible = true;
		},
		// 搜索顾客
		async searchCustomer() {
			const { cardNo } = this.customerAddForm;
			if (!cardNo) return this.$message.warning('请输入会员卡号');
			const res = await this.$fetch(`/mgmt/store/getMasterMemberInfoByCardNo?cardNo=${cardNo}`);
			if (res && res.code == 200 && res.data) {
				const { cardNo, memberType, realname, mobile } = res.data;
				this.customerAddForm = { cardNo, memberType, realname, mobile };
			} else {
				this.$message.error('获取顾客信息失败');
			}
		},
		// 搜索
		handleSearch() {
			this.pagination.currentPage = 1;
			this.loadCustomerData();
		},
		// 清空导入列表
		clearImportList() {
			this.$confirm('删除后你需要重新导入或添加', '确认提示', {
				type: 'warning',
			})
				.then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/loginGift/clearImportMember',
						data: { importKey: this.importKey },
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
					} else {
						this.$message.error('操作失败');
					}
				})
				.catch(() => {});
		},
		// 模板下载
		templateDownload() {
			exportExcel('/mgmt/prmt/loginGift/exportMemberTemplate');
		},
		// 导入新增
		async uploadCustom(file) {
			console.log(123, file);
			const data = new FormData();
			data.append('id', this.promotion.id);
			data.append('importKey', this.importKey);
			data.append('file', file.file);
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/loginGift/importMemberList',
				data,
			});
			if (res && res.code == 200) {
				this.$message.success('上传成功');
				this.uploadCustomResponse = res.data;
				this.importKey = res.data.importKey;
				this.uploadVisible = true;
				this.loadCustomerData();
			} else {
				this.$message.error('上传失败');
			}
		},
		// 删除顾客
		customerDelete(row) {
			this.$confirm('删除顾客确认', '确认提示').then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/loginGift/deleteImportMember',
					data: { id: row.id },
				});
				if (res && res.code == 200) {
					this.$message.success('操作成功');
					this.loadCustomerData();
				} else {
					this.$message.error('操作失败');
				}
			});
		},
		// 下载导入失败列表
		downloadCustomFail() {
			exportExcel('/mgmt/prmt/loginGift/getImportFailedList', { key: this.importKey });
		},
		// 手动添加顾客名单 取消
		customerAddCancel(formName) {
			this.$refs[formName].resetFields();
			this.customerAddVisible = false;
		},
		// 手动添加顾客名单 添加
		async customerAddSave(formName) {
			if (!this.customerAddForm.cardNo) return this.$message.warning('请输入会员卡号');
			const {
				promotion: { id },
				importKey,
			} = this;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/loginGift/addImportMember',
				data: { ...this.customerAddForm, id, importKey },
			});
			if (res && res.code == 200) {
				this.$message.success('操作成功');
				this.importKey = res.data.importKey;
				this.loadCustomerData();
				this.customerAddCancel(formName);
			} else {
				this.$message.error('操作失败');
			}
		},
		// 处理符合原始数据
		dealData() {
			let data = {
				...this.customerLimitForm,
				...this.customerForm,
				importKey: this.importKey,
			};
			if (data.cardTime) {
				data.cardStartTime = data.cardTime[0] || '';
				data.cardEndTime = data.cardTime[1] || '';
			}
			return data;
		},
		toNext() {
			let onoff = false;
			this.$refs['customerLimitForm'].validate(valid => {
				if (valid) {
					onoff = true;
				}
			});
			this.$refs['customerForm']?.validate(valid => {
				onoff = false;
				if (valid) {
					onoff = true;
				}
			});
			this.$emit('editSuccess', { ...this.dealData() });
			return onoff;
		},
		// 获取导入顾客list
		async loadCustomerData() {
			const res = await this.$fetch(`/mgmt/prmt/loginGift/getImportMemberPage?${qs.stringify(this.loadDataPost)}`);
			if (res && res.code == 200 && res.data) {
				const { list, total } = res.data;
				this.customerList = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取导入顾客列表失败');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.section-title {
	font-size: 18px;
	font-weight: 600;
	padding: 0 0 20px 0;
	flex-shrink: 0;
	margin-right: 30px;
}
::v-deep.section-body {
	font-size: 12px;
}
::v-deep.button-group {
	.el-button {
		margin-left: 10px;
	}
}
</style>
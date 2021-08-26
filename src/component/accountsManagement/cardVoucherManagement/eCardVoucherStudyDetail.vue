<template>
	<div class="e-card-voucher-study-detail">
		<guideBar>
			<el-button v-permission="'e_card_voucher_study_detail_study'" type="primary" @click="cardStudy">
				礼券调查
			</el-button>
			<el-button v-permission="'e_card_voucher_study_detail_export'" type="primary" @click="batchExport">
				导出
			</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel v-model="searchConfig" :config="ECARD_VOUCHER_STUDY_SEARCH_CONFIG" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="list"
				:columns="ECARD_VOUCHER_STUDY_COLUMNS_CONFIG"
				:pagination="pagination"
				:dataTotal="dataTotal"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'e_card_voucher_study_detail_changelog'"
						type="text"
						@click="transRecord(scope.data)"
					>
						变更记录
					</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 礼券调查变更记录 -->
		<el-dialog v-drag title="礼券调查变更记录" width="600px" :visible.sync="recordPopVisible">
			<div class="record-box">
				<tableList border :dataSource="transRecordList" :columns="ECARD_VOUCHER_STUDY_RECORD_COLUMNS_CONFIG" />
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="recordPopVisible = false">取消</el-button>
				<el-button type="primary" @click="recordPopVisible = false">确定</el-button>
			</span>
		</el-dialog>
		<!-- 礼券调查 -->
		<el-dialog v-drag title="礼券调查" width="500px" :visible.sync="cardStudyPopVisible">
			<el-form :model="cardStudyForm" ref="cardStudyForm" :rules="cardStudyRules" label-suffix=":" label-width="100px">
				<el-form-item label="会员卡号" prop="cardNo">
					<el-input
						v-model="cardStudyForm.cardNo"
						@change="cardNoChange"
						placeholder="请输入会员卡号"
						style="width: 80%; margin-right: 8px"
					></el-input>
					<el-button type="primary" @click="loadUserInfo">搜索</el-button>
				</el-form-item>
				<el-form-item v-if="cardStudyForm.realname || cardStudyForm.memberType" prop="realname">
					<el-col :span="8">会员姓名：{{ cardStudyForm.realname }}</el-col>
					<el-col :span="8">会员身份：{{ cardStudyForm.memberType && MEMBER_TYPE[cardStudyForm.memberType] }}</el-col>
				</el-form-item>
				<el-form-item prop="realname" type="flex" justify="center" v-else>暂无数据</el-form-item>
				<el-form-item prop="surveyStatus">
					<el-radio-group v-model="cardStudyForm.surveyStatus" class="radio-list">
						<div><el-radio :label="3">不要礼券</el-radio></div>
						<div><el-radio :label="1">礼券200</el-radio></div>
						<div><el-radio :label="2">礼券800</el-radio></div>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-button @click="cardStudyCancel('cardStudyForm')">取消</el-button>
				<el-button type="primary" v-bind:loading="submitLoading" @click="cardStudySave('cardStudyForm')">
					保存
				</el-button>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import {
	ECARD_VOUCHER_STUDY_SEARCH_CONFIG,
	ECARD_VOUCHER_STUDY_COLUMNS_CONFIG,
	ECARD_VOUCHER_STUDY_RECORD_COLUMNS_CONFIG,
	MEMBER_TYPE,
} from './config';
import { exportExcelPost } from 'util';
export default {
	name: 'eCardVoucherStudyDetail',
	data() {
		return {
			ECARD_VOUCHER_STUDY_SEARCH_CONFIG,
			ECARD_VOUCHER_STUDY_COLUMNS_CONFIG,
			ECARD_VOUCHER_STUDY_RECORD_COLUMNS_CONFIG,
			searchConfig: {},
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			list: [],
			recordPopVisible: false,
			transRecordList: [],
			cardStudyPopVisible: false, // 礼券调查框状态
			cardStudyForm: {}, // 礼券调查框form
			cardStudyRules: {
				cardNo: [{ required: true, message: '请输入会员卡号', trigger: 'blur' }],
				realname: [{ required: true, message: '请确认会员存在', trigger: 'blur' }],
				surveyStatus: [{ required: true, message: '请选择状态', trigger: 'blur' }],
			},
			submitLoading: false,
		};
	},
	methods: {
		// 礼券调查
		cardStudy() {
			this.cardStudyPopVisible = true;
		},
		// 导出
		batchExport() {
			exportExcelPost(
				'/mgmt/fin/voucher/gift/coupon/exportGiftCouponSurveyDtl',
				this.loadDataPost,
				'电子礼券调查明细数据表'
			);
		},
		// 搜索
		handleSearch() {
			this.loadData();
		},
		// 翻页操作
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 切换页面条数
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize,
			};
			this.loadData();
		},
		// 显示变更记录
		transRecord(row) {
			this.recordPopVisible = true;
			this.loadStudyAdjustData(row.id);
		},
		// 监听会员卡号改变 将已有会员信息置空
		cardNoChange() {
			this.cardStudyForm = {
				...this.cardStudyForm,
				realname: '',
				memberType: '',
				id: '',
			};
		},
		// 礼券调查 取消
		cardStudyCancel(formName) {
			this.cardStudyPopVisible = false;
			this.$refs[formName].resetFields();
			this.cardStudyForm = {};
		},
		// 礼券调查 确定
		cardStudySave(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.submitLoading = true;
					const { id: memberId, surveyStatus } = this.cardStudyForm;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/voucher/gift/coupon/addGiftCouponSurvey',
						data: { memberId, surveyStatus },
						callback: () => {
							this.submitLoading = false;
						},
					});
					if (res && res.code == 200) {
						this.$message.success('操作成功');
						this.loadData();
						this.cardStudyCancel(formName);
					}
				}
			});
		},
		// 获取用户信息
		async loadUserInfo() {
			const { cardNo } = this.cardStudyForm;
			if (!cardNo) return this.$message.warning('请输入会员卡号');
			const res = await this.$fetch(`/mgmt/member/getMasterMemberInfoByCardNo?cardNo=${cardNo}`);
			if (res && res.code == 200) {
				const { realname, memberType, id } = res.data;
				this.cardStudyForm = { ...this.cardStudyForm, realname, memberType, id };
			}
		},
		// 获取礼券调查变更记录
		async loadStudyAdjustData(surveydtlId) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/fin/voucher/gift/coupon/queryGiftCouponSurveyUpdatedDtl?surveydtlId=${surveydtlId}`,
			});
			this.transRecordList.length = 0;
			if (res && res.data) {
				this.transRecordList = res.data;
			} else {
				this.$message.error(`获取变更记录失败`);
			}
		},
		// 获取列表数据
		async loadData() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/voucher/gift/coupon/queryGiftCouponSurvey',
				data: this.loadDataPost,
			});
			if (res && res.data) {
				const { list, total } = res.data;
				this.list = list;
				this.dataTotal = total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
	},
	computed: {
		loadDataPost() {
			const { searchConfig, pagination } = this;
			let data = {
				...searchConfig,
				pageNum: pagination.currentPage,
				pageSize: pagination.pageSize,
			};
			return data;
		},
		MEMBER_TYPE() {
			return MEMBER_TYPE;
		},
	},
	mounted() {
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.e-card-voucher-study-detail {
	.box-card {
		margin-bottom: 16px;
	}
	.record-box {
		max-height: 500px;
		overflow: auto;
	}
	.radio-list {
		&.el-radio-group {
			line-height: 32px;
		}
	}
}
</style>

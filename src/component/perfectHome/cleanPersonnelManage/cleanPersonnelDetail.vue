<template>
	<div>
		<guideBar />
		<!-- 顾客信息 -->
		<el-card class="part-gap">
			<h3>清洗人员详情</h3>
			<el-form
				:model="detail"
				inline
				label-position="right"
				:rules="CLEAN_PERSONNEL_RULES"
				ref="cleanerCheck"
				label-width="140px"
				label-suffix=":"
			>
				<el-row>
					<el-form-item label="服务人员卡号">
						<p>{{ detail.cardNo }}</p>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务人员姓名">
						<p>{{ detail.cleanerName }}</p>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务人员手机">
						<p>{{ detail.cleanerMobile }}</p>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务地址">
						<p>{{ detail.address }}</p>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="服务范围">
						<p>{{ detail.cleanerServiceArea }}</p>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="申请时间">
						<p>{{ detail.createTime }}</p>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="状态">
						<p>{{ BANKCARD_STATUS[detail.accCleanerStatus] }}</p>
					</el-form-item>
				</el-row>
				<!-- 审核通过 -->
				<el-row v-if="detail.accCleanerStatus === 1">
					<el-form-item label="审核通过时间">
						<p>{{ detail.checkTime }}</p>
					</el-form-item>
				</el-row>
				<!-- 已驳回 -->
				<el-row v-if="detail.accCleanerStatus === -1">
					<el-form-item label="驳回时间">
						<p>{{ detail.checkTime }}</p>
					</el-form-item>
				</el-row>
				<!-- 待审核 -->
				<el-row v-if="detail.accCleanerStatus === 0">
					<el-form-item label="审核结果" prop="status">
						<el-radio-group v-model="detail.status">
							<el-radio :label="1">审核通过</el-radio>
							<el-radio :label="-1">审核不通过</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-row>
				<el-row v-if="detail.accCleanerStatus === 0">
					<el-form-item label="审核意见" prop="remarks">
						<el-input type="textarea" :rows="2" v-model="detail.remarks" class="input-item" />
					</el-form-item>
				</el-row>
				<el-row
					class="btn_row"
					v-if="detail.accCleanerStatus === 0"
					v-permission="'perfect_home_clean_personnel_submit'"
				>
					<el-button @click="$closeSelf()">取消</el-button>
					<el-button type="primary" @click="cleanerValidate" :loading="submitLoading">
						保存
					</el-button>
				</el-row>
			</el-form>
		</el-card>
		<!-- 操作记录 -->
		<el-card class="part-gap">
			<h3>操作记录</h3>
			<tableList border :dataSource="cleanerlog" :columns="CLEAN_PERSONNEL_OPERATION_RECORD"></tableList>
		</el-card>
	</div>
</template>

<script>
// import { optionGenerator } from 'util';
import { CLEAN_PERSONNEL_OPERATION_RECORD, BANKCARD_STATUS, CLEAN_PERSONNEL_RULES } from './config';

export default {
	name: 'cleanPersonnelDetail',
	data() {
		return {
			CLEAN_PERSONNEL_OPERATION_RECORD,
			BANKCARD_STATUS,
			CLEAN_PERSONNEL_RULES,
			id: '',
			detail: {
				// 审核
				status: '1',
				remarks: '',
			},
			// 操作记录
			cleanerlog: [],
			submitLoading: false,
		};
	},
	methods: {
		// 清洗人员详情
		async loadDetail() {
			const { id } = this;
			if (!id) return this.$message('清洗人员 Id 不存在或无效, 无法查询清洗人员详情');

			const res = await this.$fetch(`/mgmt/acc/cleaner/detail/${id}`);

			if (res && res.code === 200 && res.data) {
				this.detail = res.data;
				this.$nextTick(this.cleanerLog);
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 操作记录
		async cleanerLog() {
			if (!this.id) return this.$message('清洗人员 Id 不存在或无效, 无法查询清洗人员操作记录');

			const res = await this.$fetch(`/mgmt/acc/cleaner/log/list/${this.id}`);

			if (res && res.data) {
				this.cleanerlog = res.data;
			}
		},
		// 审核验证
		cleanerValidate() {
			this.$refs.cleanerCheck.validate(valid => {
				if (valid) {
					this.cleanerStatusUpdate();
				} else {
					this.$message({
						type: 'warning',
						message: '请填写必填项',
					});
					return false;
				}
			});
		},
		// 审核
		async cleanerStatusUpdate() {
			this.submitLoading = true;
			const data = {
				id: this.id,
				status: this.detail.status,
				remarks: this.detail.remarks,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/acc/cleaner/status/update',
				data,
			});

			if (res && res.code == 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('CLEAN_PERSONNEL_LIST');
						this.$closeSelf();
					},
				});
			}
			this.submitLoading = false;
		},
	},
	mounted() {
		const { id } = this.$route.query;
		this.id = id;
		setTimeout(() => {
			this.loadDetail(id);
		}, 500);
	},
};
</script>

<style lang="scss" scoped>
h3 {
	font-size: 16px;
	color: $color-title;
	margin-bottom: 16px;
}
.part-gap {
	margin-bottom: 16px;
}
.input-item {
	width: 200px;
}
.bank_info {
	width: 330px;
}
.btn_row {
	display: flex;
	justify-content: center;
	.el-button {
		padding: 8px 20px;
		margin-right: 10px;
	}
}
</style>

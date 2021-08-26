<template>
	<div class="contract-detail">
		<guideBar />
		<el-card class="box-card">
			<el-row>
				<el-col :span="16">
					<span class="fs18 mr30">{{ signStatusStr }}</span>
					<el-button
						type="primary"
						v-permission="'service_contract_detail_submit'"
						icon="el-icon-document-checked"
						@click="submit"
					>
						提交合同签署
					</el-button>
				</el-col>
				<el-col :span="8" class="text-right">
					<el-button
						type="primary"
						v-if="contractData.signStatus === 5"
						v-permission="'service_contract_detail_remove'"
						@click="contractDel"
					>
						删除
					</el-button>
					<div v-else>
						<el-button
							type="danger"
							plain
							v-permission="'service_contract_detail_revoke'"
							@click="contractRevoke"
							v-if="contractData.signStatus < 4"
						>
							撤销
						</el-button>
						<el-button
							type="primary"
							plain
							v-permission="'service_contract_detail_edit'"
							@click="contractEdit"
							v-if="contractData.signStatus == 1"
						>
							编辑
						</el-button>
						<el-button
							type="primary"
							v-permission="'service_contract_detail_preview'"
							icon="el-icon-view"
							@click="contractPreview"
						>
							查看
						</el-button>
					</div>
				</el-col>
				<el-col :span="12" class="step-box">
					<el-steps :active="statusActive">
						<el-step
							title="创建合同"
							:description="formatDate(contractData.createTime)"
							:icon="statusActive >= 1 ? checkIcon : defaultIcon"
						></el-step>
						<el-step
							title="已撤销"
							:description="formatDate(contractData.undoTime)"
							:icon="statusActive >= 6 ? checkIcon : defaultIcon"
							v-if="statusActive >= 6"
						></el-step>
						<template v-else>
							<el-step
								title="提交合同"
								:description="formatDate(contractData.commitTime)"
								:icon="statusActive >= 2 ? checkIcon : defaultIcon"
							></el-step>
							<el-step
								title="店铺签署"
								:description="formatDate(contractData.sign1Time)"
								:icon="statusActive >= 3 ? checkIcon : defaultIcon"
							></el-step>
							<el-step
								title="公司签署"
								:description="formatDate(contractData.sign2Time)"
								:icon="statusActive >= 4 ? checkIcon : defaultIcon"
							></el-step>
							<el-step title="已完成" :icon="statusActive >= 5 ? checkIcon : defaultIcon"></el-step>
						</template>
					</el-steps>
				</el-col>
			</el-row>
		</el-card>
		<el-card>
			<el-row type="flex" v-for="item in SERVICE_CENTRE_CONTRACT_DETAIL_CONFIG" :key="item.prop">
				<el-col :lg="3" :md="4" :sm="5" class="text-right mr30">{{ item.label }}:</el-col>
				<el-col :span="20" v-if="item.formatter" v-html="item.formatter(item)"></el-col>
				<el-col :span="20" v-else>{{ item.value }}</el-col>
			</el-row>
		</el-card>
		<!-- 查看合同dialog -->
		<el-dialog title="查看合同" :visible.sync="contractDialog.show" :before-close="clearIframe" width="1300px">
			<iframe class="dialog-iframe" :src="contractDialog.src"></iframe>
		</el-dialog>
	</div>
</template>

<script>
import { SERVICE_CENTRE_CONTRACT_DETAIL_CONFIG, AGREE_STATUS } from './config';
import { formatDate } from 'util/formValidation.js';
export default {
	name: 'contractDetail',
	data() {
		return {
			SERVICE_CENTRE_CONTRACT_DETAIL_CONFIG,
			AGREE_STATUS,
			contractData: {},
			id: '',
			signStatusStr: '',
			contractDialog: { show: false, src: '' },
		};
	},
	computed: {
		checkIcon() {
			return 'el-icon-circle-check';
		},
		defaultIcon() {
			return 'el-icon-time';
		},
		statusActive() {
			const { signStatus } = this.contractData;
			return signStatus >= 4 ? signStatus + 1 : signStatus;
		},
		formatDate() {
			return formatDate;
		},
	},
	methods: {
		// 提交
		submit() {
			const params = { ids: [this.id] };
			this.$confirm('确定提交？', '提示').then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/store/submitContract',
					data: params,
				});
				if (res && res.code === 200) {
					this.loadData();
					this.$dispatch('CONTRACT_LIST_UPDATE');
					this.$message.success('操作成功');
				} else {
					this.$message.error('操作失败');
				}
			});
		},
		// 撤销
		contractRevoke() {
			this.$confirm('确定撤销合同吗？', '提示').then(async () => {
				const { id, storeCode } = this.contractData;
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/store/undoContract`,
					data: { contractManageId: id, storeCode },
				});
				if (res && res.code === 200) {
					this.$message.success('操作成功');
					this.$dispatch('CONTRACT_LIST_UPDATE');
					this.$closeSelf();
				} else {
					this.$message.error('操作失败');
				}
			});
		},
		// 删除
		contractDel() {
			this.$confirm('确认删除？', '提示').then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: `/mgmt/store/delContract?id=${this.id}`,
				});
				if (res && res.code === 200) {
					this.$message.success('操作成功');
					this.$dispatch('CONTRACT_LIST_UPDATE');
					this.$closeSelf();
				} else {
					this.$message.error('操作失败');
				}
			});
		},
		// 编辑
		contractEdit() {
			this.$go('service_contract_edit', { id: this.id });
		},
		// 查看
		async contractPreview() {
			const { docNo } = this.contractData;
			const res = await this.$fetch(`/mgmt/store/viewContract?docNo=${docNo}`);
			if (res && res.code === 200) {
				this.contractDialog = { show: true, src: res.data };
			} else {
				this.$message.error('获取合同信息失败');
			}
		},
		// 关闭查看回调
		clearIframe(done) {
			this.contractDialog.src = '';
			done();
		},
		// 获取对应法大大客户编号信息
		async loadCustomerInfo(storeCode) {
			const res = await this.$fetch(`/mgmt/store/queryStoreContractRelation?storeCode=${storeCode}`);
			if (res && res.data) {
				this.SERVICE_CENTRE_CONTRACT_DETAIL_CONFIG[2].value = res.data.customerId;
			} else {
				this.$message.error('获取法大大客户信息失败');
			}
		},
		// 获取数据
		async loadData() {
			const res = await this.$fetch(`/mgmt/store/queryContractDetailById?id=${this.id}`);
			if (res && res.data) {
				// console.log(AGREE_STATUS);
				this.signStatusStr = AGREE_STATUS[res.data.signStatus];
				this.contractData = res.data;
				this.SERVICE_CENTRE_CONTRACT_DETAIL_CONFIG.map(v => {
					v.value = res.data[v.prop];
				});
				this.loadCustomerInfo(res.data.storeCode);
			} else {
				this.$message.error('获取合同信息失败');
			}
		},
	},
	mounted() {
		this.$listen('CONTRACT_LIST_DETAIL_UPDATE', this.loadData);
		const { id } = this.$route.query;
		if (id) {
			this.id = id;
			this.loadData();
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.contract-detail {
	.step-box {
		margin-top: 16px;
	}
	.text-right {
		text-align: right;
	}
	.mr30 {
		margin-right: 30px;
	}
	.fs18 {
		font-size: 18px;
	}
	.el-row {
		margin-bottom: 16px;
		font-size: 14px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	.dialog-iframe {
		width: 100%;
		height: 600px;
	}
	.signature-center {
		left: 0;
	}
}
</style>

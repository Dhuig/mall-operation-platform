<template>
	<div class="hand-input-money-check">
		<guideBar>
			<el-button
				type="primary"
				@click="exportExcel"
				v-permission="'hand_input_money_check_export_excel'"
				v-if="unitActiveTab == 'audit'"
			>
				导出Excel
			</el-button>
		</guideBar>
		<el-card>
			<el-tabs v-model="unitActiveTab">
				<el-tab-pane label="手工录入" name="input">
					<input-unit :unitActiveTab="unitActiveTab" />
				</el-tab-pane>
				<el-tab-pane label="手工录入审核" name="audit">
					<audit-unit :unitActiveTab="unitActiveTab" @changeLoadData="changeLoadData" />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import inputUnit from './unit/inputUnit';
import auditUnit from './unit/auditUnit';
import { exportExcelPost } from 'util';
export default {
	name: 'handInputMoneyCheck',
	components: {
		'input-unit': inputUnit,
		'audit-unit': auditUnit,
	},
	data() {
		return {
			unitActiveTab: 'input',
			loadDataPost: {
				pageNum: 1,
				pageSize: 10,
			},
		};
	},
	methods: {
		// 导出Excel
		exportExcel() {
			const name = `手工录入款项审核列表`;
			const config = { timeout: 20000 };
			exportExcelPost('/mgmt/fin/wallet/exportAdjustList', this.loadDataPost, name, config);
		},
		changeLoadData(data) {
			this.loadDataPost = data;
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.hand-input-money-check {
	.check-detail {
		.title {
			font-size: 16px;
			margin-bottom: 22px;
		}
	}
	.edit-message {
		.edit-message-content {
			overflow: hidden;
			.flex {
				float: left;
				width: 50%;
				.el-form-item {
					margin-bottom: 0;
				}
			}
		}
	}
	.check-message {
		padding-top: 22px;
		.el-form-item {
			margin-bottom: 0;
		}
		.check-message-content {
			overflow: hidden;
		}
		.flex {
			float: left;
			width: 50%;
			&.w100p {
				width: 100%;
			}
		}
	}
	.el-dialog__footer {
		text-align: center;
	}
	.edit-wallet-balance {
		.el-select {
			width: 100%;
		}
		.flex {
			width: 80%;
			margin: 0 auto;
		}
	}
}
</style>
<template>
	<div class="perfect-wallet-list">
		<guideBar>
			<el-button
				v-permission="'perfect_wallet_batch_export'"
				type="primary"
				v-bind:loading="exportLoading"
				@click="batchExport"
			>
				批量导出
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfigTwo" :config="PERFECT_WALLET_LIST_CONFIG_TWO" @search="handleSearchTwo" />
		</el-card>
		<el-card>
			<tableList
				border
				ref="multipleTable"
				:loading="loading"
				:dataSource="list"
				:columns="LIST_COLUMNS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				showSummary
				:summary-method="getSummaries"
				@loadMore="loadMore"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button v-permission="'perfect_wallet_detail'" type="text" @click="detail(scope.data)">详情</el-button>
				</template>
			</tableList>
		</el-card>
		<!-- 新增/编辑 -->
		<el-dialog v-drag title="手工录入款项" :visible.sync="show" width="600px">
			<el-form
				class="add-rate"
				:model="ruleForm"
				:rules="HAND_INPUT_RULES"
				ref="ruleForm"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="flex">
					<el-form-item label="当前余额">
						<span>{{ ruleForm.actualBalance }}元</span>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="款项类型" prop="type">
						<el-select size="medium" v-model="ruleForm.type" placeholder="请选择款项类型">
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in MONEY_TYPE" :key="index" />
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="输入金额" prop="adjustAmount">
						<el-input size="medium" v-model="ruleForm.adjustAmount" placeholder="输入数字，支持小数点后2位" />
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="修改后余额">
						<span>￥{{ parseFloat(ruleForm.actualBalance) + parseFloat(ruleForm.adjustAmount) || 0 }}</span>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="修改原因说明" prop="adjustReason">
						<el-input size="medium" type="textarea" v-model="ruleForm.adjustReason" placeholder="请输入修改原因说明" />
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
				<el-button type="primary" @click="save('ruleForm')" class="save">提交审核</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { PERFECT_WALLET_LIST_CONFIG_TWO, LIST_COLUMNS, HAND_INPUT_RULES, MONEY_TYPE } from './config';
import { optionGenerator } from 'util';
export default {
	name: 'perfectWalletList',
	data() {
		return {
			PERFECT_WALLET_LIST_CONFIG_TWO,
			exportLoading: false, // 导出loading
			searchConfig: { storeCode: '', cardNo: '' },
			searchConfigTwo: {},
			MONEY_TYPE,
			LIST_COLUMNS,
			summaryData: null,
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			dataTotal: 0,
			loading: false,
			list: [],
			show: false,
			ruleForm: {},
			HAND_INPUT_RULES,
		};
	},
	watch: {
		'searchConfigTwo.storeCode'(val) {
			if (/^\d{6,}$/.test(val)) {
				this.handleSearchOne();
			}
		},
	},
	computed: {
		loadDataPost() {
			let data = { ...this.searchConfigTwo };
			data.pageNum = this.pagination.currentPage;
			data.pageSize = this.pagination.pageSize;
			return data;
		},
	},
	methods: {
		// 滚动加载
		loadMore() {
			const { currentPage, pageSize } = this.pagination;
			const { dataTotal } = this;
			if (currentPage * pageSize >= dataTotal) {
				return this.$message.warning('没有更多数据');
			}
			this.pagination.currentPage++;
			this.loadData();
		},
		// 批量导出
		async batchExport() {
			this.exportLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/exportList',
				data: this.loadDataPost,
				callback: () => {
					this.exportLoading = false;
				},
			});
			if (res && res.code == 200) {
				if (res.data) {
					this.$message.success('excel表格正在生成中，请在下载管理查看');
				} else {
					this.$message.warning('正在月结中，不支持导出');
				}
			} else {
				this.$message.error('操作失败');
			}
		},
		// 通过服务中心编号查询会员卡号
		async handleSearchOne() {
			const { storeCode } = this.searchConfigTwo;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/fin/wallet/getCardNoByStoreCode?storeCode=${storeCode}`,
			});
			if (res && res.code == 200) {
				this.searchConfigTwo.cardNo = res.data;
			} else {
				this.$message.error('获取会员卡号失败');
			}
		},
		// 第二栏查询事件
		handleSearchTwo() {
			this.pagination.currentPage = 1;
			this.list = [];
			this.loadData();
			this.loadSummaryAmt();
			this.loadDataTotal();
		},
		// 详情
		detail(row) {
			this.$go('perfect_wallet_detail', { info: JSON.stringify(row) });
		},
		// 手工录入
		edit(row) {
			this.show = true;
			const { actualBalance, walletId, walletAdjustId } = row;
			this.ruleForm = { actualBalance, walletId, walletAdjustId };
		},
		// 手工录入 -- 保存
		save(formName) {
			let data = this.ruleForm;
			this.$refs[formName].validate(async valid => {
				if (valid) {
					delete data.actualBalance;
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/fin/wallet/applyAdjust',
						data,
					});
					if (res && res.code == 200) {
						this.show = false;
						this.$refs[formName].resetFields();
					} else {
						this.$message({
							type: 'error',
							message: '操作失败',
						});
					}
				}
			});
		},
		// 手工录入 -- 取消
		cacel(formName) {
			this.show = false;
			this.$refs[formName].resetFields();
		},
		handleChangePage(page) {
			this.pagination.currentPage = page;
			this.loadData();
		},
		// 变更单页数据条数
		handleSizeChange(pageSize) {
			this.pagination = {
				currentPage: 1,
				pageSize,
			};
			this.loadData();
		},
		// 合计
		getSummaries() {
			const sums = [];
			const { summaryData, dataTotal } = this;
			if (summaryData) {
				LIST_COLUMNS.forEach((column, index) => {
					if (index === 0) {
						sums[index] = `合计:`;
						return;
					}
					if (index === 1) {
						sums[index] = `${dataTotal}条`;
						return;
					}
					if (column.summary) {
						sums[index] = column.prop in summaryData ? summaryData[column.prop] : '';
						sums[index] = typeof sums[index] == 'number' ? '' + sums[index] : '';
					} else {
						sums[index] = '';
					}
				});
			} else {
				LIST_COLUMNS.forEach((column, index) => {
					if (index === 0) {
						sums[index] = `合计:`;
						return;
					}
					if (index === 1) {
						sums[index] = `加载中...`;
						return;
					}
					if (column.summary) {
						sums[index] = '加载中...';
					}
				});
			}
			this.$nextTick(() => {
				this.$refs['multipleTable'].$children[0].doLayout();
			});
			return sums;
		},
		// 获取数据条数
		async loadDataTotal() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getWalletCount',
				data: this.loadDataPost,
				timeout: 60000,
			});
			if (res && res.code === 200) {
				this.dataTotal = res.data;
			} else {
				this.$message.error('获取数据合计条数失败，请查询服务是否可用');
			}
		},
		// 获取钱包管理合计金额
		async loadSummaryAmt() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getWalletTotalAmt',
				data: this.loadDataPost,
				timeout: 60000 * 2,
			});
			if (res && res.code === 200) {
				this.summaryData = res.data;
			} else {
				this.$message.error('获取钱包管理合计数据失败');
			}
		},
		// 请求钱包管理列表
		async loadData() {
			this.loading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/fin/wallet/getList',
				data: this.loadDataPost,
				timeout: 60000,
				callback: () => {
					this.loading = false;
				},
			});
			this.loading = false;
			if (res && res.code == 200 && res.data) {
				let { list } = res.data;
				this.list = this.list.concat(list);
			} else {
				this.$message.error('获取数据失败，请查询服务是否可用');
			}
		},
		// 获取字典映射
		async getDicts() {
			const [MONEY_TYPE] = await Promise.all([this.$getDict('NEW_MONEY_TYPE')]);
			MONEY_TYPE && (this.MONEY_TYPE = optionGenerator(MONEY_TYPE));
		},

		// 获取分公司编号
		async loadCompanyCode() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.PERFECT_WALLET_LIST_CONFIG_TWO.form[3].options = serviceCompanyOptions.map(({ label, value }) => ({
				label: `${value} ${label}`,
				value,
			}));
		},
	},
	mounted() {
		this.getDicts();
		this.loadCompanyCode();
		this.handleSearchTwo();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.perfect-wallet-list {
	.dialog-footer {
		display: flex;
		justify-content: center;
	}
}
::v-deep.add-rate {
	.el-form-item {
		margin-bottom: 25px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.el-input-group__append {
		padding: 0 6px;
	}
	.flex {
		display: flex;
		justify-content: center;
	}
}
.save {
	width: 100px;
	margin-right: 16px;
	margin-left: 16px;
}
.cacel {
	width: 100px;
}
</style>

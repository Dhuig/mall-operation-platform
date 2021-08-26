<template>
	<div>
		<el-card class="box-card">
			<searchPanel :config="CUSTOMER_CODE_CONFIG" @search="customerCodeSearch" @reset="customerCodeReset" />
		</el-card>
		<el-card class="card-gap">
			<div class="statistics-content">
				<div class="fiex" v-for="(item, name) in SUBMITORDERS_CODE" :key="item">
					<div class="text">{{ item }}</div>
					<div class="text" v-if="'couponCount' === name">
						{{ breakdownList['couponCount'] === '-1' ? '不限制' : breakdownList[name] }}
					</div>
					<div class="text" v-else>{{ breakdownList[name] ? breakdownList[name] : 0 }}</div>
				</div>
			</div>
			<tableList
				border
				:dataSource="customerCodeList.data"
				:pagination="customerCodeList.pagination"
				:dataTotal="customerCodeList.total"
				:loading="customerCodeList.loading"
				@handleChangePage="customerCodeChangePage"
				@handleSizeChange="customerCodeSizeChange"
				:columns="DETAIL_CODE_CHANGE_COLUMNS"
			>
				<!-- <template slot="content_context">
					<div class="daochu">
						<el-button type="primary" @click="customerCodeData(1)">导 出</el-button>
					</div>
				</template> -->
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { CUSTOMER_CODE_CONFIG, DETAIL_CODE_CHANGE_COLUMNS, SUBMITORDERS_CODE } from '../config';
import { exportExcel } from 'util';
import qs from 'querystring';
export default {
	name: 'couponCode',
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			SUBMITORDERS_CODE,
			CUSTOMER_CODE_CONFIG,
			DETAIL_CODE_CHANGE_COLUMNS,
			customerCodeList: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				memberInfo: null,
				customerIds: [],
			},
			breakdownList: {},
		};
	},
	created() {
		this.customerCodeData();
		this.breakdown();
	},
	methods: {
		customerCodeSearch({ isExchange, state }) {
			this.customerCodeList.isExchange = isExchange;
			this.customerCodeList.state = state;
			this.customerCodeData();
		},
		customerCodeReset({ isExchange, state }) {
			this.customerCodeList.isExchange = isExchange;
			this.customerCodeList.state = state;
			this.customerCodeData();
		},
		customerCodeChangePage(val) {
			this.customerCodeList.pagination.currentPage = val;
			this.customerCodeData();
		},
		customerCodeSizeChange(val) {
			this.customerCodeList.pagination.pageSize = val;
			this.customerCodeData();
		},
		async customerCodeData(status) {
			let { id } = this.pageData;
			let {
				customerCodeList: {
					pagination: { currentPage, pageSize },
					isExchange,
					state,
				},
			} = this;
			let params = { pageNum: currentPage, pageSize, isExchange, state, couponId: id };
			if (status) {
				exportExcel(`/mgmt/prmt/coupon/exportCodeList`, { isExchange, state, couponId: id });
				return;
			}
			const res = await this.$fetch(`/mgmt/prmt/coupon/getCouponCodePage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				let { list, total } = res.data;
				this.customerCodeList.data = list;
				this.customerCodeList.total = total;
			}
		},
		async breakdown() {
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/coupon/getCouponCodeData`,
				params: { couponId: this.pageData.id },
			});
			if (res && res.code === 200) {
				this.breakdownList = Object.assign(this.breakdownList, res.data);  
				this.breakdownList.exchangePercent = this.breakdownList.exchangePercent + '%';
			}
		},
	},
	watch: {},
};
</script>

<style lang="scss" scoped>
.daochu {
	height: 32px;
	padding: 0 0 15px 0;
	.btn-dc {
		float: right;
	}
}
.statistics-content {
	display: flex;
	.fiex {
		flex: 1;
		text-align: center;
		font-size: $font-size;
		.text {
			line-height: 30px;
		}
	}
}
</style>

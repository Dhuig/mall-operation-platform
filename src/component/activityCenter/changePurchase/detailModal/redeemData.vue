<template>
	<div>
		<el-card class="box-card">
			<searchPanel :config="DATA_CONFIG" @search="dataSearch" />
		</el-card>
		<el-card class="card-gap">
			<div>
				<div class="head-text">
					数据统计:
					<span class="statistics">明天凌晨2点，更新前一天数据统计</span>
				</div>
				<div class="statistics-content">
					<div class="fiex" v-for="(item, name) in SUBMITORDERS" :key="item">
						<div class="text">{{ item }}</div>
						<div class="text">{{ activityList[name] ? activityList[name] : 0 }}</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="activity-data">
				<tableList
					border
					:dataSource="activityList.data"
					:pagination="activityList.pagination"
					:dataTotal="activityList.total"
					:loading="activityList.loading"
					@handleChangePage="activityChangePage"
					@handleSizeChange="activitySizeChange"
					:columns="DATA_COLUMNS"
				>
					<template slot="content_context">
						<div class="daochu">
							<el-button
								class="btn-dc"
								type="primary"
								v-permission="'change_purchase_detail_export_data'"
								@click="activityData(1)"
							>
								导出
							</el-button>
						</div>
					</template>
				</tableList>
			</div>
		</el-card>
	</div>
</template>

<script>
import { DATA_CONFIG, SUBMITORDERS, DATA_COLUMNS } from '../config';
import { exportExcel } from 'util';
import { formatDate } from 'util/formValidation.js';
import qs from 'querystring';
export default {
	name: 'redeemData',
	data() {
		return {
			DATA_CONFIG,
			SUBMITORDERS,
			DATA_COLUMNS,
			activityList: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				promotionId: '',
				startTime: null,
				endTime: null,
			},
		};
	},
	created() {},
	methods: {
		dataSearch({ searchtime }) {
			this.activityList.startTime = searchtime.length > 0 ? formatDate(searchtime[0]) : '';
			this.activityList.endTime = searchtime.length > 0 ? formatDate(searchtime[1]) : '';
			this.activityData();
		},
		activityChangePage(val) {
			this.activityList.pagination.currentPage = val;
			this.activityData();
		},
		activitySizeChange(val) {
			this.activityList.pagination.pageSize = val;
			this.activityData();
		},
		async activityData(status) {
			let { id } = this.$route.query;
			let {
				activityList: {
					pagination: { currentPage, pageSize },
					startTime,
					endTime,
				},
			} = this;
			let params = { pageNum: currentPage, pageSize, promotionId: id, startTime, endTime };
			if (status) {
				exportExcel(`/mgmt/prmt/exportPromotionData`, { startTime, endTime, promotionId: id });
				return;
			}
			const res = await this.$fetch(`/mgmt/prmt/getPromotionDataPage?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.activityList = Object.assign(this.activityList, res.data);
				this.activityList.data = res.data.pageVo.list;
				this.activityList.total = res.data.pageVo.total;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.head-text {
	font-size: 18px;
	font-weight: 600;
	padding-bottom: 20px;
	.statistics {
		font-size: $font-size;
		color: $color-disabled;
		font-weight: 400;
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
.daochu {
	height: 32px;
	padding: 0 0 15px 0;
	.btn-dc {
		float: right;
	}
}
.activity-data {
	overflow: hidden;
}
</style>

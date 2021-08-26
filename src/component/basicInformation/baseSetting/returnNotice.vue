<template>
	<div>
		<guideBar />
		<el-card>
			<tableList :dataSource="dataSource" :columns="RETURN_NOTICE_COLUMNS" slotcontent>
				<template slot-scope="scope">
					<el-button v-permission="'return_notice_detail'" type="text" @click="viewDetail(scope.data)">详情</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { RETURN_NOTICE_COLUMNS, TUIHUANHUO_XUZHI } from './config';

export default {
	name: 'returnNotice',
	data() {
		return {
			RETURN_NOTICE_COLUMNS,
			dataSource: [],
		};
	},
	methods: {
		// 编辑
		viewDetail({ id, returnType }) {
			this.$go('return_notice_detail', { id, returnType, title: `${TUIHUANHUO_XUZHI[returnType]}须知详情` });
		},
		// 请求列表数据
		async loadReturnNotice() {
			const res = await this.$fetch('/mgmt/sys/getAllReNotice');
			if (res && res.data) {
				this.dataSource = res.data;
			} else {
				this.dataSource = [];
			}
		},
	},
	created() {
		this.loadReturnNotice();
	},
};
</script>

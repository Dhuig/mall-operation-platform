<template>
	<div class="serviceCenterDetail">
		<el-row class="el-row row-gap" v-for="(dataSource, $idx) in data" :key="$idx">
			<el-form :model="dataSource" label-width="120px" label-suffix=":">
				<el-col :span="8" class="flex">
					<el-form-item label="账户名称">{{ dataSource.accountName || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="账号">{{ dataSource.account || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="开户银行">{{ dataSource.accountBank || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="银行省份">{{ dataSource.provinceName || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="银行城市">{{ dataSource.cityName || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="开户行名称">{{ dataSource.branch || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="账户性质">
						{{ dataSource.accountType in ACCOUNT_TYPE ? ACCOUNT_TYPE[dataSource.accountType] : '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="是否扣款账号">
						{{ dataSource.isDeduction in DECUCTION_TYPE ? DECUCTION_TYPE[dataSource.isDeduction] : '' }}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="开户许可证">
						<el-image
							v-if="dataSource.permissionUrl"
							:src="dataSource.permissionUrl"
							:preview-src-list="[dataSource.permissionUrl]"
							alt="开户许可证"
						/>
					</el-form-item>
				</el-col>
			</el-form>
		</el-row>
		<el-row v-if="!data.length" type="flex" justify="center" class="tips">暂无银行帐户资料数据</el-row>
	</div>
</template>

<script>
import { ACCOUNT_TYPE, DECUCTION_TYPE } from './config';
export default {
	name: 'serviceCenterDetail',
	props: {
		data: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			ACCOUNT_TYPE,
			DECUCTION_TYPE,
		};
	},
};
</script>
<style lang="scss" scoped>
.tips {
	padding: 50px 0;
	font-size: 12px;
}
.row-gap {
	padding-bottom: 10px;
	margin-bottom: 8px;
	border-bottom: 1px dashed #ccc;
}
::v-deep.serviceCenterDetail {
	.el-form-item {
		margin-bottom: 0;
		img {
			max-width: 128px;
		}
	}
}
</style>

<template>
	<div class="shopDetail">
		<el-form :model="dataSource" label-width="120px" label-suffix=":">
			<el-row class="el-row" :data="dataSource">
				<el-col :span="8" class="flex">
					<el-form-item label="房产类型">{{ HOUSE_TYPE[dataSource.propertyType] || '' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="租赁年限">{{ dataSource.leaseTerm || '' }}年</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="月租">{{ dataSource.monthlyRent || '' }}元</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="总面积">{{ dataSource.totalArea || '' }}㎡</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="营业区面积">{{ dataSource.businessArea || '' }}㎡</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="营业区层高">{{ dataSource.businessFloorHeight || '' }}m</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="店铺长度">{{ dataSource.shopLength || '' }}m</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="店铺宽度">{{ dataSource.shopWidth || '' }}m</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="招牌长度">{{ dataSource.signLength || '' }}m</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="招牌宽度">{{ dataSource.signWidth || '' }}m</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="是否安装招牌">{{ dataSource.isSign == 1 ? '是' : '否' }}</el-form-item>
				</el-col>
				<el-col :span="8" class="flex">
					<el-form-item label="是否安装LED灯">{{ dataSource.isLed == 1 ? '是' : '否' }}</el-form-item>
				</el-col>
				<el-col :span="24" class="flex">
					<el-form-item label="店铺类型">{{ SHOP_TYPE[dataSource.shopType] || '' }}</el-form-item>
				</el-col>
				<el-col :span="24" class="flex">
					<el-form-item label="店铺装修图">
						<el-row type="flex" v-if="dataSource.storePic">
							<el-image
								v-for="(item, index) in dataSource.storePic"
								:key="index"
								fit="scale-down"
								class="image-wrap"
								:src="item"
								:preview-src-list="dataSource.storePic"
								alt
							/>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
import { HOUSE_TYPE, SHOP_TYPE } from './config';
export default {
	name: 'shopDetail',
	props: {
		dataSource: {
			type: Object,
		},
	},
	data() {
		return {
			HOUSE_TYPE,
			SHOP_TYPE,
		};
	},
	watch: {
		dataSource: {
			handler(data) {
				if (data.storePic) {
					data.storePic = data.storePic.split(',');
				}
			},
		},
	},
	mounted() {},
	methods: {},
};
</script>
<style lang="scss" scoped>
.shopDetail {
	.el-form-item {
		margin-bottom: 0;
	}
	.flex {
		img {
			width: 100%;
		}
	}
	.padding-10 {
		padding: 0 10px;
	}
	.image-wrap {
		max-width: 150px;
		margin-right: 8px;
	}
}
</style>

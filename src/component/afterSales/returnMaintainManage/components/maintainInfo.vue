<template>
	<div class="maintain-info">
		<el-card>
			<div class="header">
				<h4 class="title">维修信息</h4>
				<el-button
					v-if="repairStatus === 3 || (repairStatus === 4 && editMaintainInfo)"
					type="primary"
					v-permission="'return_maintain_detail_add_item'"
					@click="addRepair"
				>
					添加维修项目
				</el-button>
			</div>
			<el-table :data="dataSource" style="width: 100%;">
				<el-table-column prop="productCode" label="产品编码" width="180"></el-table-column>
				<el-table-column label="配件编码" width="180">
					<template slot-scope="scope">
						<el-select
							v-model="scope.row.fittingsNo"
							@change="value => partsChange(value, scope.$index)"
							placeholder="请选择配件编码"
							:disabled="disabledEdit"
							:class="{ red: !scope.row.fittingsNo }"
						>
							<el-option
								v-for="item in partsList"
								:key="item.id"
								:label="item.fittingSerialno"
								:value="item.id"
							></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="配件名称">
					<template slot-scope="scope">
						<el-input v-model="scope.row.fittingsName" disabled placeholder="配件名称"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="fittingsType" label="维修/更换配件" min-width="120">
					<template slot-scope="scope">
						<el-select v-model="scope.row.fittingsType" placeholder="请选择" :disabled="disabledEdit">
							<el-option label="维修" :value="1"></el-option>
							<el-option label="更换" :value="2"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="数量">
					<template slot-scope="scope">
						<el-input
							type="number"
							min="0"
							:disabled="disabledEdit"
							v-model.number="scope.row.quantity"
							:class="{ red: !scope.row.quantity }"
							@input="quantityChange(scope.row, scope.$index)"
							placeholder="数量"
						></el-input>
					</template>
				</el-table-column>
				<el-table-column label="单价">
					<template slot-scope="scope">
						<el-input v-model="scope.row.price" disabled placeholder="配件编码"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="费用">
					<template slot-scope="scope">
						<el-input v-model="scope.row.amount" disabled placeholder="配件编码"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" v-if="repairStatus === 3 || (repairStatus === 4 && editMaintainInfo)">
					<template slot-scope="scope">
						<el-button type="text" @click="hadleDel(scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="maintain-fee">维修费用合计：{{ totalAmount }}</div>
			<el-form label-suffix=":" :model="formData">
				<el-row>
					<el-col :span="8">
						<el-form-item label="付费方式">
							<el-select v-if="repairStatus === 3" v-model="formData.payType" :disabled="repairStatus !== 3">
								<el-option key="mianfeiweixiu" label="免费维修" :value="1"></el-option>
								<el-option key="fufeiweixiu" label="付费维修" :value="2"></el-option>
							</el-select>
							<div v-else>{{ detailData.payType === 2 ? '付费维修' : '免费维修' }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="检测结果">
							<el-input
								v-if="repairStatus === 3"
								type="textarea"
								v-model="formData.detectionResult"
								:disabled="repairStatus !== 3"
								style="width: 60%;"
							/>
							<div v-else>{{ detailData.detectionResult }}</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'maintainInfo',
	props: ['repairStatus', 'detailData', 'editMaintainInfo'],
	data() {
		return {
			partsList: [],
			formData: {
				payType: 1,
				detectionResult: '',
			},
			totalAmount: 0,
			nowServiceStatus: 0,
		};
	},
	computed: {
		dataSource: vm => vm.detailData.fittingsList,
		disabledEdit: vm => !(vm.repairStatus === 3 || (vm.repairStatus === 4 && vm.editMaintainInfo)),
	},
	methods: {
		// 删除
		hadleDel(key) {
			this.dataSource.splice(key, 1);
			this.allAmountChange();
		},
		// 添加维修项目
		addRepair() {
			let addRepairData = {
				productCode: this.detailData.productCode, // 产品编码
				fittingsNo: '', // 配件编码
				fittingsName: '', // 配件名称
				fittingsType: 1, // 维修/更换配件
				quantity: 1,
				price: 0, // 单价
				amount: 0, // 费用
			};
			this.dataSource.push(addRepairData);
		},
		// 配件选择
		partsChange(value, key) {
			let isRepair = this.partsList.find(item => {
				return item.id === value;
			});
			let newRepairData = {
				id: isRepair.id,
				productCode: isRepair.productSerialno, // 产品编码
				fittingsNo: isRepair.id, // 配件编码
				fittingsName: isRepair.fittingTitle, // 配件名称
				fittingsType: 1, // 维修/更换配件
				quantity: 1,
				price: isRepair.fittingPrice, // 单价
				amount: isRepair.fittingPrice, // 费用
			};
			this.$set(this.dataSource, key, newRepairData);
			this.allAmountChange();
		},
		// 数量变化
		quantityChange(data, key) {
			if (this.dataSource[key].quantity < 0) {
				this.dataSource[key].quantity = 0;
			}
			this.$set(this.dataSource[key], 'amount', data.quantity * data.price);
			console.log(data.quantity * data.price);
			this.allAmountChange();
		},
		//
		allAmountChange() {
			let allAmount = 0;
			this.dataSource.forEach(v => {
				allAmount += v.amount;
			});
			console.log(allAmount);
			this.totalAmount = allAmount;
		},
		// 获取配件编码下拉数据
		async creditAudit() {
			let params = {
				productSerialnos: [this.detailData.productCode],
			};
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/order/factory/getFittingList',
				data: params,
			});
			if (res && res.code === 200) {
				this.partsList = res.data;
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
	},
	mounted() {
		this.creditAudit();
		this.allAmountChange();
		this.nowServiceStatus = this.detailData.statusChangeList[
			this.detailData.statusChangeList.length - 1
		]?.serviceStatus;
	},
};
</script>

<style lang="scss" scoped>
::v-deep .red {
	.el-input__inner {
		border-color: $error;
	}
}
.maintain-info {
	.header {
		display: flex;
		justify-content: space-between;
		padding-bottom: 20px;
		.title {
			font-size: 18px;
			font-weight: 500;
			padding-bottom: 20px;
		}
	}
	.maintain-fee {
		padding: 0 40px 20px 0;
		color: red;
		text-align: right;
	}
}
</style>

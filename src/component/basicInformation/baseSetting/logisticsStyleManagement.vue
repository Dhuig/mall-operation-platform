<template>
	<div class="remit-type">
		<guideBar></guideBar>
		<el-card class="box-card">
			<tableList
				border
				:loading="loading"
				:options="options"
				:dataSource="dataSource"
				:columns="LOGISTICS_COLUMNS"
				slotcontent
			>
				<template slot-scope="row">
					<span class="btns" @click="handleEdit(row.data, 'edit')">编辑</span>
					<span class="btns" @click="handleEdit(row.data, 'jy')">{{ row.data.status === 1 ? '禁用' : '启用' }}</span>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="编辑适用对象" v-drag :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
			<div>
				<el-form :inline="true" label-width="120px">
					<el-form-item label="物流方式名称：" prop="name">
						<el-input :value="this.cardNoFn[postData.cardNo]" :disabled="true" placeholder=""></el-input>
					</el-form-item>
					<el-form-item label="适用对象：" prop="name">
						<el-checkbox-group v-model="postData.checkedCities">
							<el-checkbox v-for="(city, index) in cities" :label="city.key" :value="city.key" :key="index">
								{{ city.name }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { LOGISTICS_COLUMNS } from './config';

export default {
	name: 'logisticsStyleManagement',
	data() {
		return {
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			postData: {
				cardNo: '',
				id: '',
				checkedCities: [],
			},
			cardNoFn: { 1: '自提', 2: '完美公司交付' },
			cardNo: '',
			checkedCities: [],
			dialogVisible: false,
			loading: false,
			LOGISTICS_COLUMNS,
			dataSource: [],
			cities: [
				{ name: '普通顾客', key: '1' },
				{ name: '优惠顾客', key: '2' },
				{ name: '云商', key: '4' },
				{ name: '微店', key: '8' },
			],
		};
	},
	methods: {
		handleClose() {
			this.dialogVisible = false;
		},
		async save() {
			const res = await this.$fetch(
				`/mgmt/sys/updateLogisticsOfRole?id=${this.postData.id}&applianceRoleFlag=${this.postData.checkedCities}`
			);
			if (res && res.code === 200) {
				this.dialogVisible = false;
				this.$message.success(res.message);
				this.getList();
			}
		},
		// 编辑
		handleEdit(row, type) {
			if (type === 'edit') {
				this.postData.cardNo = row.type;
				this.postData.id = row.id;
				this.postData.checkedCities = row.applianceRoleFlag;
				this.dialogVisible = true;
			} else {
				this.$confirm(`确定${row.status === 1 ? '禁用' : '启用'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(async () => {
					const res = await this.$fetch(
						`/mgmt/sys/alterLogisticsPermission?id=${row.id}&status=${row.status === 1 ? 0 : 1}`
					);
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.getList();
					}
				});
			}
		},
		// 请求列表数据
		async getList() {
			this.loading = true;
			const res = await this.$fetch('/mgmt/sys/getLogisticsList');
			if (res && res.code === 200) this.dataSource = res.code === 200 ? res.data : [];
			this.loading = false;
		},
	},
	created() {
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
.remit-type {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}

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
</style>

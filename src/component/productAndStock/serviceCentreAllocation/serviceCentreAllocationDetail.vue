<template>
	<div>
		<guideBar />
		<el-card>
			<el-form :model="detail" label-width="110px" label-position="right" label-suffix=":" size="small" inline disabled>
				<el-form-item label="服务中心编号" prop="typeName">
					<el-input size="medium" :value="detail.code" />
				</el-form-item>
				<el-form-item label="服务中心名称" prop="typeName">
					<el-input size="medium" :value="detail.name" />
				</el-form-item>
				<el-form-item label="负责人" prop="typeName">
					<el-input size="medium" :value="detail.leaderName" />
				</el-form-item>
				<el-form-item label="负责人卡号" prop="typeName">
					<el-input size="medium" :value="detail.leaderCardNo" />
				</el-form-item>
			</el-form>
		</el-card>
		<el-card>
			<el-row class="row-gap">
				<el-button
					type="primary"
					@click="addNewProductAllocation"
					v-permission="'service_center_allocation_add'"
					icon="el-icon-plus"
				>
					添加新产品分配
				</el-button>
				<template v-if="isEditing">
					<el-button type="success" @click="saveUpdateAllocation" icon="el-icon-check" :loading="updateLoading">
						保存
					</el-button>
					<el-button @click="toggleEditingStatus">取消</el-button>
				</template>
				<el-button
					type="primary"
					@click="toggleEditingStatus"
					v-permission="'service_center_allocation_modify'"
					icon="el-icon-edit"
					:disabled="!data.length"
					v-else
				>
					修改数量
				</el-button>
			</el-row>
			<el-table v-loading="loading" :data="data" border>
				<el-table-column type="index" />
				<el-table-column label="产品代码" prop="serialNo" />
				<el-table-column label="产品名称" prop="title" />
				<el-table-column label="产品规格" prop="packing" />
				<el-table-column label="产品单位" prop="meterUnit" />
				<el-table-column label="最大可销售数量" prop="maxNum">
					<template slot-scope="scope">
						<el-input
							type="number"
							v-model.number="scope.row.maxNum"
							size="small"
							:min="0"
							:max="99999999"
							v-if="isEditing"
						/>
						<span v-else>{{ scope.row.maxNum }}</span>
					</template>
				</el-table-column>
				<el-table-column label="已销售数量" prop="mortgageNum" />
				<el-table-column label="控制类型" prop="type">
					<template slot-scope="scope">
						<span>{{ scope.row.type in CONTROL_TYPE ? CONTROL_TYPE[scope.row.type] : '' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" v-if="isEditing">
					<template slot-scope="scope">
						<el-button
							v-permission="'service_centre_allocation_detail_delete'"
							type="text"
							@click="deleteItem(scope.row.id)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				background
				class="pagination"
				:total="total"
				:current-page.sync="pagination.currentPage"
				:page-size="pagination.pageSize"
				@current-change="handleChangePage"
				@size-change="handleSizeChange"
				layout="sizes, total , prev, pager, next, jumper"
			/>
		</el-card>
		<!-- 新增产品分配量 -->
		<el-dialog title="新增产品分配量" :visible.sync="allocation.show" width="35%" :close-on-click-modal="true" v-drag>
			<el-form :model="allocation.form" label-width="140px" label-position="left" label-suffix=":" size="small">
				<el-form-item label="产品代码">
					<el-input v-model="allocation.form.serialNo">
						<el-button slot="append" icon="el-icon-search" @click="handleSearchProductBySerialNo">搜索</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="产品名称">
					<el-input :value="allocation.form.title" disabled />
				</el-form-item>
				<el-form-item label="规格">
					<el-input :value="allocation.form.packing" disabled />
				</el-form-item>
				<el-form-item label="单位">
					<el-input :value="allocation.form.meterUnit" disabled />
				</el-form-item>
				<el-form-item label="控制类型">
					<span>{{ CONTROL_TYPE[allocation.form.type] }}</span>
				</el-form-item>
				<el-form-item label="最大可押货数量">
					<el-input type="number" v-model.number="allocation.form.maxNum" :min="0" :max="99999999" />
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="cancelUpdateAllocation">取 消</el-button>
				<el-button
					type="primary"
					@click="saveBatchUpdateAllocation"
					:disabled="
						!allocation.form.serialNo ||
						!allocation.form.productId ||
						typeof allocation.form.maxNum !== 'number' ||
						!/^[0-9]*$/.test(allocation.form.maxNum)
					"
					icon="el-icon-check"
				>
					保存
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { CONTROL_TYPE } from './config';
import qs from 'querystring';

export default {
	name: 'serviceCentreAllocationDetail',
	data() {
		return {
			CONTROL_TYPE,
			loading: false,
			detail: {
				code: '',
				name: '',
				leaderName: '',
				leaderCardNo: '',
			},
			data: [],
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			total: 0,
			isEditing: false,
			updateLoading: false,
			allocation: {
				show: false,
				form: {
					productId: '',
					serialNo: '',
					title: '',
					packing: '',
					meterUnit: '',
					type: 1,
					maxNum: 0,
				},
			},
		};
	},
	methods: {
		// 分页触发事件
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},
		// 删除产品分配项
		deleteItem(id) {
			if (!id) return this.$message('产品Id 不存在或无效, 无法执行删除操作');
			this.$confirm('确定删除该产品吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteAllocationItem(id);
				})
				.catch(() => {
					this.$message('已删下架操作');
				});
		},
		// 添加新产品分配
		addNewProductAllocation() {
			this.allocation = {
				show: true,
				form: {
					serialNo: '',
					productId: '',
					title: '',
					packing: '',
					meterUnit: '',
					type: 1,
					maxNum: 0,
				},
			};
		},
		// 切换编辑状态
		toggleEditingStatus() {
			this.isEditing = !this.isEditing;
		},
		// 保存更新后的服务中心分配量
		saveUpdateAllocation() {
			const { data } = this;
			if (!data || !data.length) return this.$message('分配量详情为空, 无法更新');
			const updateList = data.map(({ id: distId, maxNum }) => ({ distId, maxNum }));
			this.updateAllocationItem(updateList);
		},
		// 搜索回调
		handleSearchProductBySerialNo() {
			const { serialNo } = this.allocation.form;
			if (!serialNo || !serialNo.length) return this.$message('请输入产品编码号再进行查询');
			this.searchProductByCode(serialNo);
		},
		// 取消回调
		cancelUpdateAllocation() {
			this.allocation.show = false;
		},
		// 保存回调
		saveBatchUpdateAllocation() {
			const {
				detail: { code: storeCode },
				allocation: {
					form: { productId, maxNum },
				},
			} = this;
			if (!storeCode) return this.$message('服务中心编码不存在, 无法执行添加分配量操作');
			const addItem = {
				storeCode,
				productId,
				maxNum,
			};
			this.addAllocationItem(addItem);
		},
		// 获取服务中心列表
		async loadData() {
			this.loading = true;
			const {
				detail: { code: storeCode },
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const params = {
				storeCode,
				pageNum,
				pageSize,
			};

			const res = await this.$fetch(`/mgmt/product/quota/getDetail?${qs.stringify(params)}`);
			if (res && res.data) {
				const { list, total } = res.data;
				this.data = list;
				this.total = total;
			} else {
				this.data = [];
				this.total = 0;
			}
			this.loading = false;
		},
		// 删除分配量条目
		async deleteAllocationItem(distId) {
			if (!distId) return;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/quota/delProduct?distId=${distId}`,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(this.loadData);
			} else {
				this.$message({
					type: 'error',
					message: '上架商品失败',
				});
			}
		},
		// 更新分配量条目
		async updateAllocationItem(data) {
			this.updateLoading = true;

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/quota/batchUpdateProduct',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.toggleEditingStatus();
					this.loadData();
				});
			} else {
				this.$message({
					type: 'error',
					message: '更新分配量失败',
				});
			}

			this.updateLoading = false;
		},
		// 新增分配量条目
		async addAllocationItem(params) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/quota/addProduct?${qs.stringify(params)}`,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.allocation.show = false;
					this.loadData();
				});
			} else {
				this.$message({
					type: 'error',
					message: '新增分配量失败',
				});
			}
		},
		// 根据产品编码查询产品
		async searchProductByCode(serialNo) {
			if (!serialNo) return;
			const res = await this.$fetch(`/mgmt/product/item/getProductInfo?serialNo=${serialNo}`);
			if (res && res.code === 200 && res.data) {
				const { id: productId, title, packing, meterUnit } = res.data;
				this.allocation.form = {
					...this.allocation.form,
					productId,
					title,
					packing,
					meterUnit,
				};
			} else {
				this.$message({
					type: 'warning',
					message: '无法搜索到产品, 请确认产品编码正确',
				});
			}
		},
	},
	mounted() {
		const { code = '', name = '', leaderName = '', leaderCardNo = '' } = this.$route.query;
		this.detail = {
			code,
			name,
			leaderName,
			leaderCardNo,
		};
		code && this.loadData();
	},
};
</script>

<style lang="scss" scoped>
::v-deep.pagination {
	margin-top: 16px;
	text-align: right;
	.el-pagination__sizes {
		float: left;
	}
	.el-pagination__total {
		float: left;
	}
}
.row-gap {
	margin-bottom: 12px;
}
</style>

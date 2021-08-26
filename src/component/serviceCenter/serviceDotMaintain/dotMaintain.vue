<template>
	<div class="dotMaintain">
		<guideBar>
			<el-button v-permission="'service_dot_maintain_add_type'" type="primary" @click="addReturn">新增类型</el-button>
		</guideBar>
		<el-card>
			<tableList
				border
				:dataSource="dataSource"
				:columns="columns"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'service_dot_maintain_edit'" type="text" @click="handleBtnsGruop(row.data, 'edit')">
						修改
					</el-button>
					<el-button
						v-permission="'service_dot_maintain_delete'"
						type="text"
						@click="handleBtnsGruop(row.data, 'delete')"
					>
						删除
					</el-button>
				</template>
			</tableList>
		</el-card>

		<!-- 新增编辑提示窗口 -->
		<el-dialog title="新增/修改网点类型" label-suffix=":" :visible.sync="showAddReturnBox" width="30%" v-drag>
			<el-form :model="addReturnData" :rules="addReturnDataRules" ref="addReturnData" class="add-user">
				<el-form-item label="网点类型" prop="name">
					<el-input v-model="addReturnData.name" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="addReturnData.remark" size="medium"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submit('addReturnData')" style="width: 100px; margin-right: 16px">
					确定
				</el-button>
				<el-button @click="showAddReturnBox = false" style="width: 100px">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import qs from 'querystring';
import { loadShopTypeData } from '@/service'; // 更新store仓库网点类型数据
export default {
	name: 'dotMaintain',
	data() {
		return {
			columns: [
				{
					prop: 'name',
					label: '网点类型',
					align: 'left',
				},
				{
					prop: 'remark',
					label: '备注',
					align: 'left',
				},
			],
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			dataTotal: 0,
			options: {
				// label: '全部',
				index: true,
				// selection: false,
				labelIndex: '序号',
			},
			id: '',
			dataSource: [],
			showAddReturnBox: false,
			addReturnData: {}, //新增编辑分配额度
			addReturnDataRules: {
				name: [{ required: true, message: '请输入网点类型', trigger: 'blur' }],
			},
			centerDialogVisible: false,
			dialogContent: '',
			loading: false,
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		handleBtnsGruop(row, handleType) {
			switch (handleType) {
				case 'edit':
					//修改
					this.id = row.id;
					this.addReturnData = { ...row };
					this.showAddReturnBox = true;
					break;
				case 'delete':
					//删除
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(() => {
							this.delShopType(row.id);
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消删除',
							});
						});
					break;
				default:
					break;
			}
		},
		// 获取列表
		async loadData() {
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this;
			const params = {
				pageNum,
				pageSize,
			};
			const res = await this.$fetch(`/mgmt/store/list/shopType?${qs.stringify(params)}`);
			if (res && res.data) {
				this.dataSource = res.data.list;
				this.dataTotal = res.data.total;
			} else {
				this.$message.error('获取列表数据失败');
			}
		},
		async delShopType(id) {
			let params = {
				id,
			};
			const res = await this.$fetch(`/mgmt/store/del/shopType?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: '删除成功!',
				});
				this.loadData();
				loadShopTypeData();
			} else {
				this.$message.warning((res.data && res.data.message) || '删除失败');
			}
		},
		// 增加网点类型
		async addShopType(params) {
			const res = await this.$fetch(`/mgmt/store/add/shopType?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.showAddReturnBox = false;
				this.loadData();
				loadShopTypeData();
			} else {
				this.$message.error(res.message || '增加网点失败');
			}
		},
		// 编辑网点类型
		async editShopType(params) {
			const res = await this.$fetch(`/mgmt/store/update/shopType?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.showAddReturnBox = false;
				this.loadData();
				loadShopTypeData();
			} else {
				this.$message.error(res.message || '更新网点失败');
			}
		},
		submit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.id) {
						this.addReturnData.id = this.id;
						this.editShopType(this.addReturnData);
					} else {
						this.addShopType(this.addReturnData);
					}
				}
			});
		},
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.loadData();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.loadData();
		},
		// 添加服务中心退货额
		addReturn() {
			this.addReturnData = {
				name: '',
				remark: '',
			};
			this.id = '';
			this.showAddReturnBox = true;
		},
	},
};
</script>

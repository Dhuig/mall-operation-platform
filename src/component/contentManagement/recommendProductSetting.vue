<template>
	<div>
		<guideBar />
		<el-card>
			<el-form :model="recommendForm" :rules="recommendRules" ref="recommendForm" label-width="120px">
				<el-form-item label="推荐商品名称:" prop="name">
					<span v-if="!isEdit">{{ recommendForm.name }}</span>
					<el-input v-else size="mini" v-model="recommendForm.name" class="banner-input" />
				</el-form-item>
				<el-form-item label="描述:" prop="description">
					<span v-if="!isEdit">{{ recommendForm.description }}</span>
					<el-input v-else size="mini" v-model="recommendForm.description" class="banner-input" />
				</el-form-item>
				<el-form-item label="关联产品:" prop="product">
					<span v-if="!isEdit">已关联产品{{ relativeProductList.length }}个</span>
					<div v-else>
						<el-button type="primary" class="btn-gap" icon="el-icon-share" @click="showProductClick">
							选择产品
						</el-button>
						<el-row type="flex" justify="end">
							<el-button :type="sortAble ? 'info' : 'primary'" icon="el-icon-sort" @click="setSort">
								{{ sortAble ? '设置排序' : '完成排序' }}
							</el-button>
						</el-row>
					</div>
					<el-table :data="relativeProductList">
						<el-table-column type="index" label="序号" width="50" />
						<el-table-column prop="serialNo" label="产品编码" />
						<el-table-column prop="title" label="产品名称" />
						<el-table-column prop="catalogTitle" label="产品分类" />
						<el-table-column label="操作" :width="450" v-if="isEdit">
							<template slot-scope="scope">
								<el-button size="mini" type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.$index)">
									删除
								</el-button>
								<el-button
									size="mini"
									icon="el-icon-top"
									@click="handleUpper(scope.$index)"
									:disabled="scope.$index == 0 || sortAble"
								>
									上移
								</el-button>
								<el-button
									size="mini"
									icon="el-icon-bottom"
									@click="handleDownner(scope.$index)"
									:disabled="scope.$index == relativeProductList.length - 1 || sortAble"
								>
									下移
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-row type="flex" justify="center" align="center" v-permission="'recommend_product_setting_edit'">
					<el-button v-if="!isEdit" type="primary" icon="el-icon-edit-outline" @click="saveEdit">编辑</el-button>
					<el-button v-else type="primary" icon="el-icon-check" @click="saveAndExit">保存</el-button>
				</el-row>
			</el-form>
		</el-card>
		<!-- 关联产品弹窗 -->
		<el-dialog title="关联产品" :visible.sync="showProduct" width="65%" v-drag :before-close="beforeClose">
			<search-panel v-model="searchProduct" :config="BIND_PRODUCT_CONFIG" @search="handleSearchProduct" />
			<el-row class="mb-16"></el-row>
			<table-list
				border=""
				ref="tablelist"
				:dataSource="bindProductList"
				:columns="BIND_PRODUCT_COLUMNS"
				:operates="bindProductOperate"
				:options="bindProductOptions"
				:pagination="bindProductPagination"
				:dataTotal="bindProductPagination.total"
				@handleSelectChange="handleSelectChange"
        @handleSelectAllChange="handleSelectAllChange"
				@handleChangePage="handleProductChangePage"
				@handleSizeChange="handleProductSizeChange"
			/>
			<span slot="footer" class="operate-bottom">
				<span>
					<el-button @click.stop="beforeClose">取 消</el-button>
					<el-button type="primary" @click.stop="saveProduct">保存</el-button>
				</span>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { BIND_PRODUCT_CONFIG, BIND_PRODUCT_COLUMNS } from './shoppingMall/config';
export default {
	name: 'recommendProductSetting',
	data() {
		var validateProduct = (rule, value, callback) => {
			if (this.relativeProductList.length == 0) {
				callback(new Error('请选择关联产品'));
			} else {
				callback();
			}
		};
		return {
      searchProduct:{
        keyword:'',
        catalogId:''
      },
			recommendForm: {
				name: '',
				description: '',
			},
			relativeProductList: [],
			relation: [],
			recommendRules: {
				name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
				product: [{ required: true, validator: validateProduct, trigger: 'change' }],
			},
			showProduct: false,
			bindProductList: [],
			bindProductPagination: {
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
			bindProductOptions: {
				label: '全部',
				index: true,
				selection: true,
				labelIndex: '序号',
				saveSelection: true,
				rowKey: 'productId',
			},
			bindProductOperate: [],
			BIND_PRODUCT_CONFIG,
			BIND_PRODUCT_COLUMNS,
			sortAble: true,
			recommendId: '',
			bindSelectProductList: [],
			isEdit: false,
		};
	},
	created() {
		this.getCataLog();
		this.getRecommendDetail();
	},
	methods: {
		// 获取推荐商品
		async getRecommendDetail() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/recommend/getRecommend',
			});
			if (res) {
				this.recommendId = res.data.id;
				this.recommendForm.description = res.data.descript;
				this.recommendForm.name = res.data.name;
				if (this.recommendId) this.getBindProductList();
			}
		},
		// 点击编辑
		saveEdit() {
			this.isEdit = !this.isEdit;
		},
		// 获取已经关联的产品数据
		async getBindProductList() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getLinkProductList',
				params: {
					decorateId: this.recommendId,
					decorateType: '4',
					pageNum: 1,
					pageSize: 999999999,
				},
			});
			if (res.data.list) {
				this.relativeProductList = res.data.list;
        this.bindSelectProductList=JSON.parse(JSON.stringify(res.data.list))
			} else {
				this.relativeProductList = [];
			}
		},
		// 获取产品分类
		async getCataLog() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getCatalogList',
			});
			if (res) {
				BIND_PRODUCT_CONFIG.form[1].options = res.data.map(item => {
					return { label: item.title, value: item.id };
				});
			}
		},
		// 保存
		saveAndExit() {
			this.$refs['recommendForm'].validate(async valid => {
				if (valid) {
					let product = this.relativeProductList.map(({ serialNo }, index) => ({
						serialNo,
						sort: this.relativeProductList.length - index,
					}));
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/cms/recommend/saveRecommend',
						data: {
							descript: this.recommendForm.description,
							name: this.recommendForm.name,
							productList: product,
						},
					});
					if (res && res.code === 200) {
						this.$message.success(res.message);
						this.isEdit = false;
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 选择产品按钮事件
		showProductClick() {
			this.showProduct = true;
			this.getAllProductList();
		},
		// 产品搜索
		handleSearchProduct(data) {
			this.bindProductPagination.currentPage = 1;
			this.getAllProductList(data);
		},
		// 产品分页触发
		handleProductChangePage(currentPage) {
			this.bindProductPagination.currentPage = currentPage;
			this.getAllProductList();
		},
		// 产品弹窗切换单页数量事件
		handleProductSizeChange(pageSize) {
			this.bindProductPagination.pageSize = pageSize;
			this.getAllProductList();
		},
		// 获取所有产品列表
		async getAllProductList() {
      let {currentPage:pageNum,pageSize} = this.bindProductPagination
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/cms/getProductList',
				params: {pageNum,pageSize,...this.searchProduct},
			});
			if (res && res.code===200) {
				this.bindProductPagination.total = res.data.total;
				this.bindProductList = res.data.list;
				this.bindProductList.map(e => {
					this.relativeProductList.map(el => {
						if (e.productId === el.productId) {
							this.$nextTick(() => {
								this.$refs.tablelist.$children[0].toggleRowSelection(e, true);
							});
						}
					});
				});
			}
		},
		beforeClose() {
			this.showProduct = false;
			if (this.relativeProductList.length === 0) {
				this.$refs.tablelist.$children[0].clearSelection();
				this.handleSearchProduct();
			}
		},
		// 弹窗保存关联的产品
		saveProduct() {
			if (this.bindSelectProductList.length == 0) return this.$message.error(`请选择要关联的产品`);
			this.relativeProductList = this.bindSelectProductList;
			this.showProduct = false;
		},
		// 选择产品事件
		handleSelectChange(val,row) {
      if(this.bindSelectProductList.length===0) return this.bindSelectProductList.push(row)
      let index = this.bindSelectProductList.map(e=>e.productId).indexOf(row.productId)
      if(index>-1){
          this.bindSelectProductList.splice(index,1)
      } else{
        this.bindSelectProductList.push(row)
      }
		},
    handleSelectAllChange(val){
      if(val.length===0){
        let bindProductList = this.bindProductList.map(e=>e.productId)
        bindProductList.forEach(e=>{
          this.bindSelectProductList.forEach(()=>{
            let index = this.bindSelectProductList.map(els=>els.productId).indexOf(e)
            if(index>-1) {
              this.bindSelectProductList.splice(index,1)
            }
          })
        })
      }  else {
        this.bindSelectProductList = JSON.parse(JSON.stringify(this.bindSelectProductList.concat(this.bindProductList)))
      }
    },
		// 删除已经关联的产品
		handleDelete(index) {
			this.$confirm('此操作将删除该关联产品, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.relativeProductList.splice(index, 1);
          this.beforeClose()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					});
				});
		},
		// 设置排序
		async setSort() {
			this.sortAble = this.sortAble ? false : true;
		},
		swapArray(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 上移
		handleUpper(index) {
			this.swapArray(this.relativeProductList, index, index - 1);
		},
		// 下移
		handleDownner(index) {
			this.swapArray(this.relativeProductList, index, index + 1);
		},
	},
};
</script>
<style lang="scss" scoped>
.banner-input {
	max-width: 350px;
}
.mb-16 {
	margin-bottom: 16px;
}
::v-deep.el-dialog__wrapper .el-dialog__body .table_list_fix {
	max-height: 300px;
	overflow: auto;
}
</style>

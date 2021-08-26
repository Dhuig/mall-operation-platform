<template>
	<div>
		<el-card class="card-gap">
			<div class="head-text">换购产品</div>
			<div class="dr">
				<span class="dr-btns">
					<el-upload
						class="upload-demo"
						:on-error="onError"
						:action="$store.getters['system/getbaseURL'] + '/mgmt/prmt/importProducts'"
						:headers="$store.getters['system/getSignatureVerification']"
						name="file"
						:data="uploadData"
						:show-file-list="false"
						:on-success="handleSuccess"
					>
						<el-button type="primary">导入新增</el-button>
					</el-upload>
					<el-button type="primary" plain class="top-btn-dr" @click="getExcel">下载模板</el-button>
					<el-button type="primary" class="top-btn-dr" @click="isAdd">手动新增</el-button>
				</span>
			</div>
			<div class="table_list_fix">
				<el-table :data="productDtosArr" border style="width: 100%" :loading="false">
					<el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
					<el-table-column prop="serialNo" label="产品编码" align="center"></el-table-column>
					<el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
					<el-table-column prop="specification" label="规格" align="center"></el-table-column>
					<el-table-column prop="unit" label="单位" align="center"></el-table-column>
					<el-table-column prop="retailPrice" label="零售价" align="center"></el-table-column>
					<el-table-column prop="originalPrice" label="原价" align="center">
						<template slot="header">
							<span style="margin-right: 5px">原价</span>
							<el-popover placement="right" title width="200" trigger="hover" content=" ">
								<div>用来展示产品的划线价，如果留空，则不显示划线价</div>
								<span slot="reference" class="detail el-icon-warning-outline"></span>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="productPv" label="产品pv" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="{ row, $index }">
							<div>
								<span class="btns" @click="edit(row, $index)">编辑</span>
								<span class="btns" @click="del($index)">删除</span>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog :title="productTitle" v-drag :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
				<div class="search-div">
					<el-form :inline="true" label-width="120px" v-if="productTitle !== '编辑活动产品'">
						<el-form-item label="搜索产品：" prop="name">
							<el-input v-model="cardNo" placeholder="输入产品编码，精准搜索" clearable></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch">搜 索</el-button>
						</el-form-item>
					</el-form>
					<div class="product-class">
						<el-form label-width="120px" v-if="temporary.length > 0">
							<el-form-item label="产品编码：">
								<span>{{ product.serialNo }}</span>
							</el-form-item>
							<el-form-item label="产品名称：">
								<span>{{ product.productName }}</span>
							</el-form-item>
							<el-form-item label="零售价：">
								<span>{{ product.retailPrice }}</span>
							</el-form-item>
							<el-form-item label="产品PV：">
								<span>{{ product.productPv }}</span>
							</el-form-item>
							<el-form-item label="设置产品原价：">
								<el-input
									v-model="product.originalPrice"
									style="width: 300px"
									maxlength="10"
									show-word-limit
									placeholder="输入产品原价，留空为不显示"
								></el-input>
							</el-form-item>
						</el-form>
						<div class="nothing" v-else>
							<p class="el-icon-document icon-file"></p>
							<p class="file-text">搜索不到产品或产品已下架</p>
						</div>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="handleClose">取 消</el-button>
					<el-button type="primary" @click="add">{{ productTitle !== '编辑活动产品' ? '添 加' : '保 存' }}</el-button>
				</span>
			</el-dialog>

			<el-dialog title="导入结果" v-drag :visible.sync="importVisible" width="30%">
				<div class="import-class">
					<div class="import-div">成功导入{{ importData.trueCount }}条数据，失败{{ importData.falseCount }}条</div>
					<div class="import-div dowload-data-file" @click="dowloadFileList">下载失败列表</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="importVisible = false">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
import { exportExcel } from 'util';
export default {
	name: 'productConfiguration',
	props: {
		promotion: {
			type: Object,
			default: () => {
				return {
					productDtos: [],
				};
			},
		},
	},
	data() {
		return {
			importData: {},
			importVisible: false,
			dialogVisible: false,
			uploadData: { promotionId: null, promotionType: 2 },
			optionsLoading: false,
			isPush: false,
			temporary: [],
			options: [],
			productNameoptions: [],
			productDtosArr: [],
			cardNo: '',
			productTitle: '手动新增活动产品',
			product: {},
		};
	},
	watch: {
		promotion: {
			handler(val) {
				let { query } = this.$route;
				let { productDtos } = val;
				let { limitNumber } = val.configDto;
				if (productDtos.length > 0) this.productDtosArr = JSON.parse(JSON.stringify(productDtos));
				this.uploadData = { promotionId: query.id, promotionType: 2, limitNumber };
				this.uploadData.promotionId = query && query.id ? query.id : null;
				if (this.$route.query) delete this.uploadData.promotionId;
			},
			deep: true,
			immediate: true,
		},
	},
	created() {
		let { query } = this.$route;
		let { limitNumber } = this.promotion.configDto;
		this.uploadData = { promotionId: query.id, promotionType: 2, limitNumber };
		this.uploadData.promotionId = query && query.id ? query.id : null;
		if (this.$route.query) delete this.uploadData.promotionId;
	},
	methods: {
		dowloadFileList() {
			exportExcel('/mgmt/prmt/getImportErrorList', { key: this.importData.key });
		},
		handleSearch() {
			this.getProduct(this.cardNo, '');
		},
		handleClose() {
			this.dialogVisible = false;
			this.product = {};
			this.temporary = [];
			this.cardNo = '';
		},
		onError() {
			this.$message.error('导入失败');
		},
		handleSuccess(res) {
			if (res.code === 200) {
				let { list } = res.data;
				this.importData = res.data;
				let arr = list.map(
					({ id, meterUnit, originalPrice, productName, productPv, retailPrice, serialNo, specification }) => {
						return {
							originalPrice,
							productId: id,
							productName,
							productPv,
							productStatus: null,
							promotionCode: null,
							promotionId: null,
							retailPrice,
							serialNo,
							specification,
							unit: meterUnit,
						};
					}
				);
				this.productDtosArr = list ? this.productDtosArr.concat(arr) : this.productDtosArr;
				if (res.data.falseCount) {
					this.importVisible = true;
				}
			} else {
				this.$message.error(res.message);
			}
		},
		// 导出excel
		getExcel() {
			exportExcel(`/mgmt/prmt/importPromotionProductTemplate`);
		},
		productEmit() {
			this.$emit(
				'productEmit',
				this.productDtosArr.filter(e => e.serialNo)
			);
		},
		del(index) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				this.productDtosArr.splice(index, 1);
			});
		},
		isAdd() {
			this.dialogVisible = true;
			this.productTitle = '手动新增活动产品';
		},
		edit(row) {
			this.productTitle = '编辑活动产品';
			this.dialogVisible = true;
			this.product = row;
			this.temporary = [row];
		},
		add() {
			if (this.product.originalPrice) {
				if (!/^[1-9]\d*$/.test(this.product.originalPrice)) {
					this.product.originalPrice = '';
					return this.$message.warning('原价为正整数！');
				}
			}
			if (this.productTitle !== '编辑活动产品') {
				if (this.temporary.length == 0) return this.$message.warning('请搜索数据！');
				this.isPush = false;
				this.productDtosArr.forEach(el => {
					if (this.product.productId === el.productId) {
						this.isPush = true;
						this.$message.warning('请添加未添加过的产品');
					}
				});
				if (this.isPush) return;
				this.productDtosArr.push(this.product);
				this.$message.success('添加成功！');
			} else {
				this.dialogVisible = false;
				this.$message.success('保存成功！');
			}
		},
		selChange(e, index) {
			this.isPush = false;
			this.productDtosArr.forEach(el => {
				if (e === el.productId) {
					this.isPush = true;
					this.$message.warning('请选择未添加过的产品');
				}
			});
			if (this.isPush) return;
			let aryItem = this.temporary.filter(el => e === el.productId)[0];
			aryItem.originalPrice = aryItem.originalPrice ? aryItem.originalPrice : aryItem.retailPrice;
			this.productDtosArr.splice(index, 1, aryItem);
		},
		async getProduct(couponNumber = '', productName = '') {
			const res = await this.$fetch(
				`/mgmt/prmt/getProductListByCodeOrName?productCode=${couponNumber}&productName=${productName}&type=2`
			);
			if (res && res.code == 200) {
				let { data } = res;
				this.temporary = data;
				this.product = data[0] || {};
			} else {
				this.product = {};
				this.temporary = [];
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.detail {
	font-size: 18px;
	cursor: pointer;
}
.card-gap {
	margin-top: 10px;
	.form-width-protect {
		padding: 0 40px;
	}
	.dr {
		padding: 10px 0;
		overflow: hidden;
		.upload-demo {
			margin-right: 20px;
			float: right;
		}
		.top-btn-dr {
			margin-bottom: 14px;
			margin-right: 20px;
		}
		.dr-btns {
			float: right;
		}
	}
	.head-text {
		font-size: 18px;
		font-weight: 600;
		padding: 0 0 20px 30px;
	}
	.module-text {
		margin-left: 10px;
		color: $color-link;
	}
}
.btns {
	color: #0877fd;
	cursor: pointer;
	margin-right: 18px;
}

.search-div {
	padding: 20px 0;
}
.product-class {
	height: 288px;
	.nothing {
		color: $color-disabled;
		text-align: center;
		.icon-file {
			font-size: 128px;
			margin-top: 30px;
		}
		.file-text {
			margin-top: 30px;
			font-size: 16px;
		}
	}
}

.import-class {
	padding: 0 20px;
	font-size: 16px;
	.import-div {
		line-height: 30px;
	}
	.del-text {
		color: $color-disabled;
		font-size: 14px;
	}
	.del-top-text {
		font-size: 16px;
	}
}
.dowload-data-file {
	color: $color-link;
	cursor: pointer;
}
</style>

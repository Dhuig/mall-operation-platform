<template>
	<div>
		<el-card class="card-gap">
			<div class="head-text">
				<span class="text-one">参与顾客设置</span>
				<span class="text-two">
					限购数量：{{
						promotion.configDto.limitNumber > 0
							? `每位顾客最多购买${promotion.configDto.limitNumber}件`
							: CHANGE_LIMITNUMBER[promotion.configDto.limitNumber]
					}}
					<el-popover placement="right" title width="200" trigger="hover" content=" ">
						<div>设置后只有所选或者组内顾客才可以参与活动，不能参与活动的顾客看到的商品无法购买</div>
						<span slot="reference" class="detail el-icon-warning-outline"></span>
					</el-popover>
				</span>
			</div>
			<el-form :model="promotion.configDto" :rules="rules" ref="ruleForm" label-width="140px">
				<el-form-item label="顾客限制：" prop="limitCustomer">
					<template v-if="promotion.configDto.limitNumber == -2">
						<div>
							<el-radio v-model="promotion.configDto.limitCustomer" :label="4">
								自由导入（按需配置时，仅支持自由导入。）
							</el-radio>
						</div>
					</template>
					<template v-else>
						<el-radio
							v-for="(item, index) in LIMIT"
							v-model="promotion.configDto.limitCustomer"
							:label="item.value"
							:key="index"
						>
							{{ item.label }}
						</el-radio>
					</template>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card-gap">
			<div class="all-content" v-if="promotion.configDto.limitCustomer == 1 && promotion.configDto.limitNumber !== -2">
				所有顾客都可以参与活动
			</div>
			<div class="head-text text-one" v-if="promotion.configDto.limitCustomer == '2'">选择顾客身份</div>
			<el-form :rules="rules" ref="ruleForm" label-width="140px" v-show="promotion.configDto.limitCustomer == '2'">
				<el-form-item label="顾客限制：" prop="memberIdentities">
					<el-checkbox-group v-model="promotion.memberIdentities">
						<el-checkbox :label="item.code" v-for="(item, index) in identity" :key="index">
							{{ item.typeName }}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="仅当月新开卡：" prop="isNewCard">
					<el-radio class="radio-xz" v-model="promotion.configDto.isNewCard" :label="1">是</el-radio>
					<el-radio class="radio-xz" v-model="promotion.configDto.isNewCard" :label="0">否</el-radio>
					<el-popover placement="right" title width="200" trigger="hover" content=" ">
						<div>如果选择了仅限当月开卡会员，则只有每个月新开卡的会员可以参与次活动，跨月失效。</div>
						<span slot="reference" class="detail el-icon-warning-outline"></span>
					</el-popover>
				</el-form-item>
			</el-form>
			<!-- <el-form
				:model="promotion"
				:rules="rules"
				ref="ruleForm"
				label-width="140px"
				v-show="promotion.configDto.limitCustomer == 3"
			>
				<el-form-item label="顾客等级：" prop="roleIds">
					<el-checkbox-group v-model="promotion.roleIds">
						<el-checkbox label="一星"></el-checkbox>
						<el-checkbox label="客户代表"></el-checkbox>
						<el-checkbox label="初级客户经理"></el-checkbox>
						<el-checkbox label="中级客户经理"></el-checkbox>
						<el-checkbox label="客户总监"></el-checkbox>
						<el-checkbox label="高级客户总监"></el-checkbox>
						<el-checkbox label="资深客户总监"></el-checkbox>
						<el-checkbox label="客户总经理"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form> -->
			<el-form
				:inline="true"
				label-width="140px"
				v-show="promotion.configDto.limitCustomer == 4 || promotion.configDto.limitNumber === -2"
			>
				<div class="head-text text-one" v-if="promotion.configDto.limitCustomer == 4">自由导入</div>
				<el-form-item label="搜索已导入顾客：" prop="cardNo">
					<el-input v-model="identityList.cardNo" placeholder="输入会员卡号"></el-input>
				</el-form-item>
				<el-form-item label>
					<el-button type="primary" @click="serachList">搜 索</el-button>
				</el-form-item>
				<el-form-item label>
					<el-button type="primary" plain @click="delVisible = true">清空导入列表</el-button>
				</el-form-item>
				<el-form-item label>
					<el-button type="primary" plain @click="exportTemplate">下载模板</el-button>
				</el-form-item>
				<el-form-item label>
					<el-upload
						class="upload-demo"
						:on-error="onError"
						:action="$store.getters['system/getbaseURL'] + '/mgmt/prmt/importUserList'"
						name="file"
						:data="uploadData"
						:show-file-list="false"
						:http-request="handleSuccess"
						:before-upload="beforeUpload"
					>
						<el-button type="primary">导入新增</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label>
					<el-button type="primary" @click="dialogVisible = true">手动新增</el-button>
				</el-form-item>
			</el-form>
			<div class="table-box">
				<el-col v-show="promotion.configDto.limitCustomer == 4 || promotion.configDto.limitNumber === -2">
					<el-table :data="identityList.data" style="width: 100%" height="250">
						<el-table-column prop="cardNo" label="会员卡号"></el-table-column>
						<el-table-column prop="realName" label="会员姓名"></el-table-column>
						<el-table-column prop="mobile" label="注册手机号"></el-table-column>
						<el-table-column
							prop="serialNo"
							label="产品编码"
							v-if="promotion.configDto.limitNumber === -2"
						></el-table-column>
						<el-table-column
							prop="totalCount"
							label="可购数量"
							v-if="promotion.configDto.limitNumber === -2"
						></el-table-column>
						<el-table-column prop="zip" label="操作">
							<template slot-scope="scope">
								<div>
									<span class="btns" @click="del(scope.row)">删除</span>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						background
						class="pagination"
						:total="identityList.total"
						:current-page.sync="identityList.pagination.currentPage"
						:page-size="identityList.pagination.pageSize"
						@current-change="handleChangePage"
						@size-change="handleSizeChange"
						layout="sizes, total , prev, pager, next, jumper"
					/>
				</el-col>
			</div>
		</el-card>
		<el-dialog title="手动添加" v-drag :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
			<div class="search-div">
				<el-form :inline="true" label-width="120px">
					<el-form-item label="搜索顾客：" prop="name">
						<el-input v-model="cardNo" @input="handleReset" placeholder="输入会员卡号，精准搜索" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch">搜 索</el-button>
					</el-form-item>
				</el-form>
				<div class="product-class">
					<el-form label-width="120px" v-if="addList.length > 0">
						<el-form-item label="会员卡号：">
							<span>{{ product.cardNo }}</span>
						</el-form-item>
						<el-form-item label="会员身份：">
							<span>{{ product.memberType }}</span>
						</el-form-item>
						<el-form-item label="会员姓名：">
							<span>{{ product.realName }}</span>
						</el-form-item>
						<el-form-item label="注册手机号：">
							<span>{{ product.mobile }}</span>
						</el-form-item>
					</el-form>
					<div class="nothing" v-else>
						<p class="el-icon-document icon-file"></p>
						<p class="file-text">搜索不到对应的顾客</p>
					</div>
				</div>
				<el-table
					v-if="addList.length > 0 && promotion.configDto.limitNumber == -2"
					:data="productList"
					border
					style="width: 100%"
					:loading="false"
				>
					<el-table-column prop="serialNo" label="产品编码" align="center"></el-table-column>
					<el-table-column prop="serialNo" label="可购数量" align="center">
						<template slot-scope="{ row }">
							<div>
								<el-input
									v-model="row.totalCount"
									maxlength="4"
									show-word-limit
									placeholder="请输入可购数量"
								></el-input>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="save">添 加</el-button>
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

		<el-dialog title="确认提示" v-drag :visible.sync="delVisible" width="30%">
			<div class="import-class">
				<div class="import-div del-top-text">清空导入内容确认</div>
				<div class="import-div del-text">删除后你需要重新导入或添加</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="delImportData">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel, fromDataUpload } from 'util';
import { PARTICIPATING_CUSTOMER_COLUMNS, LIMIT, ADD_COLUMNS, CHANGE_LIMITNUMBER } from '../config.js';
import qs from 'querystring';
export default {
	name: 'productConfiguration',
	props: {
		promotion: {
			type: Object,
			default: () => {
				return {
					configDto: {
						limitCustomer: 1,
					},
					roleIds: [],
					memberIdentities: [],
				};
			},
		},
	},
	data() {
		return {
			CHANGE_LIMITNUMBER,
			productList: [],
			importData: {},
			delVisible: false,
			importVisible: false,
			uploadData: { promotionId: '' },
			cardNo: '',
			addList: [],
			ADD_COLUMNS,
			LIMIT,
			dialogVisible: false,
			PARTICIPATING_CUSTOMER_COLUMNS,
			identity: {},
			identityList: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				total: 0,
				cardNo: null,
				promotionId: null,
			},
			rules: {
				limitCustomer: [{ required: true, message: '请选择顾客限制', trigger: 'blur' }],
				memberIdentities: [{ required: true, message: '请选择顾客身份', trigger: 'blur' }],
				roleIds: [{ required: true, message: '请选择顾客等级', trigger: 'blur' }],
			},
			product: {},
		};
	},
	computed: {
		token() {
			return this.$store.getters['user/getFullToken'];
		},
	},
	watch: {
		promotion: {
			handler() {
				this.productList = this.promotion.productDtos.map(({ serialNo }) => ({ serialNo, totalCount: '' }));
				if (this.promotion.configDto.limitNumber == -2) this.promotion.configDto.limitCustomer = 4;
				if (this.promotion.configDto.limitCustomer === 4) this.identityData();
			},
			immediate: true,
			deep: true,
		},
	},
	created() {
		let { query } = this.$route;
		let { limitNumber } = this.promotion.configDto;
		this.uploadData =
			query && query.id
				? { promotionId: query.id, limitNumber: limitNumber, promotionType: 2 }
				: { limitNumber: limitNumber, promotionType: 2 };
		if (query.id) this.identityData();
		this.getIdentity();
		this.productList = this.promotion.productDtos.map(({ serialNo }) => ({ serialNo, totalCount: '' }));
	},
	methods: {
		async delImportData() {
			let { query } = this.$route;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/deleteImportMember',
				data: { id: query.id ? query.id : null },
			});
			if (res.code === 200) {
				this.delVisible = false;
				this.$message.success(res.message);
				this.identityData();
			}
		},
		onError(err) {
			this.$message.error(err);
		},
		dowloadFileList() {
			exportExcel('/mgmt/prmt/couponGrant/getImportErrorList', { key: this.importData.key });
		},
		beforeUpload() {
			this.identityList.loading = true;
			return true;
		},
		handleSuccess(file) {
			fromDataUpload.call(
				this,
				{
					url: `/mgmt/prmt/importUserList`,
					formObject: { ...this.uploadData, file: file.file },
				},
				res => {
					if (res.code === 200) {
						this.importData = res.data;
						if (res.data.falseCount) {
							this.importVisible = true;
						}
						this.identityData();
					} else {
						this.$message.error(res.message);
					}
				}
			);
		},
		customersData() {
			let { limitCustomer } = this.promotion.configDto;
			if (limitCustomer === 1 || limitCustomer === 4) {
				this.promotion.memberIdentities = [];
				this.promotion.roleIds = [];
			}
			if (limitCustomer === 2) {
				this.promotion.roleIds = [];
			}
			this.$emit('customersData', this.promotion);
		},
		del({ cardNo, realName, id }) {
			let promotionId = this.uploadData.promotionId ? this.uploadData.promotionId : null;
			this.$confirm('确定删除会员' + realName + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/deleteUserById',
					data: { cardNo, id, promotionId },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.identityData();
				}
			});
		},
		exportTemplate() {
			exportExcel(`/mgmt/prmt/importPromotionMemberTemplate`);
		},
		importTemplate() {},
		async handleSearch() {
			const res = await this.$fetch(`/mgmt/prmt/selectMemberByCard?cardNo=${this.cardNo}`);
			if (res.code == 200) {
				this.addList = [res.data];
				this.product = res.data;
			}
		},
		handleReset() {
			this.addList = [];
		},
		handleSizeChange(val) {
			this.identityList.pagination.pageSize = val;
			this.identityData();
		},
		handleChangePage(val) {
			this.identityList.pagination.currentPage = val;
			this.identityData();
		},
		handleClose() {
			this.dialogVisible = false;
			this.resetAdd();
		},
		async identityData() {
			let {
				$route: { query },
				identityList: {
					pagination: { currentPage, pageSize },
					cardNo,
					promotionId,
				},
			} = this;
			promotionId = query && query.id ? query.id : promotionId;
			let params = { pageNum: currentPage, pageSize, cardNo, promotionId };
			const res = await this.$fetch(`/mgmt/prmt/getUserListPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.identityList.data = res.data.list;
				this.identityList.total = res.data.total;
			}
		},
		resetAdd() {
			this.cardNo = '';
			this.product = {};
			this.productList = this.productList.map(e => {
				e.totalCount = null;
				return e;
			});
			this.addList = [];
		},
		async save() {
			if (this.addList.length === 0) return this.$message.warning('请根据卡号搜索一位顾客添加');
			let istrue = false;
			for (let index = 0; index < this.productList.length; index++) {
				if (this.productList[index].totalCount && !/^[1-9]\d*$/.test(this.productList[index].totalCount)) {
					this.productList[index].totalCount = '';
					istrue = true;
					this.$message.warning('可购数量为正整数！');
					break;
				}
			}
			if (istrue) return;
			let { cardNo, mobile, realName } = this.addList[0];
			let { limitNumber } = this.promotion.configDto;
			let promotionId = this.$route.query.id ? this.$route.query.id : null;
			let params = {
				limitNumber,
				cardNo,
				mobile,
				realName,
				promotionId,
				productLists: this.productList.filter(e => e.totalCount),
			};
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/addUser`,
				data: params,
			});
			if (res && res.code == 200) {
				this.$message.success('添加成功');
				this.dialogVisible = false;
				this.identityData();
				this.resetAdd();
			}
		},
		async getIdentity() {
			const res = await this.$fetch(`/mgmt/prmt/getMemberIdentity`);
			if (res && res.code === 200) this.identity = res.data;
		},
		serachList() {
			this.identityData();
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
	.upload-demo {
		display: inline-block;
	}
	.all-content {
		height: 200px;
		line-height: 200px;
		text-align: center;
		font-size: 20px;
		color: $color-disabled;
	}
	.head-text {
		padding: 0 0 20px 30px;
		.text-one {
			font-size: 18px;
			font-weight: 600;
		}
		.text-two {
			font-size: 14px;
			color: $color-disabled;
		}
	}
	.text-one {
		font-size: 18px;
		font-weight: 600;
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
.table-box {
	overflow: hidden;
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

<template>
	<div class="platform-activeCenter_createHandWork-wrap">
		<guideBar></guideBar>
		<el-form ref="ruleForm" :model="form" label-width="100px" :rules="rulesLimit" v-if="step">
			<el-card>
				<h1 class="table_title_head">新建编辑转赠优惠券派发任务</h1>
			</el-card>
			<el-card>
				<h1 class="table_title">优惠券信息</h1>
				<div class="coupone-content">
					<div class="coupone-text">优惠券编号：{{ couponeData.couponNumber }}</div>
					<div class="coupone-text">优惠券名称：{{ couponeData.couponName }}</div>
					<div class="coupone-text">
						优惠券总量：{{ couponeData.couponCount == '-1' ? '不限量' : couponeData.couponCount }}
					</div>
					<div class="coupone-text">生效时间：{{ couponeData.startTime }}</div>
					<div class="coupone-text">失效时间：{{ couponeData.endTime || '不限制' }}</div>
					<div class="coupone-text">生成优惠码：{{ couponeData.isGenerateCode == 0 ? '否' : '是' }}</div>
					<div class="coupone-text">可获得数量：{{ couponeData.limitCount || '不限制' }}</div>
					<div class="coupone-text">优惠券面值：{{ couponeData.faceValue }}元</div>
				</div>
				<div class="coupone-footer-text">优惠券说明：{{ couponeData.remarks }}</div>
			</el-card>

			<el-card>
				<h1 class="table_title">使用规则</h1>
				<div class="coupone-content">
					<div class="coupone-text">优惠券类型：{{ COUPON_TYPE[couponeData.couponType] }}</div>
					<div class="coupone-text">
						使用条件：{{ couponeData.minAmount ? `满￥${couponeData.minAmount} 可用` : '无限额' }}
					</div>
					<div class="coupone-text">叠加规则：{{ couponeData.isStacked == 0 ? '不可叠加' : '可叠加' }}</div>
					<div class="coupone-text">使用限制：{{ LIMIT_STORE_TYPE[couponeData.limitStore] }}</div>
				</div>
			</el-card>

			<el-card>
				<h1 class="table_title">派发规则</h1>
				<el-form-item label="派发数量：" required>
					<div class="cardNo">
						<el-radio class="radio-xz" v-model="form.type" :label="1">按需派发</el-radio>
					</div>
				</el-form-item>
				<el-form-item label="派发方式：" required>
					<el-radio class="radio-xz" v-model="form.grantType" :label="1">即时派发</el-radio>
					<el-radio class="radio-xz" v-model="form.grantType" :label="2">定时派发</el-radio>
				</el-form-item>
				<el-form-item label="">
					<div class="cardNo-text" v-if="form.grantType == 1">优惠券审核通过后将会即时派发</div>
					<div v-if="form.grantType == 2">
						派发时间：
						<el-date-picker
							v-model="form.fixedTime"
							:picker-options="timeDisabel"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
						></el-date-picker>
					</div>
				</el-form-item>
			</el-card>

			<el-card>
				<h1 class="table_title">转赠限制</h1>
				<el-form-item label="时间限制：" required>
					<div class="cardNo">
						<el-radio class="radio-xz" v-model="form.limitCardTime" :label="0">不限制</el-radio>
						<el-radio class="radio-xz" v-model="form.limitCardTime" :label="1">限制办卡时间</el-radio>
						<el-radio class="radio-xz" v-model="form.limitCardTime" :label="2">限制注册时间</el-radio>
					</div>
				</el-form-item>
				<el-form-item label="">
					<div class="cardNo-text" v-if="form.limitCardTime == 0">任何注册时间的人都可以获得优惠券</div>
					<div v-if="form.limitCardTime == 1">
						限制办卡月份为：
						<el-date-picker
							v-model="startTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
						></el-date-picker>
						至
						<el-date-picker
							v-model="endTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
						></el-date-picker>
						才能获得优惠券
					</div>
					<div v-if="form.limitCardTime == 2">
						限制注册月份为：
						<el-date-picker
							v-model="startRegister"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
						></el-date-picker>
						至
						<el-date-picker
							v-model="endRegister"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
						></el-date-picker>
						才能获得优惠券
					</div>
				</el-form-item>
				<el-form-item label="顾客限制：" required>
					<el-radio class="radio-xz" v-model="form.grantTarget" :label="2">按照顾客身份</el-radio>
					<el-radio class="radio-xz" v-model="form.grantTarget" :label="1">全部顾客</el-radio>
				</el-form-item>
				<el-form-item label="">
					<div class="cardNo-text" v-if="form.grantTarget == 1">任何注册时间的人都可以获得优惠券</div>
					<div v-if="form.grantTarget == 2">
						<el-checkbox-group v-model="form.memberIdentities">
							<el-checkbox :label="1">普通顾客</el-checkbox>
							<el-checkbox :label="2">优惠顾客</el-checkbox>
							<el-checkbox :label="3">云商</el-checkbox>
							<el-checkbox :label="4">微店</el-checkbox>
						</el-checkbox-group>
					</div>
				</el-form-item>
				<el-form-item label="" v-if="form.grantTarget == 2" prop="memberIdentities">
					限制该次派送的券可以转赠的顾客身份
				</el-form-item>
			</el-card>

			<el-card class="card-gap">
				<h1 class="table_title">导入门店清单</h1>
				<el-form :inline="true" label-width="140px">
					<el-form-item label="搜索已导入门店：" prop="user">
						<el-input v-model="identityList.code" clearable placeholder="输入门店编号"></el-input>
					</el-form-item>
					<el-form-item label prop="name">
						<el-button type="primary" @click="serachList">搜 索</el-button>
					</el-form-item>
					<el-form-item label>
						<el-button type="text" @click="exportTemplate">下载模板</el-button>
					</el-form-item>
					<el-form-item label>
						<el-button type="text" @click="delVisible = true">清空导入列表</el-button>
					</el-form-item>
					<el-form-item label prop="name">
						<el-upload
							class="upload-demo"
							:on-error="onError"
							:action="$store.getters['system/getbaseURL'] + '/mgmt/prmt/couponTransfer/importStoreList'"
							name="file"
							:headers="$store.getters['system/getSignatureVerification']"
							:show-file-list="false"
							:before-upload="beforeUpload"
							:http-request="uploadHandle"
						>
							<el-button class="top-btn-dr" type="primary">导入新增</el-button>
						</el-upload>
						<el-button type="primary" @click="isadd">手动新增</el-button>
					</el-form-item>
				</el-form>
				<div class="table-box">
					<tableList
						border
						:dataSource="dataSource"
						:columns="PARTICIPATING_CUSTOMER_COLUMNS"
						:pagination="pagination"
						:dataTotal="identityList.total"
						:loading="identityList.loading"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						slotcontent
						:options="options"
					>
						<template slot-scope="scope">
							<div>
								<span class="btns" @click="del(scope.data)">删除</span>
							</div>
						</template>
					</tableList>
				</div>
			</el-card>

			<el-dialog title="手动新增派发门店" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
				<div class="search-div">
					<el-form :inline="true" label-width="120px">
						<el-form-item label="搜索门店：" prop="name">
							<el-input v-model="cardNo" placeholder="输入门店" clearable></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="handleSearch">搜 索</el-button>
						</el-form-item>
					</el-form>
					<div class="product-class">
						<el-form label-width="120px" v-if="addList.length > 0">
							<el-form-item label="门店编号：">
								<span>{{ product.code }}</span>
							</el-form-item>
							<el-form-item label="门店名称：">
								<span>{{ product.storeName }}</span>
							</el-form-item>
							<el-form-item label="负责人卡号：">
								<span>{{ product.leaderNo }}</span>
							</el-form-item>
							<el-form-item label="负责人姓名：">
								<span>{{ product.leaderName }}</span>
							</el-form-item>
							<el-form-item label="管理员卡号：">
								<span>{{ product.shopkeeperNo }}</span>
							</el-form-item>
							<el-form-item label="管理员姓名：">
								<span>{{ product.shopkeeperName }}</span>
							</el-form-item>
							<el-form-item label="派发数量：" required>
								<el-input
									v-model="product.grantCount"
									style="width: 300px"
									placeholder="输入派发数量"
									maxlength="4"
									show-word-limit
									clearable
								></el-input>
							</el-form-item>
						</el-form>
						<div class="nothing" v-else>
							<p class="el-icon-document icon-file"></p>
							<p class="file-text">搜索不到对应的门店</p>
						</div>
					</div>
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
		</el-form>

		<el-card v-else>
			<div class="succCon">
				<div class="icon_tip">
					<i class="el-icon-success font_set"></i>
					<p>提交成功</p>
					<p>提交成功，等待审核完成</p>
				</div>
				<div class="btn_list">
					<el-button type="primary" @click="golist">返回列表</el-button>
					<el-button @click="godetail">查看详情</el-button>
				</div>
			</div>
		</el-card>
		<actionBar v-if="step">
			<template>
				<el-button type="primary" @click="saveAdd('add')" style="float: right">提交审核</el-button>
				<el-button @click="saveAdd('draft')" style="float: right; margin-right: 20px">存草稿</el-button>
			</template>
		</actionBar>

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
import { COUPON_TYPE, LIMIT_STORE_TYPE } from './config.js';
import qs from 'querystring';
import { exportExcel, fromDataUpload } from 'util';
export default {
	name: 'addDonateCoupon',
	components: {},
	data() {
		return {
			LIMIT_STORE_TYPE,
			startTime: '',
			endTime: '',
			startRegister: '',
			endRegister: '',
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
			COUPON_TYPE,
			couponCount: null,
			options: {
				operatesWidth: 80,
			},
			datetime: [],
			ishandworkType: false,
			startcard: 0,
			delVisible: false,
			importVisible: false,
			step: true,
			pageId: null,
			uploadData: { grantId: '' },
			PARTICIPATING_CUSTOMER_COLUMNS: [
				{ prop: 'code', label: '门店编号', align: 'center' },
				{ prop: 'storeName', label: '门店名称', align: 'center' },
				{ prop: 'shopkeeperNo', label: '管理员卡号', align: 'center' },
				{ prop: 'shopkeeperName', label: '管理员姓名', align: 'center' },
				{ prop: 'leaderNo', label: '负责人卡号', align: 'center' },
				{ prop: 'leaderName', label: '负责人姓名', align: 'center' },
				{ prop: 'grantCount', label: '派发数量', align: 'center' },
			],
			dialogVisible: false,
			//顾客等级
			couponeData: {},
			importFormTable: [],
			loading: false,
			//派发对象form
			form: {
				type: 1,
				grantType: 1,
				grantTarget: 1,
				fixedTime: '',
				memberIdentities: [],
				limitCardTime: 0,
				couponId: null,
				endTime: '',
				id: null,
				startTime: '',
			},
			pushData: {
				couponId: null,
				id: null,
			},
			rules: {
				limitCustomer: [{ required: true, message: '请选择顾客限制', trigger: 'blur' }],
				memberIdentities: [{ required: true, message: '请选择顾客身份', trigger: 'blur' }],
				roleIds: [{ required: true, message: '请选择顾客等级', trigger: 'blur' }],
			},
			rulesLimit: {
				everyCount: [
					{ required: true, message: '请输入派发数量', trigger: 'change' },
					{ type: 'number', message: '派发数量必须为数字值' },
				],
				memberIdentities: [{ required: true, message: '顾客身份至少勾选一项', trigger: 'change' }],
			},
			cardNo: '',
			addList: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			identityList: {
				loading: false,
				total: 0,
				code: '',
			},
			importData: {},
			product: {
				code: '',
				grantCount: null,
				grantId: null,
				id: null,
				leaderName: '',
				leaderNo: '',
				shopkeeperName: '',
				shopkeeperNo: '',
				storeName: '',
			},
			queryEdit: null,
			queryId: null,
		};
	},
	created() {
		let { edit, id } = this.$route.query;
		this.queryEdit = edit;
		this.queryId = id;
		this.ishandworkType = Boolean(edit);
		if (id) this.loadData();
		if (edit) {
			this.lechoData();
		}
		this.identityData();
		this.$listen('delImportData', this.delImportData);
	},
	methods: {
		isadd() {
			this.dialogVisible = true;
		},
		async delImportData() {
			let { queryEdit } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponTransfer/deleteImportMember',
				data: { id: queryEdit || null },
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.identityData();
			}
			this.delVisible = false;
		},
		dowloadFileList() {
			exportExcel('/mgmt/prmt/couponTransfer/getImportErrorDataList', { key: this.importData.key });
		},
		beforeUpload() {
			this.identityList.loading = true;
			return true;
		},
		uploadHandle({ file }) {
			let options = {
				formObject: {
					type: 1,
					grantId: this.queryEdit ? this.queryEdit : '',
					file,
				},
				url: '/mgmt/prmt/couponTransfer/importStoreList',
			};
			fromDataUpload.call(this, options, res => {
				this.identityList.loading = false;
				if (res.code === 200) {
					this.importData = res.data;
					if (res.data.falseCount) {
						this.importVisible = true;
					} else {
						this.$message.success(res.message);
					}
					this.identityData();
				} else {
					this.$message.error(res.message);
				}
			});
		},
		onError() {
			this.identityList.loading = false;
			this.$message.error('导入失败');
		},
		golist() {
			this.$closeSelf();
		},
		godetail() {
			this.$go('donate_coupon_detail', { id: this.pageId });
		},
		del({ code, storeName, id }) {
			let { edit } = this.$route.query;
			this.$confirm('确定删除会员' + (storeName ? storeName : code) + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/couponTransfer/deleteStore',
					data: { code, id, cardNo: edit ? id : code },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.identityData();
				}
			});
		},
		dateGetTime(e) {
			return new Date(e).getTime();
		},
		validatePush() {
			let { endTime, endRegister, isFun, dateGetTime, startTime, startRegister } = this;
			let { limitCardTime, fixedTime, grantType } = this.form;
			let isTrue = false;
			if (limitCardTime == 1 && endTime == '') return isFun(isTrue, '限制办卡时间必填');
			if (limitCardTime == 2 && endRegister == '') return isFun(isTrue, '限制注册时间必填');
			if (grantType == 2 && fixedTime == '') return isFun(isTrue, '定时派发的派发时间必填');
			if (limitCardTime == 1 && dateGetTime(endTime) <= dateGetTime(startTime))
				return isFun(isTrue, '限制办卡时间开始时间需小于结束时间');
			if (limitCardTime == 2 && dateGetTime(endRegister) <= dateGetTime(startRegister))
				return isFun(isTrue, '限制注册时间开始时间需小于结束时间');
		},
		isFun(isTrue, text) {
			isTrue = true;
			this.$message.warning(text);
			return isTrue;
		},
		async saveAdd(type) {
			if (this.validatePush()) return;
			let { edit } = this.$route.query;
			if (this.form.limitCardTime == 1) {
				this.form.endTime = this.endTime;
				this.form.startTime = this.startTime;
			} else if (this.form.limitCardTime == 2) {
				this.form.endTime = this.endRegister;
				this.form.startTime = this.startRegister;
			}
			this.form.couponId = this.pushData.couponId;
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/prmt/couponTransfer/${edit ? 'editCouponGrant' : 'addCouponGrant'}`,
						data: { ...this.form, state: type == 'add' ? 1 : 5 },
					});
					if (res && res.code == 200) {
						this.step = false;
						this.pageId = edit ? edit : res.data;
						this.$dispatch('DONATE_CONPON_LIST');
						this.$dispatch('donate_Coupon_Basis');
					}
				}
			});
		},
		async save() {
			if (this.addList.length === 0) return this.$message.warning('请搜索门店数据');
			if (!/^[1-9]\d*$/.test(this.product.grantCount)) {
				return this.$message.warning('可购数量为正整数！');
			}
			let { code, grantCount } = this.product;
			let grantId = this.$route.query.edit ? this.$route.query.edit : null;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/couponTransfer/addStore`,
				data: { code, grantCount, grantId },
			});
			if (res && res.code == 200) {
				this.$message.success('添加成功');
				this.dialogVisible = false;
				this.identityData();
			}
		},
		async handleSearch() {
			const res = await this.$fetch(`/mgmt/prmt/couponTransfer/selectStoreByCode?code=${this.cardNo}`);
			if (res.code == 200) {
				this.product = { ...this.product, ...res.data };
				this.addList = [res.data];
			}
		},
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.identityData();
		},
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.identityData();
		},
		exportTemplate() {
			exportExcel(`/mgmt/prmt/couponTransfer/exportStoreTemplate`);
		},
		serachList() {
			this.identityData();
		},
		async identityData() {
			let { edit } = this.$route.query;
			let { currentPage: pageNum, pageSize } = this.pagination;
			let grantId = edit ? edit : null;
			let params = { pageNum, pageSize, grantId, code: this.identityList.code };
			const res = await this.$fetch(`/mgmt/prmt/couponTransfer/getImportStorePage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.dataSource = res.data.list;
				this.identityList.total = res.data.total;
			}
		},
		handleClose() {
			this.dialogVisible = false;
			this.resetAdd();
		},
		resetAdd() {
			this.cardNo = '';
			this.product = {};
			this.addList = [];
		},
		async loadData() {
			let { id } = this.$route.query;
			const res = await this.$fetch(`/mgmt/prmt/coupon/getBasicInfo?id=${id}`);
			if (res && res.code == 200) {
				this.couponeData = res.data;
				this.pushData = Object.assign(this.pushData, { couponId: id });
				this.couponCount = res.data.couponCount;
			}
		},
		async lechoData() {
			let { edit } = this.$route.query;
			const res = await this.$fetch(`/mgmt/prmt/couponGrant/getCouponGrant?grantId=${edit}`);
			if (res && res.code == 200) {
				let { type, limitCardTime, startTime, endTime } = res.data;
				let { couponVo, grantTarget, grantType, fixedTime, memberIdentities, couponId, id } = res.data;
				this.form = {
					type,
					grantType,
					grantTarget,
					fixedTime,
					memberIdentities: memberIdentities || [],
					limitCardTime,
					couponId,
					endTime,
					id,
					startTime,
				};
				if (limitCardTime == 1) {
					this.endTime = this.dateGetTime(endTime);
					this.startTime = this.dateGetTime(startTime);
				} else if (limitCardTime == 2) {
					this.endRegister = this.dateGetTime(endTime);
					this.startRegister = this.dateGetTime(startTime);
				}
				this.pushData = { couponId, id };
				this.couponeData = couponVo;
				this.couponCount = couponVo.couponCount;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.search-div {
	padding: 20px 0;
}
.all-content {
	height: 200px;
	line-height: 200px;
	text-align: center;
	font-size: 20px;
	color: $color-disabled;
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
.table_title {
	font-weight: bold;
	margin-bottom: 20px;
}
.table_title_head {
	font-weight: bold;
}
.platform-activeCenter_createHandWork-wrap {
	.data_show {
		min-height: 400px;
	}
	.no_data {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30px;
		color: #ccc;
	}
	.free_import_wrap {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		.text {
			margin-left: 10px;
			color: blue;
		}
	}
}
.table-box {
	overflow: hidden;
}

.upload-demo {
	display: inline-block;
	margin-right: 10px;
}
.btns {
	color: $color-link;
	margin-right: 10px;
	cursor: pointer;
}
.succCon {
	min-height: 600px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.icon_tip {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC', sans-serif;

		p:nth-of-type(1) {
			font-weight: 650;
			font-style: normal;
			font-size: 24px;
			color: rgba(0, 0, 0, 0.847058823529412);
			text-align: center;
			line-height: 32px;
			margin-bottom: 20px;
		}
		p:nth-of-type(2) {
			font-weight: 400;
			font-style: normal;
			color: rgba(0, 0, 0, 0.447058823529412);
			text-align: center;
			line-height: 22px;
			margin-bottom: 30px;
		}
		.font_set {
			font-size: 100px;
			color: #52c41a;
			margin-bottom: 20px;
		}
	}
}
.import-class {
	padding: 0 20px;
	font-size: 16px;
	.import-div {
		line-height: 30px;
	}
}
.dowload-data-file {
	color: $color-link;
	cursor: pointer;
}
.product-class {
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
.detail {
	font-size: 18px;
	cursor: pointer;
}

.coupone-content {
	overflow: hidden;
	.coupone-text {
		float: left;
		width: 33.33%;
		line-height: 30px;
		font-size: 14px;
	}
}
.coupone-footer-text {
	line-height: 30px;
	font-size: 14px;
	margin-bottom: 10px;
}
::v-deep .el-dialog__wrapper {
	overflow-y: auto;
}
</style>

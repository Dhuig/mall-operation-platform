<template>
	<div class="platform-activeCenter_createHandWork-wrap">
		<guideBar></guideBar>
		<el-form ref="ruleForm" :model="form" label-width="100px" :rules="rulesLimit" v-if="step">
			<el-card>
				<h1>派发优惠券</h1>
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
				</div>
			</el-card>

			<el-card>
				<el-form-item label="派发数量：" required>
					<div class="cardNo">
						<el-radio class="radio-xz" :disabled="ishandworkType" v-model="form.type" :label="1">等量派发</el-radio>
						<el-radio class="radio-xz" :disabled="ishandworkType" v-model="form.type" :label="2">按需派发</el-radio>
						<el-popover placement="right" title width="200px" trigger="hover" content="">
							<div>-选择等量派发时，每位用户获得相同张数优惠券</div>
							<div>-选择按需派发时，仅支持导入，且每位用户可获得不同张数的优惠券</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</div>
				</el-form-item>
				<el-form-item label="" prop="everyCount">
					<div class="cardNo" v-if="form.type !== 2">
						<span class="font">每位顾客获得</span>
						<el-input-number v-model="form.everyCount" :min="1" label="描述文字" />
						<span style="margin-left: 10px; margin-right: 10px">张</span>
					</div>
					<div class="cardNo-text" v-else>请在下方派发对象内进行导入, 按需派发仅支持即时派发和定时派发</div>
				</el-form-item>
				<el-form-item label="派发方式" required>
					<el-radio class="radio-xz" v-model="form.grantType" :label="1">即时派发</el-radio>
					<el-radio class="radio-xz" v-model="form.grantType" :label="2">定时派发</el-radio>
					<el-radio class="radio-xz" v-model="form.grantType" :disabled="form.type == 2" :label="3">
						每日循环派发
					</el-radio>
					<el-radio class="radio-xz" v-model="form.grantType" :disabled="form.type == 2" :label="4">
						每月定时派发
					</el-radio>
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
					<div v-if="form.grantType == 3">
						派发时间：
						<el-date-picker
							v-model="form.grantStartTime"
							:picker-options="timeDisabel"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
						></el-date-picker>
						至
						<el-date-picker
							v-model="form.grantEndTime"
							:picker-options="timeDisabel"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
						></el-date-picker>
					</div>
					<div v-if="form.grantType == 4">
						派发时间：
						<el-date-picker
							class="date-picker"
							v-model="timeForm.startTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
							:picker-options="timeDisabel"
						></el-date-picker>
						至
						<el-date-picker
							class="date-picker"
							v-model="timeForm.endTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
							:picker-options="timeDisabel"
						></el-date-picker>
					</div>
				</el-form-item>
				<el-form-item v-if="form.grantType == 3">
					<div class="cardNo-text">每10分钟</div>
				</el-form-item>
				<el-form-item v-if="form.grantType == 4">
					<span style="margin-right: 10px">每月</span>
					<el-input-number v-model="dayNum" :min="1" :max="31" label="描述文字" />
					日
					<el-time-picker v-model="timeData" placeholder="请选择时间"></el-time-picker>
					<!-- :disabled-hours="disabledHours"
						:disabled-minutes="disabledMinutes"
						:disabled-seconds="disabledSeconds" -->
				</el-form-item>
			</el-card>

			<el-card class="card-gap">
				<div class="text-one">派发对象</div>
				<el-form :model="form" :rules="rules" ref="ruleForm" label-width="140px">
					<el-form-item label="顾客限制：" prop="grantTarget">
						<el-radio
							v-model="form.grantTarget"
							:label="1"
							:disabled="form.type === 2 || couponCount > 0 || form.grantType > 2"
						>
							所有顾客
						</el-radio>
						<el-radio v-model="form.grantTarget" :label="2" :disabled="form.type === 2 || couponCount > 0">
							按顾客身份
						</el-radio>
						<el-radio
							v-model="form.grantTarget"
							:label="4"
							:disabled="form.type === 2 || couponCount > 0 || form.grantType > 2"
						>
							自由导入
						</el-radio>
						<el-popover placement="right" title width="240px" trigger="hover" content="">
							<div>限量的优惠券仅支持自由导入</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card class="card-gap">
				<div class="text-one" v-if="form.grantTarget == 2">选择顾客身份</div>
				<div class="all-content" v-if="form.grantTarget == 1">所有顾客都可以参与活动</div>
				<el-form :rules="rules" ref="ruleForm" label-width="140px" v-show="form.grantTarget == 2">
					<el-form-item label="顾客限制：" prop="memberIdentities">
						<el-checkbox-group v-model="form.memberIdentities">
							<el-checkbox :label="item.code" v-for="(item, index) in identity" :key="index">
								{{ item.typeName }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="开卡月份：" required>
						<el-radio v-model="pushData.limitCardTime" :disabled="form.grantType > 2" :label="0">不限制</el-radio>
					</el-form-item>
					<el-form-item label="">
						<el-radio v-model="pushData.limitCardTime" :label="1">固定开卡月份</el-radio>
						<el-date-picker
							v-model="datetime"
							:disabled="pushData.limitCardTime === 0"
							start-placeholder="开始月份"
							end-placeholder="结束月份"
							type="monthrange"
							placeholder="选择日期"
							value-format="yyyy-MM"
							:picker-options="timeDisabelmonth"
						></el-date-picker>
					</el-form-item>
				</el-form>
				<div class="text-one" v-show="form.grantTarget == 4">自由导入</div>
				<el-form :inline="true" label-width="140px" v-show="form.grantTarget == 4">
					<el-form-item label="搜索顾客：" prop="user">
						<el-input v-model="identityList.user" clearable placeholder="搜索顾客卡号"></el-input>
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
							:action="$store.getters['system/getbaseURL'] + '/mgmt/prmt/couponGrant/importUserList'"
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
					<el-col :span="16" v-show="form.grantTarget == 4">
						<tableList
							border
							:dataSource="identityList.data"
							:columns="PARTICIPATING_CUSTOMER_COLUMNS"
							:pagination="identityList.pagination"
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
					</el-col>
				</div>
			</el-card>

			<el-dialog title="手动新增派发顾客" v-drag :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
				<div class="search-div">
					<el-form :inline="true" label-width="120px">
						<el-form-item label="搜索顾客：" prop="name">
							<el-input v-model="cardNo" placeholder="输入会员卡号，精准搜索" clearable></el-input>
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
							<el-form-item label="派发数量">
								<span v-if="form.type === 1">{{ product.everyCount }}</span>
								<el-input
									v-else
									v-model="product.everyCount"
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
							<p class="file-text">搜索不到对应的顾客</p>
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
import {
	LIMIT_RADIO,
	CUSTOMER_IDENTITY_ARR,
	CUSTOMER_LEVEL,
	MESSAGE_DETAIL_STATUS,
	IMPORT_FORM_COLUMNS,
	COUPON_TYPE,
} from './config.js';
import qs from 'querystring';
import { exportExcel, fromDataUpload } from 'util';
import { formatDate } from 'util/formValidation';
export default {
	name: 'createHandWork',
	components: {},
	data() {
		return {
			timeData: '',
			dayNum: 1,
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
			timeDisabelmonth: {
				disabledDate(time) {
					let nowOne = formatDate(new Date()).split(' ')[0].substring(0, 8) + '01';
					return time.getTime() < new Date(nowOne).getTime() - 3600 * 1000 * 24;
				},
			},
			COUPON_TYPE,
			MESSAGE_DETAIL_STATUS,
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
				{ prop: 'cardNo', label: '会员卡号', align: 'center' },
				{ prop: 'realName', label: '会员姓名', align: 'center' },
				{ prop: 'mobile', label: '注册手机号', align: 'center' },
				{ prop: 'everyCount', label: '派发数量', align: 'center' },
			],
			dialogVisible: false,
			//自动导入表格数据
			importFormColumns: IMPORT_FORM_COLUMNS,
			formLoading: false,

			//顾客限制
			limitArr: LIMIT_RADIO,
			//顾客身份
			customerIdentityArr: CUSTOMER_IDENTITY_ARR,
			//顾客等级
			customerLevel: CUSTOMER_LEVEL,
			couponeData: {},
			importFormTable: [],
			loading: false,
			//派发对象form
			form: {
				type: 1,
				grantType: 1,
				grantTarget: 1,
				everyCount: null,
				fixedTime: '',
				grantStartTime: '',
				grantEndTime: '',
				memberIdentities: [],
			},
			timeForm: {
				startTime: '',
				endTime: '',
			},
			pushData: {
				couponId: null,
				id: null,
				state: 1,
				limitCardTime: 0,
			},
			importForm: {
				customerCardNum: '',
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
				limit: [{ required: true, message: '请选择顾客限制', trigger: 'blur' }],
				customerIdentity: [{ required: true, message: '请选择顾客身份', trigger: 'blur' }],
				customerLevel: [{ required: true, message: '请选择顾客等级', trigger: 'blur' }],
			},
			identity: [],
			cardNo: '',
			addList: [],
			identityList: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				total: 0,
				user: null,
				promotionId: null,
			},
			importData: {},
			product: {},
			queryEdit: null,
			queryId: null,
		};
	},
	created() {
		this.initialization();
		let { edit, id } = this.$route.query;
		this.queryEdit = edit;
		this.queryId = id;
		this.ishandworkType = Boolean(edit);
		if (id) this.loadData();
		if (edit) {
			this.lechoData();
		}
		this.identityData();
		this.getIdentity();
	},
	watch: {
		pushData: {
			handler() {
				this.PARTICIPATING_CUSTOMER_COLUMNS[3]['isShow'] = () => this.form.type == 2;
			},
			deep: true,
		},
		'form.type'(val) {
			if (val == 2 && this.form.grantType > 2) this.form.grantType = 1;
			if (val == 2) this.form.grantTarget = 4;
			this.PARTICIPATING_CUSTOMER_COLUMNS[3]['isShow'] = () => this.form.type == 2;
			this.clearImportMember();
		},
		'form.grantType'(val) {
			if (val > 2) {
				this.form.grantTarget = 2;
				this.pushData.limitCardTime = 1;
			}
		},
		'pushData.limitCardTime'(val) {
			if (val === 0) this.datetime = [];
		},
	},
	methods: {
		async clearImportMember() {
			let res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponGrant/clearImportMember',
			});
			if (res && res.code === 200) this.identityData();
		},
		isadd() {
			this.dialogVisible = true;
			this.product.everyCount = this.form.type === 1 ? this.form.everyCount : '';
		},
		async delImportData() {
			let { query } = this.$route;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponGrant/deleteImportMember',
				data: { id: query.edit ? query.edit : null },
			});
			if (res.code === 200) {
				this.$message.success(res.message);
				this.identityData();
			}
			this.delVisible = false;
		},
		dowloadFileList() {
			exportExcel('/mgmt/prmt/couponGrant/getImportErrorList', { key: this.importData.key });
		},
		beforeUpload() {
			this.identityList.loading = true;
			return true;
		},
		uploadHandle({ file }) {
			let options = {
				formObject: {
					type: this.form.type,
					grantId: this.queryEdit ? this.queryEdit : '',
					file,
				},
				url: '/mgmt/prmt/couponGrant/importUserList',
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
			this.$go('coupon_handOf_Detail', { id: this.pageId });
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
					url: '/mgmt/prmt/couponGrant/deleteUserByCardNo',
					data: { cardNo, id, promotionId },
				});
				if (res.code === 200) {
					this.$message.success(res.message);
					this.identityData();
				}
			});
		},
		initialization() {
			let { form, dayNum, timeForm, timeData } = this;
			let data = Object.assign({}, form);
			if (data.grantTarget !== 2) data.memberIdentities = [];
			if (this.form.grantType == 4) {
				data.grantEndTime = timeForm.endTime;
				data.grantStartTime = timeForm.startTime;
				let day = dayNum > 9 ? dayNum : '0' + dayNum;
				let minutes = formatDate(timeData).split(' ')[1];
				data.fixedTime = new Date(formatDate(Date.now(), 'month') + '-' + day + ' ' + minutes).getTime();
			}
			return data;
		},
		validatePush() {
			let isTrue = false;
			let { grantType, fixedTime, grantStartTime, grantEndTime } = this.form;
			let { startTime, endTime } = this.timeForm;
			let { dayNum, timeData } = this;
			let day = dayNum > 9 ? dayNum : '0' + dayNum;
			let minutes = formatDate(timeData).split(' ')[1];
			if (grantType == 4) fixedTime = new Date(formatDate(Date.now(), 'month') + '-' + day + ' ' + minutes).getTime();
			if (grantType == 4 && (!fixedTime || !startTime || !endTime || this.timeData.length == 0)) {
				isTrue = true;
				this.$message.warning('每月定时派发的时间都必填');
				return isTrue;
			}
			if (grantType == 2 && !fixedTime) {
				isTrue = true;
				this.$message.warning('每日循环派发时间必填');
				return isTrue;
			}
			if (grantType == 3 && (!grantStartTime || !grantEndTime)) {
				isTrue = true;
				this.$message.warning('派发时间必填');
				return isTrue;
			}
			if (grantType == 4 && new Date(startTime).getTime() >= new Date(endTime).getTime()) {
				isTrue = true;
				this.$message.warning('每月定时派发的派发开始时间需小于结束时间');
				return isTrue;
			}
			if (grantType == 3 && new Date(grantStartTime).getTime() >= new Date(grantEndTime).getTime()) {
				isTrue = true;
				this.$message.warning('每日循环派发的派发开始时间需小于结束时间');
				return isTrue;
			}
			if (this.pushData.limitCardTime == 1 && this.datetime.length == 0) {
				isTrue = true;
				this.$message.warning('固定开卡月份必填');
				return isTrue;
			}
		},
		resetPushData() {
			let { grantType } = this.form;
			if (this.form.grantTarget == 1 || this.pushData.limitCardTime == 0) this.datetime = [];
			if (this.form.grantTarget == 1) this.form.memberIdentities = [];
			if (grantType == 3) {
				this.timeForm.endTime = '';
				this.timeForm.startTime = '';
				this.form.fixedTime = '';
				this.dayNum = 1;
				this.timeData = '';
				return;
			}
			this.form.grantStartTime = '';
			this.form.grantEndTime = '';
			if (grantType == 4) return;
			this.timeForm.endTime = '';
			this.timeForm.startTime = '';
			this.dayNum = 1;
			this.timeData = '';
			if (grantType == 2) return;
			if (grantType == 1) this.form.fixedTime = '';
		},
		async saveAdd(type) {
			this.resetPushData();
			if (this.validatePush()) return;
			let { edit } = this.$route.query;
			let [startTime, endTime] = this.datetime || [];
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					let data = Object.assign(this.initialization(), this.pushData);
					data.state = type == 'add' ? 1 : 5;
					const res = await this.$fetch({
						method: 'POST',
						url: `/mgmt/prmt/couponGrant/${edit ? 'editCouponGrant' : 'addCouponGrant'}`,
						data: {
							...data,
							startTime: new Date(startTime).getTime() || '',
							endTime: new Date(endTime).getTime() || '',
						},
					});
					if (res && res.code == 200) {
						this.step = false;
						this.pageId = edit ? edit : res.data;
						this.$dispatch('CONPONHANDLIST');
						this.$dispatch('COUPON_HAND_OF_DETAIL_loadData');
						this.$dispatch('COUPON_HAND_OF_DETAIL_productData');
					}
				}
			});
		},
		async save() {
			if (this.form.type === 2 && !/^[1-9]\d*$/.test(this.product.everyCount)) {
				return this.$message.warning('可购数量为正整数！');
			}
			let { cardNo, mobile, realName } = this.addList[0];
			let grantId = this.$route.query.edit ? this.$route.query.edit : null;
			let type = this.form.type;
			let everyCount = type === 1 ? this.form.everyCount : this.product.everyCount;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/couponGrant/addUser`,
				data: { cardNo, mobile, realName, grantId, everyCount, type },
			});
			if (res && res.code == 200) {
				this.$message.success('添加成功');
				this.dialogVisible = false;
				this.identityData();
			}
		},
		async handleSearch() {
			const res = await this.$fetch(`/mgmt/prmt/selectMemberByCard?cardNo=${this.cardNo}`);
			if (res.code == 200) {
				this.product = { ...this.product, ...res.data };
				this.addList = [res.data];
			}
		},
		handleSizeChange(val) {
			this.identityList.pagination.pageSize = val;
			this.identityData();
		},
		handleChangePage(val) {
			this.identityList.pagination.currentPage = val;
			this.identityData();
		},
		exportTemplate() {
			exportExcel(`/mgmt/prmt/couponGrant/importGrantMemberTemplate`);
		},
		serachList() {
			this.identityData();
		},
		async identityData() {
			let {
				$route: { query },
				identityList: {
					pagination: { currentPage, pageSize },
					grantId,
					user,
				},
			} = this;
			grantId = query && query.edit ? query.edit : null;
			let params = { pageNum: currentPage, pageSize, grantId, user };
			const res = await this.$fetch(`/mgmt/prmt/couponGrant/getImportMemberPage?${qs.stringify(params)}`);
			if (res && res.code == 200) {
				this.identityList.data = res.data.list;
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
		async getIdentity() {
			const res = await this.$fetch(`/mgmt/prmt/getMemberIdentity`);
			if (res && res.code === 200) this.identity = res.data;
		},
		async loadData() {
			let { id } = this.$route.query;
			const res = await this.$fetch(`/mgmt/prmt/coupon/getBasicInfo?id=${id}`);
			if (res && res.code == 200) {
				this.couponeData = res.data;
				this.pushData = Object.assign(this.pushData, { couponId: id });
				this.couponCount = res.data.couponCount;
				if (this.couponCount > 0) this.form.grantTarget = 4;
			}
		},
		async lechoData() {
			let { edit } = this.$route.query;
			const res = await this.$fetch(`/mgmt/prmt/couponGrant/getCouponGrant?grantId=${edit}`);
			if (res && res.code == 200) {
				let { state, type, limitCardTime, startTime, endTime } = res.data;
				let { couponVo, grantTarget, grantType, everyCount, fixedTime, memberIdentities, couponId, id } = res.data;
				let { grantEndTime, grantStartTime } = res.data;
				this.form = {
					grantTarget,
					grantType,
					everyCount,
					grantStartTime,
					grantEndTime,
					fixedTime,
					memberIdentities: memberIdentities || [],
					type,
				};
				this.form.grantStartTime = grantStartTime || '';
				this.form.grantEndTime = grantEndTime || '';
				this.datetime = startTime ? [startTime, endTime] : [];
				this.pushData = { couponId, id, state, limitCardTime };
				this.couponeData = couponVo;
				this.couponCount = couponVo.couponCount;
				if (grantType == 4) {
					this.form.grantEndTime = '';
					this.form.grantStartTime = '';
					this.form.fixedTime = '';
					this.timeForm.startTime = grantStartTime;
					this.timeForm.endTime = grantEndTime;
					this.dayNum = formatDate(fixedTime, 'day').split('-')[2];
					this.timeData = fixedTime;
				}
				if (this.couponCount > 0) this.form.grantTarget = 4;
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
.platform-activeCenter_createHandWork-wrap {
	.table_title {
		font-weight: bold;
		margin-bottom: 20px;
	}
	.cardNo {
		display: flex;
		.radio-xz {
			line-height: 40px;
			margin-right: 10px;
		}
		.font {
			margin-right: 10px;
		}
		.elInput {
			margin-right: 10px;
			width: 100px;
		}
	}
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

.text-one {
	padding-left: 56px;
	padding-bottom: 10px;
	font-size: 18px;
	font-weight: 600;
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
</style>

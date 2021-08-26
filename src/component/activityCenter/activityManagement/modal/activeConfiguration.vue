<template>
	<div>
		<el-card class="card-gap">
			<div class="head-text">基础信息</div>
			<el-form :model="pagePromotion" :rules="rulesConfigDto" ref="ruleForm3" label-width="140px">
				<el-form-item label="活动编号：" prop="promotionCode">
					<el-input
						class="style-width"
						v-model="pagePromotion.promotionCode"
						@change="blurClick"
						placeholder="请输入活动编号"
						maxlength="40"
						show-word-limit
					></el-input>
					<span v-if="isSelectPromotionCode === 1" class="icon-class el-icon-success"></span>
					<span v-if="isSelectPromotionCode === 0" class="icon-class el-icon-error"></span>
					<span v-if="isSelectPromotionCode === 1">该编号可用</span>
					<span v-if="isSelectPromotionCode === 0">该编号重复</span>
				</el-form-item>
				<el-form-item label="活动名称：" prop="promotionName">
					<el-input
						v-model="pagePromotion.promotionName"
						class="style-width"
						placeholder="请输入活动名称"
						maxlength="40"
					></el-input>
				</el-form-item>
				<el-form-item label="活动开始时间：" prop="startTime">
					<el-date-picker
						class="date-picker"
						v-model="pagePromotion.startTime"
						type="datetime"
						placeholder="选择日期时间"
						:picker-options="timeDisabel"
						value-format="timestamp"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="活动结束时间：" prop="endTime">
					<el-date-picker
						:disabled="showEndTimeNum"
						class="date-picker"
						v-model="pagePromotion.endTime"
						type="datetime"
						value-format="timestamp"
						:picker-options="timeDisabel"
						placeholder="选择日期时间"
					></el-date-picker>
					<el-checkbox style="margin-right: 10px; margin-left: 10px" v-model="showEndTimeNum">不限时</el-checkbox>
					<el-popover placement="right" title width="200" trigger="hover" content=" ">
						<div>设为不限时活动时，该活动不会自动停止。商城不会有活动结束倒计时。</div>
						<span slot="reference" class="detail el-icon-warning-outline"></span>
					</el-popover>
				</el-form-item>
				<el-form-item label="显示结束时间" required>
					<el-radio
						class="radio-xz"
						:disabled="showEndTimeNum"
						v-model="pagePromotion.configDto.showEndTime"
						:label="1"
					>
						显示
					</el-radio>
					<el-radio
						class="radio-xz"
						:disabled="showEndTimeNum"
						v-model="pagePromotion.configDto.showEndTime"
						:label="0"
					>
						不显示
					</el-radio>
				</el-form-item>
				<el-form-item label="活动说明" prop="remarks">
					<el-input
						type="textarea"
						class="style-width textarea-class"
						placeholder="请输入活动说明，方便内部识别说明"
						v-model="pagePromotion.remarks"
						maxlength="1000"
						:autosize="{ minRows: 5 }"
						show-word-limit
					></el-input>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">购买配置</div>
			<el-row class="form-width-protect">
				<el-form :model="pagePromotion.configDto" ref="ruleForm1" :rules="rulesConfigDto" label-width="140px">
					<el-form-item label="限购总数量：" required>
						<el-radio
							class="radio-xz"
							v-for="(item, index) in limitNumberArr"
							:key="index"
							:disabled="$route.query.id && limitNumber == 4"
							v-model="limitNumber"
							:label="item.label"
						>
							{{ item.text }}
						</el-radio>
						<el-radio
							class="radio-xz"
							v-model="limitNumber"
							:label="4"
							:disabled="$route.query.id && limitNumber !== 4"
						>
							按需导入
						</el-radio>
					</el-form-item>
					<el-form-item label="" v-if="limitNumber != 4 && limitNumber != 1">
						{{ limitNumber == 2 ? '每位顾客可以购买每样产品' : '每位顾客可以购买所有活动产品总共' }}
						<el-input-number
							v-if="limitNumber == 2"
							v-model="limitNumberStrOne"
							:min="0"
							style="width: 140px"
							label="描述文字"
							:max="9999"
						></el-input-number>
						<el-input-number
							v-else
							v-model="limitNumberStrTwo"
							:min="0"
							style="width: 140px"
							label="描述文字"
							:max="9999"
						></el-input-number>
						<span style="margin-left: 10px">件</span>
					</el-form-item>
					<el-form-item label="支付时效：" required>
						<el-col :span="5">
							<el-col>
								<el-input-number
									:disabled="ispayLimitTime"
									style="margin-right: 10px; width: 140px"
									v-model="pagePromotion.configDto.day"
									:min="0"
									:max="14"
								></el-input-number>
								<span>天</span>
							</el-col>
						</el-col>
						<el-col :span="5">
							<el-col>
								<el-input-number
									:disabled="ispayLimitTime"
									style="margin-right: 10px; width: 140px"
									v-model="pagePromotion.configDto.hour"
									:min="0"
									:max="23"
								></el-input-number>
								<span>时</span>
							</el-col>
						</el-col>
						<el-col :span="5">
							<el-col>
								<el-input-number
									:disabled="ispayLimitTime"
									style="margin-right: 10px; width: 140px"
									v-model="pagePromotion.configDto.minute"
									:min="0"
									:max="59"
								></el-input-number>
								<span>分</span>
							</el-col>
						</el-col>
						<el-checkbox class="radio-xz" style="margin-right: 10px" v-model="ispayLimitTime">跟随系统</el-checkbox>
						<el-popover placement="right" title width="200" trigger="hover" content=" ">
							<div>
								-控制该活动中产品下单后的支付时效
								<br />
								-如果订单内有其他产品，以活动产品为主。如果有多个活动产品，以最短支付时间的产品为准。
								<br />
								-选择跟随系统，该活动内产品的支付时效跟随系统全局配置
								<br />
								-最大值10天23时59分
							</div>
							<span slot="reference" class="detail el-icon-warning-outline"></span>
						</el-popover>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">优惠券配置</div>
			<div class="table_list_fix">
				<el-table :data="couponIdArr" border style="width: 100%" :loading="false">
					<el-table-column label="操作" align="center">
						<template slot-scope="{ row, $index }">
							<div>
								<span class="btns" @click="add">添加</span>
								<span class="btns" v-if="couponIdArr.length !== 1" @click="del(row, $index)">删除</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="couponNumber" label="优惠券编号" align="center" width="160">
						<template slot-scope="{ row, $index }">
							<div>
								<el-select
									v-model="row.couponNumber"
									filterable
									placeholder="输入编号选择"
									:remote-method="remoteMethod"
									:loading="optionsLoading"
									reserve-keyword
									remote
									@change="selChange($event, $index)"
								>
									<el-option
										v-for="item in options"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									></el-option>
								</el-select>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="couponName" label="优惠券名称" align="center"></el-table-column>
					<el-table-column prop="faceValue" label="面值" align="center"></el-table-column>
					<el-table-column prop="minAmount" label="使用规则" align="center"></el-table-column>
					<el-table-column prop="couponTypeString" label="类型" align="center"></el-table-column>
					<el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
					<el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
				</el-table>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">预告配置</div>
			<el-row type="flex" class="form-width-protect">
				<el-form :model="pagePromotion.configDto" ref="ruleForm2" :rules="rulesConfigDto" label-width="140px">
					<el-form-item label="活动预告时间：" prop="noticeTime">
						<el-date-picker
							class="date-picker"
							v-model="pagePromotion.configDto.noticeTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
							:picker-options="timeDisabel"
							:disabled="pagePromotion.configDto.isNotice === 1"
						></el-date-picker>
						<el-radio class="radio-xz" v-model="pagePromotion.configDto.isNotice" :label="0">预告</el-radio>
						<el-radio class="radio-xz" v-model="pagePromotion.configDto.isNotice" :label="1">不预告</el-radio>
					</el-form-item>
					<div v-if="pagePromotion.configDto.isNotice === 0">
						<el-form-item label="预告内容：" prop="noticeContent">
							<div>
								<el-radio v-model="pagePromotion.configDto.noticeContent" :label="1">产品预告</el-radio>
								<span class="activity-text">预告内容为本次活动的产品</span>
							</div>
							<div>
								<el-radio v-model="pagePromotion.configDto.noticeContent" :label="2">海报预告</el-radio>
								<span class="activity-text">预告内容为海报，顾客无法看到具体参与活动的产品</span>
							</div>
						</el-form-item>
						<div v-if="pagePromotion.configDto.noticeContent === 2">
							<el-form-item label>
								<span class="activity-text">PC版海报 支持bmp、jpg、png，最大10M。建议图片宽：1024px</span>
							</el-form-item>
							<el-form-item label>
								<el-upload
									:action="$store.getters['system/getOssUploadUrl']"
									:headers="$store.getters['system/getSignatureVerification']"
									:data="uploadData"
									:limit="1"
									list-type="picture-card"
									:on-preview="handlePictureCardPreviewPC"
									:on-success="handleSuccessPC"
									:file-list="filePC"
									:before-remove="beforeRemovePC"
									:before-upload="beforeVideoUpload"
									:class="[pagePromotion.configDto.pcPosterImg ? 'is-upload-pc' : '']"
									accept="bmp,jpg,png"
								>
									<i class="el-icon-plus"></i>
								</el-upload>
								<el-dialog v-drag :visible.sync="dialogVisiblePC">
									<img width="100%" :src="dialogImageUrlPC" alt />
								</el-dialog>
							</el-form-item>
							<el-form-item label>
								<span class="activity-text">
									移动端海报 同时应用于APP和小程序 支持bmp、jpg、png，最大10M。建议图片宽度：750px
								</span>
							</el-form-item>
							<el-form-item label prop="desc">
								<el-upload
									:class="[pagePromotion.configDto.appPosterImg ? 'is-upload-app' : '']"
									:action="$store.getters['system/getOssUploadUrl']"
									:headers="$store.getters['system/getSignatureVerification']"
									:data="uploadData"
									:limit="1"
									list-type="picture-card"
									:on-success="handleSuccessApp"
									:on-preview="handlePictureCardPreviewApp"
									:file-list="fileApp"
									:before-upload="beforeVideoUpload"
									:before-remove="beforeRemoveApp"
									accept="bmp,jpg,png"
								>
									<i class="el-icon-plus"></i>
								</el-upload>
								<el-dialog v-drag :visible.sync="dialogVisibleApp">
									<img width="100%" :src="dialogImageUrlApp" alt />
								</el-dialog>
							</el-form-item>
						</div>
					</div>
				</el-form>
			</el-row>
		</el-card>
	</div>
</template>

<script>
import axios from 'axios';
import { CHECK_PROMOTION_CODE, CHECK_PROMOTION_NAME } from '../config.js';
import { uploadFileType } from 'util/formValidation';
import qs from 'querystring';
export default {
	name: 'activeConfiguration',
	props: {
		promotion: {
			type: Object,
			default: () => {
				return {};
			},
		},
		componentname: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			pagePromotion: {},
			isSelectPromotionCode: '',
			ispayLimitTime: false,
			couponIdArr: [
				{
					id: '',
					couponCountString: null,
					couponName: null,
					couponNumber: null,
					couponState: null,
					couponStateString: null,
					couponType: null,
					couponTypeString: null,
					createTime: null,
					endTime: null,
					faceValue: null,
					grantCount: null,
					isGenerateCode: null,
					minAmount: null,
					minAmountString: null,
					startTime: null,
					useRange: null,
					usedCount: null,
					usedPercent: null,
				},
			],
			timeDisabel: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
			showEndTimeNum: false,
			limitNumberStrOne: '',
			limitNumberStrTwo: '',
			limitNumber: 1,
			limitNumberArr: [
				{ label: 1, text: '不限量' },
				{ label: 2, text: '独立限量' },
				{ label: 3, text: '统一限量' },
			],
			options: [],
			optionsLoading: false,
			filePC: [],
			fileApp: [],
			temporary: [],
			rulesConfigDto: {
				noticeTime: [{ required: true, message: '请选择活动预告时间', trigger: 'blur' }],
				noticeContent: [{ required: true, message: '请选择预告内容', trigger: 'change' }],
				isNotice: [{ required: true, message: '', trigger: 'blur' }],
				promotionCode: [{ required: true, validator: CHECK_PROMOTION_CODE, trigger: 'blur' }],
				promotionName: [{ required: true, validator: CHECK_PROMOTION_NAME }],
				startTime: [{ required: true, message: '请选择开始时间' }],
				endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
			},
			time: {
				day: 0,
				hour: 0,
				minute: 0,
			},
			dialogVisibleApp: false,
			dialogImageUrlApp: '',
			dialogVisiblePC: false,
			dialogImageUrlPC: '',
			isPush: false,
			isFlag: false,
			isImg: true,
			isdeleteCacheMember: true,
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	watch: {
		showEndTimeNum: {
			handler(val) {
				this.rulesConfigDto.endTime = [{ required: !val, message: '请选择结束时间', trigger: 'change' }];
				if (val) {
					this.pagePromotion.endTime = '';
					this.pagePromotion.configDto.showEndTime = 0;
				}
			},
		},
		async limitNumber(val, oldval) {
			if (!this.$route.query.id) {
				if (oldval === 4 && this.isdeleteCacheMember) {
					this.deleteCacheMember();
				} else if (oldval !== 4 && val === 4 && this.isdeleteCacheMember) {
					this.deleteCacheMember();
				}
				this.isdeleteCacheMember = true;
			}
		},
		ispayLimitTime(val) {
			if (val) {
				this.pagePromotion.configDto.day = 0;
				this.pagePromotion.configDto.hour = 0;
				this.pagePromotion.configDto.minute = 0;
			}
			this.pagePromotion.configDto.payLimitTime = val ? 1 : 2;
		},
		'pagePromotion.configDto.limitType'() {
			let { payLimitTime } = this.pagePromotion.configDto;
			this.limitNumberStr();
			this.ispayLimitTime = payLimitTime == 1 ? true : false;
		},
		'pagePromotion.configDto.appPosterImg'() {
			let { pcPosterImg, appPosterImg } = this.pagePromotion.configDto;
			if (pcPosterImg) this.filePC = this.filePC.length > 0 ? this.filePC : [{ name: '01', url: pcPosterImg }];
			if (appPosterImg) this.fileApp = this.fileApp.length > 0 ? this.fileApp : [{ name: '02', url: appPosterImg }];
		},
		'pagePromotion.configDto.noticeContent'() {
			this.$refs['ruleForm2'] && this.$refs['ruleForm2'].clearValidate('noticeContent');
		},
		'promotion.endTime'(val) {
			if (val === null && this.componentname === 'activeConfiguration') {
				this.showEndTimeNum = true;
				this.pagePromotion.endTime = '';
			}
		},
		'pagePromotion.configDto.isNotice'(val) {
			if (val === 1) this.$refs['ruleForm2'] && this.$refs['ruleForm2'].clearValidate('noticeTime');
		},
		'promotion.configDto.isNotice'(val) {
			if (val == 0) this.pagePromotion.configDto.noticeContent = 2;
		},
		promotion: {
			handler(val) {
				this.pagePromotion = JSON.parse(JSON.stringify(val));
				if (val.couponIds.length > 0) this.couponIdArr = val.couponIds;
			},
			deep: true,
			immediate: true,
		},
	},
	created() {
		this.limitNumberStr();
		this.ispayLimitTime = this.promotion.configDto.payLimitTime == 1 ? true : false;
	},
	methods: {
		limitNumberStr() {
			let { limitNumber, limitType } = this.pagePromotion.configDto;
			this.limitNumber = limitType;
			if (limitType == 2) {
				this.limitNumberStrOne = limitNumber > 0 ? limitNumber : '';
			} else if (limitType == 3) {
				this.limitNumberStrTwo = limitNumber > 0 ? limitNumber : '';
			}
		},
		async deleteCacheMember() {
			let res = await this.$fetch(`/mgmt/prmt/getUserListPage?${qs.stringify({ pageNum: 1, pageSize: 10 })}`);
			if (res && res.code === 200 && res.data && res.data.list.length > 0) {
				this.$confirm('切换购买配置类型将清空已导入的顾客?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.$fetch({ method: 'POST', url: `/mgmt/prmt/deleteCacheMember`, data: { id: null } });
					})
					.catch(() => {
						this.limitNumber = this.promotion.configDto.limitNumber;
						this.isdeleteCacheMember = false;
					});
			}
		},
		async blurClick(e) {
			if (!/[^\w\s\u4e00-\u9fa5]+/.test(e) && e.trim() !== '') {
				let { id } = this.$route.query;
				const res = await axios.request(
					`/mgmt/prmt/selectPromotionCode?promotionCode=${e}&promotionId=${this.$route.query.id ? id : ''}`
				);
				if (res.data.code == 500 && res.data.message != '活动编码不能重复') {
					this.$message.error('网络异常！');
				} else {
					this.isSelectPromotionCode = res && res.data.code == 200 ? 1 : 0;
				}
				if (!e) this.isSelectPromotionCode = '';
			} else {
				this.isSelectPromotionCode = '';
			}
		},
		beforeVideoUpload(file) {
			const whiteList = ['jpg', 'png', 'bmp'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		radioel() {
			this.$refs['ruleForm2'].clearValidate();
		},
		del(row, index) {
			this.pagePromotion.couponIds.splice(index, 1);
		},
		add() {
			this.pagePromotion.couponIds.push({
				id: '',
				couponCountString: null,
				couponName: null,
				couponNumber: null,
				couponState: null,
				couponStateString: null,
				couponType: null,
				couponTypeString: null,
				createTime: null,
				endTime: null,
				faceValue: null,
				grantCount: null,
				isGenerateCode: null,
				minAmount: null,
				minAmountString: null,
				startTime: null,
				useRange: null,
				usedCount: null,
				usedPercent: null,
			});
		},
		selChange(e, index) {
			this.isPush = false;
			if (this.isPush) return;
			let aryObj = this.temporary.filter(el => el.id === e);
			this.couponIdArr.splice(index, 1, aryObj[0]);
		},
		async remoteMethod(query) {
			if (query !== '') {
				this.optionsLoading = true;
				this.getConpon(query);
			}
		},
		async getConpon(couponNumber) {
			const res = await this.$fetch(`/mgmt/prmt/selectCouponByNumber?couponNumber=${couponNumber}`);
			if (res && res.code == 200) {
				this.temporary = res.data;
				this.options = res.data.map(({ id, couponNumber }) => ({ value: id, label: couponNumber }));
				this.optionsLoading = false;
			}
		},
		handleSuccessPC(res, c, filelist) {
			if (res.success) {
				this.pagePromotion.configDto.pcPosterImg = res.datas.fileUrlKey;
				this.filePC = filelist.map(e => {
					e.url = res.datas.fileUrlKey;
					return e;
				});
			} else {
				this.$refs.elUpload.clearFiles();
			}
		},
		handleSuccessApp(res, c, filelist) {
			if (res.success) {
				this.pagePromotion.configDto.appPosterImg = res.datas.fileUrlKey;
				this.fileApp = filelist.map(e => {
					e.url = res.datas.fileUrlKey;
					return e;
				});
			} else {
				this.$refs.elUpload.clearFiles();
			}
		},
		beforeRemovePC() {
			this.dialogImageUrlPC = '';
			this.pagePromotion.configDto.pcPosterImg = '';
			this.filePC = [];
		},
		beforeRemoveApp() {
			this.dialogImageUrlApp = '';
			this.pagePromotion.configDto.appPosterImg = '';
			this.fileApp = [];
		},
		handlePictureCardPreviewPC(file) {
			this.dialogImageUrlPC = file.url;
			this.dialogVisiblePC = true;
		},
		handlePictureCardPreviewApp(file) {
			this.dialogImageUrlApp = file.url;
			this.dialogVisibleApp = true;
		},
		isGo() {
			let { isNotice, noticeTime } = this.pagePromotion.configDto;
			let isFlag = true;
			let isTure = true;
			let isTure2 = true;
			let isTure3 = true;
			let isTure4 = true;
			let isTure5 = true;
			this.$refs['ruleForm3'].validate(valid => {
				isFlag = valid;
			});
			this.$refs['ruleForm1'].validate(valid => {
				isTure = valid;
			});
			if (!isNotice) this.$refs['ruleForm2'].validate(() => {});
			isTure2 = !(isNotice === 0 && !noticeTime);
			let { day, hour, minute, payLimitTime, noticeContent, pcPosterImg, appPosterImg } = this.pagePromotion.configDto;
			let time = true;
			if (payLimitTime === 2) {
				time = !!day || !!hour || !!minute ? true : false;
				if (!time) this.$message.warning('支付时效至少要为1分钟');
			} else {
				time = true;
			}
			if (noticeContent === 2 && (!pcPosterImg || !appPosterImg)) {
				this.$message.warning('PC海报与APP海报图片不能为空！');
				isTure3 = false;
			} else {
				isTure3 = true;
			}
			if (this.isSelectPromotionCode == '' && isFlag && this.$route.query.id) {
				isTure4 = true;
			} else if (isFlag && this.isSelectPromotionCode) {
				isTure4 = true;
			} else {
				isTure4 = false;
			}
			if (this.limitNumber == 2 || this.limitNumber == 3) {
				if (this.limitNumber == 2 && this.limitNumberStrOne == '') {
					this.$message.warning('每位顾客可以购买每样产品须大于0件');
					isTure5 = false;
				}
				if (this.limitNumber == 3 && this.limitNumberStrTwo == '') {
					this.$message.warning('每位顾客可以购买所有活动产品总共产品须大于0件');
					isTure5 = false;
				}
			}
			return isFlag && isTure && isTure2 && !!time && isTure3 && isTure4 && isTure5;
		},
		emit() {
			let { limitNumber } = this;
			if (limitNumber == 2 && this.limitNumberStrOne == '') return;
			if (limitNumber == 3 && this.limitNumberStrTwo == '') return;
			let { noticeContent, pcPosterImg, appPosterImg, isNotice } = this.pagePromotion.configDto;
			let params = Object.assign({}, this.pagePromotion);
			params.configDto.pcPosterImg = noticeContent == 1 ? '' : pcPosterImg;
			params.configDto.appPosterImg = noticeContent == 1 ? '' : appPosterImg;
			params.configDto.noticeContent = isNotice == 1 ? null : noticeContent;
			params.endTime = this.showEndTimeNum ? null : this.pagePromotion.endTime;
			params.configDto.payLimitTime = this.ispayLimitTime ? 1 : 2;
			params.configDto.limitType = limitNumber;
			if (limitNumber == 2) {
				params.configDto.limitNumber = this.limitNumberStrOne;
			} else if (limitNumber == 3) {
				params.configDto.limitNumber = this.limitNumberStrTwo;
			} else {
				params.configDto.limitNumber = '';
			}
			params.couponIds = this.couponIdArr;
			this.$emit('firstData', { ...params });
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
		.radio-xz {
			margin-left: 10px;
		}
		.span-text {
			margin-left: 10px;
		}
		.activity-text {
			color: $color-disabled;
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

.is-upload-app ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}

.is-upload-pc ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
.style-width {
	width: 300px;
	margin-right: 10px;
}
.textarea-class ::v-deep .el-input__count {
	right: 28px;
}
.textarea-class ::v-deep.el-textarea__inner {
	padding-bottom: 50px;
}
.icon-class {
	color: $success;
	margin-right: 5px;
}
.el-icon-error {
	color: $error;
}
</style>

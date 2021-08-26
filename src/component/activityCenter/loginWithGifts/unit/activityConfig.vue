<template>
	<div class="activity-config">
		<el-card>
			<div class="section-title">基础信息</div>
			<el-form ref="baseInfo" :model="baseInfo" :rules="rulesConfig" label-suffix=":" label-width="120px">
				<el-form-item label="活动名称" prop="activityName">
					<el-input v-model.trim="baseInfo.activityName"></el-input>
					<div class="bottom-tips">1~40个字，不支持特殊符号</div>
				</el-form-item>
				<el-form-item label="活动开始时间" prop="startTime">
					<el-date-picker
						v-model="baseInfo.startTime"
						type="datetime"
						placeholder="选择日期时间"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<div class="bottom-tips">如果同一时间段内有多个登录有礼活动，按照创建时间正序循环触发。</div>
				</el-form-item>
				<el-form-item label="活动结束时间" prop="endTime">
					<el-date-picker
						v-model="baseInfo.endTime"
						type="datetime"
						placeholder="选择日期时间"
						:disabled="baseInfo.unlimitedTime"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
					<el-checkbox v-model="baseInfo.unlimitedTime">不限时</el-checkbox>
				</el-form-item>
				<el-form-item label="领券平台" prop="platforms">
					<el-checkbox-group v-model="baseInfo.platforms">
						<el-checkbox :label="1">APP</el-checkbox>
						<el-checkbox :label="2">PC</el-checkbox>
						<el-checkbox :label="4">小程序</el-checkbox>
					</el-checkbox-group>
					<div class="bottom-tips">活动顾客首次登录了领取平台才会获取优惠券，每次活动每位顾客仅可领取一次。</div>
				</el-form-item>
				<el-form-item label="活动说明" prop="remarks">
					<el-input
						type="textarea"
						v-model.trim="baseInfo.remarks"
						maxlength="1000"
						show-word-limit
						placeholder="请输入活动说明，方便内部识别说动"
					></el-input>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card>
			<el-row type="flex" align="middle">
				<div class="section-title">关联优惠券</div>
				<div class="section-subtitle">
					活动参与顾客在登录领取平台时会按照“本次活动可获得数量”
					批量获得所有关联优惠券。如果关联优惠券内某个优惠券已经用完，当前登录有礼活动会自动停止。
				</div>
			</el-row>
			<tableList :dataSource="couponList" :columns="LOGIN_WITH_GIFTS_ADD_RELATION_COLUMNS" slotcontent>
				<template slot="loginGiftLimitCount" slot-scope="scope">
					<el-input v-model.trim="scope.row.loginGiftLimitCount" @blur="verifyLimitCount(scope.row)"></el-input>
				</template>
				<template slot-scope="scope">
					<el-button type="text" @click="couponDelete(scope.$index)">删除</el-button>
				</template>
			</tableList>
			<el-button type="primary" @click="couponAdd">新增</el-button>
		</el-card>
		<el-card>
			<el-row type="flex" align="middle">
				<div class="section-title">提醒配置</div>
				<div class="section-subtitle">选择登录提醒需要配置海报，活动参与顾客在登录适用平台的商城后会有弹窗提醒。</div>
			</el-row>
			<el-form ref="remindForm" :model="remindForm" :rules="remindFormRules" label-suffix=":" label-width="120px">
				<el-form-item label="登录" prop="remind">
					<el-radio-group v-model="remindForm.remind">
						<el-radio :label="true">提醒</el-radio>
						<el-radio :label="false">不提醒</el-radio>
					</el-radio-group>
				</el-form-item>
				<template v-if="remindForm.remind">
					<el-form-item label="提醒海报" prop="posterPicPc">
						<el-row>
							<el-col :span="3">PC版海报</el-col>
							<el-col :span="4">
								<el-upload
									:action="$store.getters['system/getOssUploadUrl']"
									:headers="$store.getters['system/getSignatureVerification']"
									:data="uploadData"
									list-type="picture-card"
									:on-preview="handlePictureCardPreviewPC"
									:on-remove="handleRemovePC"
									:on-success="handleSuccessPC"
									:file-list="pcPostList"
									:before-upload="beforeVideoUpload"
									:class="pcPostList.length == 1 ? 'hide_box' : ''"
								>
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-col>
							<el-col :span="10">
								<div>支持bmp、jpg、png，最大10M。建议图片尺寸：652 x 858</div>
								<el-button type="text" @click="handlePosterPreviewPC">预览</el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="" prop="posterPicApp">
						<el-row>
							<el-col :span="3">移动端海报</el-col>
							<el-col :span="4">
								<el-upload
									:action="$store.getters['system/getOssUploadUrl']"
									:headers="$store.getters['system/getSignatureVerification']"
									:data="uploadData"
									list-type="picture-card"
									:on-preview="handlePictureCardPreviewAPP"
									:on-remove="handleRemoveAPP"
									:on-success="handleSuccessAPP"
									:file-list="appPostList"
									:before-upload="beforeVideoUpload"
									:class="appPostList.length == 1 ? 'hide_box' : ''"
								>
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-col>
							<el-col :span="10">
								<div>支持bmp、jpg、png，最大10M。建议图片尺寸：652 x 858</div>
								<el-button type="text" @click="handlePosterPreviewAPP">预览</el-button>
							</el-col>
						</el-row>
					</el-form-item>
				</template>
			</el-form>
		</el-card>

		<!-- 添加优惠券 -->
		<el-dialog v-drag title="增加优惠券关联" :visible.sync="couponAddVisible" width="500px">
			<el-form ref="couponForm" :model="couponForm" :rules="couponFormRules" label-width="100px" label-suffix=":">
				<el-form-item label="搜索优惠券" prop="couponNumber">
					<el-row type="flex">
						<!-- <el-input v-model="couponForm.couponNumber"></el-input> -->
						<el-select
							v-model.trim="couponForm.couponNumber"
							filterable
							remote
							placeholder="输入优惠券编号，精准搜索"
							:remote-method="loadCoupon"
							@change="couponSelect"
						>
							<el-option
								v-for="item in couponData"
								:key="item.couponNumber"
								:label="item.couponNumber"
								:value="item.couponNumber"
							></el-option>
						</el-select>
						<!-- <el-button type="primary">搜索</el-button> -->
					</el-row>
				</el-form-item>
				<el-form-item label="优惠券编号" prop="couponNumberText">{{ couponForm.couponNumberText }}</el-form-item>
				<el-form-item label="优惠券名称" prop="couponName">{{ couponForm.couponName }}</el-form-item>
				<el-form-item label="面值" prop="faceValue">{{ couponForm.faceValue }}</el-form-item>
				<el-form-item label="使用规则" prop="minAmountString">{{ couponForm.minAmountString }}</el-form-item>
				<el-form-item label="类型" prop="couponTypeString">{{ couponForm.couponTypeString }}</el-form-item>
				<el-form-item label="有效时间" prop="effectiveTime">
					{{ couponForm.effectiveTime }}
				</el-form-item>
				<el-form-item label="可获券张数" prop="couponCountString">{{ couponForm.limitCount }}</el-form-item>
			</el-form>
			<el-row type="flex">
				<el-button @click="couponCancel('couponForm')">取消</el-button>
				<el-button type="primary" @click="couponSave('couponForm')">添加</el-button>
			</el-row>
		</el-dialog>
		<!-- 图片预览 -->
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
		<!-- 海报预览 -->
		<el-dialog fullscreen :visible.sync="posterVisible">
			<el-row class="poster-bg" :class="{ phone: isPhone }" type="flex" justify="center" align="middle">
				<div class="poster-content">
					<i class="el-icon-circle-close"></i>
					<el-image :src="isPhone ? posterImageUrlAPP : posterImageUrl"></el-image>
					<div class="button">立即领取</div>
				</div>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { LOGIN_WITH_GIFTS_ADD_RELATION_COLUMNS } from './config';
import { deepCopy } from '@/component/serviceCenter/serviceCenterData/util.js';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'activityConfig',
	props: {
		promotion: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			LOGIN_WITH_GIFTS_ADD_RELATION_COLUMNS,
			baseInfo: {
				platforms: [],
			},
			couponList: [], //关联优惠券list
			couponListStore: [],
			rulesConfig: {
				activityName: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{ pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,40}$/, message: '1~40位字符，不支持特殊符号', trigger: 'blur' },
				],
				startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
				endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
				platforms: [{ required: true, message: '请选择领券平台', trigger: 'blur' }],
			},
			couponAddVisible: false, //新增关联优惠券弹窗状态
			couponForm: {
				couponNumber: '',
			}, //新增关联优惠券弹窗form
			couponData: [], //模糊搜索到的优惠券数据
			couponFormRules: {
				//新增关联优惠券弹窗form rules
				couponNumber: [{ required: true, message: '请输入优惠券编号', trigger: 'blur' }],
			},
			remindForm: {
				remind: '',
				posterPicPc: '',
				posterPicApp: '',
			}, // 提醒配置form
			pcPostList: [], // pc海报
			appPostList: [], //app海报
			dialogVisible: false, // 预览弹窗状态
			dialogImageUrl: '', // 预览地址
			remindFormRules: {
				remind: [{ required: true, message: '请选择是否登陆提醒', trigger: 'blur' }],
				posterPicPc: [{ required: true, message: '请上传PC版海报', trigger: 'blur' }],
				posterPicApp: [{ required: true, message: '请上传移动端海报', trigger: 'blur' }],
			},
			posterVisible: false, //海报预览状态
			posterImageUrl: '', //海报url
			posterImageUrlAPP: '',
			isPhone: false,
		};
	},
	watch: {
		promotion: {
			// immediate: true,
			handler(data) {
				// console.log(data, 'promotion');
				const {
					activityName,
					startTime,
					endTime,
					unlimitedTime,
					platforms,
					remarks,
					couponList,
					remind,
					posterPicPc,
					posterPicApp,
				} = data;
				this.baseInfo = { ...this.baseInfo, activityName, startTime, endTime, unlimitedTime, platforms, remarks };
				this.couponList = this.couponListStore.length > 0 ? [...this.couponListStore] : [...couponList];
				this.remindForm = { ...this.remindForm, remind, posterPicPc, posterPicApp };
				this.pcPostList = posterPicPc ? [{ url: posterPicPc }] : [];
				this.appPostList = posterPicApp ? [{ url: posterPicApp }] : [];
			},
		},
		'baseInfo.unlimitedTime'(val) {
			if (val) {
				this.rulesConfig.endTime[0].required = false;
				this.baseInfo.endTime = '';
			} else {
				this.rulesConfig.endTime[0].required = true;
			}
		},
		'baseInfo.platforms'(val) {
			if (val.includes(2)) {
				this.remindFormRules.posterPicPc[0].required = true;
			} else {
				this.remindFormRules.posterPicPc[0].required = false;
			}
			if (val.includes(1) || val.includes(4)) {
				this.remindFormRules.posterPicApp[0].required = true;
			} else {
				this.remindFormRules.posterPicApp[0].required = false;
			}
		},
	},
	computed: {
		// 上传data
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
	},
	methods: {
		// 图片上传验证
		beforeVideoUpload(file) {
			const whiteList = ['bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		// 关联优惠券 删除
		couponDelete(index) {
			this.$confirm('删除活动关联优惠券', '确认提示', {
				type: 'warning',
			})
				.then(() => {
					this.couponList.splice(index, 1);
				})
				.catch(() => {});
		},
		// 关联优惠券 新增
		couponAdd() {
			this.couponAddVisible = true;
		},
		verifyLimitCount(row) {
			const { loginGiftLimitCount, limitCount } = row;
			if (!/^[1-9]\d{0,3}$/.test(loginGiftLimitCount)) {
				// 最大支持9999
				row.loginGiftLimitCount = '';
				return this.$message.warning('请输入1~优惠券最大可获数量的数字');
			}
			if (limitCount && loginGiftLimitCount > limitCount) {
				row.loginGiftLimitCount = '';
				return this.$message.warning('请输入1~优惠券最大可获数量的数字');
			}
		},
		// 关联优惠券添加 取消
		couponCancel(formName) {
			this.$refs[formName].resetFields();
			this.couponAddVisible = false;
		},
		// 关联优惠券添加 保存
		couponSave(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let item = deepCopy(this.couponForm);
					item.loginGiftLimitCount = ''; // @todo 防止input输入不成功问题
					if (!this.couponList.map(item => item.couponNumber).includes(item.couponNumber)) {
						this.couponList.unshift(item);
					} else {
						return this.$message.warning('已有相同优惠券，请勿重复添加');
					}
					this.couponCancel(formName);
				}
			});
		},
		// 图片预览
		handlePictureCardPreviewPC(file) {
			this.dialogVisible = true;
			this.dialogImageUrl = file.url;
		},
		// 图片删除
		handleRemovePC() {
			this.pcPostList = [];
			this.remindForm.posterPicPc = '';
		},
		// 图片上传成功
		handleSuccessPC(response) {
			this.pcPostList = [{ url: response?.datas?.fileUrlKey }];
			this.remindForm.posterPicPc = response?.datas?.fileUrlKey;
		},
		// PC海报预览
		handlePosterPreviewPC() {
			this.posterVisible = true;
			this.isPhone = false;
			this.posterImageUrl = this.remindForm.posterPicPc;
		},
		// ======移动端======
		// 图片预览
		handlePictureCardPreviewAPP(file) {
			this.dialogVisible = true;
			this.dialogImageUrl = file.url;
		},
		// 图片删除
		handleRemoveAPP() {
			this.appPostList = [];
			this.remindForm.posterPicApp = '';
		},
		// 图片上传成功
		handleSuccessAPP(response) {
			this.appPostList = [{ url: response?.datas?.fileUrlKey }];
			this.remindForm.posterPicApp = response?.datas?.fileUrlKey;
		},
		handlePosterPreviewAPP() {
			this.posterVisible = true;
			this.isPhone = true;
			this.posterImageUrlAPP = this.remindForm.posterPicApp;
		},

		toNext() {
			let baseInfoOnoff = false;
			let remindOnoff = false;
			let limitCountOnoff = false;
			const limitCountArr = this.couponList.map(item => item.loginGiftLimitCount);
			if (limitCountArr.length > 0) {
				if (limitCountArr.every(item => item > 0)) {
					limitCountOnoff = true;
				} else {
					this.$message.warning('请输入活动可获得数量');
				}
			} else {
				this.$message.warning('请选择关联优惠券');
			}
			this.$refs['baseInfo'].validate(valid => {
				if (valid) {
					baseInfoOnoff = true;
				}
			});
			this.$refs['remindForm'].validate(valid => {
				if (valid) {
					remindOnoff = true;
				}
			});
			const couponList = this.couponList.map(({ id, loginGiftLimitCount }) => ({ couponId: id, loginGiftLimitCount }));
			this.couponListStore = [...this.couponList];
			this.$emit('editSuccess', { ...this.baseInfo, ...this.remindForm, couponList });
			return limitCountOnoff && baseInfoOnoff && remindOnoff;
		},
		// 选择优惠券
		couponSelect(data) {
			const item = this.couponData.filter(item => item.couponNumber == data)[0] || {};
			const { couponNumber, startTime, endTime } = item;
			this.couponForm = {
				...item,
				couponNumberText: couponNumber,
				effectiveTime: (startTime && `${startTime}至${endTime || ''}`) || '',
			};
		},
		// 获取优惠券数据
		async loadCoupon(val) {
			const res = await this.$fetch(`/mgmt/prmt/loginGift/getCouponPage?couponNumber=${val}`);
			if (res && res.code == 200 && res.data) {
				this.couponData = res.data.list;
			} else {
				this.$message.error('搜索优惠券失败');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
::v-deep .is-fullscreen {
	.el-dialog__body {
		height: calc(100% - 100px);
	}
	.poster-bg {
		width: 100%;
		height: 100%;
		background: url('../../../../assets/poster-bg.png') 0 0 /100%;
		&.phone {
			width: 375px;
			height: 100%;
			margin: 0 auto;
			.poster-content {
				.el-image {
					width: 300px;
					height: 400px;
				}
			}
		}
		.poster-content {
			text-align: center;
			position: relative;
			.el-icon-circle-close {
				color: #fff;
				position: absolute;
				right: -20px;
				top: -20px;
				font-size: 20px;
			}
			.el-image {
				width: 400px;
				height: 524px;
			}
			.button {
				width: 200px;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-radius: 20px;
				background: #cf0807;
				font-size: 16px;
				margin: 10px auto;
			}
		}
	}
}
.section-title {
	font-size: 18px;
	font-weight: 600;
	padding: 0 0 20px 0;
	flex-shrink: 0;
	margin-right: 30px;
}
.section-subtitle {
	font-size: 12px;
	margin-bottom: 20px;
	color: $color-body-se;
}
</style>
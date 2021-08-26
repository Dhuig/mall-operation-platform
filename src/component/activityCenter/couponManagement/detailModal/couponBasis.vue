<template>
	<div>
		<el-card class="card-gap">
			<div class="had-title">
				<span>{{ pageData.couponState | status }}</span>
				<el-button
					v-if="pageData.couponState == 1 || pageData.couponState == 6"
					class="btns-btns"
					:type="pageData.couponState == 1 ? 'primary' : 'danger'"
					@click="reivewBtn(pageData.couponState)"
				>
					{{ pageData.couponState | DATA_STATUS_TEXT_BTN }}
				</el-button>
				<span v-if="pageData.couponState !== 4">
					<el-button v-if="pageData.couponState == 5" type="primary" plain class="btns-btn" @click="startCoupon">
						启用
					</el-button>
					<el-button
						v-if="pageData.couponState == 6 || pageData.couponState == 1"
						type="primary"
						plain
						class="btns-btn"
						@click="edit"
					>
						编辑
					</el-button>
					<span v-permission="'coupon_management_detail_stop_btn'">
						<el-button
							v-if="pageData.couponState == 2 || pageData.couponState == 3"
							type="primary"
							plain
							class="btns-btn"
							@click="stopCoupon"
						>
							停用
						</el-button>
					</span>
				</span>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">基础信息</div>
				<div class="content">
					<span class="left">优惠券编号：{{ pageData.couponNumber }}</span>
				</div>
				<div class="content">
					<span class="right">优惠券名称：{{ pageData.couponName }}</span>
				</div>
				<div class="content">
					<span class="left">生效时间：{{ pageData.startTime }}</span>
				</div>
				<div class="content">
					<span class="right">失效时间：{{ pageData.endTime ? pageData.endTime : '不限制' }}</span>
				</div>
				<div class="content">
					<span class="left">优惠券总量：{{ pageData.couponCount === '-1' ? '不限量' : pageData.couponCount }}</span>
				</div>
				<div class="content">
					<span class="right">生成优惠码：{{ !pageData.isGenerateCode ? '否' : '是' }}</span>
				</div>
				<div class="content">
					<span class="right">可获得数量：{{ pageData.limitCount ? pageData.limitCount + '张' : '不限制' }}</span>
				</div>
				<div class="content remarks">优惠券说明：{{ pageData.remarks }}</div>
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="config">
				<div class="head-text">使用规则</div>
				<div class="content">
					<span class="left">优惠券面值：{{ pageData.faceValue === -1 ? '不限量' : pageData.faceValue + '元' }}</span>
				</div>
				<div class="content">
					<span class="right">优惠券类型：{{ pageData.couponType | couponType }}</span>
				</div>
				<div class="content">
					<span class="left">使用条件：{{ pageData.minAmount ? `满${pageData.minAmount}元可用` : '不限制' }}</span>
				</div>
				<div class="content">
					<span class="right">叠加规则：{{ pageData.isStacked | isStacked }}</span>
				</div>
				<div class="content">
					<span class="right">使用限制：{{ LIMIT_STORE_TYPE[pageData.limitStore] }}</span>
				</div>
				<!-- <div class="content">
					<span class="right">平台限制：{{ pageData.platforms | platforms }}</span>
				</div> -->
			</div>
		</el-card>
		<el-card class="card-gap">
			<div class="head-text">操作记录</div>
			<tableList border :dataSource="pageData.operateLogs" slotcontent :columns="OPERATING_COLUMNS">
				<template slot-scope="scope">
					<div>
						<div v-for="(item, index) in scope.data.enclosures" :key="index">
							<span>{{ item.fileName }}</span>
							<el-button type="text" class="btns" @click="downloadWithBlob(item.url)">下载</el-button>
						</div>
					</div>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="提示" v-drag :visible.sync="dialogVisible" width="50%">
			<div>
				<el-form :model="pushData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="审核结果：" prop="examine">
						<el-radio-group v-model="pushData.examine">
							<el-radio :label="3">审核通过</el-radio>
							<el-radio :label="4">审核不通过</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="审核意见：" prop="remarks">
						<el-input
							type="textarea"
							:autosize="{ minRows: 5 }"
							maxlength="1000"
							show-word-limit
							v-model="pushData.remarks"
							placeholder="请输入审核意见"
						></el-input>
					</el-form-item>
					<el-form-item label="附件：" prop="desc">
						<span>支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件</span>
					</el-form-item>
					<el-form-item label prop="desc">
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="3"
							multiple
							list-type="picture-card"
							:on-success="handleSuccessPC"
							:before-remove="beforeRemovePC"
							accept="doc, docx, pdf, wps, bmp, jpg, png"
							:on-error="onError"
							:before-upload="beforeUpload"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveReview">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	DATA_STATUS_CUSTOMER,
	DATA_STATUS_TEXT_BTN,
	DATA_STATUS_COUPONETYPE,
	OPERATING_COLUMNS,
	DATA_STATUS_ISSTACKED,
	LIMIT_STORE_TYPE,
} from '../config';
import { uploadFileType } from 'util/formValidation';
export default {
	name: 'couponBasis',
	props: {
		pageData: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			LIMIT_STORE_TYPE,
			dialogVisible: false,
			rules: {
				remarks: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
				examine: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
			},
			pushData: {
				couponId: null,
				examine: 3,
				remarks: null,
				enclosureVos: [],
			},
			OPERATING_COLUMNS,
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
	filters: {
		status: val => DATA_STATUS_CUSTOMER[val],
		DATA_STATUS_TEXT_BTN: val => DATA_STATUS_TEXT_BTN[val],
		couponType: val => DATA_STATUS_COUPONETYPE[val],
		isStacked: val => DATA_STATUS_ISSTACKED[val],
		platforms: val => {
			let textArr = [];
			val.forEach(e => {
				if (e == 1) textArr.push('APP');
				if (e == 2) textArr.push('PC');
				if (e == 4) textArr.push('小程序');
			});
			return textArr.join('、');
		},
	},
	methods: {
		beforeUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		handleSuccessPC(res, file) {
			this.pushData.enclosureVos.push({ fileName: file.name, urls: file.response.datas.fileUrlKey });
		},
		beforeRemovePC(res) {
			this.pushData.enclosureVos.forEach((e, index) => {
				if (e.fileName === res.name) this.pushData.enclosureVos.splice(index, 1);
			});
		},
		onError() {
			this.$message.error('导入失败');
		},
		async saveReview() {
			this.pushData.couponId = this.pageData.id;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/coupon/examine`,
				data: this.pushData,
			});
			if (res && res.code == 200) {
				this.$dispatch('COUPONMANAGEMENT_LIST');
				this.$closeSelf();
				this.$message.success('审核成功');
			} else {
				this.$message.error('审核失败');
			}
		},
		downloadWithBlob(url) {
			if (!url) return this.$message.error('文件地址不存在, 无法下载');
			window.open(url);
		},
		reivewBtn(type) {
			if (type === 1) {
				this.dialogVisible = true;
			} else {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(async () => {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/prmt/coupon/deleteCouponBatch',
						data: [this.pageData.id],
					});
					if (res.code === 200) {
						this.$message.success('操作成功');
						this.$dispatch('COUPONMANAGEMENT_LIST');
						this.$closeSelf();
					}
				});
			}
		},
		startCoupon() {
			let { id } = this.pageData;
			this.$confirm('确定停用?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.stopCustomer(id * 1, this.pageData.couponState === 3 ? 5 : 1);
			});
		},
		edit() {
			let { id } = this.pageData;
			this.$go('add_edit_coupon', { id, num: Date.now() });
		},
		stopCoupon() {
			let { id } = this.pageData;
			this.$confirm('确定停用?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.stopCustomer(id * 1, this.pageData.couponState === 3 ? 5 : 1);
			});
		},
		async stopCustomer(id, couponState) {
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/prmt/coupon/enableOrDisable`,
				data: { id, couponState },
			});
			if (res && res.code == 200) {
				this.$message.success('停用优惠券成功');
				this.$parent.$parent.$parent.$parent.loadData();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.had-title {
	position: relative;
	line-height: 32px;
	height: 32px;
	.btns-btn {
		position: absolute;
		right: 0;
	}
	.btns-btns {
		position: absolute;
		right: 72px;
	}
}
.btns {
	margin-left: 10px;
}
.config {
	overflow: hidden;
	.content {
		padding: 10px 0;
		width: 30%;
		float: left;
		font-size: $font-size;
	}
	.remarks {
		line-height: 30px;
	}
}

.head-text {
	font-size: 18px;
	font-weight: 600;
	padding-bottom: 20px;
	.statistics {
		font-size: $font-size;
		color: $color-disabled;
		font-weight: 400;
	}
}
</style>

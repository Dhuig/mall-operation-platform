<template>
	<div class="platform-activeCenter_couponHandDetail-wrap">
		<el-card>
			<div class="box-card">
				<p class="title">{{ DETAIL_STATUS[pageData.state] }}</p>
				<el-button type="primary" class="btn" v-if="pageData.state === 1" @click="dialogVisible = true">审核</el-button>
				<el-button type="primary" class="btn" plain v-if="pageData.state === 4" @click="goEdit">编辑</el-button>
			</div>
		</el-card>

		<el-card>
			<h1 class="table_title">优惠券信息</h1>
			<div class="coupone-content">
				<div class="coupone-text">优惠券编号：{{ pageData.couponNumber }}</div>
				<div class="coupone-text">优惠券名称：{{ pageData.couponName }}</div>
				<div class="coupone-text">优惠券总量：{{ pageData.couponCount == '-1' ? '不限量' : pageData.couponCount }}</div>
				<div class="coupone-text">生效时间：{{ pageData.startTime }}</div>
				<div class="coupone-text">失效时间：{{ pageData.endTime || '不限制' }}</div>
				<div class="coupone-text">生成优惠码：{{ pageData.isGenerateCode == 0 ? '否' : '是' }}</div>
				<div class="coupone-text">可获得数量：{{ pageData.limitCount || '不限制' }}</div>
				<div class="coupone-text">优惠券面值：{{ pageData.faceValue }}元</div>
			</div>
			<div class="coupone-footer-text">优惠券说明：{{ pageData.remarks }}</div>
		</el-card>

		<el-card>
			<h1 class="table_title">使用规则</h1>
			<div class="coupone-content">
				<div class="coupone-text">优惠券类型：{{ COUPON_TYPE[pageData.couponType] }}</div>
				<div class="coupone-text">使用条件：{{ pageData.minAmount ? `满￥${pageData.minAmount} 可用` : '无限额' }}</div>
				<div class="coupone-text">叠加规则：{{ pageData.isStacked == 0 ? '不可叠加' : '可叠加' }}</div>
				<div class="coupone-text">使用限制：{{ LIMIT_STORE_TYPE[pageData.limitStore] }}</div>
			</div>
		</el-card>

		<el-card>
			<h1 class="table_title">优惠券派发规则</h1>
			<div class="coupone-content">
				<div class="coupone-text">派发数量：按需派发</div>
				<div class="coupone-text">派发方式：{{ GRANT_TYPE_ARR[pageData.grantType] }}</div>
				<div class="coupone-text" v-if="pageData.grantType == 2">派发时间：{{ formatDate(pageData.fixedTime) }}</div>
			</div>
		</el-card>

		<el-card>
			<h1 class="table_title">转赠限制</h1>
			<div class="coupone-content">
				<div class="coupone-text">顾客限制：{{ pageData.grantTarget == 1 ? '全部顾客' : '按照顾客身份' }}</div>
				<div class="coupone-text" v-if="pageData.grantTarget != 1">客户身份：{{ pageData.memberIdentity }}</div>
				<div class="coupone-text" v-if="pageData.limitCardTime == 1">
					<el-popover placement="top-start" width="300" trigger="hover" :content="cardTime">
						<span slot="reference">限制办卡时间：{{ cardTime }}</span>
					</el-popover>
				</div>
				<div class="coupone-text" v-if="pageData.limitCardTime == 2">
					<el-popover placement="top-start" width="300" trigger="hover" :content="cardTime">
						<span slot="reference">限制注册时间：{{ cardTime }}</span>
					</el-popover>
				</div>
			</div>
		</el-card>
		<el-card>
			<h2 class="rule_title">操作记录</h2>
			<tableList :dataSource="pageData.operateLogs" :columns="DONATE_BASIS_COLUMNS">
				<template v-slot:enclosures="{ row }">
					<div>
						<div v-for="(item, index) in row.enclosures" :key="index">
							<span style="marign-right: 10px">{{ item.fileName }}</span>
							<el-button type="text" class="download" @click="downloadBtn(item.url)">下载</el-button>
						</div>
					</div>
				</template>
			</tableList>
		</el-card>

		<el-dialog title="优惠券派发审核" :visible.sync="dialogVisible" width="50%">
			<div class="dialog_con">
				<div class="attr">
					<p>优惠券编号：{{ pageData.couponNumber }}</p>
					<p>优惠券名称：{{ pageData.couponName }}</p>
				</div>
				<h1 class="dialog_title">优惠券派发审核</h1>
				<el-form ref="examineForm" :model="examineForm" label-width="100px" :rules="theRules">
					<el-form-item label="审核结果：" prop="examine">
						<el-radio v-model="examineForm.examine" :label="3">审核通过</el-radio>
						<el-radio v-model="examineForm.examine" :label="4">审核不通过</el-radio>
					</el-form-item>
					<el-form-item label="审核意见：" prop="remark">
						<el-input
							type="textarea"
							v-model="examineForm.remark"
							placeholder="请输入审核意见"
							:autosize="{ minRows: 5 }"
							style="width: 80%"
							maxlength="1000"
							show-word-limit
						></el-input>
					</el-form-item>
					<el-form-item>附件： 支持格式doc、docx、pdf、wps、bmp、jpg、png，最大10M，3个文件</el-form-item>
					<el-form-item>
						<el-upload
							:class="[examineForm.enclosureVos.length == 3 ? 'is-upload' : '']"
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							:limit="3"
							multiple
							list-type="picture-card"
							:on-success="handlePictureCardSuccess"
							:on-error="onError"
							:on-exceed="onExceed"
							:before-upload="beforeUpload"
							:file-list="imglist"
							accept=".doc, .docx, .pdf, .wps, .bmp, .jpg, .png"
						>
							<i class="el-icon-plus"></i>
							<div slot="file" slot-scope="{ file }" class="uploadSlotDiv">
								<pdf
									v-if="file && file.response && file.response.datas && file.response.datas.fileUrlKey.includes('.pdf')"
									:src="file.url"
								></pdf>
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span class="el-upload-list__item-delete" @click="handleRemove(file)">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="save">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog v-drag :modal="false" :visible.sync="dialog.visible" @closed="closeDialog">
			<pdf v-if="dialog.isPdf" :src="dialog.url"></pdf>
			<img width="100%" :src="dialog.url" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import {
	COUPON_TYPE,
	DETAIL_STATUS,
	COUPON_GRAN_TYPE,
	DONATE_BASIS_COLUMNS,
	GRANT_TYPE_ARR,
	LIMIT_STORE_TYPE,
} from '../config.js';
import { formatDate, uploadFileType } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'donateCouponBasis',
	components: {},
	data() {
		return {
			DETAIL_STATUS,
			LIMIT_STORE_TYPE,
			GRANT_TYPE_ARR,
			DONATE_BASIS_COLUMNS,
			formatDate,
			COUPON_GRAN_TYPE,
			ruleForm: {
				invalidReason: '',
			},
			imglist: [],
			dialog: {
				visible: false,
				url: '',
				isPdf: '',
			},
			stopVisible: false,
			COUPON_TYPE,
			dialogVisible: false,
			examineForm: {
				enclosureVos: [],
				examine: 3,
				grantId: null,
				remark: '',
			},
			showImg: false,
			dialogImageUrl: '',
			theRules: {
				remark: [{ required: true, message: '请输入审核意见！', change: 'blur' }],
				examine: [{ required: true, message: '请选择审核结果', change: 'blur' }],
			},
			pageData: {},
			list: [],
			queryId: null,
		};
	},
	created() {
		this.queryId = this.$route.query.id;
		this.$listen('donate_Coupon_Basis', this.loadData);
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
		cardTime() {
			let { openStartTime, openEndTime } = this.pageData;
			let text = '';
			if (openEndTime) text = openStartTime + '至' + openStartTime;
			return text;
		},
	},
	methods: {
		beforeUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		async importBtn() {
			exportExcel('/mgmt/prmt/couponGrant/getGrantMembers', { grantId: this.$route.query.id });
		},
		stopClose() {
			this.stopVisible = false;
			this.ruleForm.invalidReason = '';
		},
		stop() {
			this.stopVisible = true;
		},
		async addMsg() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponGrant/stopGrant',
				data: { id: this.$route.query.id, remarks: this.ruleForm.invalidReason },
			});
			if (res && res.code === 200) {
				this.$message.success(res.message);
				this.$dispatch('DONATE_CONPON_LIST');
				this.stopVisible = false;
			}
		},
		goEdit() {
			this.$go('add_donate_coupon', { edit: this.queryId });
		},
		async save() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponTransfer/examineGrant',
				data: this.examineForm,
			});
			if (res && res.code === 200) {
				this.dialogVisible = false;
				this.$message.success(res.message);
				this.$dispatch('DONATE_CONPON_LIST');
				this.$closeSelf();
			}
		},
		downloadBtn(url) {
			if (!url) return this.$message.warning('下载失败，请联系管理员');
			window.open(url);
		},
		async loadData() {
			this.examineForm.grantId = this.queryId;
			const res = await this.$fetch('/mgmt/prmt/couponGrant/grantBaseInfo?grantId=' + this.queryId);
			if (res && res.code === 200) {
				this.pageData = res.data;
			}
		},
		handlePictureCardPreview(file) {
			const { fileUrlKey: url } = file.response.datas;
			this.dialog = {
				url,
				visible: true,
				isPdf: url.includes('.pdf'),
			};
		},
		closeDialog() {
			this.dialog = {
				url: null,
				visible: false,
				isPdf: false,
			};
		},
		handleRemove(file) {
			this.examineForm.enclosureVos.forEach((e, i) => {
				if (file.name === e.fileName) this.examineForm.enclosureVos.splice(i, 1);
			});
			this.imglist.forEach((e, index) => {
				if (e.name === file.name) this.imglist.splice(index, 1);
			});
		},
		handlePictureCardSuccess(res, file, filelist) {
			this.imglist = filelist;
			if (res.success) this.examineForm.enclosureVos.push({ fileName: file.name, urls: res.datas.fileUrlKey });
		},
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
	overflow: auto;
}
.download {
	margin-left: 10px;
	cursor: pointer;
	float: right;
}
.dialog_con {
	.attr {
		p {
			margin-right: 10px;
			display: inline-block;
		}
	}
	.dialog_title {
		font-size: 24px;
		color: blue;
		font-weight: bold;
		margin: 30px 0px;
	}
}
.box-card {
	display: flex;
	align-items: center;
	flex-direction: row;
	.title {
		font-size: 30px;
		color: blue;
		margin-right: 30px;
		font-weight: bold;
	}
	.btn {
		width: 120px;
	}
}
.rule_title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 20px;
}

.table_title {
	font-weight: bold;
	margin-bottom: 20px;
}

.coupone-content {
	overflow: hidden;
	.coupone-text {
		float: left;
		width: 33.33%;
		line-height: 30px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.coupone-footer-text {
	line-height: 30px;
	font-size: 14px;
}

.batch-void {
	padding-left: 10px;
	padding-bottom: 20px;
	.is-text-top {
		line-height: 40px;
		height: 40px;
		.el-icon-question {
			color: $warning;
			font-size: 40px;
			float: left;
		}
		.text {
			font-size: 18px;
			color: $color-body-se;
			display: inline-block;
			margin-bottom: 10px;
		}
	}
	.is-text {
		font-size: 14px;
		color: $color-disabled;
		text-indent: 40px;
	}
}
.is-upload ::v-deep .el-upload--picture-card {
	display: none; /* 上传按钮隐藏 */
}
</style>

<template>
	<div class="platform-activeCenter_couponHandDetail-wrap">
		<guideBar></guideBar>
		<el-card>
			<div class="box-card">
				<p class="title">{{ pageData.state | status }}</p>
				<el-button type="primary" class="btn" v-if="pageData.state === 1" @click="dialogVisible = true">审核</el-button>
				<el-button type="primary" class="btn" plain v-if="pageData.state === 4" @click="goEdit">编辑</el-button>
				<el-button type="primary" class="btn" plain v-if="pageData.state === 2" @click="stop">停止</el-button>
			</div>
		</el-card>

		<el-dialog title="停止派发提示" v-drag :visible.sync="stopVisible" width="500px" :before-close="stopClose">
			<div>
				<div class="batch-void">
					<p class="is-text-top">
						<span class="el-icon-question"></span>
						<span class="text">停止派发任务</span>
					</p>
					<p class="is-text">停止后优惠券派发任务会终止，但已经派发的优惠券不会作废</p>
				</div>
				<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="停止原因：">
						<el-col :span="12">
							<el-input
								style="width: 340px"
								v-model="ruleForm.invalidReason"
								placeholder="请输入停止原因"
								maxlength="40"
								show-word-limit
							/>
						</el-col>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="stopClose">取消</el-button>
				<el-button type="primary" @click="addMsg">确定</el-button>
			</span>
		</el-dialog>

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
			</div>
		</el-card>

		<el-card>
			<h1 class="table_title">优惠券派发规则</h1>
			<div class="coupone-content">
				<div class="coupone-text">
					派发数量：{{ pageData.everyCount > 0 ? `每位顾客获得${pageData.everyCount}张` : '按需派发' }}
				</div>
				<div class="coupone-text" v-if="pageData.grantTarget === 2">
					派发对象：{{ pageData.grantTarget | grantTargetArr }}-{{ pageData.memberIdentity }}
				</div>
				<div class="coupone-text" v-else>派发对象：{{ pageData.grantTarget | grantTargetArr }}</div>
				<div class="coupone-text" v-if="pageData.limitCardTime === 1 && pageData.grantTarget != 4">
					开卡时间：{{ pageData.openStartTime + '~' + pageData.openEndTime }}
				</div>
				<div class="coupone-text">派发方式：{{ COUPON_GRAN_TYPE[pageData.grantType] }}</div>
				<div class="coupone-text" v-if="pageData.grantStartTime">
					派发时间：{{ formatDate(pageData.grantStartTime) }}
					<span v-if="pageData.grantStartTime">至</span>
					{{ formatDate(pageData.grantEndTime) }}
				</div>
				<div class="coupone-text" v-if="pageData.grantType == 2">
					定时规则：定时派发 派发时间：{{ formatDate(pageData.fixedTime) }}
				</div>
				<div v-if="pageData.grantTarget != 4">
					<div class="coupone-text" v-if="pageData.grantType == 1">定时规则：即时派发 优惠券审核通过后将会即时派发</div>
					<div class="coupone-text" v-if="pageData.grantType == 3">定时规则：每日循环派发：每日10分钟派发</div>
					<div class="coupone-text" v-if="pageData.grantType == 4">
						定时规则：每月循环派发：每月{{ resetDay }}日{{ resetTime }}派发
					</div>
				</div>
			</div>
		</el-card>

		<el-card v-if="pageData.grantTarget === 4">
			<h2 class="rule_title">顾客列表</h2>
			<div style="width: 800px">
				<tableList
					border
					:dataSource="customer.data"
					:columns="history_column"
					:pagination="customer.pagination"
					:dataTotal="customer.total"
					:loading="customer.loading"
					@handleChangePage="handleChangePage"
					@handleSizeChange="handleSizeChange"
				>
					<template slot="content_context" slot-scope="scope">
						<el-button type="primary" class="download" @click="importBtn(scope.grantId)">导出</el-button>
					</template>
				</tableList>
			</div>
		</el-card>
		<el-card>
			<h2 class="rule_title">操作记录</h2>
			<el-table :data="pageData.operateLogs" :border="false" style="width: 100%">
				<el-table-column prop="createTime" label="操作时间" align="center" width="180"></el-table-column>
				<el-table-column prop="operate" label="操作" align="center" width="180">
					<template slot-scope="{ row }">
						<div>
							{{ row.operate | operate }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="operator" label="操作人帐号" align="center"></el-table-column>
				<el-table-column prop="operateName" label="操作人姓名" align="center"></el-table-column>
				<el-table-column prop="companyName" label="所属部门" align="center">
					<template slot-scope="{ row }">
						{{ row.companyName || '-' }}
					</template>
				</el-table-column>
				<el-table-column prop="remarks" label="备注说明" align="center">
					<template slot-scope="{ row }">
						{{ row.remarks || '-' }}
					</template>
				</el-table-column>
				<el-table-column prop="enclosures" label="附件" width="300">
					<template slot-scope="{ row }">
						<div>
							<div v-for="(item, index) in row.enclosures" :key="index">
								<span style="marign-right: 10px">{{ item.fileName }}</span>
								<el-button type="text" class="download" @click="downloadBtn(item.url)">下载</el-button>
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog title="优惠券派发审核" :visible.sync="dialogVisible" width="50%">
			<div class="dialog_con">
				<div class="attr">
					<p>优惠券编号：{{ pageData.couponNumber }}</p>
					<p>优惠券名称：{{ pageData.couponName }}</p>
				</div>
				<h1 class="dialog_title">优惠券派发审核</h1>
				<template>
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
								:autosize="{ minRows: 2, maxRows: 4 }"
								style="width: 80%"
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
										v-if="
											file && file.response && file.response.datas && file.response.datas.fileUrlKey.includes('.pdf')
										"
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
				</template>
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
	HISTORY_COLUMN,
	COUPON_TYPE,
	DETAIL_STATUS,
	grantTypeArr,
	grantTargetArr,
	HISTORY_COLUMN_LIST,
	COUPON_GRAN_TYPE,
} from './config.js';
import { formatDate, uploadFileType } from 'util/formValidation';
import { exportExcel } from 'util';
export default {
	name: 'couponHandOfDetail',
	components: {},
	data() {
		return {
			imglist: [],
			dialog: {
				visible: false,
				url: '',
				isPdf: '',
			},
			formatDate,
			COUPON_GRAN_TYPE,
			ruleForm: {
				invalidReason: '',
			},
			stopVisible: false,
			COUPON_TYPE,
			customer: {
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				loading: false,
				total: 0,
			},
			history_column: HISTORY_COLUMN_LIST,
			dialogVisible: false,
			examineForm: {
				enclosureVos: [],
				examine: 3,
				grantId: null,
				remark: '',
			},
			theRules: {
				option: [{ required: true, message: '请输入审核意见！', change: 'blur' }],
				result: [{ required: true, message: '请选择审核结果', change: 'blur' }],
			},
			pageData: {},
			list: [],
			queryId: null,
		};
	},
	created() {
		this.queryId = this.$route.query.id;
		this.loadData();
		this.productData();
		this.$listen('COUPON_HAND_OF_DETAIL_loadData', this.loadData);
		this.$listen('COUPON_HAND_OF_DETAIL_productData', this.productData);
	},
	filters: {
		status: val => DETAIL_STATUS[val],
		grantTypeArr: val => grantTypeArr[val],
		grantTargetArr: val => grantTargetArr[val],
		operate: val => HISTORY_COLUMN[val],
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.promotion,
			};
			return params;
		},
		resetDay() {
			return parseInt(formatDate(this.pageData.fixedTime).substring(8, 10));
		},
		resetTime() {
			return formatDate(this.pageData.fixedTime).split(' ')[1];
		},
	},
	methods: {
		beforeUpload(file) {
			const whiteList = ['doc', 'docx', 'pdf', 'wps', 'bmp', 'jpg', 'png'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		importBtn() {
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
				this.$dispatch('CONPONHANDLIST');
				this.stopVisible = false;
			}
		},
		goEdit() {
			this.$go('create_handWork', { edit: this.queryId });
		},
		async save() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/prmt/couponGrant/examineGrant',
				data: this.examineForm,
			});
			if (res && res.code === 200) {
				this.dialogVisible = false;
				this.$message.success(res.message);
				this.$dispatch('CONPONHANDLIST');
				this.$closeSelf();
			}
		},
		downloadBtn(url) {
			if (!url) return this.$message.warning('下载失败，请联系管理员');
			window.open(url);
		},
		async productData() {
			let {
				pagination: { currentPage: pageNum, pageSize },
			} = this.customer;
			const res = await this.$fetch({
				method: 'GET',
				url: `/mgmt/prmt/couponGrant/getImportMembers`,
				params: { grantId: this.queryId, pageNum, pageSize },
			});
			if (res && res.code == 200) {
				this.customer.data = res.data.list;
				this.customer.total = res.data.total;
			}
			this.customer.loading = false;
		},
		handleChangePage(val) {
			this.customer.pagination.currentPage = val;
			this.productData();
		},
		handleSizeChange(val) {
			this.customer.pagination.pageSize = val;
			this.productData();
		},
		async loadData() {
			this.examineForm.grantId = this.queryId;
			const res = await this.$fetch('/mgmt/prmt/couponGrant/grantBaseInfo?grantId=' + this.queryId);
			if (res && res.code === 200) {
				let { openStartTime, openEndTime } = res.data;
				this.pageData = {
					...res.data,
					openStartTime: openStartTime && openStartTime.substring(0, 7),
					openEndTime: openEndTime && openEndTime.substring(0, 7),
				};
				this.history_column[3]['isShow'] = () => res.data.type == 2;
			}
		},
		onError() {
			this.$message.error('上传失败');
		},
		onExceed() {
			this.$message.warning('只能上传3个文件');
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
.platform-activeCenter_couponHandDetail-wrap {
	.uplod_img {
		margin-left: 30px;
		p {
			line-height: 30px;
			margin-bottom: 20px;
		}
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
	.con {
		overflow: hidden;
		p {
			height: 50px;
			line-height: 50px;
			width: 50%;
			float: left;
			color: #666;
			font-size: 14px;
		}
	}
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

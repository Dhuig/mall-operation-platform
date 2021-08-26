<template>
	<div class="returnAuditCommonDialog">
		<el-dialog
			:title="orderInfo.auditTitle"
			:visible.sync="orderInfo.auditShow"
			width="60%"
			:before-close="closeDialog"
			v-drag
		>
			<!-- 退票审核 -->
			<div class="dialogBox">
				<el-form
					ref="dialogForm"
					:model="dialogForm"
					:rules="REFUN_AUDIT_DIALOG_RULES"
					label-width="120px"
					label-suffix=":"
				>
					<div class="flex">
						<el-form-item label="退货单号">
							{{ orderInfo.returnNo }}
						</el-form-item>
						<el-form-item label="订单号">
							{{ orderInfo.orderNo }}
						</el-form-item>
					</div>
					<el-form-item label="审核结果" prop="auditStatus">
						<el-radio-group v-model="dialogForm.auditStatus">
							<el-radio v-for="{ value, name } in AUDITSTATUS_RESULT" :key="value" :label="value" border>
								{{ name }}
							</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="审核意见" prop="remarks">
						<el-input
							placeholder="请输入审核意见"
							:autosize="{ minRows: 4, maxRows: 4 }"
							maxlength="1000"
							show-word-limit
							type="textarea"
							v-model="dialogForm.remarks"
						></el-input>
					</el-form-item>
					<el-form-item label="附件">
						<p>附件： 支持格式jpg、png，最大10M，最多可以上传5张图片</p>
						<el-upload
							ref="elUpload"
							:action="uploadData.actionUrl"
							:headers="$store.getters['system/getSignatureVerification']"
							:data="uploadData"
							list-type="picture-card"
							:limit="5"
							:before-upload="beforeAvatarUpload"
							:on-success="handleSuccess"
							:on-preview="onPreview"
							:on-remove="handleRemove"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="flex footer">
					<el-button class="cancelBtn" @click="closeDialog">取 消</el-button>
					<el-button type="primary" @click="enterDialog('dialogForm')">保 存</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- 退货审核详情 -->
		<el-dialog :title="showInfo.title" :visible.sync="showInfo.visible" v-drag>
			<el-form label-width="120px" label-suffix=":">
				<el-form-item label="退货单号">
					{{ orderInfo.returnNo }}
				</el-form-item>
				<el-form-item label="订单号">
					{{ orderInfo.orderNo }}
				</el-form-item>
				<el-form-item label="审核结果">
					{{ dialogForm.auditStatus == 1 ? '审核通过' : '审核不通过' }}
				</el-form-item>
				<el-form-item label="审核意见">
					{{ dialogForm.remarks }}
				</el-form-item>
				<el-form-item label="附件">
					<div v-if="dialogForm.attachmentUrlList.length > 0" class="flex">
						<img
							class="img"
							:src="item"
							alt=""
							v-for="(item, index) in dialogForm.attachmentUrlList"
							@click="onPreview({ url: item })"
							:key="index"
						/>
					</div>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="auditInvoice">确 认</el-button>
					<el-button @click="showInfo.visible = false">取 消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 查看图片 -->
		<el-dialog :visible.sync="picture.visible" v-drag>
			<div class="dialogPicture">
				<img width="100%" :src="picture.url" alt="" />
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { REFUN_AUDIT_DIALOG_RULES, AUDITSTATUS_RESULT } from './config';
// import axios from 'axios';
export default {
	name: 'refundAudit',
	props: {
		// 传入信息
		orderInfo: Object,
	},

	data() {
		return {
			REFUN_AUDIT_DIALOG_RULES, // rules
			AUDITSTATUS_RESULT,
			dialogForm: {
				// 表单
				auditStatus: '',
				remarks: '',
				attachmentUrlList: [],
			},
			picture: {
				visible: false,
				url: '',
			},
			showInfo: {
				title: '退票审核确认',
				visible: false,
			},
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE, // 存储类型（目前支持的类型:FastDFS）
				clientKey: this.$config.CLIENT_KEY.order, // 客户端Key(由管理员进行分配)
				actionUrl: this.$store.getters['system/getOssUploadUrl'],
			},
		};
	},
	computed: {},
	methods: {
		// dialog 取消
		closeDialog(type = '') {
			this.dialogForm = {
				auditStatus: '',
				remarks: '',
				attachmentUrlList: [],
			};
			this.$refs.elUpload.clearFiles(); // * 清空上传图片
			this.$refs['dialogForm'].resetFields();
			this.$emit('onClosedDialog', type);
		},
		// dialog 确认
		enterDialog(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// 确认后切换显示
					this.showInfo.visible = true;
					// this.auditInvoice();
				}
			});
		},
		// 查看图片
		onPreview(file) {
			this.picture = {
				url: file.url,
				visible: true,
			};
		},
		// 上传前校验
		beforeAvatarUpload(file) {
			const isIMG = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isIMG) {
				this.$message.error('只支持jpg和png');
			}
			if (!isLt10M) {
				this.$message.error('文件大小超过限制');
			}
			return isIMG && isLt10M;
		},
		// 文件列表成功之后的钩子
		handleSuccess(res, file, fileList) {
			if (res.success) {
				const { fileUrlKey } = res.datas;
				const { name, uid, status } = file;
				const obj = {
					name,
					status,
					uid,
					url: fileUrlKey,
				};
				let list = fileList.map(x => (x.uid == obj.uid ? obj : x));
				this.dialogForm.attachmentUrlList = list.map(x => x.url);
			}
		},
		// 文件列表移除文件时的钩子
		handleRemove(file, fileList) {
			this.dialogForm.attachmentUrlList = fileList.map(x => x.url);
		},
		//退票审核
		async auditInvoice() {
			let obj = {
				method: 'POST',
				url: `/mgmt/order/return/auditInvoice`,
				data: {
					serviceNo: this.orderInfo.returnNo, //售后单号
					...this.dialogForm,
				},
			};
			let res = await this.$fetch(obj);
			if (res.code == 200) {
				this.showInfo.visible = false;
				this.closeDialog('success');
				this.$message.success(res.message);
			}
			if (this.$store.getters['system/getError']) {
				// * 错误提示
				this.$message.error(res.message);
			}
		},
	},
	mounted() {
		console.log(this.orderInfo);
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	overflow-y: auto;
}
.returnAuditCommonDialog {
	.dialogBox {
		max-height: 520px;
	}
	.dialogPicture {
		max-height: 480px;
	}
	.flex {
		display: flex;
		.el-form-item {
			width: 50%;
		}
	}
	.footer {
		justify-content: flex-end;
		padding-bottom: 20px;
		.cancelBtn {
			margin-right: 5px;
		}
	}
	.img {
		display: block;
		width: 100px;
		height: 100px;
		padding-right: 10px;
		cursor: pointer;
	}
}
</style>

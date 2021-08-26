<template>
	<div class="main">
		<div class="bank-card">
			<div class="text-div">
				<p class="text-p" v-if="pageData.accountName">
					<span>账户名称：</span>
					<el-popover
						slot="reference"
						placement="top-start"
						width="200"
						trigger="hover"
						:content="pageData.accountName"
					>
						<span slot="reference">{{ pageData.accountName }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.accountType">
					<span>账户类型：</span>
					<el-popover
						placement="top-start"
						width="200"
						trigger="hover"
						:content="pageData.accountType | ZHANGHUXINGZHI_STATUS"
					>
						<span slot="reference">{{ pageData.accountType | ZHANGHUXINGZHI_STATUS }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.account">
					<span>账号：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.account">
						<span slot="reference">{{ pageData.account }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.accountBank">
					<span>开户银行：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.accountBank">
						<span slot="reference">{{ pageData.accountBank }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.branch">
					<span>开户支行：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.branch">
						<span slot="reference">{{ pageData.branch }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.cityName">
					<span>银行省/市：</span>
					<el-popover
						placement="top-start"
						width="200"
						trigger="hover"
						:content="(pageData.provinceName === pageData.cityName ? '' : pageData.provinceName) + pageData.cityName"
					>
						<span slot="reference">
							{{ pageData.provinceName === pageData.cityName ? '' : pageData.provinceName }}{{ pageData.cityName }}
						</span>
					</el-popover>
				</p>
			</div>
			<div class="text-div" v-if="profileChangeTypeStr == '7'">
				<p class="text-p" v-if="pageData.oldAccountName">
					<span>原账户名称：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.oldAccountName">
						<span slot="reference">
							{{ pageData.oldAccountName }}
						</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.oldAccountType">
					<span>原账户类型：</span>
					<el-popover
						placement="top-start"
						width="200"
						trigger="hover"
						:content="pageData.oldAccountType | ZHANGHUXINGZHI_STATUS"
					>
						<span slot="reference">
							{{ pageData.oldAccountType | ZHANGHUXINGZHI_STATUS }}
						</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.oldAccount">
					<span>原账号：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.oldAccount">
						<span slot="reference">{{ pageData.oldAccount }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.oldAccountBank">
					<span>原开户银行：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.oldAccountBank">
						<span slot="reference">{{ pageData.oldAccountBank }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.oldBranch">
					<span>原开户支行：</span>
					<el-popover placement="top-start" width="200" trigger="hover" :content="pageData.oldBranch">
						<span slot="reference">{{ pageData.oldBranch }}</span>
					</el-popover>
				</p>
				<p class="text-p" v-if="pageData.oldCityName">
					<span>原银行省/市：</span>
					<el-popover
						placement="top-start"
						width="200"
						trigger="hover"
						:content="
							(pageData.oldProvinceName === pageData.oldCityName ? '' : pageData.oldProvinceName) + pageData.oldCityName
						"
					>
						<span slot="reference">
							{{ pageData.oldProvinceName === pageData.oldCityName ? '' : pageData.oldProvinceName
							}}{{ pageData.oldCityName }}
						</span>
					</el-popover>
				</p>
			</div>
		</div>
		<div class="upload-div">
			<div class="upload-child">
				<el-form :inline="true">
					<el-form-item label="开户许可证：" v-if="zhimgList.length > 0">
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							class="disUoloadSty"
							:on-preview="handlePictureCardPreview"
							list-type="picture-card"
							disabled
							:file-list="zhimgList"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog v-drag :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="" />
						</el-dialog>
					</el-form-item>
				</el-form>
			</div>
			<div class="upload-child">
				<el-form :inline="true">
					<el-form-item label="原开户许可证：" v-if="profileChangeTypeStr == '7'">
						<el-upload
							:action="$store.getters['system/getOssUploadUrl']"
							:headers="$store.getters['system/getSignatureVerification']"
							class="disUoloadSty"
							list-type="picture-card"
							disabled
							:on-preview="handlePictureCardPreview"
							:file-list="oldzhimgList"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog v-drag :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="" />
						</el-dialog>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="text-div-kk">
			<p class="text-p" v-if="pageData.isDeduction">
				<span>是否扣款账户：</span>
				<span>{{ pageData.isDeduction === 1 ? '是' : '否' }}</span>
			</p>
			<p class="text-p" v-if="pageData.oldIsDeduction && profileChangeTypeStr == '7'">
				<span>原是否扣款账户：</span>
				<span>{{ pageData.oldIsDeduction === 1 ? '是' : '否' }}</span>
			</p>
		</div>
	</div>
</template>
<script>
import { DATA_CHANGE_SEARCH, DATA_CHANGE_COLUMNS, ZHANGHUXINGZHI_STATUS, QITASHENGQING_STATUS } from '../config';
// import { genCurrentMonthFirstAndLastDay } from 'util';
// import { formatDateDefault } from 'util/formValidation.js';
export default {
	name: 'bank',
	data() {
		return {
			DATA_CHANGE_SEARCH,
			DATA_CHANGE_COLUMNS,
			zhimgList: [],
			oldzhimgList: [],
			dialogVisible: false,
			dialogImageUrl: '',
			profileChangeTypeStr: '',
		};
	},
	props: {
		pageData: {
			type: Object,
			default: () => {
				return {};
			},
		},
		profileChangeType: {
			type: String,
			default: '',
		},
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
		ZHANGHUXINGZHI_STATUS: val => (val + '' in ZHANGHUXINGZHI_STATUS ? ZHANGHUXINGZHI_STATUS[val] : '--'),
		REFUND_APPROVAL_STATUS: val => (val + '' in QITASHENGQING_STATUS ? QITASHENGQING_STATUS[val] : '--'),
	},
	created() {
		this.profileChangeTypeStr = this.profileChangeType;
	},
	methods: {
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
	},
	watch: {
		pageData: {
			handler(val) {
				this.zhimgList = val.permissionUrl
					? [{ name: '01', url: val.permissionUrl }]
					: [{ name: '0', url: require('assets/img-empty.png') }];
				this.oldzhimgList = val.oldPermissionUrl
					? [{ name: '01', url: val.oldPermissionUrl }]
					: [{ name: '0', url: require('assets/img-empty.png') }];
			},
		},
	},
};
</script>
<style lang="scss" scoped>
.bank-card {
	overflow: hidden;
}

.text-div {
	box-sizing: border-box;
	padding: 0 50px;
	overflow: hidden;
	width: 50%;
	float: left;
	.text-p {
		line-height: 50px;
		height: 50px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		-ms-text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.text-div-kk {
	padding: 0 50px;
	overflow: hidden;
	.text-p {
		width: 50%;
		float: left;
		line-height: 50px;
		box-sizing: border-box;
		font-size: 14px;
	}
}
.upload-div {
	overflow: hidden;
	padding: 0 50px;
	.upload-child {
		overflow: hidden;
		width: 50%;
		float: left;
	}
}
.suiwudengji {
	border-top: 1px solid #d3d9e2;
	border-bottom: 1px solid #d3d9e2;
}
.shipin {
	border-bottom: 1px solid #d3d9e2;
}
.main {
	overflow: hidden;
	.left {
		width: 50%;
		float: left;
	}
	.right {
		width: 50%;
		float: left;
	}
}
</style>

<template>
	<div>
		<guideBar />
		<el-card class="box-card">
			<el-form inline label-width="80px" label-suffix=":" class="customer-info">
				<el-row class="customer_data_title">
					<el-col :span="8">
						<el-form-item label="顾客编号">
							<el-input v-model="modifyDetail.memberNo" size="small" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="顾客卡号">
							<el-input v-model="modifyDetail.cardNo" size="small" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="顾客姓名">
							<el-input v-model="modifyDetail.realName" size="small" disabled />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 本人信息 -->
		<el-card class="box-card" v-if="modifyDataType === 1">
			<div class="title">
				{{ modifyDetail.typeDesc }}
			</div>
			<div>
				<table class="customer_data_table">
					<tr>
						<th>信息字段</th>
						<th>修改前</th>
						<th>修改后</th>
					</tr>
					<tr v-for="(item, key) in modifyDetail.fieldUpdateLogList" :key="key">
						<td v-if="!item.idCardType">{{ item.field }}</td>
						<td v-if="!item.idCardType">{{ item.before }}</td>
						<td v-if="!item.idCardType">{{ item.after }}</td>
					</tr>
					<!-- 身份证 -->
					<tr v-for="(item, key) in modifyDetail.idImg" :key="key">
						<td>{{ item.field }}</td>
						<td>
							<el-upload
								list-type="picture-card"
								:on-preview="handlePictureCardPreview"
								:file-list="item.before"
								:class="[
									item.before.length === 1 ? (item.before[0].url ? 'hide_box' : 'hide_box hide_hook') : 'avatar-gap',
								]"
								disabled
							>
								<i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" v-drag>
								<img width="100%" :src="dialogImageUrl" alt />
							</el-dialog>
						</td>
						<td>
							<el-upload
								list-type="picture-card"
								:on-preview="handlePictureCardPreview"
								:file-list="item.after"
								:class="[
									item.after.length === 1 ? (item.after[0].url ? 'hide_box' : 'hide_box hide_hook') : 'avatar-gap',
								]"
								disabled
							>
								<i class="el-icon-plus"></i>
							</el-upload>
						</td>
					</tr>
				</table>
			</div>
		</el-card>
	</div>
</template>

<script>
// import qs from 'querystring';
// import {formatDateDefault} from "util/formValidation";

export default {
	name: 'customerDataModifyDetail',
	data() {
		return {
			id: '',
			modifyDataType: 1,
			modifyDetail: {
				idImg: [{ field: '', before: [], after: [] }],
			},
			dialogImageUrl: '',
			dialogVisible: false,
			idType: {
				'1': '身份证',
				'2': '其他',
			},
		};
	},
	methods: {
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 查询顾客信息
		async loadUserInfo() {
			if (!this.id) return;
			const res = await this.$fetch(`/member/memberUpdateLog/info?id=${this.id}`);
			if (res && res.data) {
				this.modifyDetail = res.data;
				this.modifyDetail.idImg = [];
				// 数据处理
				this.modifyDetail.fieldUpdateLogList.map(item => {
					item.idCardType = false;
					item.before = item.field.indexOf('证件类型') !== -1 ? item.before && this.idType[item.before] : item.before;
					item.after = item.field.indexOf('证件类型') !== -1 ? item.after && this.idType[item.after] : item.after;
					// 身份证
					if (item.field.indexOf('身份证') !== -1) {
						item.idCardType = true;
						item.before = [{ name: item.field, url: item.before || null }];
						item.after = [{ name: item.field, url: item.after || null }];
						this.modifyDetail.idImg.push(item);
					}
				});
			} else {
				this.$fetch.warning('查询顾客资料详情失败');
			}
		},
	},

	computed: {},
	mounted() {
		const { id } = this.$route.query;
		this.id = id || '';
		this.loadUserInfo();
	},
};
</script>

<style lang="scss" scoped>
h3,
.item-gap {
	margin-bottom: 16px;
}
.img-gap {
	margin-right: 16px;
}
.customer-info span {
	display: inline-block;
	width: 150px;
}
.el-image {
	width: 250px;
}
.customer_data_title .el-form-item {
	margin-bottom: 0;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
.customer_data_table {
	margin-top: 20px;
	width: 100%;
}
th,
td {
	border: 1px solid #000;
	width: 30%;
	text-align: center;
	padding: 8px 0;
	font-size: 14px;
	font-weight: bold;
}
th:nth-child(1),
td:nth-child(1) {
	width: 20%;
	display: table-cell;
	vertical-align: middle;
}
td {
	font-weight: normal;
}
.box-card ::v-deep.el-dialog__body {
	max-height: 500px;
	overflow: auto;
}
::v-deep.hide_hook .el-upload-list__item.is-success .el-upload-list__item-status-label,
::v-deep.hide_hook .el-upload-list--picture-card .el-upload-list__item-actions {
	display: none;
}
</style>

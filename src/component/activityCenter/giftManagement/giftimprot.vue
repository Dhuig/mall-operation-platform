<template>
	<div class="main">
		<guideBar>
			<el-button type="primary" plain @click="$closeSelf()">返回</el-button>
		</guideBar>
		<el-card class="card-gap">
			<el-steps :active="step" align-center>
				<el-step
					:title="item.title"
					:description="item.description"
					v-for="(item, index) in stepContent"
					:key="index"
				></el-step>
			</el-steps>
		</el-card>
		<el-card class="card-gap" v-if="step === 1">
			<div class="xzmb">
				<div class="left"><span class="el-icon-upload"></span></div>
				<div class="right">
					<div class="text-had">填写导入的信息</div>
					<div class="text-content">
						请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，单次导入的数据不超过10000条。
					</div>
					<div class="text-xz">
						<el-button type="text" @click="exportClick">下载模板</el-button>
					</div>
				</div>
			</div>
			<div class="xzmb" style="margin-top: 20px">
				<div class="left"><span class="el-icon-upload"></span></div>
				<div class="right">
					<div class="text-had">上传填表好的信息表</div>
					<div class="text-content">文件后缀名必须为xls或xlsx(即Excel格式)</div>
					<div class="text-xz">
						<el-upload
							class="upload-demo"
							:show-file-list="false"
							:on-error="onError"
							:action="url + '/mgmt/prmt/gift/importGiftList'"
							:headers="$store.getters['system/getSignatureVerification']"
							name="file"
							:on-progress="progress"
							:on-success="handleSuccess"
							:before-upload="beforeVideoUpload"
							accept="xls,xlsx"
						>
							<el-button type="text">上传文件</el-button>
						</el-upload>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="card-gap" v-if="step === 2">
			<div class="zxdr">
				<div class="left"><i class="el-icon-circle-check zc"></i></div>
				<div class="right">
					<div class="text-had">正常数量条数</div>
					<div class="text-xz">
						<span>{{ dataRes.trueCount }}条</span>
					</div>
				</div>
			</div>
			<div class="zxdr" style="margin-top: 20px">
				<div class="left"><i class="el-icon-warning-outline yc"></i></div>
				<div class="right">
					<div class="text-had">异常数量条数</div>
					<div class="text-xz">
						<span>{{ dataRes.falseCount }}条</span>
					</div>
				</div>
			</div>
			<div class="false-data" v-if="dataRes.list.length > 0">
				<div class="had">异常提示：</div>
				<div class="content" v-for="(item, index) in dataRes.list" :key="index">{{ item }}</div>
			</div>
		</el-card>
		<el-card v-if="step === 3">
			<div class="succCon">
				<div class="icon_tip">
					<i class="el-icon-success font_set"></i>
					<p>批量导入完成</p>
					<p>成功导入{{ dataRes.trueCount }}条</p>
				</div>
				<div class="btn_list">
					<el-button type="primary" @click="$closeSelf()">完成</el-button>
				</div>
			</div>
		</el-card>
		<actionBar>
			<template>
				<el-button type="primary" @click="save(1)" v-if="step === 1">下一步</el-button>
				<el-button type="primary" @click="save(2)" v-if="step === 2">下一步</el-button>
				<el-button type="primary" plain @click="save('draft')" v-if="step === 2">重新上传</el-button>
			</template>
		</actionBar>
	</div>
</template>

<script>
import { uploadFileType } from 'util/formValidation';
import axios from 'axios';
import { exportExcel } from 'util';
export default {
	name: 'giftimprot',
	data() {
		return {
			url: axios.defaults.baseURL,
			step: 1,
			stepContent: [
				{ title: '上传文件', description: '' },
				{ title: '执行导入', description: '' },
				{ title: '完成', description: '' },
			],
			nowNum: null,
			dataRes: {
				list: [],
				falseCount: 0,
				trueCount: 0,
			},
		};
	},
	mounted() {},
	watch: {
		step: {
			handler(val) {
				console.log(val);
			},
			immediate: true,
		},
	},
	methods: {
		beforeVideoUpload(file) {
			const whiteList = ['xls', 'xlsx'];
			return uploadFileType.call(this, file, whiteList, 10);
		},
		exportClick() {
			exportExcel('/mgmt/prmt/gift/exportGiftTemplate');
		},
		handleSuccess(res) {
			if (res.code == 200) {
				this.dataRes = res.data;
				this.nowNum = true;
				this.$message.success(res.message);
				// this.$dispatch('COUPONMANAGEMENT_LIST');
			} else {
				this.$message.error(res.message);
			}
		},
		progress() {
			// console.log(event, file, fileList);event, file, fileList
			// let datas = new FormData();
			// datas.append('file', file);
			// let xhr = new XMLHttpRequest();
			// xhr.upload.addEventListener('progress', (e) => {
			// 	if (e.lengthComputable) {
			// 		var percentage = Math.round((e.loaded * 100) / e.total);
			// 		l(`${percentage}%`);
			// 	}
			// });
			// const l = console.log;
			// xhr.open('POST', 'http://42.194.223.11/mgmt/prmt/gift/importGiftList');
			// xhr.setRequestHeader('Authorization', `bearer ${store.access_token}`);
			// xhr.responseType = 'json';
			// xhr.send(datas);
		},
		onError() {
			this.$message.error('导入失败');
		},
		async save(type) {
			if (type === 1 && this.nowNum) {
				this.step = 2;
				return;
			} else if (type === 1 && this.nowNum) {
				this.$message.warning('请上传需要导入的文件');
				return;
			}
			if (type === 'draft') {
				this.step = 1;
				return;
			}
			if (type === 2 && this.nowNum) {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/prmt/gift/saveGiftList',
				});
				if (res && res.code === 200) {
					this.step = 3;
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.xzmb {
	overflow: hidden;
	border: 1px solid $color-border;
	.left {
		box-sizing: border-box;
		float: left;
		width: 200px;
		height: 140px;
		line-height: 140px;
		text-align: center;
		border-right: 1px solid $color-border;
		.el-icon-upload {
			font-size: 60px;
		}
	}
	.right {
		float: left;
		width: calc(100% - 200px);
		box-sizing: border-box;
		padding: 20px;
		.text-had {
			color: $color-hit;
			height: 30px;
			line-height: 30px;
			padding: 0 10px;
			font-weight: 600;
		}
		.text-content {
			line-height: 30px;
			padding: 0 10px;
			font-size: 14px;
			color: $color-disabled;
		}
		.text-xz {
			line-height: 30px;
			padding: 0 10px;
			color: $color-link;
			cursor: pointer;
		}
	}
}
.zxdr {
	overflow: hidden;
	border: 1px solid $color-border;
	.left {
		float: left;
		width: 200px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		.zc {
			font-size: 45px;
			color: $success;
		}
		.yc {
			color: $warning;
			font-size: 45px;
		}
	}
	.right {
		float: left;
		width: calc(100% - 200px);
		box-sizing: border-box;
		padding: 20px;
		.text-had {
			color: $color-hit;
			height: 30px;
			line-height: 30px;
			padding: 0 10px;
			font-weight: 600;
		}
		.text-content {
			line-height: 30px;
			padding: 0 10px;
			font-size: 14px;
			color: $color-disabled;
		}
		.text-xz {
			line-height: 30px;
			padding: 0 10px;
			color: $color-link;
			cursor: pointer;
		}
	}
}
.false-data {
	height: 400px;
	padding: 20px;
	.had {
		color: $warning;
		line-height: 30px;
	}
	.content {
		color: $warning;
		line-height: 30px;
	}
}
.card-gap {
	&:nth-of-type(3) {
		margin-top: 10px;
	}
	&:nth-of-type(4) {
		margin-top: 10px;
	}
	&:nth-of-type(5) {
		margin-top: 10px;
	}
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
::v-deep .el-step__title.is-process {
	color: #8c939b;
	font-weight: 400;
}
::v-deep .el-step__head.is-process {
	color: #8c939b;
	font-weight: 400;
	border-color: #8c939b;
}
::v-deep .el-step__description.is-process {
	color: #8c939b;
}
::v-deep .el-dialog__body {
	// 深度修改样式
	padding: 0px 20px;
}
</style>

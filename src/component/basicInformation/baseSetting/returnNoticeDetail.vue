<template>
	<div class="remit-type">
		<guideBar></guideBar>
		<el-card class="box-card">
			<el-form ref="form" :model="dataSource" label-width="120px">
				<el-form-item :label="`${returnType}须知：`">
					<tinyEditor v-model="dataSource.notice" :id="id" :init="init" />
				</el-form-item>
				<el-form-item>
					<el-button v-if="!isEdit" @click="edit">编 辑</el-button>
					<span v-else>
						<el-button type="primary" @click="onSubmit">保 存</el-button>
						<el-button @click="close">取 消</el-button>
					</span>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
import { TUIHUANHUO_XUZHI } from './config';
import { generateRandomCode } from '@/util';
export default {
	name: 'returnNoticeDetail',
	data() {
		return {
			id: generateRandomCode(),
			isEdit: false,
			dataSource: {
				notice: '',
				id: null,
			},
			init: {
				readonly: true,
				// fontsize_formats: '10px 12px 14px 18px 24px 30px 48px',
				// lineheight_formats: `16px 1.15 1.6 2 2.5 3`,
			},
		};
	},
	created() {
		this.getData();
	},
	computed: {
		returnType() {
			return TUIHUANHUO_XUZHI[this.$route.query.returnType];
		},
	},
	methods: {
		// 编辑
		async onSubmit() {
			this.dataSource.id = this.dataSource.id * 1;
			let { id, notice } = this.dataSource;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/sys/updateReNoticeById',
				data: { id, notice },
			});
			if (res && res.code === 200) {
				this.init.readonly = true;
				this.isEdit = false;
				this.$message.success(res.message);
			}
		},
		edit() {
			this.init.readonly = false;
			this.isEdit = true;
		},
		close() {
			this.init.readonly = true;
			this.isEdit = false;
		},
		// 请求列表数据
		async getData() {
			const res = await this.$fetch('/mgmt/sys/getReNoticeById?id=' + this.$route.query.id);
			if (res && res.code === 200) {
				this.dataSource = res.data;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.remit-type {
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}

	.dialog-footer {
		display: flex;
		justify-content: center;
	}
}
::v-deep.add-rate {
	.el-form-item {
		margin-bottom: 25px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor {
			width: 224px;
		}
	}
	.el-input-group__append {
		padding: 0 6px;
	}
	.flex {
		display: flex;
		justify-content: center;
	}
}
</style>

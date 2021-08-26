<template>
	<div>
		<guideBar />
		<el-card class="part-gap">
			<tinyEditor :disabled="!editType" v-model="protocol" :id="explain" key="serveContent" />
		</el-card>
		<actionBar>
			<el-row type="flex" justify="end">
				<el-button
					type="primary"
					v-permission="'clean_personnel_agreement_edit'"
					v-if="!editType"
					@click="editType = true"
				>
					编辑
				</el-button>
				<template v-if="editType">
					<div v-permission="'clean_personnel_agreement_save'">
						<el-button type="primary" @click="cleanerProtocolSave">保存</el-button>
						<el-button @click="editType = false">返回</el-button>
					</div>
				</template>
			</el-row>
		</actionBar>
	</div>
</template>

<script>
import { generateRandomCode } from '@/util';

export default {
	name: 'cleanPersonnelAgreement',
	data() {
		return {
			explain: generateRandomCode(),
			protocolName: '完美服务到家用户协议',
			protocol: '',
			editType: false,
		};
	},
	methods: {
		// 取消编辑
		cancelEdit() {
			this.$closeSelf();
		},
		// 根据名称获取协议信息
		async loadDetail() {
			const res = await this.$fetch(`/mgmt/acc/cleaner/protocol/get?protocolName=${this.protocolName}`);
			if (res && res.code === 200 && res.data) {
				this.protocol = res.data.protocol;
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 保存清洗人协议
		async cleanerProtocolSave() {
			const data = {
				protocol: this.protocol,
				protocolName: this.protocolName,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/acc/cleaner/protocol/save',
				data,
			});

			if (res && res.code == 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
	},
	mounted() {
		this.loadDetail();
	},
};
</script>

<style lang="scss" scoped>
h3 {
	font-size: 16px;
	color: $color-title;
	margin-bottom: 16px;
}
.part-gap {
	margin-bottom: 16px;
}
.input-item {
	width: 200px;
}
.bank_info {
	width: 330px;
}
.btn_row {
	display: flex;
	justify-content: center;
	.el-button {
		padding: 8px 20px;
		margin-right: 10px;
	}
}
</style>

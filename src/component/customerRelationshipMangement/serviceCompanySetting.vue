<template>
	<div>
		<guideBar />
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="注销原因" name="unreg">
					<el-button type="primary" class="item-gap" icon="el-icon-plus" @click="addUnregReason" size="medium">
						新增注销原因
					</el-button>
					<tableList
						border
						:dataSource="unreg.data"
						:columns="UNREG_REASON_COLUMN"
						:pagination="unreg.pagination"
						:dataTotal="unreg.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" @click="unregEdit(scope.data)">编辑</el-button>
							<el-button type="text" @click="unregDelete(scope.data)">删除</el-button>
						</template>
					</tableList>
				</el-tab-pane>
				<el-tab-pane label="审批原因" name="approval">
					<el-button type="primary" class="item-gap" icon="el-icon-plus" @click="addApprovalReason" size="medium">
						新增审批原因
					</el-button>
					<tableList
						border
						:dataSource="approval.data"
						:columns="UNREG_REASON_COLUMN"
						:pagination="approval.pagination"
						:dataTotal="approval.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button type="text" @click="unregEdit(scope.data)">编辑</el-button>
							<el-button type="text" @click="unregDelete(scope.data)">删除</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 新增注销原因模态框 -->
		<el-dialog title="新增注销原因" :visible.sync="unregModal.show" width="32%" v-drag>
			<div>
				<p class="item-gap">注销原因名称</p>
				<el-input v-model="unregModal.name" class="item-gap" size="small" />
				<el-input type="textarea" v-model="unregModal.reason" />
			</div>
			<span slot="footer">
				<el-button @click="unregModalCancel">取 消</el-button>
				<el-button type="primary" @click="unregModalConfirm">
					确认
				</el-button>
			</span>
		</el-dialog>
		<!-- 新增审批原因模态框 -->
		<el-dialog title="新增注销原因" :visible.sync="approvalModal.show" width="32%" v-drag>
			<div>
				<p class="item-gap">注销原因名称</p>
				<el-input v-model="approvalModal.name" class="item-gap" size="small" />
				<el-input type="textarea" v-model="approvalModal.reason" />
			</div>
			<span slot="footer">
				<el-button @click="approvalModalCancel">取 消</el-button>
				<el-button type="primary" @click="approvalModalConfirm">
					确认
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { UNREG_REASON_COLUMN } from './config';

export default {
	name: 'serviceCompanySetting',
	data() {
		return {
			UNREG_REASON_COLUMN,
			activeTab: 'unreg',
			unreg: {
				data: [],
				total: 0,
				pagination: {},
			},
			approval: {
				data: [],
				total: 0,
				pagination: {},
			},
			unregModal: {
				show: false,
				name: '',
				reason: '',
			},
			approvalModal: {
				show: false,
				name: '',
				reason: '',
			},
		};
	},
	methods: {
		unregEdit() {},
		unregDelete() {},
		addUnregReason() {
			this.unregModal.show = true;
		},
		unregModalCancel() {
			this.unregModal.show = false;
		},
		unregModalConfirm() {
			this.unregModal.show = false;
		},
		addApprovalReason() {
			this.unregModal.show = true;
		},
		approvalModalCancel() {
			this.approvalModal.show = false;
		},
		approvalModalConfirm() {
			this.approvalModal.show = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.item-gap {
	margin-bottom: 16px;
}
</style>

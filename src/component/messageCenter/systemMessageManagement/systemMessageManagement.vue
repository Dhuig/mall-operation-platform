<template>
	<div>
		<guideBar />
		<el-card class="box-card">
			<searchPanel ref="searchPanel" :config="searchConfig" @search="handleSearch" @reset="handleReset" />
		</el-card>
		<el-card class="box-card">
			<el-tabs v-model="activeStatusTab">
				<el-tab-pane
					:label="item.name"
					:name="item.platformId"
					v-for="(item, index) in tabsPrent"
					:key="index"
				></el-tab-pane>
			</el-tabs>
			<tableList border :dataSource="dataSource" :columns="columns" slotcontent>
				<template slot-scope="scope">
					<el-button v-permission="'system_message_management_view'" type="text" @click="detail(scope.data)">
						查看
					</el-button>
				</template>
			</tableList>
		</el-card>
	</div>
</template>

<script>
import { SYSTEM_MESSGE_MAANGEMENT_CONFIG, systemMessageManagement } from './config.js';
export default {
	name: 'systemMessageManagement',
	data() {
		return {
			activeStatusTab: '',
			dataSource: [],
			columns: systemMessageManagement,
			tabsPrent: [],
			params: {
				platformId: '',
				name: '',
			},
		};
	},
	computed: {
		searchConfig() {
			return SYSTEM_MESSGE_MAANGEMENT_CONFIG;
		},
	},
	activated() {
		this.getInitData();
	},
	methods: {
		async getInitData() {
			const res = await this.$fetch({
				method: 'GET',
				url: '/mgmt/msgadmin/scene/init',
			});
			if (res && res.code === 200) {
				this.tabsPrent = res.data;
				this.activeStatusTab = res.data[0].platformId;
			}
		},
		loadData() {
			this.tabsPrent.forEach(async e => {
				if (e.platformId === this.activeStatusTab) {
					this.params.platformId = e.platformId;
					const res = await this.$fetch({
						method: 'GET',
						url: '/mgmt/msgadmin/scene/search',
						params: this.params,
					});
					if (res && res.code === 200) {
						this.dataSource = res.data;
					}
				}
			});
		},
		detail({ sceneId }) {
			this.$go('sub_scene_management', { title: '子场景管理', sceneId, platformId: this.params.platformId });
		},
		// 查询事件
		handleSearch({ name }) {
			this.params.name = name;
			this.loadData();
		},
		// 重置事件
		handleReset() {
			this.params.name = '';
		},
	},
	watch: {
		activeStatusTab: {
			handler() {
				this.loadData();
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}
.btns {
	color: #0877fd;
	cursor: pointer;
	margin-right: 18px;
}
</style>

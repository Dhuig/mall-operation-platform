<template>
	<div>
		<guideBar>
			<el-button v-permission="'app_setting_add'" type="primary" icon="el-icon-plus" @click="addAdvert"
				>新增广告图</el-button
			>
		</guideBar>
		<el-card>
			<el-table :data="data">
				<el-table-column type="index" label="序号" width="50" />
				<el-table-column prop="imageUrl" label="广告页图片">
					<template slot-scope="scope">
						<el-image class="img" :src="scope.row.imageUrl" fit="scale-down"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="shelfUpTime" label="上架时间">
					<template slot-scope="scope">
						<span>{{ scope.row.shelfUpTime | timestampFormat }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="shelfOffTime" label="下架时间">
					<template slot-scope="scope">
						<span>{{ scope.row.shelfOffTime | timestampFormat }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="enableStatus" label="广告页状态">
					<template slot-scope="scope">
						<span>{{ scope.row.enableStatus == '0' ? '禁用' : '启用' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" :width="450">
					<template slot-scope="scope">
						<el-button
							v-permission="'app_setting_enable_toggle_status'"
							size="mini"
							type="danger"
							icon="el-icon-delete-solid"
							@click="enable(scope.row)"
							>{{ scope.row.enableStatus == '0' ? '启用' : '禁用' }}</el-button
						>
						<el-button
							v-permission="'app_setting_edit'"
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							@click="handleEdit(scope.row.id)"
							>编辑</el-button
						>
						<el-button
							v-permission="'app_setting_delete'"
							size="mini"
							type="primary"
							icon="el-icon-edit-outline"
							@click="handleDelete(scope.row.id)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>
<script>
export default {
	name: 'appSetting',
	data() {
		return {
			data: [],
		};
	},
	created() {
		this.$listen('GET_ADVERT_LIST', this.getAdvertList);
		this.getAdvertList();
	},
	methods: {
		// 获取启动页列表
		async getAdvertList() {
			const res = await this.$fetch('/mgmt/cms/advert/getAdvertList');
			if (res && res.code == 200) this.data = res.data;
		},
		// 启用禁用
		async enable(row) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/cms/advert/enable',
				data: {
					id: row.id,
					enable: row.enableStatus == '0' ? 1 : 0,
				},
			});
			if (res && res.code == 200) {
				this.$message.success(res.message);
				this.getAdvertList();
			}
		},
		// 删除
		async handleDelete(id) {
			const res = await this.$fetch('/mgmt/cms/advert/removeAdvertPage/' + id);
			if (res && res.code == 200) {
				this.getAdvertList();
				this.$message.success(res.message);
			}
		},
		// 编辑
		handleEdit(id) {
			this.$go('/update_app', { title: '编辑启动页', id });
		},
		// 新增广告图
		addAdvert() {
			this.$go('/update_app');
		},
	},
};
</script>
<style lang="scss" scoped>
.img {
	width: 100%;
	height: 100px;
}
</style>

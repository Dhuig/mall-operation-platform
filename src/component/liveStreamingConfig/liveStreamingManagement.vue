<template>
	<div class="live-stream">
		<guideBar>
			<el-button
				v-permission="'live_streaming_management_banner_setting'"
				type="primary"
				@click="bannerAndPosterSet(true)"
			>
				banner设置
			</el-button>
			<el-button
				v-permission="'live_streaming_management_share_poster'"
				type="primary"
				@click="bannerAndPosterSet(false)"
			>
				分享海报
			</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="LIVE_STREAMING_SEARCH" @search="handleSearch" />
		</el-card>
		<el-card>
			<tableList
				:columns="LIVE_STREAMING_COLUMNS"
				:dataSource="dataSource"
				:pagination="pagination"
				:dataTotal="pagination.total"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="scope">
					<el-button
						v-permission="'live_streaming_management_start'"
						v-if="scope.data.bannedStatus"
						type="text"
						@click="enableLive(scope.data)"
					>
						启用
					</el-button>
					<el-button
						v-else
						v-permission="'live_streaming_management_stop'"
						type="text"
						@click="disableLive(scope.data)"
					>
						禁用
					</el-button>
					<el-button v-permission="'live_streaming_management_commodity'" type="text" @click="handleProduct(scope)">
						查看商品
					</el-button>
					<el-button v-permission="'live_streaming_management_replay'" type="text" @click="handleReplay(scope.data)">
						查看回放
					</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="直播商品" :visible.sync="visibleProduct">
			<tableList border :columns="PRODUCT_COLUMNS" :dataSource="goodsData"></tableList>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleCloseGoodsDialog">关 闭</el-button>
			</div>
		</el-dialog>
		<el-dialog
			@close="handleClose"
			destroy-on-close
			:title="isBanner ? 'Banner设置' : '分享海报设置'"
			:visible.sync="visible"
		>
			<el-form ref="fromRef" :model="formdata" :rules="BANNER_POSTER_FORM_RULES" label-width="100px">
				<el-form-item v-if="!isBanner" label="海报标题" prop="tittleName">
					<el-input style="width: 60%" v-model="formdata.tittleName" />
				</el-form-item>
				<el-form-item v-if="!isBanner" label="海报logo" prop="logoUrl">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:on-success="handlePosterSuccess"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemovePoster"
						:before-upload="beforeUpload"
						:on-exceed="exceed"
						:file-list="fileListPoster"
						:limit="1"
						list-type="picture-card"
						accept=".jpg,.jpeg,.png"
					>
						<i class="el-icon-plus"></i>
						<div slot="tip" class="el-upload__tip">支持JPG、JPEG、PNG，最大5M，建议尺寸比例为200px*200px，</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="banner图片" prop="bannerUrl">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						:on-success="handleBannerSuccess"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemoveBanner"
						:before-upload="beforeUpload"
						:on-exceed="exceed"
						:file-list="fileListBanner"
						:limit="1"
						list-type="picture-card"
						accept=".jpg,.jpeg,.png"
					>
						<i class="el-icon-plus"></i>
						<div slot="tip" class="el-upload__tip">支持JPG、JPEG、PNG，最大5M，建议尺寸比例为200px*200px，</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="visible = false">关 闭</el-button>
				<el-button type="primary" @click="handleConfirm">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="dialogVisible" :modal="false">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
		<el-dialog title="查看回放" :visible.sync="isVisible" width="60%">
			<tableList :dataSource="liveReplays" :options="options" :columns="REPLAY_DOWNLOAD_COLUMNS">
				<template v-slot:media_url="scope">
					<el-button type="text" @click="goLook(scope.row.media_url)">{{ scope.row.media_url }}</el-button>
				</template>
			</tableList>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isVisible = false">取 消</el-button>
				<el-button type="primary" @click="isVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	LIVE_STREAMING_SEARCH,
	LIVE_STREAMING_COLUMNS,
	PRODUCT_COLUMNS,
	BANNER_POSTER_FORM_RULES,
	REPLAY_DOWNLOAD_COLUMNS,
} from './config';
import { uploadFileType } from 'util/formValidation';
import { formatDate } from '@/util/formValidation';
export default {
	name: 'liveStreamingManagement',
	data() {
		return {
			options: {
				index: true,
				labelIndex: '序号',
			},
			REPLAY_DOWNLOAD_COLUMNS,
			isVisible: false,
			LIVE_STREAMING_SEARCH,
			LIVE_STREAMING_COLUMNS,
			BANNER_POSTER_FORM_RULES,
			PRODUCT_COLUMNS,
			dialogImageUrl: '',
			dataSource: [],
			fileListBanner: [],
			fileListPoster: [],
			pagination: {
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
			searchConfig: {
				name: '',
				live_status: '',
				live_time: '',
			},
			formdata: {
				tittleName: '',
				logoUrl: '',
				bannerUrl: '',
			},
			dialogVisible: false,
			visibleProduct: false,
			visible: false,
			isBanner: true,
			goodsData: [],
			liveReplays: [],
		};
	},
	computed: {
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.finance,
			};
			return params;
		},
	},
	methods: {
		async loadData() {
			const { live_status, live_time, name } = this.searchConfig;
			const { currentPage: pageNum, pageSize } = this.pagination;
			const data = { live_status, name, pageNum, pageSize };
			if (live_time && live_time.length > 0 && live_time[0]) {
				data.start_time = formatDate(live_time[0]);
				data.end_time = formatDate(live_time[1] + 24 * 3600 * 1000 - 1000);
			}
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/miniapp/getliveinfo',
				data,
			});
			if (res && res.code === 200) {
				const { list, total } = res.data || {};
				let datas = list.map(e => {
					e.goods.map(el => {
						el.price = String(el.price).substring(0, String(el.price).length - 2) + '.00';
					});
					return e;
				});
				this.dataSource = res.data ? datas : [];
				this.pagination.total = res.data ? total : 0;
			}
		},
		handleSearch() {
			this.loadData();
		},
		async bannerAndPosterSet(isBanner) {
			this.isBanner = isBanner;
			const liveRoom = await this.$fetch(`/mgmt/miniapp/${isBanner ? 'getBannerUrl' : 'getPostUrl'}`);
			if (liveRoom && liveRoom.code === 200) {
				this.fileListBanner = liveRoom.data.bannerUrl ? [{ name: '01', url: liveRoom.data.bannerUrl }] : [];
				this.fileListPoster = liveRoom.data.logoUrl ? [{ name: '01', url: liveRoom.data.logoUrl }] : [];
				this.formdata.tittleName = liveRoom.data.tittleName;
				this.formdata.logoUrl = liveRoom.data.logoUrl;
				this.formdata.bannerUrl = liveRoom.data.bannerUrl;
			}
			this.visible = true;
		},
		updateLiveRoomStatus({ bannedStatus, roomid, name }) {
			this.$confirm(`确定${bannedStatus ? '启用' : '禁用'}` + (name ? name : '') + '?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				const res = await this.$fetch({
					method: 'POST',
					url: '/mgmt/miniapp/updateLiveRoomStatus',
					data: { bannedStatus: bannedStatus ? 0 : 1, roomId: roomid },
				});
				if (res && res.code === 200) {
					this.$message.success(res.message);
					this.loadData();
				}
			});
		},
		enableLive(data) {
			this.updateLiveRoomStatus(data);
		},
		disableLive(data) {
			this.updateLiveRoomStatus(data);
		},
		goLook(url) {
			window.open(url);
		},
		handleReplay({ liveReplays }) {
			this.isVisible = true;
			this.liveReplays = liveReplays;
		},
		// 点击查看商品
		handleProduct(scope) {
			const { goods } = scope.data;
			this.visibleProduct = true;
			this.goodsData = goods;
		},
		handleCloseGoodsDialog() {
			this.visibleProduct = false;

			this.goodsData = [];
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		beforeUpload(file) {
			const whiteList = ['jpg', 'jpeg', 'png'];
			return uploadFileType.bind(this, file, whiteList, 5)();
		},
		exceed() {
			this.$message.warning('最多上传一张图片！');
		},
		// 分页改变
		handleChangePage(currentPage) {
			this.pagination.currentPage = currentPage;
			this.loadData();
		},

		// 单页数量改变
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize;
			this.loadData();
		},

		// 海报上传成功
		handlePosterSuccess(res) {
			if (res && res.success) {
				const { fileUrlKey } = res.datas;
				this.formdata.logoUrl = fileUrlKey;
			}
		},
		handleRemovePoster() {
			this.fileListPoster = [];
		},

		// banner上传成功
		handleBannerSuccess(res) {
			if (res && res.success) {
				const { fileUrlKey } = res.datas;
				this.formdata.bannerUrl = fileUrlKey;
			}
		},
		handleRemoveBanner() {
			this.fileListBanner = [];
		},
		// 点击确认
		handleConfirm() {
			this.$refs['fromRef'].validate(async valid => {
				if (valid) {
					const res = await this.$fetch({
						method: 'POST',
						url: '/mgmt/miniapp/updatePhotoById',
						data: {
							...this.formdata,
							id: this.isBanner ? '1' : '2',
						},
					});
					if (res && res.code === 200) {
						this.$message.success('设置成功');
						this.visible = false;
					} else {
						res && this.$message.error(res.message);
					}
				}
			});
		},
		// 关闭弹窗回调
		handleClose() {
			this.formdata = {
				tittleName: '',
				logoUrl: '',
				bannerUrl: '',
			};
			this.fileListBanner = [];
			this.fileListPoster = [];
		},
	},
	created() {
		this.loadData();
	},
};
</script>

<style lang="scss" scoped>
.live-stream {
	.table-button {
		display: flex;
		justify-content: flex-end;
		padding-bottom: 20px;
	}
}
.el-dialog__wrapper {
	overflow: auto;
}
</style>

<template>
	<div class="editExchangeOrder">
		<el-card class="box-card">
			<div class="header-content">
				<div>
					<h3>订单号：</h3>
					<span>{{ exchangeOrderInfo.orderNo }}</span>
				</div>
				<div>
					<h3>换货单号：</h3>
					<span>{{ exchangeOrderInfo.exchangeNo }}</span>
				</div>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span class="header-title">换货明细</span>
			</div>
			<el-table :data="exchangeOrderInfo.orderProductInfos" border>
				<el-table-column label="产品编号" prop="serialNo" width="120" align="center" fixed></el-table-column>
				<el-table-column label="产品名称" prop="title" width="200" align="center"></el-table-column>
				<el-table-column label="规格" width="120" align="center" prop="packing"></el-table-column>
				<el-table-column label="单位" width="60" align="center" prop="meterUnit"></el-table-column>
				<el-table-column label="购买数量" width="100" align="center" prop="quantity"></el-table-column>
				<el-table-column label="换货数量" width="120" align="center">
					<template slot-scope="scope">
						<el-input type="input" @input="onBlur(scope.$index)" v-model="scope.row.bnum"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="生产日期/有效期" width="220" align="center">
					<template slot-scope="scope">
						<el-date-picker
							v-model="scope.row.expiryData"
							type="date"
							value-format="yyyy-MM-dd"
							placeholder="选择日期"
							style="width: 100%"
						></el-date-picker>
					</template>
				</el-table-column>
				<el-table-column label="批号" width="120" align="center">
					<template slot-scope="scope">
						<div :class="{ showRed: scope.row.bnum > 0 && !scope.row.batchNumber }">
							<el-input v-model="scope.row.batchNumber" maxlength="6"></el-input>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="二维码数字" width="220" align="center">
					<template slot-scope="scope">
						<el-input v-model="scope.row.qrCode" maxlength="16"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="初次使用时间" width="220" align="center">
					<template slot-scope="scope">
						<el-date-picker
							v-model="scope.row.firstUseTime"
							type="date"
							placeholder="选择日期"
							value-format="yyyy-MM-dd"
							style="width: 100%"
						></el-date-picker>
					</template>
				</el-table-column>
				<el-table-column label="日常使用时段" width="120" align="center">
					<template slot-scope="scope">
						<el-select v-model="scope.row.usePeriod" placeholder="请选择">
							<el-option
								v-for="item in OPTIONS_DATA"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="问题发生状态" width="220" align="center">
					<template slot-scope="scope">
						<el-select v-model="scope.row.problemStatus" placeholder="请选择">
							<el-option
								v-for="item in PROBLEM_STATUS"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="产品内容物状态" width="360" align="center">
					<template slot-scope="scope">
						<el-input v-model="scope.row.problemDesc" maxlength="60" placeholder="请输入"></el-input>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span class="header-title">换货信息</span>
			</div>
			<el-form
				ref="exchangeOrderForm"
				:model="exchangeOrderInfo"
				:rules="EXCHANGE_ORDER_UPDATE_INFO_RULES"
				label-width="180px"
				label-suffix=":"
			>
				<el-form-item label="一级换货原因" prop="reason1Id">
					<el-select v-model="exchangeOrderInfo.reason1Id" @change="clearReason2Id">
						<el-option
							v-for="{ returnReason, id } in reasonDict"
							:label="returnReason"
							:value="id"
							:key="id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="一级换货原因备注" prop="reason1Remark">
					<el-input v-model="exchangeOrderInfo.reason1Remark" placeholder="补充说明" style="width: 500px"></el-input>
				</el-form-item>
				<el-form-item label="二级换货原因" prop="reason2Id">
					<el-select v-model="exchangeOrderInfo.reason2Id" placeholder="请选择活动区域">
						<el-option
							v-for="{ returnReason, id } in reasonDict2"
							:label="returnReason"
							:value="id"
							:key="id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="二级换货原因备注" prop="reason2Remark">
					<el-input v-model="exchangeOrderInfo.reason2Remark" placeholder="补充说明" style="width: 500px"></el-input>
				</el-form-item>
				<el-form-item label="换货方式" prop="exchangeType">
					<el-select v-model="exchangeOrderInfo.exchangeType" placeholder="请选择换货方式">
						<el-option
							v-for="{ value, label } in optionGenerator(EXCHANGETYPE)"
							:label="label"
							:value="value"
							:key="value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="旧货处理方式" prop="junkHandleType">
					<el-select v-model="exchangeOrderInfo.junkHandleType" placeholder="请选择旧货处理方式">
						<el-option
							v-for="{ value, label } in optionGenerator(JUNKHANDLETYPE)"
							:label="label"
							:value="value"
							:key="value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上传凭证">
					<p>附件： 支持格式jpg、png，最大10M，最多可以上传3张图片</p>
					<el-upload
						ref="elUpload"
						:action="uploadData.actionUrl"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadData"
						list-type="picture-card"
						:limit="3"
						:file-list="exchangeOrderInfo.attachmentUrls"
						:before-upload="beforeAvatarUpload"
						:on-success="handleSuccess"
						:on-preview="handPreview"
						:on-remove="handleRemove"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item>
					<el-button @click="$closeSelf()">返回</el-button>
					<el-button type="primary" @click="onSubmit">提交申请</el-button>
				</el-form-item>
			</el-form>
			<!-- 查看图片 -->
			<el-dialog :visible.sync="previewObj.visible" append-to-body v-drag>
				<img width="100%" :src="previewObj.url" alt />
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
import {
	OPTIONS_DATA,
	PROBLEM_STATUS,
	EXCHANGE_TYPE,
	EXCHANGE_ORDER_UPDATE_INFO_RULES,
	JUNKHANDLETYPE,
	PROBLEMSTATUS,
	EXCHANGETYPE,
} from './config';
import { optionGenerator } from 'util';
export default {
	name: 'editExchangeOrderDetails',
	data() {
		return {
			OPTIONS_DATA,
			PROBLEM_STATUS,
			EXCHANGE_TYPE,
			JUNKHANDLETYPE,
			PROBLEMSTATUS,
			EXCHANGETYPE,
			EXCHANGE_ORDER_UPDATE_INFO_RULES,
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE, // 存储类型（目前支持的类型:FastDFS）
				clientKey: this.$config.CLIENT_KEY.order, // 客户端Key(由管理员进行分配)
				actionUrl: this.$store.getters['system/getOssUploadUrl'],
			},
			reasonDict: [], // 一级原因列表
			reasonDict2: [], // 二级原因列表
			exchangeOrderInfo: {
				orderProductInfos: [],
				attachmentUrls: [],
				// 换货审核 / 验证审核 form
				attachmentUrlList: [], // 核附件URL列表
				reason1Id: '', //一级换货原因id
				reason2Id: '', //二级换货原因id
				reason1: '',
				reason2: '',
				reason1Remark: '', //一级换货原因备注
				reason2Remark: '', //二级换货原因备注
			},
			previewObj: {
				// 显示图片
				url: '',
				visible: false,
			},
		};
	},
	watch: {
		'exchangeOrderInfo.reason1Id': function (newValue) {
			if (newValue && this.reasonDict.length) {
				let obj = this.reasonDict.find(item => item.id === newValue);
				if (!obj) return;
				this.reasonDict2 = obj.reasonList;
				this.exchangeOrderInfo.reason1 = obj.returnReason;
			}
		},
		'exchangeOrderInfo.reason2Id': function (newValue) {
			this.exchangeOrderInfo.reason2 = this.reasonDict2?.find(item => item.id === newValue)?.returnReason;
		},
		deep: true,
	},
	methods: {
		optionGenerator,
		// 选的时候清空
		clearReason2Id() {
			this.reasonDict2 = [];
			this.exchangeOrderInfo.reason2Id = '';
			this.exchangeOrderInfo.reason2 = '';
		},
		//换货数量处理
		onBlur(index) {
			// 不是数字
			if (isNaN(Number(this.exchangeOrderInfo.orderProductInfos[index].bnum))) {
				this.exchangeOrderInfo.orderProductInfos[index].bnum = 0;
			}
			if (
				this.exchangeOrderInfo.orderProductInfos[index].bnum > this.exchangeOrderInfo.orderProductInfos[index].quantity
			) {
				this.exchangeOrderInfo.orderProductInfos[index].bnum = this.exchangeOrderInfo.orderProductInfos[index].quantity;
				this.$message.error('换货数量超过购买数量');
			} else if (this.exchangeOrderInfo.orderProductInfos[index].bnum < 0) {
				this.exchangeOrderInfo.orderProductInfos[index].bnum = 0;
			}
		},
		// 获取下拉框
		async getSelectList() {
			let obj = {
				method: 'GET',
				url: `sys/api/getAllReturnReasonByType`,
				params: {
					returnType: 2, // 换货审核 1 换货审核 2
				},
			};
			let res = await this.$fetch(obj);
			if (res.data && res.code == 200) {
				this.reasonDict = res.data;
			}
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
		//文件上传公共
		handleSuccess(res, file, fileList) {
			if (res.success) {
				let list = fileList.map(x => {
					return {
						name: x.name,
						status: x.status,
						uid: x.uid,
						url: x.response.datas.fileUrlKey,
					};
				});
				this.exchangeOrderInfo.attachmentUrlList = list.map(x => x.url);
			}
		},
		//文件列表移除文件时的钩子
		handleRemove(file, fileList) {
			this.exchangeOrderInfo.attachmentUrlList = fileList.map(x => x.url);
		},
		//查看文件
		handPreview(file) {
			this.previewObj = {
				url: file.url,
				visible: true,
			};
		},
		//获取编辑换货单数据
		async getOrderExchangeUpdateInfo() {
			const { exchangeNo } = this.$route.query;
			let obj = {
				method: 'GET',
				url: '/mgmt/order/exchange/getOrderExchangeUpdateInfo',
				params: {
					exchangeNo, //换货单号
				},
			};
			let res = await this.$fetch(obj);
			if (res) {
				const { exchangeProductInfos, orderProductInfos, attachmentUrls } = res.data;
				// 图片处理
				res.data.attachmentUrls = attachmentUrls.map(url => {
					return {
						url,
					};
				});
				//  默认值
				orderProductInfos.forEach(item => {
					let obj = exchangeProductInfos.find(val => item.serialNo === val.productCode);
					if (obj) {
						item.expiryData = obj.expiryData;
						item.batchNumber = obj.batchNumber;
						item.qrCode = obj.qrCode;
						item.firstUseTime = obj.firstUseTime;
						item.usePeriod = obj.usePeriod;
						item.problemStatus = obj.problemStatus;
						item.problemDesc = obj.problemDesc;
						item.bnum = obj.quantity;
					} else {
						item.expiryData = '';
						item.batchNumber = '';
						item.qrCode = '';
						item.firstUseTime = '';
						item.usePeriod = '';
						item.problemStatus = '';
						item.problemDesc = '';
						item.bnum = '';
					}
				});
				this.exchangeOrderInfo = res.data;
			}
		},
		// 提交
		onSubmit() {
			// 判断换货数量大于0可继续操作
			let maxbum = this.exchangeOrderInfo.orderProductInfos.filter(x => x.bnum > 0);
			if (maxbum.length == 0) {
				return this.$message.warning('至少填写一条换货数据');
			}
			// 判断换货数量大于0就必须填写批号
			let isCorrect = maxbum.map(item => !item.batchNumber).some(Boolean);
			if (isCorrect) {
				return this.$message.warning('请输入批号');
			}
			this.$refs['exchangeOrderForm'].validate(async valid => {
				if (valid) {
					const { exchangeNo } = this.$route.query;
					const {
						exchangeOrderInfo,
						exchangeOrderInfo: { orderProductInfos },
					} = this;
					console.log(exchangeOrderInfo.attachmentUrls.map(x => x.url));
					let obj = {
						method: 'POST',
						url: '/mgmt/order/exchange/updateOrderExchange',
						data: {
							exchangeNo,
							...exchangeOrderInfo,
							attachmentUrlList: exchangeOrderInfo.attachmentUrls.map(x => x.url),
							orderExchangeProducts: orderProductInfos.filter(v => v.bnum), // 只需传有换货数量的列表
						},
					};
					obj.data.orderExchangeProducts.forEach(x => {
						x.quantity = Number(x.bnum);
						x.productCode = x.serialNo;
						x.productName = x.title;
					});
					console.log(obj.data.orderExchangeProducts);
					let res = await this.$fetch(obj);
					if (res.data.code && res.data.code == 404) {
						this.$message.error(res.data.message);
						return;
					}
					if (res.code == 200) {
						this.$message({
							message: '提交申请成功',
							type: 'success',
						});
						this.$closeSelf();
						this.$dispatch('updata_exchang_good_details');
					}
				}
			});
		},
	},
	mounted() {
		this.getSelectList();
		this.getOrderExchangeUpdateInfo();
	},
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
	overflow-y: auto;
	max-height: 520px;
}
::v-deep .el-card__header {
	font-weight: bold;
}
.editExchangeOrder {
	.box-card {
		margin-top: 24px;
		.header-title {
			font-weight: bold;
		}
		.header-content {
			display: flex;
			align-items: center;
			div {
				display: flex;
				align-items: center;
				margin: 0 24px;
				h3 {
					font-size: 14px;
					color: #5c6268;
				}
				span {
					font-size: 14px;
					color: #303336;
				}
			}
		}
	}
	.showRed {
		::v-deep.el-input__inner {
			border-color: $error;
		}
	}
}
</style>

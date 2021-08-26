<template>
	<div>
		<guideBar>
			<el-button
				v-permission="'bankcard_list_bank_of_deposit|bank_of_deposit_manage'"
				type="primary"
				@click="detail('bank')"
			>
				开户银行管理
			</el-button>
			<el-button v-permission="'bankcard_list_cleear_all_return_account'" type="danger" @click="delBankCard('all')">
				清空所有汇退帐号
			</el-button>
			<el-button v-permission="'bankcard_list_input_account'" type="primary" @click="insertAccount">录入帐号</el-button>
			<el-button
				v-permission="'bankcard_list_batch_import_list'"
				type="primary"
				class="upload-gap"
				@click="BatchImport"
			>
				批量导入名单
			</el-button>
			<el-button v-permission="'bankcard_list_batch_export'" type="primary" @click="batchExport">批量导出</el-button>
		</guideBar>
		<el-card>
			<searchPanel v-model="searchConfig" :config="BANKCARD_SEARCH_LIST" @search="handleSearch" />
		</el-card>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane :label="item.label" :name="item.value" v-for="(item, key) in tabPane" :key="key">
					<tableList
						:loading="tabData[activeTab].loading"
						:dataSource="tabData[activeTab].data"
						:columns="BANKCARD_LIST_COLUMNS"
						:pagination="tabData[activeTab].pagination"
						@handleChangePage="handleChangePage"
						@handleSizeChange="handleSizeChange"
						:dataTotal="tabData[activeTab].pagination.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'bankcard_list_detail'" type="text" @click="detail(scope.data.id)">
								查看详情
							</el-button>
							<el-button
								v-permission="'bankcard_list_edit'"
								type="text"
								v-if="scope.data.status != 1"
								@click="edit(scope.data)"
							>
								修改
							</el-button>
							<el-button
								v-permission="'bankcard_list_delete'"
								type="text"
								v-if="scope.data.status !== 3"
								@click="delBankCard(scope.data.id)"
							>
								清空账户
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 新增/编辑 银行帐号 对话框 -->
		<el-dialog :title="bankCardModal.title" :visible.sync="bankCardModal.show" width="40%" v-drag>
			<el-form
				inline
				size="small"
				:model="bankCardModal.form"
				label-width="120px"
				:rules="BANKCARD_RULES"
				ref="bankCardData"
				label-suffix=":"
				label-position="right"
			>
				<el-row>
					<el-form-item label="会员卡号" prop="cardNo">
						<el-input
							v-model="bankCardModal.form.cardNo"
							:disabled="bankCardModal.form.edit == 1"
							@change="loadVIPInfo"
							clearable
						/>
					</el-form-item>
					<el-form-item label="顾客姓名">
						<el-input v-model="bankCardModal.form.realname" disabled clearable />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="身份证号">
						<el-input v-model="bankCardModal.form.idNumber" disabled clearable />
					</el-form-item>
					<el-form-item label="发放类型" prop="provideType">
						<el-select size="small" v-model="bankCardModal.form.provideType" disabled clearable>
							<el-option
								v-for="(option, $idx) in PAY_TYPE_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="开户银行类型" prop="bankOpenType">
						<el-select size="small" v-model="bankCardModal.form.bankOpenType" clearable>
							<el-option
								v-for="(option, $idx) in BANKTYPE_OPTIONS"
								:key="$idx"
								:label="option.label"
								:value="option.value"
							/>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="所属省市" prop="site">
						<el-cascader
							size="medium"
							ref="pca-elcascader"
							v-model="bankCardModal.form.site"
							:props="lazyProps"
							:placeholder="addressPlaceholder"
							@change="handleChangeSite"
						/>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="银行帐号" prop="bankNo">
						<el-input v-model="bankCardModal.form.bankNo" maxlength="19" clearable />
					</el-form-item>
					<el-form-item label="开户行名称" prop="bankOpenName">
						<el-input v-model="bankCardModal.form.bankOpenName" clearable />
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer">
				<el-button type="info" @click="bankCardModal.show = false">取消</el-button>
				<el-button type="primary" @click="subBankCard">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { exportExcel, optionGenerator, timeEndFormat } from 'util';
import maps from 'config/map';
import {
	PROVIDE_TYPE,
	BANKCARD_SEARCH_LIST,
	BANKCARD_LIST_COLUMNS,
	BANKCARD_STATUS_MAP,
	BANKCARD_RULES,
	TAB_PANE,
} from './config';

export default {
	name: 'bankCardList',
	data() {
		return {
			BANKCARD_SEARCH_LIST,
			BANKCARD_LIST_COLUMNS,
			BANKCARD_RULES,
			PAY_TYPE_OPTIONS: optionGenerator(PROVIDE_TYPE),
			BANKTYPE_OPTIONS: [],
			activeTab: 'all',
			searchConfig: {
				cardNo: '',
				realname: '',
				mobile: '',
				provideType: '',
				createTimeRange: [],
				directSellerBanksVo: {},
			},
			tabPane: TAB_PANE,
			tabData: {
				all: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				noAccount: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				normal: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
				refund: {
					loading: false,
					data: [],
					pagination: {
						total: 0,
						currentPage: 1,
						pageSize: 20,
					},
				},
			},

			bankCardModal: {
				show: false,
				title: '',
				form: {
					id: '',
					memberId: '',
					mobile: '',
					cardNo: '',
					realname: '',
					idNumber: '',
					provideType: '',
					bankOpenType: '',
					province: '',
					city: '',
					district: '',
					bankNo: '',
					bankOpenName: '',
					site: [],
					status: '',
					edit: 0,
				},
			},
			addressPlaceholder: '请选择',
			// 省市区
			lazyProps: {
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
			placeData: {},
			// end
		};
	},
	computed: {
		// 银行卡状态
		status() {
			return BANKCARD_STATUS_MAP[this.activeTab];
		},
		// 搜索参数
		searchFields() {
			const {
				searchConfig,
				searchConfig: { createTimeRange = ['', ''] },
			} = this;
			const params = {
				...searchConfig,
				createStartTimeLong: createTimeRange[0] || '',
				createEndTimeLong: timeEndFormat(createTimeRange[1]) || '',
			};
			delete params.createTimeRange;
			return params;
		},
	},
	watch: {
		status() {
			this.loadData();
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(currentPage) {
			this.tabData[this.activeTab].pagination.currentPage = currentPage;
			this.loadData();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.tabData[this.activeTab].pagination.pageSize = pageSize;
			this.loadData();
		},
		// 搜索
		handleSearch() {
			let searchState = '';
			for (let key in this.searchFields) {
				if (this.searchFields[key]) {
					searchState = this.searchFields[key];
				}
			}
			// 判断搜索条件
			if (!searchState) {
				this.$message.warning('搜索条件不能为空');
				return;
			}
			this.tabData[this.activeTab].pagination.currentPage = 1;
			this.loadData();
		},

		// 录入帐号
		insertAccount() {
			this.bankCardModal = {
				title: '填写银行帐号',
				show: true,
				form: {
					id: '',
					memberId: '',
					cardNo: '',
					realname: '',
					idNumber: '',
					provideType: '',
					province: '',
					city: '',
					district: '',
					bankNo: '',
					bankOpenName: '',
					site: [],
					status: '',
					edit: 0,
				},
			};
			this.addressPlaceholder = '请选择';
		},
		// 多级下拉框事件
		handleChangeSite() {
			if (this.bankCardModal.form.site && this.bankCardModal.form.site.length != 0) {
				this.bankCardModal.form.province = this.bankCardModal.form.site[0];
				this.bankCardModal.form.city = this.bankCardModal.form.site[1];
				this.bankCardModal.form.district = this.bankCardModal.form.site[2];
			}
		},
		// 懒加载
		lazyLoad(node, resolve) {
			const { level } = node;
			if (level == 0) {
				let nodes = maps.map(item => {
					return {
						value: item.value,
						label: item.label,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 1) {
				const id = node.data.value;
				let data = [];
				maps.forEach(i => {
					if (i.value === id) {
						data = i.children;
					}
				});
				let nodes = data.map(item => {
					return {
						value: item.value,
						label: item.label,
						leaf: true,
					};
				});
				resolve(nodes);
			}
		},
		rewritePlace(data, cityStore) {
			let index = 0;
			let result = [];
			if (!data) {
				return;
			}
			const loop = (data, cityStore) => {
				if (!cityStore) return;
				cityStore.forEach(item => {
					if (data[index]) {
						if (item.value == data[index]) {
							result.push(item.label);
							if (item.children) {
								index++;
								loop(data, item.children);
							}
						}
					}
				});
			};
			loop(data, cityStore);
			return result;
		},
		// 银行卡信息提交
		subBankCard() {
			this.$refs.bankCardData.validate(valid => {
				if (valid) {
					if (this.bankCardModal.form.bankNo.length < 15) {
						this.$message({
							type: 'warning',
							message: '银行卡账号不得少于15位',
						});
						return;
					}
					// 平安银行二要素验证
					this.bmemberbankCheckBank();
				} else {
					this.$message({
						type: 'warning',
						message: '请填写必填项',
					});
					return false;
				}
			});
		},
		// 平安银行二要素验证
		async bmemberbankCheckBank() {
			const {
				form: {
					id,
					memberId,
					mobile,
					cardNo,
					status,
					realname,
					provideType,
					bankOpenType,
					province,
					city,
					district,
					bankNo,
					bankOpenName,
				},
			} = this.bankCardModal;
			const data = {
				id,
				memberId,
				cardNo,
				bankOpenType,
				provideType: Number(provideType),
				province,
				city,
				district,
				bankNo,
				bankOpenName,
				realname,
				mobile,
				channel: 'PC',
				createTime: new Date().getTime(),
				updateTime: new Date().getTime(),
				status,
				updaterId: '',
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmemberbank/checkBank',
				data,
			});
			if (res && res.code == 200) {
				this.confirmInsertBankCard();
			} else {
				this.$confirm(res.data.message, {
					confirmButtonText: '继续',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.confirmInsertBankCard();
					})
					.catch(() => {
						this.insertAccount();
						this.bankCardModal.show = false;
					});
			}
		},
		// 确认新增银行卡
		async confirmInsertBankCard() {
			const isCoverMesssage = await this.isCoverBankCard();
			if (isCoverMesssage) {
				this.$confirm(isCoverMesssage, {
					confirmButtonText: '覆盖',
					cancelButtonText: '不覆盖',
					type: 'warning',
				})
					.then(() => {
						this.updateBankCardInfo();
					})
					.catch(() => {
						this.bankCardModal.show = false;
						this.bankCardModal.form = {
							id: '',
							memberId: '',
							cardNo: '',
							realname: '',
							idNumber: '',
							provideType: '',
							province: '',
							city: '',
							district: '',
							bankNo: '',
							bankOpenName: '',
						};
					});
			} else {
				this.updateBankCardInfo();
			}
		},
		// 取消新增银行卡
		cancelInsertBankCard() {
			this.bankCardModal.show = false;
		},
		// 批量导入页面
		BatchImport() {
			this.$go('bankcard_import', { title: '批量导入' });
		},
		// 批量导出
		batchExport() {
			const { searchFields } = this;
			exportExcel('/crm/bmemberbank/exportProvideBank', searchFields);
		},
		// 查看详情
		detail(id) {
			console.log(id);
			let url = id !== 'bank' ? 'bankcard_detail' : 'bank_of_deposit_manage';
			this.$go(url, { id });
		},
		// 编辑
		edit(data) {
			const {
				id,
				memberId,
				cardNo,
				realname,
				certificatesNo: idNumber,
				provideType,
				province,
				city,
				district,
				bankNo,
				bankOpenName,
				bankOpenType,
				mobile,
				status,
			} = data;
			this.bankCardModal = {
				title: '编辑银行帐号',
				show: true,
				form: {
					id,
					memberId,
					cardNo,
					realname,
					idNumber,
					provideType,
					province,
					city,
					district,
					bankNo,
					bankOpenName,
					bankOpenType,
					mobile,
					status,
					edit: 1,
				},
			};
			// 省市区回填
			if (data.province) {
				let oneselfPro = this.rewritePlace([data.province, data.city], maps);
				this.bankCardModal.form.site = data.province == '' ? [] : [data.province, data.city];
				setTimeout(() => {
					this.addressPlaceholder = `${oneselfPro[0] || ''}/${oneselfPro[1] || ''}`;
				}, 300);
			}
		},
		// 删除银行卡
		delBankCard(state) {
			let delBankCardTit = state == 'all' ? '是否清空所有汇退账号?' : '请确认是否清空选中的银行账户?';
			this.$confirm(delBankCardTit, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					if (state == 'all') {
						// 清空所有汇退帐号
						this.delectProvideRefundBank();
					} else {
						// 删除-根据会员id删除银行卡
						this.alongDelBankCard(state);
					}
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作',
					});
				});
		},
		// 清空所有汇退帐号
		async delectProvideRefundBank() {
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmemberbank/delectProvideRefundBank',
			});
			if (res) {
				this.loadData();
				this.$message(res.message || '操作成功');
			}
		},
		// 删除-根据id删除银行卡
		async alongDelBankCard(id) {
			const res = await this.$fetch(`/crm/bmemberbank/deletebyId?id=${id}`);
			if (res && res.code == 200) {
				this.$message({
					type: 'success',
					message: '操作成功',
				});
				this.loadData();
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 判断是否覆盖
		async isCoverBankCard() {
			const {
				form: { id, memberId, cardNo, provideType, bankOpenType, province, city, district, bankNo, bankOpenName },
			} = this.bankCardModal;
			const data = {
				id,
				memberId,
				cardNo,
				bankOpenType,
				provideType: Number(provideType),
				province,
				city,
				district,
				bankNo,
				bankOpenName,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmemberbank/existProvideBank',
				data,
			});
			return res.data || '';
		},
		// 新增或修改会员发放银行卡
		async updateBankCardInfo() {
			const {
				form: {
					id,
					memberId,
					realname,
					cardNo,
					provideType,
					bankOpenType,
					province,
					city,
					district,
					bankNo,
					bankOpenName,
				},
			} = this.bankCardModal;
			const data = {
				id,
				memberId,
				cardNo,
				bankOpenType,
				provideType: Number(provideType),
				province,
				city,
				district,
				bankNo,
				realname,
				channel: 'PC',
				bankOpenName,
			};
			console.log(data);
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/bmemberbank/addorUpdateProvideBank',
				data,
			});

			if (res && res.code == 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.loadData();
				this.bankCardModal.show = false;
			}
		},
		// 请求银行卡列表
		async loadData() {
			const { activeTab, status, searchFields } = this;
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.tabData[activeTab];
			this.tabData[activeTab].loading = true;

			const data = {
				status,
				pageNum,
				pageSize,
				...searchFields,
			};

			const res = await this.$fetch({
				method: 'POST',
				url: `/crm/bmemberbank/getProvideBankPage`,
				data,
			});

			if (res && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					this.$message.warning('搜索无数据，请检查查询条件');
				}
				this.tabData[activeTab].data = list;
				this.tabData[activeTab].pagination.total = total;
			} else {
				this.tabData[activeTab].data = [];
				this.tabData[activeTab].pagination.total = 0;
				this.$message.warning('搜索无数据，请检查查询条件');
			}
			this.tabData[activeTab].loading = false;
		},
		// 获取银行类型字典 @todo {字典:银行}
		async loadBankType() {
			const res = await this.$fetch('/crm/lov/getCrmLovListByType?dictType=openBankCode');
			if (res && res.data && res.data.length) {
				this.BANKTYPE_OPTIONS = res.data.map(({ code: value, name: label }) => ({ value, label }));
			}
		},
		// 根据卡号自动带出
		async loadVIPInfo(cardNo) {
			this.bankCardModal.form.cardNo = cardNo;
			if (!cardNo || cardNo.length < 7) return;
			const res = await this.$fetch(`/crm/bmemberbank/getProvideBankByCardNo?platform=1&cardNo=${cardNo}`);
			if (res && res.data) {
				const { certificatesNo = '' } = res.data;
				this.bankCardModal.form = {
					...res.data,
					idNumber: certificatesNo,
					provideType: 2,
				};
				if (res.data.province) {
					let oneselfPro = this.rewritePlace([res.data.province, res.data.city], maps);
					this.bankCardModal.form.site = res.data.province == '' ? [] : [res.data.province, res.data.city];
					setTimeout(() => {
						this.addressPlaceholder = `${oneselfPro[0] || ''}/${oneselfPro[1] || ''}`;
					}, 300);
				}
				// this.bankCardModal.form.realname = realname;
				// this.bankCardModal.form.idNumber = certificatesNo;
				// this.bankCardModal.form.mobile = mobile;
			} else {
				this.$toast(res.message || '无法根据此会员卡查询会员信息');
			}
		},
	},
	mounted() {
		this.loadBankType();
		this.$nextTick(this.loadData);
	},
};
</script>
<style lang="scss" scoped>
.upload-gap {
	margin: 0 8px;
}
::v-deep .el-upload-list {
	width: 0 !important;
	height: 0 !important;
	border: 1px solid transparent !important;
	overflow: hidden !important;
}
</style>

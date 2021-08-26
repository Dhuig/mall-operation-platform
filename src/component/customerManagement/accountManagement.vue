<template>
	<div>
		<guideBar />
		<el-card>
			<el-form label-width="360px" label-suffix=":" label-position="right" class="row-gap">
				<el-row>
					<el-col>
						<el-form-item label="顾客编号">
							<span>{{ data.memberNo }}</span>
							<div class="button-groups">
								<el-button
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.AccountChangeLog"
									@click="viewAccountModifyChangelog"
								>
									账户修改日志
								</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="会员卡号" v-if="showType === 'customer'">
							<span>{{ data.cardNo }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="顾客身份">
							<span>{{ CUSTOMER_TYPE[data.memberType] }}</span>
							<!-- 功能按钮组 -->
							<div class="button-groups" v-if="showType === 'customer' && data.channel !== 7">
								<el-button
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.IdentityConvert"
									@click="indentityTransform"
								>
									身份转换
								</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="顾客姓名" v-if="showType === 'customer'">
							<span>{{ data.realname }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="配偶姓名" v-if="showType === 'customer'">
							<span>{{ (data.detail && data.detail.spouseRealname) || '空' }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="注册手机号">
							<span>{{ data.mobile || '空' }}</span>
							<!-- 功能按钮组 -->
							<div class="phone_btn">
								<el-button
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.EditRegisterMobile"
									@click="editPhone"
								>
									修改注册手机号
								</el-button>
								<el-button
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.ClearRegisterMobile"
									@click="tipClearMobile"
								>
									清空注册手机号
								</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col v-if="showType === 'customer'">
						<el-form-item label="联系手机号">
							<span>{{ data.contactMobile || '空' }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="关联手机号" v-if="showType === 'customer'">
							<span v-if="!data.mobiles || data.mobiles.length === 0">空</span>
							<el-button
								:class="relationPhoneList.length !== 0 ? 'add_mobiles_true' : 'add_mobiles_false'"
								type="text"
								v-multiMatchPermission:[routePath]="PERMISSION.AddBindMobile"
								@click="addBindPhone"
							>
								添加关联手机号
							</el-button>
							<!-- <div v-if="data.mobiles && data.mobiles.length !== 0" class="mobiles_div">
								<div v-for="(item,key) in data.mobiles" :key="key">
									<span>{{item}}</span>
									<el-button type="text" @click="openDeleteSubAccountModal">删除关联手机号</el-button>
								</div>
							</div>-->
							<div>
								<div class="relation_phone_box" v-for="(item, key) in relationPhoneList" :key="key">
									<span>{{ item.mobile }}</span>
									<span class="spouse_span">{{ item.isSpouse === 1 ? '配偶' : '' }}</span>
									<el-button
										type="text"
										v-multiMatchPermission:[routePath]="PERMISSION.DeleteBindMobile"
										@click="openDeleteSubAccountModal"
									>
										删除关联手机号
									</el-button>
									<el-button
										type="text"
										v-multiMatchPermission:[routePath]="PERMISSION.ToggleCoupleMark"
										@click="spouseButton(item)"
									>
										{{ item.isSpouse === 1 ? '取消标记' : '标记配偶' }}
									</el-button>
								</div>
							</div>
							<div class="button-groups"></div>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="邮箱" v-if="showType === 'customer'">
							<span>{{ data.email || '空' }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="密码" v-if="showType === 'customer'">
							<span>********</span>
							<div class="button-groups">
								<el-button
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.InitialPassword"
									@click="initialPassword"
								>
									初始化密码
								</el-button>
								<el-button
									style="margin-left: 0"
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.InitialChildPassword"
									@click="openInitialSubAccountModal"
								>
									初始化子账号密码
								</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="微信">
							<span>{{ (data.wechat && data.wechat.nickname) || '空' }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="QQ">
							<span>{{ (data.qq && data.qq.nickname) || '空' }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="默认配送服务中心">
							<span>{{ data.defaultDistributionStoreName || '空' }}</span>
							<div class="button-groups">
								<el-button
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.ChangeDefaultService"
									@click="changeDetaulServiceCentre"
								>
									更换
								</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col v-if="!state">
						<el-form-item label="交付服务中心">
							<span>{{ data.storeCode || '空' }}</span>
							&nbsp;
							<span>{{ data.storeName || '' }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="账号状态">
							<span>{{ ACCOUT_STATUS[data.memberStatus] }}</span>
							<div class="button-groups">
								<el-button
									type="text"
									v-multiMatchPermission:[routePath]="PERMISSION.ChangeUserAccountState"
									@click="changeAccountStatus"
								>
									修改
								</el-button>
							</div>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="最近一次变更状态时间">
							<span>{{ data.memberStatusUpdateTime || '空' }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="操作人">
							<span>{{ data.updaterName || '空' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span class="tips" v-if="!data.id">暂无子帐户数据</span>
			<div id="container" />
			<p class="out-btn">
				<el-button type="text" @click="exit">退出</el-button>
			</p>
		</el-card>
		<!-- 取消顾客资格/转换身份 对话框 -->
		<el-dialog
			:title="transformIndentity.cancelCertifyTitle"
			:visible.sync="transformIndentity.show"
			width="24%"
			v-drag
		>
			<el-row>
				<el-col :span="24" class="account-form line-gap">
					<span class="account-label">转换前身份:</span>
					<el-input :value="CUSTOMER_TYPE[transformIndentity.before]" disabled />
				</el-col>
				<el-col :span="24" class="account-form line-gap">
					<span class="account-label">转换后身份:</span>
					<el-select v-model="transformIndentity.after" class="select-fix" @change="identityChange" size="small">
						<el-option
							:label="option.label"
							:value="option.value"
							v-for="(option, $idx) in CUSTOMER_OPTIONS"
							:key="$idx"
						/>
					</el-select>
				</el-col>
				<el-col :span="24" class="account-form">
					<span class="account-label">转换类型:</span>
					<el-input :value="transformResult" disabled size="small" />
				</el-col>
			</el-row>
			<span slot="footer">
				<el-button @click="transformIndentity.show = false">退 出</el-button>
				<el-button type="primary" @click="confirmTransform" icon="el-icon-refresh">确认转换</el-button>
			</span>
		</el-dialog>
		<!-- 修改注册手机号 对话框 -->
		<el-dialog title="修改注册手机号" :visible.sync="phoneEdit.show" width="30%" v-drag>
			<el-form :model="phoneEdit" :rules="CHANGE_REG_PHONE_RULES" label-position="right" label-suffix=":">
				<el-form-item label="原手机号">
					<el-input :value="phoneEdit.past" size="small" disabled />
				</el-form-item>
				<el-form-item label="新手机号" prop="new">
					<el-input
						v-model="phoneEdit.new"
						maxlength="11"
						onkeyup="this.value=this.value.replace(/\D/g,'')"
						size="small"
						clearable
					/>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="phoneEdit.show = false">取消</el-button>
				<el-button
					type="primary"
					@click="confirmChangeMobile"
					:disabled="!phoneEdit.new || !CHANGE_REG_PHONE_RULES.new[1].pattern.test(phoneEdit.new)"
				>
					确认
				</el-button>
			</span>
		</el-dialog>
		<!-- 添加关联手机号 对话框 -->
		<el-dialog title="添加关联手机号" :visible.sync="bindPhone.show" width="22%" v-drag>
			<el-form :model="bindPhone" :rules="ADD_BIND_PHONE_RULES" label-position="right" label-suffix=":">
				<el-form-item label="新手机号" prop="phone">
					<el-input v-model="bindPhone.phone" maxlength="11" size="small" clearable />
				</el-form-item>
			</el-form>
			<p>修改完成后, 请通知顾客修改结果</p>
			<span slot="footer">
				<el-button @click="bindPhone.show = false">取消</el-button>
				<el-button
					type="primary"
					@click="confirmAddBindPhone"
					:disabled="!bindPhone.phone || !ADD_BIND_PHONE_RULES.phone[1].pattern.test(bindPhone.phone)"
				>
					确定
				</el-button>
			</span>
		</el-dialog>
		<!-- 删除关联手机号 对话框 -->
		<el-dialog title="删除关联手机号" :visible.sync="deleteBindPhone.show" width="25%" v-drag>
			<el-form label-position="right" label-suffix=":">
				<el-form-item label="关联手机号">
					<el-select v-model="deleteBindPhone.current">
						<el-option v-for="item in subAccountList" :key="item.id" :label="item.mobile" :value="item.id" />
					</el-select>
				</el-form-item>
			</el-form>
			<p>您确认删除关联手机号码吗？确认后请通知顾客，谢谢。</p>
			<span slot="footer">
				<el-button @click="deleteBindPhone.show = false">取消</el-button>
				<el-button type="primary" @click="confirmDeleteBindPhone" :disabled="!deleteBindPhone.current">确定</el-button>
			</span>
		</el-dialog>
		<!-- 初始化绑定子帐号密码 对话框(结构与删除关联手机号模态框 相同) -->
		<el-dialog title="初始化绑定子账号密码" :visible.sync="initialBindPhone.show" width="25%" v-drag>
			<el-form label-position="right" label-suffix=":">
				<el-form-item label="关联手机号">
					<el-select v-model="initialBindPhone.current">
						<el-option v-for="(item, $idx) in subAccountList" :key="item.id" :label="item.mobile" :value="$idx" />
					</el-select>
				</el-form-item>
			</el-form>
			<p>您确认将子账号密码初始化为888888？确认后请通知顾客，谢谢。</p>
			<span slot="footer">
				<el-button @click="initialBindPhone.show = false">取消</el-button>
				<el-button type="primary" @click="confirmInitialSubAccountPassword" :disabled="initialBindPhone.current === ''">
					确定
				</el-button>
			</span>
		</el-dialog>
		<!-- 修改默认服务中心 对话框 -->
		<el-dialog title="选择服务中心" :visible.sync="defaultServiceCentreModal.show" width="65%" v-drag>
			<el-form :inline="true" label-width="68px" label-suffix=":" :model="centreModalformData">
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="省市区">
							<el-cascader
								ref="elcascader"
								size="medium"
								v-model="centreModalformData.regions"
								:props="props"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="星级">
							<el-select v-model="centreModalformData.level" placeholder="请选择" clearable>
								<el-option
									v-for="item in LEVEL_TYPE"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="名称">
							<el-input
								v-model="centreModalformData.serviceName"
								placeholder="请输入服务中心名称"
								size="medium"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-button type="primary" icon="el-icon-search" @click="searchServiceCenter()" class="search-button">
							搜索
						</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="defaultServiceCentreModal.list" border height="280" style="width: 100%">
				<el-table-column prop="code" label width="100" align="center">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.isSelect" @change="changeRadio(scope.row)"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="服务中心名称" width="200" align="center"></el-table-column>
				<el-table-column prop="code" label="编号" width="110" align="center"></el-table-column>
				<el-table-column prop="detailAddress" label="地址" align="center"></el-table-column>
				<el-table-column
					prop="level"
					label="星级"
					width="150"
					align="center"
					:formatter="formatterLevel"
				></el-table-column>
			</el-table>
			<br />
			<!-- 分页部分 -->
			<el-pagination
				background
				class="pagination"
				:total="defaultServiceCentreModal.total"
				:current-page.sync="defaultServiceCentreModal.pagination.currentPage"
				:page-size="defaultServiceCentreModal.pagination.pageSize"
				@current-change="handleChangePage"
				@size-change="handleSizeChange"
				layout="sizes, total , prev, pager, next, jumper"
			/>
			<span slot="footer">
				<el-button @click="defaultServiceCentreModal.show = false">取消</el-button>
				<el-button
					type="primary"
					@click="confirmChangeDefaultService"
					:disabled="defaultServiceCentreModal.selected === ''"
				>
					确定
				</el-button>
			</span>
		</el-dialog>
		<!-- 帐号状态 对话框 -->
		<el-dialog title="修改账号状态" :visible.sync="accountStatus.show" width="25%" v-drag>
			<el-row>
				<el-col :span="24">
					<span class="account-label">状态:</span>
					<el-radio v-model="accountStatus.status" :label="0">正常(启用)</el-radio>
					<el-radio v-model="accountStatus.status" :label="1">禁用</el-radio>
					<el-radio v-model="accountStatus.status" :label="2">冻结</el-radio>
				</el-col>
			</el-row>
			<div class="tips">
				<p>注意事项:</p>
				<p>1. 启用: 指顾客账号正常, 可以登录, 可以正常交易</p>
				<p>2. 禁用: 指顾客无法登录商城</p>
				<p>3. 冻结：指顾客可以登录，不能购货，可以进行售后操作</p>
				<p>4. 修改完成后, 请通知顾客修改结果</p>
			</div>
			<span slot="footer">
				<span>
					<el-button @click.stop="accountStatus.show = false">取消</el-button>
					<el-button type="primary" @click="confirmModifyAccountStatus">确认</el-button>
				</span>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { optionGenerator } from 'util';
import { filters } from 'plugins/filters';
import {
	CUSTOMER_TYPE,
	ALLOW_TRANSFORM_LIST,
	ACCOUT_STATUS,
	CHANGE_REG_PHONE_RULES,
	ADD_BIND_PHONE_RULES,
	SERVICE_LIST,
	LEVEL_TYPE,
} from './config';
import qs from 'querystring';
import maps from 'config/map.json';
// import '@/lib/maps.js';
import LocationManger from '@/lib/location.js';
import PERMISSION from './configForAccountPermission';

export default {
	name: 'accountManagement',
	data() {
		return {
			PERMISSION,
			ACCOUT_STATUS,
			locationManger: null,
			CHANGE_REG_PHONE_RULES,
			ADD_BIND_PHONE_RULES,
			CUSTOMER_TYPE,
			ALLOW_TRANSFORM_LIST,
			CUSTOMER_OPTIONS: optionGenerator(CUSTOMER_TYPE).slice(1, 4),
			SERVICE_LIST,
			LEVEL_TYPE,
			id: '',
			subAccountList: [], // 子帐号列表
			data: {
				id: '',
				cardNo: '',
				memberType: 1,
				realname: '',
				spouseRealname: '',
			},
			account: {
				no: '',
				card_no: '',
			},
			transformIndentity: {
				cancelCertifyTitle: '取消顾客身份资格',
				show: false,
				before: 1,
				after: 2,
			},
			phoneEdit: {
				show: false,
				past: '',
				new: '',
			},
			bindPhone: {
				show: false,
				phone: '',
			},
			deleteBindPhone: {
				show: false,
				current: '',
			},
			initialBindPhone: {
				show: false,
				current: '',
			},
			accountStatus: {
				show: false,
				status: '',
			},
			initialSubAccountModal: {
				current: '',
				show: false,
			},
			defaultServiceCentreModal: {
				show: false,
				list: [],
				selected: '',
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
			},
			options: {
				selection: true,
			},
			centreModalformData: {
				regions: [], // 多级下拉绑定值
				level: '',
				serviceName: '',
			},
			props: {
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
			showType: 'business',
			state: '',
			relationPhoneList: [], // 关联手机号列表
		};
	},
	computed: {
		// 转换类型
		transformResult() {
			const { before, after } = this.transformIndentity;
			return `${CUSTOMER_TYPE[before]}转${CUSTOMER_TYPE[after]}`;
		},
		//
		routePath({ $route: { path } }) {
			let v = path.replace('/', '');
			console.log('v: ', v);
			return v;
		},
	},
	methods: {
		// 查看顾客帐户修改日志
		viewAccountModifyChangelog() {
			const { id: memberId, memberNo, cardNo, realname, memberType } = this.data;
			if (!memberId) return this.$message.warning('会员的 memberId 为空, 无法查询顾客帐户修改日志');
			this.$go('/account_modify_changelog', { memberId, memberNo, cardNo, realname, memberType });
		},
		exit() {
			this.$confirm('是否退出账户管理', '提示', {
				type: 'warning',
			})
				.then(() => {
					this.$closeSelf();
				})
				.catch(() => {});
		},
		// 点击回调
		handleClick(callbackName, ...args) {
			if (this[callbackName]) {
				this[callbackName](...args);
			}
		},
		// 取消顾客资格
		cancelCertify(key, val, data) {
			console.log(key, val, data);
			this.transformIndentity = {
				cancelCertifyTitle: '取消顾客身份资格',
				show: true,
				before: 1,
				after: 2,
				type: '',
			};
		},
		// 转换身份
		indentityTransform() {
			const { memberType: before } = this.data;
			this.transformIndentity = {
				cancelCertifyTitle: '转换身份',
				show: true,
				before,
				after: Math.min(4, before + 1),
				type: '',
			};
		},
		// 转换后身份判断
		identityChange() {
			if (this.transformIndentity.before == this.transformIndentity.after) {
				this.$message({
					type: 'warning',
					message: '转换前身份和转换后身份不能一致',
				});
				this.transformIndentity.after = '';
			}
		},
		// 确认转换回调
		confirmTransform() {
			const {
				id,
				ALLOW_TRANSFORM_LIST,
				transformIndentity: { before, after, after: toMemberType },
			} = this;
			console.log('params: ', ALLOW_TRANSFORM_LIST, before, after, toMemberType);
			// 执行转换
			this.transformCheck({ id, toMemberType });
		},
		// 清空注册手机号
		tipClearMobile() {
			let clearMobileTit = '确认清空注册手机号码吗?<br><br>注意事项：修改完成后，请通知顾客修改结果';
			this.$confirm(clearMobileTit, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				dangerouslyUseHTMLString: true,
				type: 'warning',
			})
				.then(() => {
					this.clearMobile();
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作',
					});
				});
		},
		// 清空注册手机号
		async clearMobile() {
			let data = {
				id: this.id,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/clearMobile',
				params: data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.data || res.message,
					onClose: () => {
						this.loadCustomerDetail();
					},
				});
			}
		},
		// 修改注册手机号码
		editPhone() {
			const {
				data: { mobile },
			} = this;
			this.phoneEdit = {
				show: true,
				past: mobile,
				new: '',
			};
		},
		// 确认改变手机
		confirmChangeMobile() {
			const {
				id,
				phoneEdit: { new: mobile },
			} = this;
			this.changeMobile({ id, mobile });
		},
		// 添加绑定子帐号
		addBindPhone(key, val, data) {
			console.log(key, val, data);
			this.bindPhone = {
				show: true,
				phone: val,
			};
		},
		// 确认绑定手机
		confirmAddBindPhone() {
			const {
				bindPhone: { phone: mobile },
				data: { id: memberId },
			} = this;
			const bindParams = {
				memberId,
				mobile,
			};
			this.addRelativeAccount(bindParams);
		},
		// 打开删除子帐号模态框
		openDeleteSubAccountModal() {
			this.deleteBindPhone = {
				show: true,
				current: '',
			};
			this.queryAllSubAccount(this.id);
		},
		// 确认删除关联子帐号回调
		confirmDeleteBindPhone() {
			const { current } = this.deleteBindPhone;
			this.deleteRelativeAccount(current);
		},
		// 初始化密码
		initialPassword() {
			this.$confirm('您确认初始化顾客密码吗? 初始化后, 密码将为 888888, 修改完成后将通知顾客修改结果', '初始化密码', {
				type: 'warning',
				callback: type => {
					if (type !== 'confirm') return;
					const { id } = this;
					this.resetPassword({ id });
				},
			});
		},
		// 打开初始化子帐号密码模态框
		openInitialSubAccountModal() {
			this.initialBindPhone = {
				show: true,
				current: '',
			};
			this.queryAllSubAccount(this.id);
		},
		// 初始化子帐号密码
		confirmInitialSubAccountPassword() {
			this.$confirm('您确认初始化子账号密码吗? 初始化后, 密码将为 888888', '初始化密码', {
				type: 'warning',
				callback: type => {
					if (type !== 'confirm') return;
					const { current } = this.initialBindPhone;
					const { cardNo, mobile: phone } = this.subAccountList[current];
					this.resetSubAccountPassword({ cardNo, phone });
				},
			});
		},
		// 改变帐户状态
		changeAccountStatus() {
			const {
				data: { memberStatus: status },
			} = this;
			this.accountStatus = {
				show: true,
				status,
			};
		},
		// 修改默认服务中心
		changeDetaulServiceCentre() {
			this.defaultServiceCentreModal = {
				show: true,
				list: [],
				selected: '',
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
			};
			this.loadServiceCentreList();
		},
		// 服务中心分页改变回调
		handleChangePage() {
			this.loadServiceCentreList();
		},
		// 服务中心页码改变回调
		handleSizeChange(size) {
			this.defaultServiceCentreModal.pagination.pageSize = size;
			this.loadServiceCentreList();
		},
		// 服务中心勾选回调
		changeRadio(row) {
			this.defaultServiceCentreModal.selected = row.code;
			this.defaultServiceCentreModal.list.forEach(item => {
				if (item.code !== row.code) {
					item.isSelect = false;
				}
			});
		},
		//选择省市区
		changeCity() {
			// console.log(this.centreModalformData.regions)
		},
		// 搜索
		searchServiceCenter() {
			this.loadServiceCentreList();
		},
		// 服务中心-确认
		async confirmChangeDefaultService() {
			let data = {
				defaultDistributionStoreCode: this.defaultServiceCentreModal.selected,
				id: this.id,
			};
			let res = await this.$fetch({
				method: 'POST',
				url: `/member/mgmt/changeMemberDefaultCenter`,
				data: data,
			});
			if (res && res.code === 200) {
				this.defaultServiceCentreModal.show = false;
				this.loadCustomerDetail();
			} else {
				this.$message.warning('更改异常');
			}
		},
		spouseButton(info) {
			// 请确认是否取消该手机号配偶标记？
			let tipsTitle = info.isSpouse === 1 ? '请确认是否取消该手机号配偶标记?' : '是否确定将选中号码标记为配偶?';
			this.$confirm(tipsTitle, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.memberAccountMark(info);
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作',
					});
				});
		},
		// 是否配偶标记
		async memberAccountMark(info) {
			let data = {
				isSpouse: info.isSpouse === 1 ? 2 : 1,
				id: info.id,
				memberId: this.id,
			};
			let res = await this.$fetch({
				method: 'POST',
				url: `/crm/member/memberAccount/mark`,
				data,
			});
			if (res && res.code === 200) {
				this.$message.warning(res.message);
				this.loadCustomerDetail();
			} else {
				this.$message.warning(res.message);
			}
		},
		// 确认改变帐户状态
		confirmModifyAccountStatus() {
			const {
				id,
				accountStatus: { status: memberStatus },
			} = this;
			this.modifyAccountStatus({ id, memberStatus });
		},
		// 根据帐户id 查询帐户详情
		async loadCustomerDetail() {
			const { id } = this;
			if (!id) return this.$message.warning('帐户 Id 无效,无法查询帐户详情');
			const res = await this.$fetch(`/member/mgmt/getMemberInfoById?${qs.stringify({ id })}`);
			if (res && res.data) {
				this.data = res.data;
				this.data.memberStatusUpdateTime = filters.timestampFormat(this.data.memberStatusUpdateTime);
				// 根据帐户id 查询子账号(关联手机)
				this.getMemberAccount();
			} else {
				this.$message.warning('无法查询到帐户详情');
			}
		},
		// 根据帐户id 查询子账号(关联手机)
		async getMemberAccount() {
			const res = await this.$fetch(`/crm/member/memberAccount/list?memberId=${this.id}`);
			if (res && res.data) {
				this.relationPhoneList = res.data;
			} else {
				this.$message.warning('无法查询到帐户详情');
			}
		},
		// 身份转换前检查
		async transformCheck(params) {
			const res = await this.$fetch(`/member/mgmt/checkConversion?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				// 成功之后不要提示
				// this.$message({
				// 	type: 'success',
				// 	message: res.data,
				// });
				this.doIdentityTransform(params);
			} else if (/300|301|302/.test(res.data.code)) {
				// 出现订单，返回状态码300
				// 出现订单退单，返回状态码301
				// 出现押货单，押货退单，返回状态码302
				let isMessage = res.message || '该用户还有业务暂未完成, 请完成后再执行身份转换';
				this.$confirm(isMessage, '提示', {
					confirmButtonText: '继续转换',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.doIdentityTransform(params);
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消转换',
						});
					});
			}
			// else {
			// 	this.$message({
			// 		type: 'error',
			// 		message: '该用户不充许身份转换',
			// 	});
			// }
		},
		// 执行顾客身份转换操作
		async doIdentityTransform(data) {
			if (!data) return;
			if (this.transformIndentity.before == this.transformIndentity.after) {
				this.$message({
					type: 'warning',
					message: '转换后身份不能等于转换前身份',
				});
				return false;
			}
			const res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/doConversion',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.transformIndentity.show = false;
						this.loadCustomerDetail();
					},
				});
			}
			// 在不弹出Notification 通知的情况下才提示错误信息
			// if (this.$store.getters['system/getError']) {
			// 	this.$message.error('执行身份转换操作失败');
			// }
		},
		// 修改手机号码
		async changeMobile(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/changeMobile',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.phoneEdit.show = false;
						this.loadCustomerDetail();
					},
				});
			} else {
				this.$message.error('修改手机号码失败');
			}
		},
		// 重置会员密码
		async resetPassword(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/resetMemberPassword',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => this.loadCustomerDetail(),
				});
			} else {
				this.$message.error('重置会员密码失败');
			}
		},
		// 查询当前登录人下的子帐号
		async queryAllSubAccount(id) {
			if (!id) return;

			const res = await this.$fetch(`/member/mgmt/querySubAccountByMemberId?id=${id}`);
			if (res && res.data && res.data.length) {
				this.subAccountList = res.data;
			} else {
				this.$message.warning('未能查询到主账号下有账号信息');
			}
		},
		// 初始化子帐号密码
		async resetSubAccountPassword(params) {
			console.log('params: ', params);
			if (!params) return;

			const res = await this.$fetch(`/member/mgmt/resetSubAccountPassword?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.initialBindPhone = {
							show: false,
							current: '',
						};
						this.loadCustomerDetail();
					},
					duration: 2000,
				});
			} else {
				this.$message.error('初始化子账号密码失败');
			}
		},
		// 修改会员账号状态
		async modifyAccountStatus(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/changeMemberStatus',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.accountStatus.show = false;
						this.loadCustomerDetail();
					},
				});
			} else {
				this.$message.error('修改会员账号状态失败');
			}
		},
		// 添加关联帐号(手机号)
		async addRelativeAccount(data) {
			if (!data) return;
			const res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/addSubAccount',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.bindPhone = {
							show: false,
							phone: '',
						};
						this.subAccountList = [];
						this.loadCustomerDetail();
						this.bindPhone.show = false;
					},
				});
			} else {
				this.$message.error('添加关联账号失败');
			}
		},
		// 删除关联帐号(手机号)
		async deleteRelativeAccount(id) {
			if (!id) return;
			const res = await this.$fetch({
				method: 'POST',
				url: '/member/mgmt/removeSubAccount',
				data: { id },
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.deleteBindPhone = {
							show: false,
							current: '',
						};
						this.subAccountList = [];
						this.loadCustomerDetail();
					},
				});
			} else {
				this.$message.error('删除关联手机号失败');
			}
		},
		// 获取服务中心列表
		async loadServiceCentreList() {
			let { currentPage, pageSize } = this.defaultServiceCentreModal.pagination;
			let { regions, serviceName, level } = this.centreModalformData;
			let data = {
				areaCode: regions[2],
				cityCode: regions[1],
				provinceCode: regions[0],
				name: serviceName,
				level: level === '0' ? '' : level,
			};
			let res = await this.$fetch({
				method: 'POST',
				url: `/member/mgmt/queryServiceCentre?pageNum=${currentPage}&pageSize=${pageSize}`,
				data: data,
			});
			if (res && res.code === 200) {
				const { list, total } = res.data;
				this.defaultServiceCentreModal.list = list.map(item => {
					return {
						...item,
						isSelect: false,
					};
				});
				this.defaultServiceCentreModal.total = total;
			} else {
				this.$message.error('获取服务中心列表失败');
			}
		},
		// 格式化星级
		formatterLevel(row) {
			// console.log()
			let value = '';
			LEVEL_TYPE.map(v => {
				v.value == row.level && (value = v.label);
			});
			return value;
		},
		// 加载函数
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
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 2) {
				const id = node.data.value;
				let data = [];
				maps.forEach(i => {
					i.children &&
						i.children.length > 0 &&
						i.children.forEach(j => {
							if (j.value === id) {
								data = j.children;
							}
						});
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
		// 初始化 LocationManger (基于高德地图SDK封装)
		initialAmap() {
			this.locationManger = new LocationManger();
			// setTimeout(this.locate, 1000);
			this.locate();
		},
		// 使用 LocationManger 去获取定位信息
		locate() {
			this.locationManger
				.locate()
				.then(res => {
					console.log('location data: ', res); // 定位数据 (!在 Firefox 里定位成功率很高, Chrome 中定位失败率很高)
				})
				.catch(err => {
					console.log('error: ', err);
				});
		},
	},
	created() {
		const { id, type, state } = this.$route.query;
		this.id = id;
		this.showType = type;
		this.state = state;
		id && this.loadCustomerDetail();
		// 加载高德地图 JS SDK
		// loadScript(this.$config.GAODE_MAP_URL, this.initialAmap, 'Amap');
	},
};
</script>

<style lang="scss" scoped>
.account-form {
	display: flex;
	justify-content: center;
	align-items: center;
}
.line-gap {
	margin-bottom: 10px;
}
.row-gap {
	font-size: 14px;
	color: #333;
	margin: 0 auto 8px auto;
}
.button-groups {
	min-width: 120px;
	display: inline-flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	margin-left: 20px;
}
.tips {
	font-size: 13px;
	margin-top: 24px;
	p {
		margin-bottom: 8px;
		color: #333;
	}
}
.account-label {
	color: $color-title;
	font-size: 14px;
	min-width: 90px;
	margin-right: 10px;
}
.select-fix {
	width: 100%;
}
.button-gap {
	margin-left: 16px;
}
.hide-button {
	display: none;
}
::v-deep.pagination {
	text-align: right;
	.el-pagination__sizes {
		float: left;
	}
	.el-pagination__total {
		float: left;
	}
}
.position-btn {
	margin-left: 106px;
}
.out-btn {
	text-align: center;
}
.mobiles_div span {
	margin-right: 20px;
}
.add_mobiles_true {
	margin-left: 140px;
}
.add_mobiles_false {
	margin-left: 20px;
}
.relation_phone_box > span,
.relation_phone_box button {
	margin-right: 10px;
}
.spouse_span {
	width: 30px;
	display: inline-block;
}
.phone_btn {
	display: inline-block;
	margin-left: 20px;
}
</style>

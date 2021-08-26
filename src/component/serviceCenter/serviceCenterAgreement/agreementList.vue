<template>
	<div class="contractList">
		<guideBar>
			<el-button type="primary" @click="addContarct">新增合同</el-button>
			<el-button type="primary" @click="batchImport">批量导入</el-button>
			<el-button type="primary" @click="exportExcel">导出EXCEL</el-button>
		</guideBar>
		<el-card class="box-card">
			<searchPanel
			v-model="searchConfig"
			:config="SERVICE_CENTER_AGREEMENT_CONFIG" @search="loadData"
			/>
		</el-card>
		<el-card>
			<tableList
				border
				:dataSource="dataSource"
				:columns="SERVICE_CENTER_AGREEMENT_COLUMS"
				:pagination="pagination"
				:dataTotal="dataTotal"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<span class="btns" @click="handleBtnsGruop(row.data, 'edit')">
						修改
					</span>
					<span class="btns" @click="handleBtnsGruop(row.data, 'delete')">
						删除
					</span>
				</template>
			</tableList>
		</el-card>
	<!-- 新增/编辑 -->
	<el-dialog :title="isAdd ? '新增合同' : '编辑合同'" :visible.sync="isShowBankAccount" width="700px">
		<el-form
			class="add-rate"
			:model="ruleForm"
			:rules="CREATE_NEW_AGREEMENT_RULES"
			ref="ruleForm"
			label-width="110px"
			label-position="right"
			label-suffix=":"
		>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-form-item label="服务中心编号" prop="storeCode">
						<el-input size="medium" v-model="ruleForm.storeCode" />
						<el-button type="text" @click="getStoreByCode(ruleForm.storeCode)">查询</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-form-item label="服务中心名称" prop="name">
						{{ name }}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="配偶" prop="spouse">
						{{ spouse }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-form-item label="负责人" prop="submitter">
						{{ leaderName }}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="经营者" prop="submitter">
						{{ operator }}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-form-item label="合同类型" prop="contractType">
						<el-select size="medium" v-model="ruleForm.contractType" placeholder="请选择合同类型">
							<el-option :label="item.label" v-for="item in CONCTACTTYPE" :key="item.value" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="年度" prop="year">
						<el-select size="medium" v-model="ruleForm.year" placeholder="请选择证件类型">
							<el-option :label="item.label" v-for="item in YEAR" :key="item.value" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-form-item label="提交日期" prop="sumbitDate">
						<el-date-picker  v-model="ruleForm.sumbitDate"  type="date"  placeholder="选择日期"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="提交状态" prop="submitStatus">
						<el-select size="medium" v-model="ruleForm.submitStatus" placeholder="请选择提交状态">
							<el-option :label="item.label" v-for="item in SUBMITRESULT" :key="item.value" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-form-item label="审核状态" prop="verifyStatus">
						<el-select size="medium" v-model="ruleForm.verifyStatus" placeholder="请选择提交状态">
							<el-option :label="item.label" v-for="item in AUDITSTATUS" :key="item.value" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-form-item label="备注" prop="remark">
						<el-input type="textarea" v-model="ruleForm.remark"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="submitForm('ruleForm')" class="save">{{ isAdd ? '新增' : '修改' }}</el-button>
			<el-button @click="resetForm('ruleForm')" class="cacel">取 消</el-button>
		</span>
	</el-dialog>
	</div>
</template>

<script>
import { SERVICE_CENTER_AGREEMENT_COLUMS,SERVICE_CENTER_AGREEMENT_CONFIG,AUDITSTATUS,YEAR,SUBMITRESULT,CREATE_NEW_AGREEMENT_RULES,CONCTACTTYPE } from './config.js';
import qs from 'querystring';
import { exportExcel } from 'util';
export default {
	name: 'serviceAgreementList',
	data() {
		return {
			SERVICE_CENTER_AGREEMENT_COLUMS,
			SERVICE_CENTER_AGREEMENT_CONFIG,
			CREATE_NEW_AGREEMENT_RULES,
			CONCTACTTYPE,
			SUBMITRESULT,
			AUDITSTATUS,
			YEAR,
			searchConfig: {
				contractType: null,
				storeCode:'',
				submitStatus:'',
				verifyStatus:null,
				leaderCardNo: null,
				year:''
			},
			isShowBankAccount:false,
			isAdd:false,
			name:'',
			leaderName:'',//负责人
			operator:'',
			spouse:'',
			ruleForm:{
				contractType: 0,
				remark: "",
				storeCode: "",
				submitStatus: 0,
				verifyStatus: 0,
				year: 0			
			},
			loading:false,
			pagination: {
				currentPage: 1,
				pageSize: 20,
			},
			dataTotal: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			dataSource: [],
		};
	},
	mounted() {
		this.loadData();
	},
	computed: {
		// 搜索参数
		searchFields() {
			const { searchConfig } = this;
			return {
				...searchConfig,
			};
		},
	},
	methods: {
		handleBtnsGruop(row, handleType) {
			switch (handleType) {
				case 'edit':
					//编辑
					console.log(row,'row')
					this.isAdd = false;
					this.isShowBankAccount = true;
					this.ruleForm = {
						...row
					};
					this.name = row.name;
					this.ruleForm.storeCode = row.code;
					this.operator = row.shopkeeperId;
					this.leaderName = row.leaderId;
					this.spouse = row.leaderId;
					this.ruleForm.id = row.id;
					break;
				case 'delete':
					// 删除
					var url = `service_contract_handle?id=${row.id}`;
					this.$router.history.push(url);
					break;
				default:
					break;
			}
		},
		//获取服务中心合同
		async loadData() {
			this.loading = true;
			const {
				pagination: { currentPage: pageNum, pageSize },
				searchFields,
			} = this;

			const params = {
				pageNum,
				pageSize,
				...searchFields,
			};
			const res = await this.$fetch(`/store/mgmt/listContract?${qs.stringify(params)}`);

			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = list;
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
		// 分页触发事件
		handleChangePage(val) {
			console.log(`当前页: ${val}`);
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},

		// 新增协议
		addContarct() {
			this.isAdd = true;
			this.isShowBankAccount = true;
		},
		// 批量导入
		batchImport() {
		},
		// 导出EXCEL
		exportExcel() {
			const {searchConfig } = this;
			const params = Object.assign(searchConfig);
			exportExcel('/store/mgmt/exportContract', params);
		},
		// 根据服务中心编号获取服务中心
		async getStoreByCode(storeCode){
			let code = storeCode;
			const params = {
				code
			};
			const res = await this.$fetch(`/store/mgmt/getStoreByCode?${qs.stringify(params)}`);
			this.getMemberInfoByStoreCode(code)
			this.name = res.data.store.name;		
			this.leaderName = res.data.store.leaderId;
			this.operator = res.data.store.shopkeeperId;
		},
		// 根据服务中心编号获取负责人会员信息
		async getMemberInfoByStoreCode(code){
			let storeCode = code;
			const params = {
				storeCode
			};
			const res = await this.$fetch(`/member/leader/api/getMemberInfoByStoreCode?${qs.stringify(params)}`);
			this.spouse = res.data.spouseRealname;			
		},
		// 添加合同
		async addContract(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/store/mgmt/addContract',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.isShowBankAccount = false;
			}			
		},
		// 更新合同
		async updateContract(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/store/mgmt/updateContract',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.isShowBankAccount = false;
			}			
		},
		submitForm(){
			let data = {
				...this.ruleForm
			};
			if(this.ruleForm.id){
				this.updateContract(data);
			}else{
				this.addContract(data);
			}
			let resetData = {
					contractType: 0,
					remark: "",
					storeCode: "",
					submitStatus: 0,
					verifyStatus: 0,
					year: 0			
				};
			this.ruleForm = resetData;
			this.loadData();
		},
		resetForm(){
			this.isShowBankAccount = false;
				let data = {
					contractType: 0,
					remark: "",
					storeCode: "",
					submitStatus: 0,
					verifyStatus: 0,
					year: 0			
				};
				this.ruleForm = data;
		}
	},
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 24px 0;
}

.contractList {
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
}
</style>

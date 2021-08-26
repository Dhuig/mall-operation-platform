<template>
	<div class="holiday-manage-list">
		<guideBar>
			<el-button v-permission="'holiday_manage_batch_import'" type="primary" @click="BatchImport">批量导入</el-button>
		</guideBar>
		<el-card class="box-card">
			<el-row>
				<el-col :span="16" class="month-label">
					<div>选择年份-月份：</div>
					<el-cascader
						ref="elcascader"
						size="medium"
						v-model="value"
						:options="arr"
						:props="{ expandTrigger: 'hover', checkStrictly: true }"
						@change="handleChange"
					/>
				</el-col>
				<el-col :span="8" class="my-col">
					<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
					<el-button icon="el-icon-refresh-left" class="ml-16" @click="reset">重置</el-button>
				</el-col>
			</el-row>
		</el-card>
		<el-card class="box-card">
			<tableList
				border
				:dataSource="dataSource"
				:columns="HOLIDAY_MANAGE_COLUMNS"
				:pagination="pagination"
				:dataTotal="total"
				:options="options"
				@handleChangePage="handleChangePage"
				@handleSizeChange="handleSizeChange"
				slotcontent
			>
				<template slot-scope="row">
					<el-button v-permission="'holiday_manage_edit'" type="text" @click="handleEdit(row.data)">
						编辑
					</el-button>
				</template>
			</tableList>
		</el-card>
		<el-dialog title="编辑节假日" :visible.sync="show" width="600px" v-drag>
			<el-form
				class="add-rate"
				:model="ruleForm"
				ref="ruleForm"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<div class="myself">
					<div>{{ detail.year }}年{{ detail.month }}月{{ detail.day }}日是否节假日？</div>
				</div>
				<div class="flex">
					<el-form-item label="设置" prop="holidayFlag">
						<el-radio-group v-model="ruleForm.holidayFlag">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="备注" prop="remarks">
						<el-input size="medium" v-model="ruleForm.remarks" />
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="save('ruleForm')" class="save">保存</el-button>
				<el-button @click="cacel('ruleForm')" class="cacel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
// import { exportExcel } from 'util';
import { HOLIDAY_MANAGE_COLUMNS } from './config';
import qs from 'querystring';

export default {
	name: 'holidayManageList',
	data() {
		return {
			HOLIDAY_MANAGE_COLUMNS,
			loading: false,
			dataSource: [],
			pagination: {
				currentPage: 1,
				pageSize: 10,
			},
			total: 0,
			options: {
				label: '全部',
				index: true,
				selection: false,
				labelIndex: '序号',
			},
			show: false,
			detail: {}, // 备份每条列表数据
			ruleForm: {
				holidayFlag: '', // 设置节假日
				remarks: '', // 备注
			},
			value: [], // 多级下拉绑定值
			arr: [], // 多级下拉数据
		};
	},
	computed: {
		// 搜索参数
		searchFields() {
			return {
				year: this.value[0] || '',
				month: this.value[1] || '',
			};
		},
	},
	methods: {
		// 分页触发事件
		handleChangePage(val) {
			this.pagination.currentPage = val;
			this.getList();
		},
		// 分页下拉触发事件
		handleSizeChange(val) {
			this.pagination.pageSize = val;
			this.getList();
		},
		// 批量导入
		BatchImport() {
			const { searchFields } = this;
			const params = qs.stringify(searchFields);
			this.$go('holiday_manage_import', { title: '批量导入节假日', params });
		},
		// 编辑
		handleEdit(row) {
			this.show = true;
			this.detail = row;
			const { holidayFlag, remarks } = row;
			this.ruleForm = {
				...this.ruleForm,
				holidayFlag: String(holidayFlag),
				remarks,
			};
		},
		// 保存
		save(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { id } = this.detail;
					const params = {
						...this.ruleForm,
						id,
					};
					await this.update(params);
					this.show = false;
					this.$refs[formName].resetFields();
					this.getList();
				}
			});
		},
		// 取消
		cacel(formName) {
			this.$refs[formName].resetFields();
			this.show = false;
		},
		// 编辑接口
		async update(params) {
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/sys/updateHoliday',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
		},
		// 多级下拉框事件
		handleChange() {
			// 选择之后将下拉界面收起
			this.$refs.elcascader.dropDownVisible = false;
			// 还可以获取labels值
			// const labels = this.$refs.elcascader.getCheckedNodes()[0].pathLabels;
		},
		// 搜索
		search() {
			this.getList();
		},
		// 重置
		reset() {
			this.value = [];
			this.getList();
		},
		// 二级下拉-月份数据
		getItems() {
			let arr = [];
			for (var i = 1; i <= 12; i++) {
				arr.push({
					label: i + '月',
					value: i,
				});
			}
			return arr;
		},
		// 一级下拉-年份数据
		getYearItems() {
			let currYear = new Date().getFullYear();
			let start = currYear - 10;
			let end = currYear + 10;
			let yearItems = [];
			for (var i = start; i <= end; i++) {
				yearItems.push({
					label: i,
					value: i,
					children: this.getItems(),
				});
			}
			return yearItems;
		},
		// 请求数据
		async getList() {
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
			const res = await this.$fetch(`/mgmt/sys/getHolList?${qs.stringify(params)}`);
			if (res.code === 200) {
				const { list, total } = res.data;
				this.dataSource = this.formatList(list);
				this.total = total;
			} else {
				this.dataSource = [];
				this.total = 0;
			}
			this.loading = false;
		},
		// 格式化数据
		formatList(list) {
			return list.map(item => {
				return {
					...item,
					year: this.formatDate(item.holidayDay, 'Y'),
					month: this.formatDate(item.holidayDay, 'M'),
					day: this.formatDate(item.holidayDay, 'D'),
				};
			});
		},
		// 处理日期
		formatDate(date, type) {
			let d = new Date(date);
			let YY = d.getFullYear();
			let MM = d.getMonth() + 1;
			let DD = d.getDate();
			switch (type) {
				case 'Y':
					return YY;
				case 'M':
					return MM;
				case 'D':
					return DD;
				default:
					return '';
			}
		},
	},
	created() {
		this.arr = this.getYearItems();
		this.getList();
	},
};
</script>
<style lang="scss" scoped>
::v-deep.holiday-manage-list {
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
	.month-label {
		padding-left: 30px;
		font-size: 14px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
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
.save {
	width: 100px;
	margin-right: 16px;
}
.cacel {
	width: 100px;
}
.my-col {
	text-align: right;
}
.ml-16 {
	margin-left: 16px;
}
.myself {
	padding-left: 180px;
}
</style>

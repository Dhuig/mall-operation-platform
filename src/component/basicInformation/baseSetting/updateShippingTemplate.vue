<template>
	<div class="update-shipping-template">
		<guideBar />
		<el-card class="box-card">
			<el-form
				:inline="true"
				ref="ruleForm"
				class="form--label-left"
				:model="ruleForm"
				:rules="rules"
				label-width="110px"
				label-position="right"
				label-suffix=":"
			>
				<el-row>
					<el-col>
						<el-form-item label="模板名称" prop="name">
							<el-input placeholder="请输入模板名称" v-model="ruleForm.name" size="medium" />
							<div class="span-title">模板名称限制在40字符以内</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="起步件数" prop="minCount">
							<el-input placeholder="请输入起步件数" v-model="ruleForm.minCount" size="medium">
								<template slot="append">件</template>
							</el-input>
							<div class="span-title">起步件数,限制100件以内</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="加价件数" prop="increaseCount">
							<el-input placeholder="请输入加价件数" v-model="ruleForm.increaseCount" size="medium">
								<template slot="append">件</template>
							</el-input>
							<div class="span-title">加价件数必须为正数，限制在100千克以内</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="起步价" prop="minPrice">
							<el-input placeholder="请输入起步价" v-model="ruleForm.minPrice" size="medium">
								<template slot="append">元</template>
							</el-input>
							<div class="span-title">默认起步价不能为空，必须为非负数字，限制在1000万以内</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="加价" prop="increasePrice">
							<el-input placeholder="请输入加价" v-model="ruleForm.increasePrice" size="medium">
								<template slot="append">元</template>
							</el-input>
							<div class="span-title">默认加价必须为非负数字，限制在1000万以内</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="province">
					<el-col>
						<el-form-item label="地区价格" prop="extension">
							<el-button type="primary" @click="addPrice">添加价格</el-button>
							<div class="table-list">
								<el-table :data="ruleForm.extension" class="wd" border>
									<el-table-column prop="spaceName" label="到达地区" width="180">
										<template slot-scope="scope">
											<el-button
												:type="ruleForm.extension[scope.$index].spaceName ? 'primary' : ''"
												@click="slectArea(scope.row, scope.$index)"
											>
												{{ ruleForm.extension[scope.$index].spaceName }}
											</el-button>
										</template>
									</el-table-column>
									<el-table-column prop="minPrice" label="起步价(元)">
										<template slot-scope="scope">
											<el-input
												size="small"
												class="my-input"
												v-model="ruleForm.extension[scope.$index].minPrice"
											></el-input>
										</template>
									</el-table-column>
									<el-table-column prop="increasePrice" label="加价(元)">
										<template slot-scope="scope">
											<el-input
												class="my-input"
												size="small"
												v-model="ruleForm.extension[scope.$index].increasePrice"
											></el-input>
										</template>
									</el-table-column>
									<el-table-column prop="operation" label="操作" width="140">
										<template slot-scope="scope">
											<span class="btns" @click="deleteRow(scope.$index)">删除</span>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 修改按钮 -->
			<div class="eidt-btn-footer">
				<div class="eidt-btn-footer-box">
					<el-button type="primary" plain @click="handleSave('ruleForm')">保存</el-button>
					<el-button type="primary" plain @click="handleCancel('ruleForm')">取消</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script>
import {
	restrictionName,
	restrictionStarters,
	restrictionMarkups,
	restrictionDefaultStartingPrice,
	restrictionIncreasePrice,
} from 'util/formValidation';
export default {
	name: 'updateShippingTemplate',
	data() {
		return {
			ruleForm: {
				name: '', // 模板名称
				minCount: '', // 起步件数
				increaseCount: '', // 加价件数
				minPrice: '', // 起步价
				increasePrice: '', // 加价
				extension: [], // 地区价格
			},
			rules: {
				name: [
					{
						required: true,
						validator: restrictionName,
						trigger: 'blur',
					},
				],
				minCount: [
					{
						required: true,
						validator: restrictionStarters,
						trigger: 'blur',
					},
				],
				increaseCount: [
					{
						required: true,
						validator: restrictionMarkups,
						trigger: 'blur',
					},
				],
				minPrice: [
					{
						required: true,
						validator: restrictionDefaultStartingPrice,
						trigger: 'blur',
					},
				],
				increasePrice: [
					{
						required: true,
						validator: restrictionIncreasePrice,
						trigger: 'blur',
					},
				],
			},
			isAddData: true, // 新增
		};
	},
	methods: {
		handleSave(formName) {
			if (this.isAddData) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						console.log('新增页面');
					}
				});
			} else {
				this.$refs[formName].validate(valid => {
					if (valid) {
						console.log('编辑页面');
					}
				});
			}
		},
		handleCancel(formName) {
			this.$refs[formName].resetFields();
			this.$closeSelf();
		},
		// 添加地区价格
		addPrice() {
			let obj = {
				spaceName: '', // 省份名称
				spaceCode: '', // 省份code
				minPrice: 0, // 起步价
				increasePrice: 0, // 加价
			};
			this.ruleForm.extension.push(obj);
		},
		// 表格操作
		deleteRow(index) {
			this.ruleForm.extension.splice(index, 1);
		},
		// 表格选择地区
		slectArea(row, index) {
			console.log(row, index);
		},
	},
	created() {
		let id = this.$route.query.id || '';
		if (id) {
			this.isAddData = false;
		} else {
			this.isAddData = true;
		}
	},
};
</script>

<style lang="scss" scoped>
::v-deep.update-shipping-template {
	.box-card {
		margin: 24px 0;
	}
	.el-form-item {
		width: 100%;
		margin-bottom: 36px;
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
	.span-title {
		color: rgba(0, 0, 0, 0.4);
		font-size: 12px;
		line-height: 1.5;
		position: absolute;
	}
	.el-form-item__error {
		line-height: 1.3;
	}
	.province {
		.el-form-item {
			display: flex;
			.el-form-item__content {
				width: 100%;
			}
		}
	}
	.eidt-btn-footer {
		z-index: 1;
		background: #fff;
		padding: 16px 38px;
		box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.2);
		position: fixed;
		bottom: 0;
		left: 264px;
		right: 0;
		.eidt-btn-footer-box {
			text-align: center;
			.el-button--default {
				background: rgba(255, 255, 255, 1);
				border-radius: 4px;
				border: 1px solid rgba(211, 217, 226, 1);
				color: #303336;
				font-size: 14px;
			}
			.el-button--primary {
				background: rgba(56, 131, 248, 1);
				border-radius: 2px;
				color: #fff;
				font-size: 14px;
			}
			button {
				padding: 9px 16px;
			}
		}
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.my-input {
		width: 100% !important;
	}
	.wd {
		width: 60%;
	}
}
</style>

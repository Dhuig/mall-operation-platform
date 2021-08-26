<template>
	<div class="search-header">
		<el-form
			:inline="true"
			:model="formData"
			:rules="formRules"
			ref="formRef"
			label-width="165px"
			label-suffix=":"
			@submit.native.prevent
		>
			<el-row :gutter="24">
				<el-col :span="8" v-for="(item, idx) in config.form" :key="idx" v-show="expand ? true : item.showForever">
					<el-form-item :label="item.label" class="search-header-item" :prop="item.key">
						<!-- 输入框 -->
						<template v-if="item.type === 'input'">
							<el-popover v-if="item.tip" placement="top-start" width="150" trigger="hover" :content="item.tip">
								<i slot="reference" class="el-icon-warning-outline" />
							</el-popover>
							<el-input
								v-model="formData[item.key]"
								:placeholder="item.placeholder"
								:maxlength="item.maxlength"
								show-word-limit
								size="medium"
								:disabled="item.disabled || false"
								:class="[item.tip && 'with-tip-adapt']"
								clearable
							/>
						</template>
						<!-- 下拉框 -->
						<template v-else-if="item.type === 'select'">
							<el-popover v-if="item.tip" placement="top-start" width="150" trigger="hover" :content="item.tip">
								<i slot="reference" class="el-icon-warning-outline" />
							</el-popover>
							<el-select
								v-model="formData[item.key]"
								:placeholder="item.placeholder"
								size="medium"
								:ref="`select${idx}`"
								:class="[item.tip && 'with-tip-adapt']"
								:filterable="item.filterable"
								@visible-change="enterBlur($event, idx)"
								:multiple="item.multiple"
								clearable
							>
								<el-option
									v-for="(option, idx) in item.options"
									:key="idx"
									:value="option.value"
									:label="option.label"
								/>
							</el-select>
						</template>
						<!-- 日期选择器 -->
						<template v-else-if="item.type === 'datePicker'">
							<el-date-picker
								v-if="item.config.type == 'month'"
								v-model="formData[item.key]"
								type="month"
								:value-format="item.config.valueFormat"
								:placeholder="item.config.placeholder"
								:editable="item.config.editable || false"
								:picker-options="item.config.pickerOptions || defaultPickerOptions"
							></el-date-picker>
							<el-date-picker
								v-else
								:type="item.config.type"
								v-model="formData[item.key]"
								:placeholder="item.config.placeholder"
								:range-separator="'~' || item.config.rangeSeparator"
								:start-placeholder="item.config.startPlaceholder || '开始日期'"
								:end-placeholder="item.config.endPlaceholder || '结束日期'"
								:picker-options="item.config.pickerOptions || defaultPickerOptions"
								size="medium"
								:value-format="item.config.valueFormat || 'timestamp'"
								:default-time="item.config.defaultTime"
								:editable="item.config.editable || false"
								@input="handleDateRangeUpdate($event, formData, item.key)"
								clearable
							/>
						</template>
						<template v-else-if="item.type === 'inputrange'">
							<el-input size="medium" v-model="formData[item.key][0]">
								<div slot="append" v-if="item.config && item.config.type === 'ratio'">%</div>
							</el-input>
							-
							<el-input size="medium" v-model="formData[item.key][1]">
								<div slot="append" v-if="item.config && item.config.type === 'ratio'">%</div>
							</el-input>
						</template>
						<!-- 双重input -->
						<template v-else-if="item.type === 'dual'">
							<el-row :gutter="24">
								<el-col :span="8" style="padding-right: 0px">
									<el-select
										v-model="formData[item.key1]"
										:placeholder="item.placeholder1"
										size="medium"
										:ref="`select${idx}`"
										:class="[item.tip && 'with-tip-adapt']"
										clearable
									>
										<el-option
											v-for="(option, idx) in item.key1options"
											:key="idx"
											:value="option.value"
											:label="option.label"
										/>
									</el-select>
								</el-col>
								<el-col :span="16" style="padding-left: 0px">
									<el-input
										v-model="formData[item.key2]"
										:placeholder="item.placeholder2"
										:maxlength="item.maxlength"
										size="medium"
										:class="[item.tip && 'with-tip-adapt']"
										clearable
									/>
								</el-col>
							</el-row>
						</template>
						<template v-else-if="item.slotcontent">
							<slot :name="item.key"></slot>
						</template>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 按钮 -->
			<el-row type="flex" justify="end" align="middle">
				<el-button type="primary" icon="el-icon-search" @click="emitSearch" class="search-button">搜索</el-button>
				<el-button icon="el-icon-refresh-right" @click="emitReset" class="search-button" v-if="showReset">
					重置
				</el-button>
				<template v-if="showExpand">
					<el-button icon="el-icon-top" @click="expand = false" class="search-button" v-if="expand">收起</el-button>
					<el-button icon="el-icon-bottom" @click="expand = true" class="search-button" v-else>展开</el-button>
				</template>
			</el-row>
		</el-form>
	</div>
</template>

<script>
import store from '@/store/index';
import { dateRangePickerGenerator } from 'util';
import { throttle } from 'underscore';

export default {
	name: 'searchPanel',
	props: {
		//查询配置项
		config: Object,
		default: () => {},
		// 是否显示重置按钮
		showReset: {
			type: Boolean,
			default: true,
		},
		// 是否显示 展开/收起 按钮
		showExpand: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			expand: !this.showExpand,
			formEntity: null,
			formData: {}, // 搜索字段
			formRules: {}, // 表达校验
			// 默认的快捷时间范围选择
			defaultPickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
				shortcuts: [
					dateRangePickerGenerator('最近一周', 7),
					dateRangePickerGenerator('最近一个月', 30),
					dateRangePickerGenerator('最近三个月', 90),
					dateRangePickerGenerator('最近半年', 180),
					dateRangePickerGenerator('最近一年', 365),
				],
			},
		};
	},
	created() {
		this.initFormData();
	},
	mounted() {
		this.formEntity = this.$refs.formRef;
	},
	watch: {
		formData: {
			deep: true,
			immediate: true,
			handler(newVal) {
				this.$emit('input', newVal);
			},
		},
	},
	methods: {
		// 初始化数据
		initFormData() {
			let [...dataArr] = this.config.form || [];
			let obj = {};
			dataArr.forEach(item => {
				if (item.type === 'select' && item.bindKey) {
					item.options = store.state.system.options[item.bindKey];
				} else if (item.type === 'inputrange') {
					obj[item.key] = [];
				} else if (item.type === 'dual') {
					// 复合的先不处理value
					return;
				} else {
					obj[item.key] = item.value || null;
				}
			});
			this.formData = Object.assign({}, obj);
			this.$emit('input', this.formData);
			this.formRules = this.config.rules || {};
		},
		// 查询
		emitSearch: throttle(function () {
			this.$refs['formRef'].validate(valid => {
				if (valid) {
					this.$emit('search', Object.assign({}, this.formData));
					return true;
				} else {
					return false;
				}
			});
		}, 500),
		// 清空
		emitReset() {
			this.initFormData();
			this.$refs.formRef && this.$refs.formRef.resetFields();
		},
		// 日期范围选择清空回调 [修正 element datePicker 控件日期清空时,不回显问题]
		handleDateRangeUpdate(value, formData, key) {
			this.$nextTick(() => {
				if (value === null) {
					formData[key] = [undefined, undefined];
				} else {
					formData[key] = value;
				}
			});
		},
		// 选中失焦
		enterBlur(type, index) {
			if (!type) {
				this.$refs[`select${index}`][0].blur();
			}
		},
	},
};
</script>
<style lang="scss">
.search-header {
	padding-top: 5px;
	.search-header-item {
		display: flex;
	}
	.search-header-item.el-form-item {
		width: 100%;
		display: flex;
		flex: 1;
		margin-bottom: 26px;
		.el-form-item__content,
		.el-input,
		.el-select,
		.el-date-editor,
		.el-cascader {
			width: 100%;
		}
		.el-form-item__content {
			display: flex;
			.with-tip-adapt {
				flex: 1;
				margin-left: 8px;
			}
		}
	}
}
</style>

/** * Table表格 */
<template>
	<div class="table_list_fix">
		<!-- 扩展性内容 -->
		<slot name="content_context"></slot>
		<input type="text" :id="copyInputId" readonly :value="copyText" class="copyText" />
		<div :data-clipboard-target="`#${copyInputId}`" ref="copyButton" />
		<!-- table表格 -->
		<el-table
			:border="false"
			size="small"
			v-bind="$attrs"
			:data="dataSource"
			v-loading="loading"
			v-on="tableEvents"
			ref="multipleTable"
			style="width: 100%"
			class="tableList"
			:max-height="$attrs.maxHeight"
			:highlight-current-row="true"
			:show-summary="showSummary"
			:row-key="(options && options.rowKey) || 'null'"
			:summary-method="$attrs['summary-method'] || getSummaries"
			@selection-change="handleSelectionChange"
			@select="handleSelectChange"
      @select-all="handleSelectAllChange"
			:height="(_events.loadMore && height) || height ? height : _events.loadMore ? 500 : null"
			v-table-scroll="loadMoreData"
		>
			<!-- 复选框 -->
			<el-table-column
				:reserve-selection="options.saveSelection"
				type="selection"
				style="width: 55px"
				:selectable="options && options.checked"
				v-if="options && options.selection && (!options.isShow || options.isShow())"
			/>

			<el-table-column
				width="60"
				align="center"
				type="index"
				v-if="options && options.index"
				:label="options && options.labelIndex"
			/>

			<!-- 表格数据 -->
			<template v-for="(column, index) in columns">
				<el-table-column
					:key="index"
					v-bind="column.props"
					:prop="column.prop"
					:label="column.label"
					:fixed="column.fixed"
					:align="column.align"
					:width="column.width"
					:min-width="column.minwidth"
					v-if="!column.slot && (!column.isShow || (column.isShow && column.isShow()))"
				>
					<template slot="header" v-if="column.headerConfig">
						<div class="bottom-border">{{ column.headerConfig.topTips }}</div>
						<div>{{ column.label }}</div>
					</template>
					<template slot-scope="scope">
						<template v-if="!column.render">
							<template v-if="column.formatter">
								<span
									v-html="column.formatter(scope.row, column, scope.$index)"
									@click="column.click && column.click(scope.row, scope.$index)"
									@dblclick="handleDbClick(column.formatter(scope.row))"
								></span>
							</template>
							<!-- <template v-else-if="column.newjump">
								<router-link
									class="newjump"
									v-bind="{ target: '_blank', ...column.target }"
									:to="column.newjump(scope.row, column, scope.$index)"
									>{{ scope.row[column.prop] || column.content }}</router-link
								>
							</template> -->
							<template v-else>
								<span
									:style="column.click ? 'color: #409EFF; cursor: pointer;' : null"
									@click="column.click && column.click(scope.row, scope.$index)"
									@dblclick="handleDbClick(scope.row[column.prop])"
								>
									{{ scope.row[column.prop] === 0 ? scope.row[column.prop] : '' }}
									{{ scope.row[column.prop] || column.content }}
									{{ `${scope.row[column.prop] && column.unit ? column.unit : ''}` }}
								</span>
							</template>
						</template>
						<template v-else>
							<render :column="column" :row="scope.row" :render="column.render" :index="index"></render>
						</template>
					</template>
				</el-table-column>
				<el-table-column
					:label="column.label"
					:width="column.width"
					:align="column.align"
					:key="index"
					v-if="column.slot"
				>
					<template slot-scope="scope">
						<slot :name="column.slot" :row="scope.row"></slot>
					</template>
				</el-table-column>
			</template>

			<!-- 操作按钮 -->
			<el-table-column
				:label="(options && options.operatesText) || '操作'"
				align="center"
				:fixed="(options && options.operateFixed) || 'right'"
				v-bind="options && options.props"
				:width="(options && options.operateCycleWidth) || 220"
				v-if="operates && operates.length > 0"
			>
				<template slot-scope="scope">
					<div class="operate-group">
						<template v-for="(btn, key) in operates">
							<span
								:key="key"
								style="margin-right: 18px"
								v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))"
							>
								<template>
									<el-button
										:size="btn.size || 'small'"
										:type="btn.type || `text`"
										:icon="btn.icon"
										:plain="btn.plain"
										:disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
										@click.native.prevent="btn.method(scope.row, scope.$index)"
									>
										{{ btn.title }}{{ operates.length >= 2 ? '&nbsp;&nbsp;' : '' }}
									</el-button>
								</template>
							</span>
						</template>
					</div>
				</template>
			</el-table-column>

			<!-- slot插槽按钮 -->
			<el-table-column
				:label="(options && options.slotcontentText) || '操作'"
				align="center"
				fixed="right"
				:width="(options && options.operatesWidth) || 220"
				v-if="slotcontent"
			>
				<template slot-scope="scope">
					<slot :data="scope.row" :index="scope.$index" />
				</template>
			</el-table-column>
		</el-table>
		<br />
		<!-- 分页部分 -->
		<el-pagination
			background
			class="pagination"
			v-if="pagination && !_events.loadMore"
			:total="dataTotal"
			:current-page.sync="pagination.currentPage"
			:page-size="pagination.pageSize"
			@current-change="handleChangePage"
			@size-change="handleSizeChange"
			layout="sizes, total , prev, pager, next, jumper"
		/>
		<!-- <div class="bottom-left">
			<slot name="bottom_left_btn"></slot>
		</div> -->
	</div>
</template>

<script>
import Clipboard from 'clipboard';
import { generateRandomCode } from '@/util';

export default {
	name: 'tableList',
	props: {
		dataSource: {
			// 数据源
			type: Array,
			default: () => [],
		},
		columns: {
			// 表头
			type: Array,
			default: () => [],
		},
		loading: {
			// 加载
			type: Boolean,
			default: false,
		},
		pagination: {
			// 分页
			type: Object,
			default: null,
		},
		dataTotal: {
			// 总数
			type: Number,
			default: 0,
		},
		options: {
			type: Object,
			default: () => {},
		}, // 多选框配置
		slotcontent: {
			// 插槽
			type: Boolean,
			default: false,
		},
		operates: {
			// 操作栏配置
			type: Array,
		},
		tableEvents: Object, // Table Events
		showSummary: {
			type: Boolean,
			default: false,
		},
		mode: {
			type: String,
			default: 'scroll',
		},
		height: {
			type: Number,
		},
	},
	data() {
		return {
			multipleSelection: [],
			// visible: false,
			clipboard: null,
			copyInputId: generateRandomCode(),
			copyText: '',
		};
	},
	watch: {
		$route() {
			this.upDataLayout();
		},
		dataSource: {
			deep: true,
			handler() {
				this.upDataLayout();
			},
		},
	},
	methods: {
		handleDbClick(val) {
			this.copyText = val;
			this.$nextTick(() => {
				this.$refs.copyButton.click();
			});
		},
		// 加载更多
		loadMoreData() {
			this.$emit('loadMore');
		},
		// 切换表格组件交互模式
		// toggleDataLoadMode() {},
		// 复选框选中项
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.$emit('handleSelectionChange', Array.from(val));
		},
    // 手动勾选全选 Checkbox 时触发的事件
    handleSelectAllChange(val){
			this.$emit('handleSelectAllChange', Array.from(val));
    },
    // 手动勾选数据行的 Checkbox 时触发的事件
    handleSelectChange(val,row){
			this.$emit('handleSelectChange', Array.from(val),row);
    },
		// 改变分页触发事件
		handleChangePage(val) {
			this.$emit('handleChangePage', val);
		},
		// 改变每页多少条下拉触发事件
		handleSizeChange(val) {
			this.$emit('handleSizeChange', val);
		},
		// 取消操作
		// onCancel() {
		// 	this.visible = false;
		// },
		// 确定操作
		// onConfirm() {
		// 	this.visible = false;
		// },
		getSummaries(param) {
			const { columns, data } = param;
			const COLUMNS_CONFIG = this.columns;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				if (COLUMNS_CONFIG.some(col => col.prop == column.property && col.summary)) {
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return (prev * 10 + curr * 10) / 10;
							} else {
								return prev;
							}
						}, 0);
						const currentCol = COLUMNS_CONFIG.filter(item => item.prop == column.property)[0];
						if (currentCol && currentCol.sumConfig && currentCol.sumConfig.type === 'money') {
							sums[index] = '￥' + sums[index];
						}
						if (currentCol && currentCol.sumConfig && currentCol.sumConfig.type === 'moneyFixed') {
							sums[index] = '￥' + sums[index].toFixed(2);
						}
					} else {
						sums[index] = '';
					}
				} else {
					sums[index] = '';
				}
			});
			this.$nextTick(() => {
				this.$refs.multipleTable.doLayout();
			});
			return sums;
		},
		upDataLayout() {
			this.$nextTick(() => {
				this.$refs.multipleTable.doLayout();
			});
		},
	},
	mounted() {
		// 初始化触发toggleRowSelection事件
		this.$nextTick(() => {
			this.$emit('toggleRowSelection', this.$refs.multipleTable);
		});
		this.clipboard = new Clipboard(this.$refs.copyButton);
		this.clipboard.on('success', () => this.$message({ type: 'success', duration: 1500, message: '内容已复制' }));
		this.clipboard.on('error', e => {
			this.$message({ type: 'warning', duration: 1500, message: '复制功能暂不可用' });
			console.error('copy error:', e);
		});
	},
	components: {
		render: {
			functional: true,
			props: {
				row: Object,
				render: Function,
				index: Number,
				column: {
					type: Object,
					default: null,
				},
			},
			render: (h, opt) => {
				const params = {
					row: opt.props.row,
					index: opt.props.index,
				};
				if (opt.props.column) params.column = opt.props.column;
				return opt.props.render(h, params);
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.table_list_fix {
	overflow: hidden;
	.btn-operates {
		margin-bottom: 6px;
		a {
			color: #fff;
			text-decoration: none;
			display: inline-block;
		}
	}
}
.table-header {
	padding-top: 10px;
	.table-header_button {
		text-align: right;
		float: right;
		margin-bottom: 12px;
		line-height: 40px;
	}
}
.newjump {
	text-decoration: none;
	color: dodgerblue;
}
::v-deep.pagination {
	text-align: right;
}
.bottom-left {
	position: absolute;
	bottom: -15px;
	left: 20px;
}
.copyText {
	position: absolute;
	left: 0;
	top: 0;
	height: 0;
	border: none;
	opacity: 0;
}
.tableList {
	height: 500;
}
</style>

<template>
	<div>
		<div class="page" v-for="(page, pageIndex) in pages" :key="pageIndex">
			<div class="page-body">
				<div class="page-content">
					<div v-if="pageIndex === 0" class="page-title">{{ title }}</div>
					<div v-if="pageIndex === 0" class="header" :style="`height:${headerHeight}mm;`">
						<slot name="header" :data="{ index: pageIndex, length: pages.length }" />
					</div>
					<div v-if="pageIndex > 0" class="page-sub-title" :style="`height:${subTitleHeight}mm;`">
						<slot name="sub-title" :data="{ index: pageIndex, length: pages.length }" />
					</div>
					<div v-if="page.length" class="page-table">
						<div class="th-row">
							<div
								v-for="(item, index) in tableHead"
								:key="item.key"
								:class="index === tableHead.length - 1 ? 'th-div last-th-div' : 'th-div'"
								:style="`${item.width ? `width:${item.width}` : 'flex: 1'};${
									item.textAlign ? `text-align:${item.textAlign}` : ''
								}`"
							>
								{{ item.label }}
							</div>
						</div>
						<div
							v-for="(tr, index) in page"
							:key="index"
							:class="index === page.length - 1 ? 'td-row last-row' : 'td-row'"
						>
							<div
								v-for="(td, tdIndex) in tableHead"
								:key="td.key"
								:class="tdIndex === tableHead.length - 1 ? 'td-div last-td-div' : 'td-div'"
								:style="`${td.width ? `width:${td.width}` : 'flex: 1'};${
									td.textAlign ? `text-align:${td.textAlign}` : ''
								}`"
							>
								{{ tr[td.key] }}
							</div>
						</div>
					</div>
					<slot
						v-if="page.length && pageIndex + 1 < pages.length"
						name="page-count"
						:data="{ list: page, index: pageIndex }"
					/>
				</div>
				<div v-if="pageIndex + 1 === pages.length" class="page-sign" :style="`height:${signHeight}mm;`">
					<slot name="sign" :data="{ list: page, index: pageIndex }" />
				</div>
			</div>
			<!-- <div class="page-footer" style="display: none">
				<span>第{{ pageIndex + 1 }}页</span><span>共{{ pages.length }}页</span>
			</div> -->
		</div>
	</div>
</template>
<script>
export default {
	name: 'print',
	props: {
		title: {
			type: String,
			default: '',
		},
		subTitleHeight: {
			type: Number,
			default: 0,
		},
		headerHeight: {
			type: Number,
			default: 0,
		},
		signHeight: {
			type: Number,
			default: 0,
		},
		tableHead: {
			type: Array,
			default: () => [],
		},
		tableData: {
			type: Array,
			default: () => [],
		},
	},
	components: {},
	data() {
		return {
			pageHeight: 210,
			pageFootHeight: 0,
			pageTitleHeight: 5,
			tableMarginTop: 0,
			trHeight: 6,
			pages: [],
		};
	},
	computed: {},
	watch: {
		tableData() {
			this.pages = [];
			this.init();
		},
		headerHeight() {
			this.pages = [];
			this.init();
		},
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			let firstRows = this.getFirstTableRows(false);
			const pageRows = this.getPageTablesRows(false);
			let list = this.tableData.map(item => item);
			const length = list.length;
			let flag = true;
			if (length >= firstRows) {
				firstRows = this.getFirstTableRows(true);
			} else {
				flag = false;
			}
			this.pages.push(list.filter((item, index) => index < firstRows));
			list = list.filter((item, index) => index >= firstRows);
			while (flag) {
				this.pages.push(list.filter((item, index) => index < pageRows));
				list = list.filter((item, index) => index >= pageRows);
				flag = !!list.length;
			}
			this.checkPageHeight();
			this.$nextTick(() => {
				this.$emit('onPrint', this.headerHeight);
			});
		},
		checkPageHeight() {
			const { pages } = this;
			const length = pages.length;
			if (length < 2) {
				this.checkFirstPage();
			} else {
				this.checkLastPage();
			}
		},
		checkFirstPage() {
			const firstRows = this.pages[0].length;
			const rows = this.getFirstTableRows();
			const maxRows = Math.floor((rows * this.trHeight - this.headerHeight) / this.trHeight);
			if (firstRows <= maxRows) {
				this.pages = [this.pages[0]];
			}
		},
		checkLastPage() {
			const length = this.pages.length;
			const lastRows = this.pages[length - 1].length;
			const rows = this.getPageTablesRows(true);
			if (lastRows > rows) {
				this.pages.push([]);
			}
		},
		getFirstTableRows(morePages) {
			const { pageHeight, headerHeight, signHeight, pageFootHeight, pageTitleHeight, tableMarginTop } = this;
			let tableHeight = pageHeight - headerHeight - pageFootHeight - signHeight - pageTitleHeight - tableMarginTop;
			if (morePages) {
				tableHeight = tableHeight + signHeight;
			}
			return Math.floor(tableHeight / this.trHeight) - (morePages ? 2 : 1);
		},
		getPageTablesRows(noMore) {
			const { pageHeight, signHeight, pageFootHeight, tableMarginTop, subTitleHeight } = this;
			let tableHeight = pageHeight - pageFootHeight - tableMarginTop - subTitleHeight;
			if (noMore) {
				tableHeight = tableHeight - signHeight;
			}
			let rows = Math.floor(tableHeight / this.trHeight) - (noMore ? 1 : 2);
			return rows;
		},
	},
};
</script>

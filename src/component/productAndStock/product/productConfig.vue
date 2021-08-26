<template>
	<div>
		<guideBar />
		<el-card>
			<el-tabs v-model="activeTab">
				<!-- 前端分类管理 -->
				<el-tab-pane label="前端分类管理" name="show">
					<el-row>
						<el-col :span="8">
							<el-row type="flex" justify="start" class="row-gap">
								<el-button
									type="plain"
									size="mini"
									:disabled="!show.form.id"
									@click="updateConfigMenuPosition(show.form.id, 'up')"
									v-permission="'product_config_show_up'"
								>
									上移
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!show.form.id"
									@click="updateConfigMenuPosition(show.form.id, 'down')"
									v-permission="'product_config_show_down'"
								>
									下移
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!show.form.id"
									@click="updateConfigMenuPosition(show.form.id, 'top')"
									v-permission="'product_config_show_top'"
								>
									置顶
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!show.form.id"
									@click="updateConfigMenuPosition(show.form.id, 'bottom')"
									v-permission="'product_config_show_bottom'"
								>
									置底
								</el-button>
								<el-button type="plain" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
							</el-row>
							<el-tree
								node-key="id"
								highlight-current
								:props="menuConfig"
								class="label-tree"
								@node-click="editMenu"
								:default-expanded-keys="[show.menu[0]['id']]"
								:data="show.menu"
							>
								<span slot-scope="{ node, data }">
									<span class="tree-label">{{ node.label }}</span>
									<el-button
										type="text"
										size="mini"
										v-permission="'product_config_show_create'"
										@click.stop="addMenu(data)"
									>
										新增
									</el-button>
								</span>
							</el-tree>
						</el-col>
						<el-col :span="15" :offset="1" v-if="show.mode">
							<h4 class="row-gap">{{ show.mode === 'edit' ? '编辑' : '新建' }}前端分类</h4>
							<el-form :model="show.form" label-width="80px" label-position="right" label-suffix=":">
								<el-form-item label="品牌名称">
									<el-input v-model="show.form.title" class="config-input" />
								</el-form-item>
								<el-form-item label="上传图片">
									<el-upload
										:action="$store.getters['system/getOssUploadUrl']"
										:headers="$store.getters['system/getSignatureVerification']"
										:data="uploadData"
										:limit="1"
										list-type="picture-card"
										:on-preview="handlePictureCardPreview"
										:on-remove="handleRemove"
										:on-success="handleSuccess"
										:file-list="imageList"
										:class="imageList.length === 1 ? 'hide_box' : ''"
									>
										<i class="el-icon-plus" />
									</el-upload>
								</el-form-item>
								<el-form-item label="描述">
									<el-input v-model="show.form.remarks" class="config-input" />
								</el-form-item>
								<el-form-item label="状态">
									<el-radio-group v-model="show.form.cfgStatus" v-permission="'product_config_show_toggle_state'">
										<el-radio :label="1">启用</el-radio>
										<el-radio :label="0">禁用</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item>
									<el-button @click="cancelUpdateMenu">取消</el-button>
									<el-button type="success" @click="updateMenu" v-if="show.mode === 'edit'">更新</el-button>
									<el-button type="primary" @click="saveMenu" v-if="show.mode === 'add'">保存</el-button>
								</el-form-item>
							</el-form>
							<el-divider>前端分类关联产品</el-divider>
							<div>
								<searchPanel
									v-model="searchConfig"
									:config="RELATIVE_CATELOG"
									class="row-gap"
									@search="resetLoad('relative')"
								/>
								<el-row type="flex" justify="end" class="row-gap">
									<el-button type="primary" v-permission="'product_config_show_do_relative'" @click="bindProducts">
										关联产品
									</el-button>
									<el-button v-permission="'product_config_show_cancel_relative'" @click="unBindProducts">
										取消关联
									</el-button>
								</el-row>
								<tableList
									:options="relative.options"
									:dataSource="relative.data"
									:loading="relative.loading"
									:columns="RELATIVE_COLUMNS"
									:pagination="relative.pagination"
									@loadMore="loadMore('relative')"
									:height="430"
									@handleSelectionChange="handleSelectionChange"
									:dataTotal="relative.total"
								/>
							</div>
						</el-col>
					</el-row>
				</el-tab-pane>
				<!-- 产品类型 -->
				<el-tab-pane label="产品类型" name="catalog">
					<el-row>
						<el-col :span="8">
							<el-row type="flex" justify="start" class="row-gap">
								<el-button
									type="plain"
									size="mini"
									:disabled="!catalog.form.id"
									@click="updateConfigMenuPosition(catalog.form.id, 'up')"
									v-permission="'product_config_catalog_up'"
								>
									上移
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!catalog.form.id"
									@click="updateConfigMenuPosition(catalog.form.id, 'down')"
									v-permission="'product_config_catalog_down'"
								>
									下移
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!catalog.form.id"
									@click="updateConfigMenuPosition(catalog.form.id, 'top')"
									v-permission="'product_config_catalog_top'"
								>
									置顶
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!catalog.form.id"
									@click="updateConfigMenuPosition(catalog.form.id, 'bottom')"
									v-permission="'product_config_catalog_bottom'"
								>
									置底
								</el-button>
								<el-button type="plain" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
							</el-row>
							<el-tree
								node-key="id"
								highlight-current
								:props="menuConfig"
								class="label-tree"
								@node-click="editMenu"
								check-on-click-node
								:default-expanded-keys="[catalog.menu[0]['id']]"
								:data="catalog.menu"
							>
								<span slot-scope="{ node, data }">
									<span class="tree-label">{{ node.label }}</span>
									<el-button
										type="text"
										size="mini"
										v-permission="'product_config_catalog_create'"
										@click.stop="addMenu(data)"
									>
										新增
									</el-button>
								</span>
							</el-tree>
						</el-col>
						<el-col :span="11" :offset="1" v-if="catalog.mode">
							<h4 class="row-gap">{{ catalog.mode === 'edit' ? '编辑' : '新建' }}产品类型</h4>
							<el-form :model="catalog.form" label-width="80px" label-position="right" label-suffix=":" size="mini">
								<el-form-item label="品牌名称">
									<el-input v-model="catalog.form.title" />
								</el-form-item>
								<el-form-item label="描述">
									<el-input type="textarea" v-model="catalog.form.remarks" />
								</el-form-item>
								<el-form-item label="状态">
									<el-radio-group v-model="catalog.form.cfgStatus" v-permission="'product_config_catalog_toggle_state'">
										<el-radio :label="1">启用</el-radio>
										<el-radio :label="0">禁用</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item>
									<el-button @click="cancelUpdateMenu">取消</el-button>
									<el-button type="success" @click="updateMenu" v-if="catalog.mode === 'edit'">更新</el-button>
									<el-button type="primary" @click="saveMenu" v-if="catalog.mode === 'add'">保存</el-button>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-tab-pane>
				<!-- 销售主体 -->
				<el-tab-pane label="销售主体" name="company">
					<el-row>
						<el-col :span="8">
							<el-button
								v-permission="'product_config_company_add'"
								type="plain"
								size="mini"
								icon="el-icon-refresh"
								@click="refresh"
							>
								刷新
							</el-button>
							<el-button type="plain" size="mini" icon="el-icon-plus" @click="addMenu(company.menu[0])">新增</el-button>
							<el-tree
								node-key="id"
								highlight-current
								:props="menuConfig"
								class="label-tree"
								@node-click="editMenu"
								check-on-click-node
								:default-expanded-keys="[company.menu[0]['id']]"
								:data="company.menu"
							/>
						</el-col>
						<el-col :span="11" :offset="1" v-if="company.mode">
							<h4 class="row-gap">{{ company.mode === 'edit' ? '编辑' : '新建' }}销售主体</h4>
							<el-form :model="company.form" label-width="80px" label-position="right" label-suffix=":" size="small">
								<el-form-item label="销售主体">
									<el-input v-model="company.form.title" />
								</el-form-item>
								<el-form-item label="描述">
									<el-input type="textarea" v-model="company.form.remarks" />
								</el-form-item>
								<el-form-item label="状态">
									<el-radio-group v-model="company.form.cfgStatus" v-permission="'product_config_company_toggle_state'">
										<el-radio :label="1">启用</el-radio>
										<el-radio :label="0">禁用</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item>
									<el-button @click="cancelUpdateMenu">取消</el-button>
									<el-button type="success" @click="updateMenu" v-if="company.mode === 'edit'">更新</el-button>
									<el-button type="primary" @click="saveMenu" v-if="company.mode === 'add'">保存</el-button>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-tab-pane>
				<!-- 产品品牌 -->
				<el-tab-pane label="产品品牌" name="brand">
					<el-row>
						<el-col :span="8">
							<el-row type="flex" justify="start" class="row-gap">
								<el-button
									type="plain"
									size="mini"
									:disabled="!brand.form.id"
									@click="updateConfigMenuPosition(brand.form.id, 'up')"
									v-permission="'product_config_brand_up'"
								>
									上移
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!brand.form.id"
									@click="updateConfigMenuPosition(brand.form.id, 'down')"
									v-permission="'product_config_brand_down'"
								>
									下移
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!brand.form.id"
									@click="updateConfigMenuPosition(brand.form.id, 'top')"
									v-permission="'product_config_brand_top'"
								>
									置顶
								</el-button>
								<el-button
									type="plain"
									size="mini"
									:disabled="!brand.form.id"
									@click="updateConfigMenuPosition(brand.form.id, 'bottom')"
									v-permission="'product_config_brand_bottom'"
								>
									置底
								</el-button>
								<el-button type="plain" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
								<el-button
									v-permission="'product_config_brand_add'"
									type="plain"
									size="mini"
									icon="el-icon-plus"
									@click="addMenu(brand.menu[0])"
								>
									新增
								</el-button>
							</el-row>
							<el-tree
								node-key="id"
								highlight-current
								:props="menuConfig"
								class="label-tree"
								@node-click="editMenu"
								check-on-click-node
								:default-expanded-keys="[brand.menu[0]['id']]"
								:data="brand.menu"
							/>
						</el-col>
						<el-col :span="11" :offset="1" v-if="brand.mode">
							<h4 class="row-gap">{{ brand.mode === 'edit' ? '编辑' : '新建' }}产品品牌</h4>
							<el-form :model="brand.form" label-width="80px" label-position="right" label-suffix=":" size="small">
								<el-form-item label="品牌名称">
									<el-input v-model="brand.form.title" />
								</el-form-item>
								<el-form-item label="描述">
									<el-input type="textarea" v-model="brand.form.remarks" />
								</el-form-item>
								<el-form-item label="状态">
									<el-radio-group v-model="brand.form.cfgStatus" v-permission="'product_config_brand_toggle_state'">
										<el-radio :label="1">启用</el-radio>
										<el-radio :label="0">禁用</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item>
									<el-button @click="cancelUpdateMenu">取消</el-button>
									<el-button type="success" @click="updateMenu" v-if="brand.mode === 'edit'">更新</el-button>
									<el-button type="primary" @click="saveMenu" v-if="brand.mode === 'add'">保存</el-button>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-tab-pane>
				<!-- 产品标签 -->
				<el-tab-pane label="产品标签" name="tag">
					<el-row>
						<el-col :span="8">
							<el-button type="plain" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
							<el-button
								v-permission="'product_config_tag_add'"
								type="plain"
								size="mini"
								icon="el-icon-plus"
								@click="addMenu(tag.menu[0])"
							>
								新增
							</el-button>
							<el-tree
								node-key="id"
								highlight-current
								:props="menuConfig"
								class="label-tree"
								@node-click="editMenu"
								check-on-click-node
								:default-expanded-keys="[tag.menu[0]['id']]"
								:data="tag.menu"
							/>
						</el-col>
						<el-col :span="11" :offset="1" v-if="tag.mode">
							<h4 class="row-gap">{{ tag.mode === 'edit' ? '编辑' : '新建' }}产品标签</h4>
							<el-form :model="tag.form" label-width="80px" label-position="right" label-suffix=":" size="small">
								<el-form-item label="活动名称">
									<el-input v-model="tag.form.title" />
								</el-form-item>
								<el-form-item label="描述">
									<el-input type="textarea" v-model="tag.form.remarks" />
								</el-form-item>
								<el-form-item label="状态">
									<el-radio-group v-model="tag.form.cfgStatus" v-permission="'product_config_tag_toggle_state'">
										<el-radio :label="1">启用</el-radio>
										<el-radio :label="0">禁用</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item>
									<el-button @click="cancelUpdateMenu">取消</el-button>
									<el-button type="success" @click="updateMenu" v-if="tag.mode === 'edit'">更新</el-button>
									<el-button type="primary" @click="saveMenu" v-if="tag.mode === 'add'">保存</el-button>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
				</el-tab-pane>
				<!-- 价格参数 -->
				<el-tab-pane label="价格参数" name="price">
					<h4 class="price-title">押货价格参数设置</h4>
					<el-row type="flex" justify="center" align="middle">
						<label class="price-label">押货价 = 零售价 &divide;</label>
						<el-input
							type="number"
							size="small"
							v-model.number="price.productParam"
							min="0"
							placeholder="押货价参数"
							class="price-input"
							clearable
						/>
						<el-alert title="押货价格四舍五入取整数" type="info" show-icon :closable="false" class="price-tips" />
					</el-row>
					<h4 class="price-title">单位团购价格参数设置</h4>
					<el-row type="flex" justify="center" align="middle">
						<label class="price-label">单位团购价 = 零售价 *</label>
						<el-input
							type="number"
							size="small"
							min="0"
							v-model.number="price.groupParam"
							placeholder="单位团购价参数"
							class="price-input"
							clearable
						/>
						<el-alert title="单位团购价四舍五入取整数" type="info" show-icon :closable="false" class="price-tips" />
					</el-row>
					<h4 class="price-title">展业包价格参数设置</h4>
					<el-row type="flex" justify="center" align="middle">
						<label class="price-label">展业包价格 = 零售价 *</label>
						<el-input
							type="number"
							size="small"
							min="0"
							v-model.number="price.orderParam"
							placeholder="展业包价格参数"
							class="price-input"
							clearable
						/>
						<el-alert title="展业包价四舍五入取整数" type="info" show-icon :closable="false" class="price-tips" />
					</el-row>
					<el-row type="flex" justify="center" align="middle" class="update-price-row">
						<el-button size="small" @click="cancelPriceChange">取消</el-button>
						<el-button
							v-permission="'product_config_price_save'"
							type="primary"
							size="small"
							@click="updatePriceParams"
						>
							保存
						</el-button>
					</el-row>
					<el-divider />
					<h4 class="price-title">分公司产品价格参数设置</h4>
					<el-button
						v-permission="'product_config_add_branch_price_params'"
						type="primary"
						size="small"
						@click="addBranchPriceParams"
						icon="el-icon-plus"
					>
						新增
					</el-button>
					<el-table :data="branchCompnayPriceParams">
						<el-table-column prop="priceCatalogTitle" label="所属类别">
							<template slot-scope="scope">
								<el-input
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 4 }"
									size="small"
									v-model="scope.row.priceCatalogTitle"
									resize="none"
									clearable
								/>
							</template>
						</el-table-column>
						<el-table-column prop="beijingCompanyParam" label="北京分公司售价比例">
							<template slot-scope="scope">
								<el-input
									size="small"
									v-model="scope.row.beijingCompanyParam"
									@blur="priceParamsBlur($event, scope.row, 'beijingCompanyParam')"
									clearable
								/>
							</template>
						</el-table-column>
						<el-table-column prop="otherCompanyParam" label="除北京分公司外售价比例">
							<template slot-scope="scope">
								<el-input
									size="small"
									v-model="scope.row.otherCompanyParam"
									@blur="priceParamsBlur($event, scope.row, 'otherCompanyParam')"
									clearable
								/>
							</template>
						</el-table-column>
						<el-table-column prop="secondCompanyParam" label="二级分公司售价比例">
							<template slot-scope="scope">
								<el-input
									size="small"
									v-model="scope.row.secondCompanyParam"
									@blur="priceParamsBlur($event, scope.row, 'secondCompanyParam')"
									clearable
								/>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button
									v-permission="'product_config_delete_branch_price_params'"
									type="text"
									@click="removeBranchPriceParams(scope.row.id, scope.$index)"
								>
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-row type="flex" justify="center" align="middle" class="update-price-row">
						<el-button
							v-permission="'product_config_save_branch_price_params'"
							type="primary"
							size="small"
							@click="updateBranchPriceParams"
						>
							保存
						</el-button>
					</el-row>
				</el-tab-pane>
				<!-- 产品属性 -->
				<el-tab-pane label="产品属性" name="property">
					<el-button
						v-permission="'product_config_property_add'"
						type="plain"
						@click="addNewProperty"
						icon="el-icon-plus"
						size="mini"
					>
						新增属性
					</el-button>
					<el-button type="plain" @click="resetLoad('property')" icon="el-icon-refresh" size="mini">刷新</el-button>
					<tableList
						:loading="property.loading"
						:dataSource="property.data"
						:columns="PRODUCT_CONFIG_COLUMNS"
						:pagination="property.pagination"
						:height="430"
						@loadMore="loadMore('property')"
						:dataTotal="property.total"
						slotcontent
					>
						<template slot-scope="scope">
							<el-button v-permission="'product_config_property_edit'" type="text" @click="editProperty(scope.data)">
								编辑
							</el-button>
							<el-button
								v-permission="'product_config_property_delete'"
								type="text"
								@click="deleteGoodsProperty(scope.data.id)"
							>
								删除
							</el-button>
						</template>
					</tableList>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 新建/编辑属性 对话框 -->
		<el-dialog
			:title="`${property.modal.id ? '编辑' : '新建'}属性`"
			:visible.sync="property.modal.show"
			width="40%"
			v-drag
		>
			<el-row>
				<el-col :span="24">
					<span class="row-label">属性名称:</span>
					<el-input v-model="property.modal.name" placeholder="属性名称" class="row-input" size="small" />
				</el-col>
				<el-col :span="24">
					<span class="row-label">属性类型:</span>
					<el-select v-model="property.modal.type" placeholder="属性类型" class="row-input" size="small">
						<el-option
							v-for="({ label, value }, $idx) in PROPERTY_TYPE_OPTIONS"
							:key="$idx"
							:label="label"
							:value="value"
						/>
					</el-select>
				</el-col>
				<el-col :span="24" v-if="property.modal.type !== 1">
					<el-row type="flex" justify="end">
						<el-button
							type="primary"
							icon="el-icon-plus"
							@click="insertProperty"
							class="row-gap"
							size="small"
							:disabled="property.modal.type == 2 && property.modal.value.length === 1"
						>
							新增属性
						</el-button>
					</el-row>
				</el-col>
				<el-col :span="24" v-if="property.modal.type !== 1">
					<span class="row-label">属性值:</span>
					<el-row type="flex" justify="start" class="row-input">
						<el-col v-for="(item, $idx) in property.modal.value" :key="$idx">
							<el-input
								v-model="property.modal.value[$idx]"
								placeholder="请输入属性值"
								class="prop-input"
								size="small"
								:data-val="item"
							/>
							<el-button type="danger" icon="el-icon-delete" @click="removeProperty($idx)" />
						</el-col>
					</el-row>
				</el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click.stop="togglePropertyModalSHow(false)" size="small">取 消</el-button>
				<el-button
					type="success"
					@click.stop="saveAddProperty"
					size="small"
					v-if="property.modal.id"
					:disabled="!property.modal.name"
				>
					更新
				</el-button>
				<el-button type="primary" @click.stop="saveAddProperty" size="small" v-else :disabled="!property.modal.name">
					保存
				</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="imgPreview.show" v-drag>
			<img width="100%" :src="imgPreview.url" />
		</el-dialog>
	</div>
</template>

<script>
import { optionGenerator } from 'util';
import { loadPriceParams, loadProductsConfig, loadProductsAttrbute } from '@/service';
import { PROPERTY_TYPE, PRODUCT_CONFIG_COLUMNS, RELATIVE_CATELOG, RELATIVE_COLUMNS } from './config';
import qs from 'querystring';

const validateOptionFilter = ({ cfgStatus }) => cfgStatus === 1;
const optionGenerator2 = ({ title: label, id: value }) => ({ label, value });

export default {
	name: 'productConfig',
	data() {
		return {
			RELATIVE_CATELOG,
			RELATIVE_COLUMNS,
			PROPERTY_TYPE_OPTIONS: optionGenerator(PROPERTY_TYPE),
			PRODUCT_CONFIG_COLUMNS,
			imageList: [],
			menuConfig: {
				label: 'title',
				children: 'childList',
			},
			uploadData: {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.cms,
			},
			imgPreview: {
				show: false,
				url: '',
			},
			searchConfig: {
				catalogId: '',
				showId: '',
				title: '',
			},
			relative: {
				options: {
					index: false,
					selection: true,
				},
				bindList: [],
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				total: 0,
				loading: false,
			},
			activeTab: 'show',
			show: {
				mode: '',
				menu: [{ id: '' }],
				form: {
					id: '',
					title: '',
					picUrl: '',
					remarks: '',
					cfgStatus: '',
				},
			},
			catalog: {
				mode: '',
				menu: [{ id: '' }],
				form: {
					id: '',
					title: '',
					remarks: '',
					cfgStatus: '',
				},
			},
			company: {
				mode: '',
				menu: [{ id: '' }],
				form: {
					id: '',
					title: '',
					remarks: '',
					cfgStatus: '',
				},
			},
			brand: {
				mode: '',
				menu: [{ id: '' }],
				form: {
					id: '',
					title: '',
					remarks: '',
					cfgStatus: '',
				},
			},
			tag: {
				mode: '',
				menu: [{ id: '' }],
				form: {
					id: '',
					title: '',
					remarks: '',
					cfgStatus: '',
				},
			},
			// price: {
			// 	productParam: 0,
			// 	orderParam: 0,
			// 	groupParam: 0,
			// },
			branchCompnayPriceParams: [],
			property: {
				loading: false,
				data: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				modal: {
					show: false,
					id: '',
					name: '',
					type: '',
					value: '',
				},
			},
		};
	},
	computed: {
		price: vm => vm.$store.getters['system/getPriceParams'],
	},
	watch: {
		activeTab: {
			immediate: true,
			handler(activeTab) {
				if ('price' === activeTab) {
					loadPriceParams();
					this.loadBranchCompanyPriceParams();
					return;
				}
				if ('property' === activeTab) return this.resetLoad('property');
				const { menu } = this[activeTab];
				if (menu && menu[0].id && menu[0].childList.length > 1) return;
				this.$nextTick(() => {
					this.loadConfigMenu(activeTab);
				});
			},
		},
		'price.productParam': function (newValue) {
			this.price.productParam = newValue > 0 ? newValue : 0;
		},
		'price.groupParam': function (newValue) {
			this.price.groupParam = newValue > 0 ? newValue : 0;
		},
		'price.orderParam': function (newValue) {
			this.price.orderParam = newValue > 0 ? newValue : 0;
		},
	},
	methods: {
		// 下拉刷新
		loadMore(type) {
			let { currentPage, pageSize } = this[type].pagination;
			if (currentPage * pageSize >= this[type].total) {
				return this.$message.warning('没有更多数据');
			}
			this[type].pagination.currentPage++;
			type == 'relative' ? this.loadRelativeGoods() : this.loadGoodsProperties();
		},
		// 重置刷新
		resetLoad(type) {
			this[type].pagination.currentPage = 1;
			this[type].data = [];
			type == 'relative' ? this.loadRelativeGoods() : this.loadGoodsProperties();
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.imgPreview = {
				show: true,
				url: file.url || '',
			};
		},
		// 删除成功的回调
		handleRemove(file, fileList) {
			this.show.form.picUrl = '';
			this.imageList = fileList;
		},
		// 上传成功的回调
		handleSuccess(response, file, fileList) {
			this.show.form.picUrl = response.datas.fileUrlKey;
			this.imageList = fileList;
		},
		// 分页触发事件
		handleChangePage(currentPage) {
			this.relative.pagination.currentPage = currentPage;
			this.loadRelativeGoods();
		},
		// 切换单页数量事件
		handleSizeChange(pageSize) {
			this.relative.pagination.pageSize = pageSize;
			this.loadRelativeGoods();
		},
		// 产品属性列表页分页回调
		handlePropListChangePage(currentPage) {
			this.property.pagination.currentPage = currentPage;
			this.loadGoodsProperties();
		},
		// 产品属性列表页切换页码回调
		handlePropListSizeChange(pageSize) {
			this.property.pagination.pageSize = pageSize;
			this.loadGoodsProperties();
		},
		// 复选回调
		handleSelectionChange(selection) {
			this.relative.bindList = selection.map(({ id }) => id);
		},
		// 关联产品
		bindProducts() {
			const {
				relative: { bindList: productIds },
				currentId: showId,
			} = this;
			if (!productIds.length) return this.$message.warning('请选择至少一条数据!');
			const bindData = {
				showId,
				productIds,
			};
			this.addBindToCatelog(bindData);
		},
		// 取消关联
		unBindProducts() {
			const {
				relative: { bindList: productIds },
				currentId: showId,
			} = this;
			if (!productIds.length) return this.$message.warning('请选择至少一条数据!');
			const bindData = {
				showId,
				productIds,
			};
			this.unBindCatelog(bindData);
		},
		// 关联产品分类
		async addBindToCatelog(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/item/onSaleRelShow',
				data,
			});
			if (res && res.code === 200) {
				this.$nextTick(this.resetLoad('relative'));
			} else {
				this.$message.error(res.data.message || '关联失败');
			}
		},
		// 取消产品分类关联
		async unBindCatelog(data) {
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/item/offSaleRelShow',
				data,
			});
			if (res && res.code === 200) {
				this.$nextTick(this.resetLoad('relative'));
			} else {
				this.$message.error(res.data.message || '取消关联失败');
			}
		},
		// 请求关联类型商品数据
		async loadRelativeGoods() {
			const {
				currentId: showId,
				searchConfig,
				relative: {
					pagination: { currentPage: pageNum, pageSize },
				},
			} = this;
			// // 顶级分类不提供关联商品分类的功能
			// if(!showId || showId === '1') return;
			const params = {
				...searchConfig,
				showId,
				pageNum,
				pageSize,
			};
			this.relative.loading = true;
			const res = await this.$fetch(`/mgmt/product/item/listRelShow?${qs.stringify(params)}`);
			this.relative.loading = false;
			if (res && res.data && res.data) {
				const { list, total } = res.data;
				if (!list.length) {
					return this.$message.warning('查询不到数据, 请更换搜索条件后重试');
				}
				this.relative.data = this.relative.data.concat(list);
				this.relative.total = total;
			} else {
				this.$message.warning('查询不到数据, 请更换搜索条件后重试');
			}
		},
		// 切换增加属性对话框显隐
		togglePropertyModalSHow(show) {
			this.property.modal = {
				...this.property.modal,
				show,
			};
		},
		// 新增属性
		insertProperty() {
			this.property.modal.value.push('');
		},
		// 删除属性
		removeProperty(idx) {
			this.property.modal.value.splice(idx, 1);
		},
		// 保存增加属性
		saveAddProperty() {
			this.addGoodsProperty();
		},
		picturePreview() {},
		removePicture() {},
		// 新增菜单
		addMenu(data) {
			const { activeTab: type } = this;
			this[type].mode = 'add';
			this[type].form = {
				parentId: data.id,
				title: '',
				picUrl: '',
				cfgStatus: 1,
				remarks: '',
				type,
			};
		},
		// 编辑菜单
		editMenu({ id }) {
			const { activeTab } = this;
			if (activeTab === 'show') {
				if (!id || id === '1') return;
				this.currentId = id;
				this.$nextTick(this.resetLoad('relative'));
			} else {
				this.currentId = '';
			}
			this[activeTab].mode = 'edit';
			this.loadMenuDetailById(id);
		},
		// 取消保存并更新菜单
		cancelUpdateMenu() {
			const { activeTab: type } = this;
			this[type].mode = '';
			this[type].form = {
				id: '',
				title: '',
				picUrl: '',
				remarks: '',
				cfgStatus: '',
			};
		},
		// 保存菜单
		saveMenu() {
			const { activeTab } = this;
			this.addConfigMenu(this[activeTab].form);
		},
		// 更新菜单
		updateMenu() {
			const { activeTab } = this;
			this.updateConfigMenu(this[activeTab].form);
		},
		// 刷新
		refresh() {
			const { activeTab } = this;
			this.loadConfigMenu(activeTab);
		},
		// 获取菜单类型
		// 产品配置 -- 菜单类型名字
		// [show: 前端展示 catalog: 产品类型 company: 销售主体 brand: 产品品牌 tag: 产品标签]
		async loadConfigMenu(type) {
			// console.log(type);
			if (!type) return;
			this.property.loading = true;
			const res = await this.$fetch(`/mgmt/product/cfg/menu/${type}`);
			if (res && res.data) {
				this[type].menu = [res.data];
				let val = [...res.data.childList].filter(validateOptionFilter).map(optionGenerator2);
				this.$store.commit('system/UPDATE_OPTIONS_BY_KEY', { key: `${type}Options`, val });
				this.$dispatch(`UPDATE_${type.toUpperCase()}_OPTIONS`);
			} else {
				this.$message('获取菜单配置信息失败');
			}
			this.property.loading = false;
		},
		// 获取具体菜单属性值
		async loadMenuDetailById(id) {
			if (!id) return;
			const { activeTab: type } = this;
			const params = {
				id,
				type,
			};

			const res = await this.$fetch(`/mgmt/product/cfg/get/${type}?${qs.stringify(params)}`);
			if (res && res.code === 200 && res.data) {
				this.imageList = type === 'show' ? [{ url: res.data.picUrl || '' }] : [];
				this[type].form = {
					...this.show.form,
					...res.data,
				};
			} else {
				this.$message.error('获取菜单详情失败');
			}
		},
		// 更新菜单属性
		async updateConfigMenu(data) {
			const { activeTab: type } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/cfg/save/${type}`,
				data: {
					...data,
					type,
				},
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this[type].mode = '';
					this.loadConfigMenu(type);
					loadProductsConfig();
				});
			} else {
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: '操作失败',
					});
				}
			}
		},
		// 调整菜单位置
		async updateConfigMenuPosition(id, sort) {
			const { activeTab: type } = this;
			const params = {
				id,
				sort,
				type,
			};
			const res = await this.$fetch(`/mgmt/product/cfg/sort/${type}?${qs.stringify(params)}`);

			if (res && res.code === 200) {
				this.$nextTick(() => {
					this.loadConfigMenu(type);
					loadProductsConfig();
				});
			} else {
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: '操作失败',
					});
				}
			}
		},
		// 新增菜单配置
		async addConfigMenu(data) {
			if (!data) return;
			delete data.id;
			const { activeTab: type } = this;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/cfg/add/${type}`,
				data,
			});

			if (res && res.data) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this[type].mode = '';
					this.loadConfigMenu(type);
					loadProductsConfig();
				});
			} else {
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: (res.data && res.data.message) || '新增菜单失败',
					});
				}
			}
		},
		// 取消更新价格参数
		cancelPriceChange() {
			this.activeTab = 'tag';
		},
		// 更新价格参数
		async updatePriceParams() {
			const { price: data } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/cfg/savePrice',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					loadPriceParams();
					this.$dispatch('LOAD_PRICE_CONFIGS');
				});
			} else {
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: '变更价格参数失败',
					});
				}
			}
		},
		// 新增产品属性
		addNewProperty() {
			this.property.modal = {
				show: true,
				id: '',
				name: '',
				type: 1,
				value: [],
			};
		},
		// 编辑产品属性
		editProperty({ id, attrKey: name, attrType: type, attrValArray: value }) {
			this.property.modal = {
				show: true,
				id,
				name,
				type,
				value,
			};
		},
		// 查询产品属性
		async loadGoodsProperties() {
			const {
				pagination: { currentPage: pageNum, pageSize },
			} = this.property;
			const params = {
				pageNum,
				pageSize,
			};
			this.property.loading = true;
			const res = await this.$fetch(`/mgmt/product/cfg/listAttr?${qs.stringify(params)}`);
			this.property.loading = false;
			if (res && res.data) {
				const { list, total } = res.data;
				this.property.data = this.property.data.concat(list);
				this.property.total = total;
			} else {
				this.$message('获取产品属性信息失败');
			}
		},
		// 添加产品属性
		async addGoodsProperty() {
			const {
				modal: { id, name: attrKey, type: attrType, value: attrValArray },
			} = this.property;
			const params = {
				attrKey,
				attrType: Number(attrType),
				attrVal: '',
				attrValArray,
			};

			const data = id ? { id, ...params } : params;

			const res = await this.$fetch({
				method: 'POST',
				url: `/mgmt/product/cfg/${id ? 'saveAttr' : 'addAttr'}`,
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.togglePropertyModalSHow(false);
				loadProductsAttrbute();
				this.$nextTick(this.resetLoad('property'));
			} else {
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: '添加产品属性失败',
					});
				}
			}
		},
		// 删除产品属性
		async deleteGoodsProperty(id) {
			if (!id) return this.$message('产品属性 Id 不存在 或 无效, 无法继续操作');
			const res = await this.$fetch(`/mgmt/product/cfg/delAttr?id=${id}`);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(this.resetLoad('property'));
			} else {
				if (this.$store.getters['system/getError']) {
					this.$message({
						type: 'error',
						message: '删除产品属性失败',
					});
				}
			}
		},
		// 输入数字回调
		priceParamsBlur(event, row, field) {
			const val = event.target.value;
			if (/^\d+(\.\d{1,2})?$/.test(val) || /\s/.test(val) || val === '') {
				if (Number(val) < 0 || Number(val) > 1) {
					this.$message.warning('输入的数字必须是 0 ~ 1 之间的小数');
					row[field] = '';
				}
			} else {
				this.$message.warning('只能输入2位小数');
				row[field] = '';
			}
		},
		// 新增分公司价格参数设置
		addBranchPriceParams() {
			this.branchCompnayPriceParams.push({
				priceCatalogTitle: '',
				beijingCompanyParam: '',
				otherCompanyParam: '',
				secondCompanyParam: '',
			});
		},
		// 删除分公司价格参数设置
		removeBranchPriceParams(id, index) {
			if (id) {
				this.$confirm('确认删除此条分公司价格参数吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.removeBranchPriceParamsService(id);
					})
					.catch(() => {
						this.$message.info('已取消删除操作');
					});
			} else {
				this.branchCompnayPriceParams.splice(index, 1);
			}
		},
		// 删除分公司价格参数
		async removeBranchPriceParamsService(id) {
			const res = await this.$fetch(`/mgmt/product/price/deleteFilialePrice?id=${id}`);
			if (res && res.code === 200) {
				this.$message.warning(res.message);
				this.$nextTick(this.loadBranchCompanyPriceParams);
			} else {
				this.$message.warning('删除分公司价格参数失败');
			}
		},
		// 请求分公司价格参数
		async loadBranchCompanyPriceParams() {
			const res = await this.$fetch('/mgmt/product/price/getFilialePriceList');
			if (res && res.data) {
				if (!res.data.length) {
					this.$message.warning('分公司价格参数为空');
					return (this.branchCompnayPriceParams = []);
				}
				this.branchCompnayPriceParams = res.data;
			} else {
				this.$message.warning('获取分公司价格参数失败');
			}
		},
		// 保存分公司价格参数
		async updateBranchPriceParams() {
			const { branchCompnayPriceParams: data } = this;

			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/product/price/saveFilialePrice',
				data,
			});
			if (res && res.code === 200) {
				this.$nextTick(this.loadBranchCompanyPriceParams);
			} else {
				this.$message.warning('保存分公司价格参数失败');
			}
		},
	},
	created() {
		loadProductsConfig();
		loadProductsAttrbute();
	},
};
</script>

<style lang="scss" scoped>
.row-label {
	display: inline-block;
	width: 120px;
	text-align: right;
}
.config-input {
	max-width: 350px;
}
.prop-input {
	display: inline-block;
	width: 75% !important;
	vertical-align: middle;
	margin-bottom: 8px;
	margin-right: 5px;
}
.tree-label {
	color: #333;
	font-size: 14px;
	margin-right: 16px;
}
.row-input {
	display: inline-block;
	width: 75% !important;
	vertical-align: text-top;
	margin: 0 0 16px 8px;
}
.row-gap {
	margin-bottom: 15px;
}
.label-tree {
	margin-top: 20px;
}
.price-title {
	margin: 10px auto;
	font-weight: bold;
}
.price-label {
	width: 200px;
	text-align: right;
	font-size: 16px;
	margin-right: 15px;
}
.price-input {
	width: 170px !important;
}
.price-tips {
	width: 280px;
	margin-left: 10px;
}
.update-price-row {
	margin-top: 16px;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
</style>

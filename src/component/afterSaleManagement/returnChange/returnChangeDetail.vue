<template>
	<div class="charging-detail">
		<!-- 基本信息 -->
		<el-card class="box-card">
			<div class="title">
				<span>基本信息</span>
				<el-button
					v-if="baseData.orderVo && ![1, 7].includes(baseData.orderVo.orderStatus)"
					class="printing_btn"
					type="primary"
					v-permission="'return_change_detail_printing'"
					@click="printing(orderId)"
				>
					打印
				</el-button>
			</div>
			<el-form
				:inline="true"
				:model="auditForm"
				:rules="RETURN_CHANGE_ADUIT_RULE"
				ref="auditForm"
				label-width="160px"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="7">
						<el-form-item label="处理状态">
							<span class="handle_state_font">
								{{ baseData.orderVo && baseData.orderVo.orderStatus | orderStatus }}
							</span>
						</el-form-item>
						<el-button
							class="examine_btn"
							type="primary"
							:disabled="!auditForm.returnInfo || baseData.opinionVos.length === 0"
							v-if="type === 'audit'"
							v-permission="'return_change_detail_validate'"
							@click="examineState = true"
						>
							审核
						</el-button>
						<el-form-item label="换货单号">
							<span>{{ baseData.orderVo && baseData.orderVo.orderSn }}</span>
						</el-form-item>
						<el-form-item label="剩余时间" v-if="timeRemainingState && baseData.orderVo.orderStatus === 5">
							<span>{{ baseData.orderVo && receivedCountdown(baseData.orderVo.receiveTimeDeadline) }}</span>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="7">
						<el-form-item label="换货单号">
							<span>{{ baseData.orderVo && baseData.orderVo.orderSn }}</span>
						</el-form-item>
					</el-col> -->
					<el-col :span="12">
						<el-steps :active="active" align-center>
							<el-step
								v-for="(item, index) in processOrderRecordList"
								:key="index"
								:title="item.processName"
								:description="item.createTime"
							></el-step>
						</el-steps>
					</el-col>
				</el-row>
				<el-row class="min-width mt20">
					<el-col :span="8">
						<el-form-item label="一级原因" prop="reasonFirst">
							<el-select
								v-if="type == 'audit'"
								@change="changereasonFirst(auditForm.reasonFirst)"
								v-model="auditForm.reasonFirst"
								placeholder="请选择一级原因"
								style="height: 32px"
							>
								<el-option
									v-for="option in reasonFirstOptions"
									:key="option.value"
									:label="option.label"
									:value="option.label"
								></el-option>
							</el-select>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonFirst }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="一级原因备注说明" prop="reasonFirstRemarks">
							<el-input
								v-if="type == 'audit'"
								v-model="auditForm.reasonFirstRemarks"
								placeholder="请输入一级原因备注说明"
							></el-input>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonFirstRemarks }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="确认处理方式" prop="exchangeType">
							<el-select
								v-if="type === 'audit'"
								v-model="auditForm.exchangeType"
								placeholder="请选择确认处理方式"
								style="height: 32px"
							>
								<el-option
									v-for="option in EXCHANGE_STATUS"
									:key="option.value"
									:label="option.name"
									:value="option.value"
								></el-option>
							</el-select>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.exchangeType | exchangeType }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="二级原因" prop="reasonSecond">
							<el-select
								v-if="type == 'audit'"
								v-model="auditForm.reasonSecond"
								placeholder="请选择二级原因"
								style="height: 32px"
							>
								<el-option
									v-for="option in reasonSecondOptions"
									:key="option.value"
									:label="option.label"
									:value="option.label"
								></el-option>
							</el-select>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonSecond }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="二级原因备注说明" prop="reasonSecondRemarks">
							<el-input
								v-if="type == 'audit'"
								v-model="auditForm.reasonSecondRemarks"
								placeholder="请输入二级原因备注说明"
							></el-input>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonSecondRemarks }}</span>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="8">
						<el-form-item label="旧品处理方式" prop="productDisposalType">
							<el-select
								v-if="type === 'audit'"
								v-model="auditForm.productDisposalType"
								placeholder="请选择确认处理方式"
								style="height: 32px;"
							>
								<el-option
									v-for="option in PRODUCT_DISPOSAL_STATUS"
									:key="option.value"
									:label="option.name"
									:value="option.value"
								>
								</el-option>
							</el-select>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.productDisposalType | productDisposalType }}</span>
						</el-form-item>
					</el-col>-->
					<el-col :span="5" v-if="type === 'audit' || type === 'detail'">
						<el-form-item label="当月换货次数">
							<!-- <el-input placeholder="请输入当月换货次数"></el-input> -->
							<span>{{ baseData.orderVo && baseData.orderVo.exchangeFinishCountInMonth }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="16">
						<el-form-item label="附件">
							<span @click="jumpFileUrl(item)" class="blue" v-for="(item, index) in newFileList" :key="index">
								{{ item.name }}
							</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width" v-if="type === 'audit'">
					<el-col :span="12">
						<el-form-item label="退换货产品退回地址" prop="returnInfo">
							<el-input
								style="width: 400px"
								type="textarea"
								maxlength="200"
								placeholder="请输入分公司或指定仓库的产品接收地址，含：收货人姓名、电话、地址等信息"
								v-model="auditForm.returnInfo"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 审批意见 -->
		<el-card class="box-card">
			<!-- <el-collapse>
			<el-collapse-item>-->

			<div class="opinion_div">
				<span class="required">*</span>
				审批意见
				<el-button
					type="primary"
					@click="addConnent"
					v-if="baseData.orderVo.orderStatus === 1"
					v-permission="'return_change_detail_add_suggestion'"
					class="m10"
				>
					添加意见
				</el-button>
			</div>

			<el-dialog title="新增留言" :visible.sync="dialogFormVisible" v-drag>
				<el-form :model="contentForm" ref="contentForm" :rules="contentRules">
					<el-form-item label="输入留言" :label-width="120" prop="content">
						<el-input v-model="contentForm.content" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button
						type="primary"
						:disabled="btnLoading"
						v-loading="btnLoading"
						element-loading-spinner="el-icon-loading"
						@click="submitContent('contentForm')"
					>
						确 定
					</el-button>
				</div>
			</el-dialog>
			<el-table :data="baseData.opinionVos" style="width: 100%" border>
				<el-table-column prop="opt" label="序号">
					<template slot-scope="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="留言时间" width="180">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="submitMan" label="留言人">
					<template slot-scope="scope">
						<span>{{ scope.row.submitMan }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="companyName" label="分公司">
					<template slot-scope="scope">
						<span>{{ scope.row.companyName }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="content" label="留言内容">
					<template slot-scope="scope">
						<span>{{ scope.row.content }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="unit" v-if="type === 'audit'" label="操作">
					<template slot-scope="scope">
						<el-button
							type="text"
							v-permission="'return_change_detail_edit_suggestion'"
							@click="editContent(scope.row.id, scope.row.content)"
						>
							修改
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- </el-collapse-item>
			</el-collapse>-->
		</el-card>
		<!--其它信息  -->
		<el-card class="box-card">
			<el-collapse>
				<el-collapse-item title="更多信息" name="1">
					<el-form :inline="true" ref="otherFormRef" label-width="140px" :model="otherForm" label-suffix=":">
						<el-row class="min-width">
							<el-col :span="7">
								<el-form-item label="换货单类型" prop="orderSource">
									<span>
										{{ baseData.orderVo && baseData.orderVo.orderSource == 1 ? '服务中心换货' : '运营后台换货' }}
									</span>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label="服务中心编号" prop="storeCode">
									<span>{{ baseData.orderVo && baseData.orderVo.storeCode }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="min-width">
							<el-col :span="7">
								<el-form-item label="提交人" prop="auditMan">
									<span>{{ baseData.orderVo && baseData.orderVo.submitMan }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label="提交编号" prop="recordTime">
									<span>{{ orderId }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item label="提交时间" prop="createTime">
									<span>{{ baseData.orderVo && baseData.orderVo.createTime | format }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-collapse-item>
			</el-collapse>
		</el-card>
		<!-- 申请退货产品 -->
		<el-card class="box-card">
			<div class="title">
				申请换货产品
				<span class="red">零售价合计：￥{{ returnAmountTotal || 0 }}</span>
				<span class="red">换货数量合计：{{ retailPriceTotal || 0 }}</span>
			</div>
			<el-table :data="baseData.productVos" style="width: 100%" border>
				<el-table-column prop="opt" label="序号">
					<template slot-scope="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productCode" width="200" label="产品编号/定制品二级编码">
					<template slot-scope="scope">
						<span>{{ scope.row.productCode }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productName" label="产品名称">
					<template slot-scope="scope">
						<span>{{ scope.row.productName }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productPacking" label="规格">
					<template slot-scope="scope">
						<span>{{ scope.row.productPacking }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productUnit" label="单位">
					<template slot-scope="scope">
						<span>{{ scope.row.productUnit }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productRetailPrice" label="零售价">
					<template slot-scope="scope">
						<span>¥{{ scope.row.productRetailPrice }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productNum" label="换货数量" width="180">
					<template slot-scope="scope">
						<el-input-number
							v-if="type === 'audit'"
							size="mini"
							v-model="scope.row.productNum"
							:min="1"
							:max="999999"
							label="换货数量"
						></el-input-number>
						<span v-else>{{ scope.row.productNum }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productProductionDate" label="生产日期/有效期" width="180">
					<template slot-scope="scope">
						<el-input
							size="small"
							v-if="type === 'audit'"
							onkeyup="value=value.replace(/[^\d]/g,'')"
							v-model="scope.row.productProductionDate"
							placeholder="请输入"
							maxlength="8"
						></el-input>
						<span v-else>{{ scope.row.productProductionDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productBatch" label="批次" width="180">
					<template slot-scope="scope">
						<el-input
							size="small"
							v-if="type === 'audit'"
							v-model="scope.row.productBatch"
							placeholder="请输入"
						></el-input>
						<span v-else>{{ scope.row.productBatch }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productSn" label="序列号/二维码" width="180">
					<template slot-scope="scope">
						<el-input
							size="small"
							v-if="type === 'audit'"
							v-model="scope.row.productSn"
							placeholder="请输入"
						></el-input>
						<span v-else>{{ scope.row.productSn }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productProblemDesc" label="详细问题描述" width="180">
					<template slot-scope="scope">
						<el-input
							size="small"
							v-if="type === 'audit'"
							v-model="scope.row.productProblemDesc"
							placeholder="请输入"
						></el-input>
						<span v-else>{{ scope.row.productProblemDesc }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productDisposalType" label="旧品处理方式" width="180">
					<template slot-scope="scope">
						<el-select v-if="type === 'audit'" v-model="scope.row.productDisposalType" placeholder="请选择">
							<el-option
								v-for="option in PRODUCT_DISPOSAL_STATUS"
								:key="option.value"
								:label="option.name"
								:value="option.value"
							></el-option>
						</el-select>
						<span v-else>{{ scope.row.productDisposalType | productDisposalType }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="firstUseTime" label="初次使用时间" width="200">
					<template slot-scope="scope">
						<el-date-picker
							:picker-options="pickerOptions2"
							v-model="scope.row.firstUseTime"
							type="date"
							v-if="type === 'audit'"
							value-format="yyyy-MM-dd"
							placeholder="选择日期时间"
						></el-date-picker>
						<span v-else>{{ scope.row.firstUseTime }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="dailyUseType" label="日常使用时间" width="150">
					<template slot-scope="scope">
						<el-select v-model="scope.row.dailyUseType" v-if="type === 'audit'" placeholder="请选择">
							<el-option
								v-for="item in DAILY_USE_TYPE"
								:key="item.value"
								:label="item.name"
								:value="item.value"
							></el-option>
						</el-select>
						<span v-else>{{ scope.row.dailyUseType | dailyUseType }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="happenType" label="问题发生状态" width="180">
					<template slot-scope="scope">
						<el-select v-model="scope.row.happenType" v-if="type === 'audit'" placeholder="请选择">
							<el-option
								v-for="item in HAPPEN_TYPE"
								:key="item.value"
								:label="item.name"
								:value="item.value"
							></el-option>
						</el-select>
						<span v-else>{{ scope.row.happenType | happenType }}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!--审核审批信息  -->
		<el-dialog title="审批信息" :visible.sync="examineState" v-drag>
			<el-form
				:inline="true"
				label-width="140px"
				label-suffix=":"
				:model="auditForm"
				:rules="RETURN_CHANGE_ADUIT_RULE"
				ref="auditForm"
			>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="审批意见" prop="auditStatus">
							<el-select v-model="auditForm.auditStatus" placeholder="请选择">
								<el-option
									v-for="item in approvals"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="审核备注" prop="auditRemarks">
							<el-input type="textarea" maxlength="50" v-model="auditForm.auditRemarks"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="附件">
							<el-upload
								class="fileStyle"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadData"
								:limit="1"
								:on-remove="handleRemoveFile"
								:on-success="handleSuccessFile"
								:file-list="fileList"
							>
								<el-button size="small" type="primary">添加附件</el-button>
								<p class="tips" slot="tip">
									1.支持文件格式:Word、EXCEL、PDF、压缩包（rar、zip)、bmp、jpg、png、tif
									<br />
									2.支持上传1个文件,
									<br />
									3.单个文件不能超过10M
									<br />
								</p>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="examineState = false">取 消</el-button>
				<el-button :loading="submitLoading" v-permission="'return_change_detail_submit'" @click="handleSubmit()">
					提交
				</el-button>
			</div>
		</el-dialog>
		<!-- <el-card class="box-card" v-if="type === 'audit'">
			<div class="title">审批信息</div>
			<el-form
				:inline="true"
				label-width="140px"
				label-suffix=":"
				:model="auditForm"
				:rules="RETURN_CHANGE_ADUIT_RULE"
				ref="auditForm"
			>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="审批意见" prop="auditStatus">
							<el-select v-model="auditForm.auditStatus" placeholder="请选择">
								<el-option
									v-for="item in approvals"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="审核备注" prop="auditRemarks">
							<el-input type="textarea" v-model="auditForm.auditRemarks"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="附件">
							<el-upload
								class="fileStyle"
								:action="$store.getters['system/getOssUploadUrl']"
								:data="uploadData"
								:limit="1"
								:headers="headers"
								:on-remove="handleRemoveFile"
								:on-success="handleSuccessFile"
								:file-list="fileList"
							>
								<el-button size="small" type="primary">添加附件</el-button>
								<p class="tips" slot="tip">
									1.支持文件格式:Word、EXCEL、PDF、压缩包（rar、zip)、bmp、jpg、png、tif
									<br />
									2.支持上传1个文件,
									<br />
									3.单个文件不能超过10M
									<br />
								</p>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="12" v-if="auditForm.auditStatus === '1'">
						<el-form-item label="换货地址信息" prop="returnInfo">
							<el-input
								type="textarea"
								placeholder="请填写联系人，联系方式及换货地址"
								v-model="auditForm.returnInfo"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card> -->
		<!--退回审批信息  -->
		<el-card
			class="box-card"
			v-if="type === 'return' || type === 'check' || type === 'enterShipment' || type === 'detail'"
		>
			<div class="title">审批信息</div>
			<el-form :inline="true" ref="baseData" label-width="160px" :model="baseData" label-suffix=":">
				<el-row class="min-width">
					<el-col :span="7">
						<el-form-item label="审批日期" prop="delivery">
							<span>{{ baseData.orderVo && baseData.orderVo.auditTime }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="审批人" prop="recordTime">
							<span>{{ baseData.orderVo && baseData.orderVo.auditMan }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="审批意见" prop="recordTime">
							<span>{{ baseData.orderVo && baseData.orderVo.auditStatus | auditStatus }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="7">
						<el-form-item label="附件" prop="delivery">
							<p v-if="baseData.orderVo.auditFileUrl" @click="jumpPageUrl(baseData.orderVo.auditFileUrl)" class="blue">
								查看文件
							</p>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="审核备注" prop="recordTime">
							<span>{{ baseData.orderVo && baseData.orderVo.auditRemarks }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="退换货产品退回地址" prop="returnAddress">
							<span>{{ baseData.orderVo && baseData.orderVo.returnAddress }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!--退回信息  -->
		<el-card
			class="box-card"
			v-if="type === 'return' || type === 'check' || type === 'enterShipment' || type === 'detail'"
		>
			<div class="title">旧品退回信息</div>
			<el-form
				:inline="true"
				ref="returnFrom"
				label-width="180px"
				:rules="RETURN_CHANGE_RETURN_RULE"
				:model="returnFrom"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="8">
						<el-form-item label="退回方式">
							<el-select v-if="type == 'return'" v-model="returnFrom.returnType" placeholder="请选择">
								<el-option v-for="item in returns" :key="item.type" :label="item.name" :value="item.type"></el-option>
							</el-select>
							<span v-else>{{ baseData.processVo && baseData.processVo.returnType | returnType }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="returnFrom.returnType == 3">
						<el-form-item label="物流公司" prop="expressCompany" :required="isHaveTo">
							<el-input
								v-if="type == 'return'"
								v-model="returnFrom.expressCompany"
								placeholder="请输入物流公司"
							></el-input>
							<span v-else>{{ baseData.processVo && baseData.processVo.expressCompany }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="returnFrom.returnType == 3">
						<el-form-item label="运单号" prop="expressNo" :required="isHaveTo">
							<el-input v-if="type == 'return'" v-model="returnFrom.expressNo" placeholder="请输入运单号"></el-input>
							<span v-else>{{ baseData.processVo && baseData.processVo.expressNo }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8" v-if="returnFrom.returnType == 3">
						<el-form-item label="运费(小于500元)" prop="expressSubsidy">
							<el-input-number
								v-if="type == 'return'"
								:min="0"
								:max="500"
								size="small"
								v-model="returnFrom.expressAmount"
							></el-input-number>
							<span v-else>{{ baseData.processVo && baseData.processVo.expressAmount }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="returnFrom.returnType == 3">
						<el-form-item label="快递凭证">
							<div v-if="['enterShipment', 'check', 'detail'].includes(type)">
								<p @click="jumpFileUrl(item)" class="blue" v-for="(item, index) in newExpressProofList" :key="index">
									{{ item.name }}
								</p>
							</div>
							<el-upload
								v-if="type == 'return' && returnFrom.returnType == 3"
								class="avatar-uploader"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadData"
								:limit="3"
								list-type="picture-card"
								:on-preview="handlePreview"
								:on-remove="handleExpressRemove"
								:on-success="handleExpressSuccess"
								:file-list="changeDataList"
								:class="changeDataList.length === 3 ? 'hide_box' : ''"
							>
								<i class="el-icon-plus"></i>
							</el-upload>
							<p v-if="changeDataList.length > 2" class="red">快递凭证最多可上传3张</p>
							<!-- 点击弹出 -->
							<el-dialog :visible.sync="dialogVisible" v-drag>
								<img width="100%" :src="returnFrom.expressProofUrl" alt />
							</el-dialog>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="scrapState || returnFrom.returnType == 1">
						<el-form-item label="报废凭证" prop="disposalProofUrl" :required="scrapState">
							<div v-if="scrapState || type == 'check' || type == 'detail'">
								<p @click="jumpFileUrl(item)" class="blue" v-for="(item, index) in newDisposalProofList" :key="index">
									{{ item.name }}
								</p>
							</div>
							<el-upload
								v-if="(scrapState && type == 'return') || (type == 'return' && returnFrom.returnType == 1)"
								class="avatar-uploader"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadData"
								:limit="3"
								list-type="picture-card"
								:on-preview="handlePreview"
								:on-remove="handleDisposalProofRemove"
								:on-success="handleDisposalProofSuccess"
								:file-list="changeDataDisposalProofList"
								:class="changeDataDisposalProofList.length === 3 ? 'hide_box' : ''"
							>
								<i class="el-icon-plus"></i>
							</el-upload>
							<!-- 点击弹出 -->
							<el-dialog :visible.sync="dialogVisible" v-drag>
								<img width="100%" :src="returnFrom.expressProofUrl" alt />
							</el-dialog>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="说明" prop="processRemarks">
							<el-input
								v-if="type == 'return'"
								v-model="returnFrom.processRemarks"
								type="textarea"
								placeholder="请输入说明"
							></el-input>
							<span v-else>{{ baseData.processVo && baseData.processVo.processRemarks }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!--验货信息  -->
		<el-card class="box-card" v-if="type !== 'audit'">
			<div class="title">旧品验货信息</div>
			<el-form
				:inline="true"
				ref="checkForm"
				:rules="RETURN_CHANGE_CHECK_RULE"
				label-width="150px"
				:model="checkForm"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="7" v-if="type === 'detail' || type === 'enterShipment'">
						<el-form-item label="验货日期" prop="createTime">
							<span>{{ baseData.inspectVo && baseData.inspectVo.createTime }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="7" v-if="type === 'detail' || type === 'enterShipment'">
						<el-form-item label="验货人" prop="inspectMan">
							<span>{{ baseData.inspectVo && baseData.inspectVo.inspectMan }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="type === 'check' || type === 'detail' || type === 'enterShipment'">
						<el-form-item label="验货意见" prop="inspectStatus">
							<el-select v-if="type == 'check'" v-model="checkForm.inspectStatus" placeholder="请选择">
								<el-option v-for="item in checks" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<span v-else>
								{{
									baseData.inspectVo && baseData.inspectVo.inspectStatus == 0
										? '验货不通过'
										: baseData.inspectVo && baseData.inspectVo.inspectStatus == 1
										? '验货通过'
										: ''
								}}
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="7" v-if="type === 'check' || type === 'detail' || type === 'enterShipment'">
						<el-form-item v-if="checkForm.inspectStatus === '1'" label="运费补贴(≤500元)" prop="expressSubsidy">
							<el-input-number
								v-if="type == 'check'"
								:min="0"
								:max="500"
								size="small"
								v-model="checkForm.expressSubsidy"
							></el-input-number>
						</el-form-item>
						<el-form-item v-if="type !== 'check'" label="运费补贴">
							{{ baseData.inspectVo && baseData.inspectVo.expressSubsidy }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="8" v-if="type === 'check' || type === 'detail' || type === 'enterShipment'">
						<el-form-item label="验货备注" prop="inspectRemarks">
							<el-input
								v-if="type == 'check'"
								type="textarea"
								v-model="checkForm.inspectRemarks"
								placeholder="请输入验货备注"
							></el-input>
							<span v-else>{{ baseData.inspectVo && baseData.inspectVo.inspectRemarks }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="['check', 'enterShipment', 'detail'].includes(type)">
						<el-form-item label="凭证">
							<div v-if="type !== 'check'">
								<p
									@click="jumpFileUrl(item)"
									class="blue"
									v-for="(item, index) in baseData.inspectVo && baseData.inspectVo.inspectProof"
									:key="index"
								>
									凭证{{ index + 1 }}
								</p>
							</div>
							<el-upload
								v-if="type === 'check'"
								class="avatar-uploader"
								:action="$store.getters['system/getOssUploadUrl']"
								:headers="$store.getters['system/getSignatureVerification']"
								:data="uploadData"
								:limit="3"
								list-type="picture-card"
								:on-preview="handlePreview"
								:on-remove="voucherRemove"
								:on-success="voucherSuccess"
								:file-list="voucherList"
								:class="voucherList.length === 3 ? 'hide_box' : ''"
							>
								<i class="el-icon-plus"></i>
							</el-upload>
							<!-- 点击弹出 -->
							<el-dialog :visible.sync="dialogVisible" v-drag>
								<img width="100%" :src="returnFrom.disposalProofUrl" alt />
							</el-dialog>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!--新品发货信息  -->
		<el-card class="box-card" v-if="type !== 'audit'">
			<div class="title">新品发货信息</div>
			<el-form
				:inline="true"
				ref="enterShipemntForm"
				:rules="RETURN_CHANGE_DELIVER_RULE"
				label-width="150px"
				:model="enterShipemntForm"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="7">
						<el-form-item label="交付方式" prop="deliverType">
							<el-select
								@change="deliverShow(enterShipemntForm.deliverType)"
								v-if="type == 'enterShipment'"
								v-model="enterShipemntForm.deliverType"
								placeholder="请选择"
							>
								<el-option
									v-for="item in DELIVERTYPE"
									:key="item.value"
									:label="item.name"
									:value="item.value"
								></el-option>
							</el-select>
							<span v-else>
								{{
									baseData.deliverVo && baseData.deliverVo.deliverType == 1
										? '顾客自提'
										: baseData.deliverVo && baseData.deliverVo.deliverType == 2
										? '邮寄'
										: ''
								}}
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="7" v-if="deliverState">
						<el-form-item label="新品配送物流公司" prop="expressCompany">
							<el-input
								v-if="type == 'enterShipment'"
								type="text"
								v-model="enterShipemntForm.expressCompany"
								placeholder="请输入"
							></el-input>
							<span v-else>{{ baseData.deliverVo && baseData.deliverVo.expressCompany }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="7" v-if="deliverState">
						<el-form-item label="物流单号" prop="expressNo">
							<el-input
								v-if="type == 'enterShipment'"
								type="text"
								v-model="enterShipemntForm.expressNo"
								placeholder="请输入"
							></el-input>
							<span v-else>{{ baseData.deliverVo && baseData.deliverVo.expressNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="发货时间" prop="deliverTime">
							<el-date-picker
								v-model="enterShipemntForm.deliverTime"
								type="datetime"
								v-if="type === 'enterShipment'"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期时间"
							></el-date-picker>
							<span v-else>{{ baseData.deliverVo && baseData.deliverVo.deliverTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 按钮 -->
		<actionBar>
			<el-button v-if="type === 'audit'" :loading="submitLoading" @click="updateReason()">保存</el-button>
			<el-button
				v-if="!['detail', 'audit'].includes(type)"
				v-permission="'return_change_detail_submit'"
				:loading="submitLoading"
				@click="handleSubmit()"
			>
				提交
			</el-button>
			<el-button @click="handleCancel()">返回</el-button>
		</actionBar>
		<!-- <div class="eidt-btn-footer">
			<div class="eidt-btn-footer-box">

			</div>
		</div>-->
	</div>
</template>
<script>
import {
	REETURN_TYPE,
	AUDIT_STATUS,
	RETURN_CHANGE_CHECK_RULE,
	RETURN_CHANGE_DELIVER_RULE,
	REETURN_STATUS,
	DELIVERTYPE,
	HAPPEN_STATUS,
	DAILY_USE_STATUS,
	DAILY_USE_TYPE,
	HAPPEN_TYPE,
	PRODUCT_DISPOAL_TYPE,
	EXCHANGE_TYPE,
	RETURN_CHANGE_ADUIT_RULE,
	ORDER_STATUS,
	EXCHANGE_STATUS,
	PRODUCT_DISPOSAL_STATUS,
} from './config';
import qs from 'querystring';
import { formatDate } from 'util/formValidation';
export default {
	name: 'returnChangeDetail',
	data() {
		// 验证
		let expressCompanyValidate = (rule, value, callback) => {
			if (this.returnFrom.expressCompany === '' && this.isHaveTo) {
				callback(new Error('请输入物流公司'));
			} else {
				callback();
			}
		};
		// let expressProofUrlyValidate = (rule, value, callback) => {
		// 	if (this.returnFrom.expressCompany === '' && this.isHaveTo) {
		// 		callback(new Error('请上传物流凭证'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		let expressNoValidate = (rule, value, callback) => {
			if (this.returnFrom.expressCompany === '' && this.isHaveTo) {
				callback(new Error('请输入物流单号'));
			} else {
				callback();
			}
		};
		return {
			headers: {
				Authorization: this.$store.getters['user/getFullToken'],
			},
			RETURN_CHANGE_DELIVER_RULE, //发货校验
			RETURN_CHANGE_CHECK_RULE, //验货校验
			RETURN_CHANGE_ADUIT_RULE, //审核校验
			ORDER_STATUS, //换货状态
			EXCHANGE_STATUS, //换货类型
			DELIVERTYPE, //新品交付方式
			PRODUCT_DISPOSAL_STATUS, //旧品处理方式
			DAILY_USE_TYPE, //日常使用时间
			HAPPEN_TYPE, //问题发生状态
			REETURN_TYPE, //退回方式
			PRODUCT_DISPOAL_TYPE, //换货处理方式
			HAPPEN_STATUS, //问题发生状态
			DAILY_USE_STATUS, //日常使用时间
			AUDIT_STATUS, //审核状态
			REETURN_STATUS,
			RETURN_CHANGE_RETURN_RULE: {
				returnType: [{ required: true, message: '请选择退回方式', trigger: 'change' }],
				expressCompany: [{ validator: expressCompanyValidate }],
				// expressProofUrl: [{ validator: expressProofUrlyValidate }],
				expressNo: [{ validator: expressNoValidate }],
			}, //退回校验
			active: 1,
			type: '', // 页面来源（审核or详情）
			orderId: '',
			changeDataList: [],
			changeDataDisposalProofList: [],
			voucherList: [], // 凭证数据
			reasonList: [],
			// 一级原因
			reasonFirstOptions: [],
			// 二级原因
			reasonSecondOptions: [],
			processOrderRecordList: [], //进度
			dialogFormVisible: false, //意见框
			contentForm: {
				content: '',
			},
			pickerOptions2: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
			contentId: '', //留言id
			baseData: '',
			auditForm: {
				id: '',
				exchangeType: '',
				auditFileUrl: '',
				auditFileName: '', //文件名称
				auditRemarks: '',
				auditStatus: '',
				productDisposalType: '1',
				reasonFirst: '',
				reasonFirstRemarks: '',
				reasonSecond: '',
				reasonSecondRemarks: '',
				productVoList: [],
				returnInfo: '', //退回信息
			}, //审核
			scrapState: false, // 是否存在报废产品
			returnFrom: {
				orderId: '',
				expressAmount: 0,
				expressCompany: '',
				expressNo: '',
				expressProofUrl: '',
				expressProofName: '', //文件名称
				processRemarks: '',
				returnType: '',
				disposalProofName: '', //报废文件名称
				disposalProofUrl: '', //报废文件地址
			},
			checkForm: {
				expressSubsidy: 0,
				inspectRemarks: '',
				inspectStatus: '',
				orderId: '',
				inspectProof: [], // 凭证
			},
			// 录入发货
			enterShipemntForm: {
				orderId: '',
				deliverTime: '',
				deliverType: '',
				expressCompany: '',
				expressNo: '',
			},
			deliverState: true, // 新品发货状态展示
			fileList: [],
			newFileList: [], //附件
			newExpressProofList: [], //快递凭证
			newDisposalProofList: [], //报废凭证
			otherForm: {
				delivery: false,
			},
			detail: [],
			disposalProofUrlList: [], //报废凭证列表
			disposalProofNameList: [], //报废凭证名称列表
			// 快递凭证
			imageUrl: '',
			dialogVisible: false,
			// 验货意见
			checks: [
				{
					value: '1',
					label: '验货通过',
				},
				{
					value: '0',
					label: '验货不通过',
				},
			],
			// 退回方式
			returns: [
				{
					value: '1',
					label: '服务中心报废',
				},
				{
					value: '2',
					label: '自带',
				},
				{
					value: '3',
					label: '邮寄',
				},
			],
			// 审核状态
			approvals: [
				{
					value: '1',
					label: '审核通过',
				},
				{
					value: '0',
					label: '审核不通过',
				},
			],
			timeRemainingState: false, // 剩余时间状态
			examineState: false, // 审核弹框
			auditRules: {
				result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
			},
			contentRules: {
				content: [{ required: true, message: '请输入留言', trigger: 'blur' }],
			},
			btnLoading: false,
			submitLoading: false, // 提交按钮loading
		};
	},
	created() {
		let type = this.$route.query.type;
		this.orderId = this.$route.query.id;
		// let returnInfo = sessionStorage.getItem('returnInfoChange') ? sessionStorage.getItem('returnInfoChange') : '';
		// this.auditForm.returnInfo = returnInfo;
		this.getReason();
		this.loadData();
		this.type = type;
	},
	filters: {
		// 押货单状态
		orderStatus(val) {
			return val in ORDER_STATUS ? ORDER_STATUS[val] : '';
		},
		// 换货类型
		exchangeType(val) {
			return val in EXCHANGE_TYPE ? EXCHANGE_TYPE[val] : '';
		},
		// 退回方式
		returnType(val) {
			return val in REETURN_STATUS ? REETURN_STATUS[val] : '';
		},
		// 旧品处理方式
		productDisposalType(val) {
			return val in PRODUCT_DISPOAL_TYPE ? PRODUCT_DISPOAL_TYPE[val] : '';
		},
		// 问题发生状态
		happenType(val) {
			return val in HAPPEN_STATUS ? HAPPEN_STATUS[val] : '';
		},
		// 日常使用时间
		dailyUseType(val) {
			return val in DAILY_USE_STATUS ? DAILY_USE_STATUS[val] : '';
		},
		// 审核状态
		auditStatus(val) {
			return val in AUDIT_STATUS ? AUDIT_STATUS[val] : '';
		},
		// 格式时间
		format(val) {
			if (!val) return;
			return formatDate(val);
		},
	},
	computed: {
		// 零售价合计
		returnAmountTotal() {
			return this.baseData.productVos
				.map(item => item.productRetailPrice * item.productNum)
				.reduce((acc, cur) => parseFloat(cur) + acc, 0);
		},
		// 换货数量合计
		retailPriceTotal() {
			return this.baseData.productVos.map(item => item.productNum).reduce((acc, cur) => parseFloat(cur) + acc, 0);
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},
		isHaveTo() {
			console.log(this.returnFrom);
			return this.returnFrom.returnType == 3;
		},
		isHaveDisposalProofTo() {
			return this.returnFrom.returnType == 1;
		},
	},
	methods: {
		// 打印
		printing(orderId) {
			this.$go('return_change_printing', { orderId });
		},
		// 待收货倒计时
		receivedCountdown(starttime) {
			let nowtime = new Date();
			let time = starttime - nowtime;
			let day = parseInt(time / 1000 / 60 / 60 / 24),
				hour = parseInt((time / 1000 / 60 / 60) % 24),
				minute = parseInt((time / 1000 / 60) % 60),
				timeRemaining = `${day}天${hour}小时${minute}分钟自动确认`;
			this.timeRemainingState = day || hour || minute;
			return timeRemaining;
		},
		// 新品发货信息展示处理
		deliverShow(state) {
			this.deliverState = this.type !== 'audit' && this.baseData.deliverVo && this.baseData.deliverVo.deliverType !== 1;
			// 待发货判断
			this.deliverState = state ? this.enterShipemntForm.deliverType !== 1 : this.deliverState;
		},

		// 获取一二级原因
		async getReason() {
			let type = 4;
			const params = {
				type,
			};
			const res = await this.$fetch(`/mgmt/inventory/common/getReason?${qs.stringify(params)}`);
			let list = res.data;
			this.reasonFirstOptions = [];
			list.forEach(e => {
				let item = {
					value: e.id,
					label: e.returnReason,
				};
				this.reasonFirstOptions.push(item);
			});
			this.reasonList = res.data;
		},
		// 一级原因操作
		changereasonFirst(returnReason) {
			this.reasonSecondOptions = [];
			this.reasonList.forEach(e => {
				if (e.returnReason == returnReason) {
					e.reasonList.forEach(n => {
						let item = {
							value: n.id,
							label: n.returnReason,
						};
						this.reasonSecondOptions.push(item);
					});
				}
			});
		},
		// 快递凭证跳转
		jumpUrl(row) {
			window.open(row.expressProofUrl, '_blank');
		},
		// 报废凭证跳转
		jumpDisposalUrl(row) {
			window.open(row.disposalProofUrl, '_blank');
		},
		// 快递/报废凭证跳转
		jumpFileUrl(row) {
			let imgUrl = row.url || row;
			window.open(imgUrl, '_blank');
		},
		// 文件跳转
		jumpPageUrl(row) {
			window.open(row, '_blank');
		},
		// 更新审核意见
		async loadOpionData() {
			let orderId = this.orderId;
			const params = {
				orderId,
			};
			const res = await this.$fetch(`/mgmt/inventory/exchangeOrder/exchangeOrderDetail?${qs.stringify(params)}`);
			if (res.code === 200) {
				let data = res.data;
				this.baseData.opinionVos = data.opinionVos;
			}
		},
		// 后台押货换货单详情
		async loadData() {
			let orderId = this.orderId;
			const params = {
				orderId,
			};
			const res = await this.$fetch(`/mgmt/inventory/exchangeOrder/exchangeOrderDetail?${qs.stringify(params)}`);
			if (res.code === 200) {
				this.baseData = res.data;
				let { orderFileUrl, orderFileName, returnAddress } = this.baseData.orderVo;
				this.baseData.orderVo.orderFileUrl = orderFileUrl || '';
				this.baseData.orderVo.orderFileName = orderFileName || '';
				this.auditForm.returnInfo = returnAddress || ''; // 地址
				// 新品发货状态判断
				this.deliverShow();
				// 倒计时
				this.receivedCountdown(this.baseData.orderVo.receiveTimeDeadline);
				// 附件
				this.newFileList = [];
				let url = this.baseData.orderVo.orderFileUrl.split(',');
				let name = this.baseData.orderVo.orderFileName.split(',');
				if (name.length == 1) {
					let item = {
						name: this.baseData.orderVo.orderFileName,
						url: this.baseData.orderVo.orderFileUrl,
					};
					this.newFileList.push(item);
				} else {
					name.map((e, i) => {
						let item = {
							name: e,
							url: url[i],
						};
						this.newFileList.push(item);
					});
				}
				// 一二级原因
				if (res.data.orderVo.reasonFirst) {
					this.changereasonFirst(res.data.orderVo.reasonFirst);
				}
				this.auditForm.reasonFirst = res.data.orderVo.reasonFirst;
				this.auditForm.reasonSecond = res.data.orderVo.reasonSecond;
				this.returnFrom = {
					...this.returnFrom,
					...res.data.processVo,
				};
				this.newExpressProofList = [];
				if (this.baseData.processVo && this.baseData.processVo.expressProofUrl) {
					let expressProofUrl = this.baseData.processVo.expressProofUrl.split(',');
					let expressProofName = this.baseData.processVo.expressProofName.split(',');
					console.log(expressProofName);
					if (expressProofName.length !== 0) {
						expressProofName.map((e, i) => {
							let item = {
								name: e,
								url: expressProofUrl[i],
							};
							this.newExpressProofList.push(item);
						});
					}
					console.log(this.newExpressProofList);
				}
				console.log(this.newExpressProofList);
				// 报废凭证
				if (this.baseData.processVo && this.baseData.processVo.disposalProofUrl) {
					this.newDisposalProofList = [];
					let disposalProofUrl = this.baseData.processVo.disposalProofUrl.split(',');
					let disposalProofName = this.baseData.processVo.disposalProofName.split(',');
					disposalProofName.map((e, i) => {
						let item = {
							name: e,
							url: disposalProofUrl[i],
						};
						this.newDisposalProofList.push(item);
					});
				}
				this.returns = res.data.exchangeOrderReturnTypePairs;
				this.auditForm.reasonFirstRemarks = res.data.orderVo.reasonFirstRemarks;
				this.auditForm.reasonSecondRemarks = res.data.orderVo.reasonSecondRemarks;
				this.auditForm.exchangeType = res.data.orderVo.exchangeType;
				// this.$set(this.baseData.opinionVos[0],'productDisposalType',null)
				// this.processOrderRecordList = [];
				// res.data.processOrderRecordList.forEach((v) => {
				// 	if (v.isFinish) {
				// 		this.processOrderRecordList.push(v);
				// 	}
				// });
				// this.active = this.processOrderRecordList.length;
				let lastStepsData = [];
				// let length = res.data.processOrderRecordList.length;
				res.data.processOrderRecordList.forEach((e, n) => {
					if (e.isFinish) {
						this.active = n + 1;
						lastStepsData.push(e);
					}
				});
				let processList = res.data.processOrderRecordList;
				// processList.map((item) => {
				// 	if (item.processType == 37 && item.isFinish) {
				// 		processList.splice(length - 1, 1);
				// 	} else if (item.processType == 38 && item.isFinish) {
				// 		processList.splice(length - 2, 1);
				// 	}
				// });
				this.processOrderRecordList = processList;
				this.processOrderRecordList.splice(this.processOrderRecordList.length - 1, 1);
				// 	1: '待审核',2: '待退回',3: '待验货',4: '待发货',5: '待收货',6: '已完成',7: '已取消',
				if ([6, 7].includes(this.baseData.orderVo.orderStatus)) {
					this.processOrderRecordList = lastStepsData;
					this.active = this.processOrderRecordList.length * 1;
				}
				// 是否存在服务中心报废产品
				// let isProductDisposalType = false,
				// 	returnType = true;
				this.baseData.productVos.map(({ productDisposalType }) => {
					if (productDisposalType === 1) {
						this.scrapState = true;
					}
				});
				// this.returns.map(({ type }) => {
				// 	if (type === 1) {
				// 		returnType = false;
				// 	}
				// });
				// this.scrapState = isProductDisposalType && returnType;
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 删除文件
		handleRemoveFile(file, fileList) {
			console.log(file, fileList);
			this.auditForm.auditFileUrl = '';
			this.auditForm.auditFileName = '';
		},
		// 附件文件上传成功
		handleSuccessFile(response, file, fileList) {
			console.log(response, file, fileList);
			this.auditForm.auditFileUrl = response.datas.fileUrlKey;
			this.auditForm.auditFileName =
				response.datas.fileUrlKey.split('/')[response.datas.fileUrlKey.split('/').length - 1];
		},
		// 凭证放大预览
		handlePreview(file) {
			this.returnFrom.disposalProofUrl = file?.response?.datas?.fileUrlKey || file.url;
			console.log(this.returnFrom.disposalProofUrl);
			this.dialogVisible = true;
		},
		// 删除报废凭证文件
		handleDisposalProofRemove(file, fileList) {
			this.returnFrom.disposalProofUrl = this.uploadChange(fileList).url.join(',');
			this.returnFrom.disposalProofName = this.uploadChange(fileList).name.join(',');
			this.changeDataDisposalProofList = fileList;
		},
		// 报废凭证文件上传成功
		handleDisposalProofSuccess(response, file, fileList) {
			this.returnFrom.disposalProofUrl = this.uploadChange(fileList).url.join(',');
			this.returnFrom.disposalProofName = this.uploadChange(fileList).name.join(',');
			this.changeDataDisposalProofList = fileList;
		},
		// 凭证上传失败
		voucherRemove(file, fileList) {
			console.log(file);
			this.voucherList = fileList;
		},
		// 凭证上传成功
		voucherSuccess(response, file, fileList) {
			console.log(response);
			console.log(file);
			this.voucherList = fileList;
		},
		// 图片数据处理
		uploadChange(fileList) {
			let url = [],
				name = [];
			fileList.forEach(v => {
				url.push(v.response.datas.fileUrlKey);
				name.push(v.response.datas.fileUrlKey.split('/')[v.response.datas.fileUrlKey.split('/').length - 1]);
			});
			return { name, url };
		},
		// 退货-后台换货添加审批意见
		async addOpinion(orderId, content) {
			this.btnLoading = true;
			let params = {
				orderId,
				content,
			};
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/addOpinion',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.btnLoading = false;
			this.dialogFormVisible = false; //留言框
			this.contentForm.content = '';
			this.contentId = '';
			this.loadOpionData();
		},
		// 退货后台换货修改审批意见
		async editOpinion(id, content) {
			this.btnLoading = true;
			let params = {
				id,
				content,
			};
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/editOpinion',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.btnLoading = false;
			this.dialogFormVisible = false; //留言框
			this.contentForm.content = '';
			this.loadOpionData();
		},
		// 新增留言
		addConnent() {
			this.contentId = '';
			this.contentForm.content = '';
			this.dialogFormVisible = true;
		},
		// 修改留言
		editContent(id, content) {
			this.contentId = id;
			this.contentForm.content = content;
			this.dialogFormVisible = true; //留言
		},
		// 提交留言
		submitContent(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.contentId) {
						let content = this.contentForm.content;
						this.editOpinion(this.contentId, content);
					} else {
						let orderId = this.orderId;
						let content = this.contentForm.content;
						this.addOpinion(orderId, content);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 退货-后台审核换货单
		async auditOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/auditMortgageExchangeOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				});
			} else {
				this.$message({
					type: 'error',
					message: res.data.message,
				});
			}
		},
		// 退货-后台换货单退回处理
		async processOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/processMortgageExchangeOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				});
			}
		},
		// 退货-后台换货单验货处理
		async inspectOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/inspectMortgageExchangeOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				});
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 退货-后台换货单发货处理
		async deliverMortgageExchangeOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/deliverMortgageExchangeOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				});
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		// 保存1 2级原因
		async updateReason() {
			let params = {
				orderId: this.orderId,
				reasonFirst: this.auditForm.reasonFirst,
				reasonFirstRemarks: this.auditForm.reasonFirstRemarks,
				reasonSecond: this.auditForm.reasonSecond,
				reasonSecondRemarks: this.auditForm.reasonSecondRemarks,
				returnAddressInfo: this.auditForm.returnInfo,
				exchangeType: this.auditForm.exchangeType,
			};
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/exchangeOrder/updateReason',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.loadOpionData();
			this.submitLoading = false;
		},
		// 提交
		handleSubmit() {
			if (this.type === 'audit') {
				this.$refs['auditForm'].validate(valid => {
					if (valid) {
						// let returnInfo = this.auditForm.returnInfo;
						// sessionStorage.setItem('returnInfoChange', returnInfo);
						this.auditForm.id = this.orderId;
						this.auditForm.productVoList = [];
						try {
							this.baseData.productVos.forEach(e => {
								if (!e.productDisposalType) {
									throw new Error();
								}
								let productListItem = {
									id: e.id,
									productNum: e.productNum,
									dailyUseType: e.dailyUseType,
									firstUseTime: e.firstUseTime ? `${e.firstUseTime} 00:00:00` : '',
									happenType: e.happenType,
									productBatch: e.productBatch,
									productProblemDesc: e.productProblemDesc,
									productProductionDate: e.productProductionDate,
									productSn: e.productSn,
									productDisposalType: e.productDisposalType,
								};
								this.auditForm.productVoList.push(productListItem);
							});
						} catch (e) {
							this.$message({
								message: '请选择旧品处理方式',
								type: 'warning',
							});
							return;
						}

						let params = this.auditForm;
						if (this.baseData.opinionVos.length > 0) {
							this.auditOrder(params);
						} else {
							this.$message({
								message: '请输入审批意见',
								type: 'warning',
							});
						}
					} else {
						return false;
					}
				});
			} else if (this.type === 'return') {
				this.$refs['returnFrom'].validate(valid => {
					if (valid) {
						this.returnFrom.orderId = this.orderId;
						if (this.returnFrom.returnType == 1 && !this.returnFrom.disposalProofUrl) {
							this.$message({
								message: '退回方式为"服务中心报废"时，报废凭证为必填',
								type: 'warning',
							});
						} else {
							let params = this.returnFrom;
							this.processOrder(params);
						}
					} else {
						return false;
					}
				});
			} else if (this.type === 'check') {
				this.$refs['checkForm'].validate(valid => {
					if (valid) {
						this.checkForm.orderId = this.orderId;
						if (this.voucherList.length !== 0) {
							this.checkForm.inspectProof = [];
							this.voucherList.forEach(v => {
								this.checkForm.inspectProof.push(v.response.datas.fileUrlKey);
							});
						}
						this.checkForm.expressSubsidy = Number(this.checkForm.inspectStatus) ? this.checkForm.expressSubsidy : 0;
						let params = this.checkForm;
						this.inspectOrder(params);
					} else {
						return false;
					}
				});
			} else if (this.type === 'enterShipment') {
				this.$refs['enterShipemntForm'].validate(valid => {
					if (valid) {
						this.enterShipemntForm.orderId = this.orderId;
						let params = this.enterShipemntForm;
						this.deliverMortgageExchangeOrder(params);
					} else {
						return false;
					}
				});
			}
		},
		// 取消
		handleCancel() {
			// this.$refs[formName].resetFields();
			this.$nextTick(() => {
				this.$dispatch('UP_LIST');
				this.$closeSelf();
			});
		},
		// 快递凭证上传成功
		handleExpressSuccess(response, file, fileList) {
			this.returnFrom.expressProofUrl = this.uploadChange(fileList).url.join(',');
			this.returnFrom.expressProofName = this.uploadChange(fileList).name.join(',');
			this.changeDataList = fileList;
		},
		// 快递凭证删除
		handleExpressRemove(file, fileList) {
			// console.log(file, fileList);
			this.returnFrom.expressProofUrl = this.uploadChange(fileList).url.join(',');
			this.returnFrom.expressProofName = this.uploadChange(fileList).name.join(',');
			this.changeDataList = fileList;
		},
	},
};
</script>

<style lang="scss" scoped>
.blue {
	color: #3883f8;
	cursor: pointer;
	margin-right: 15px;
}
::v-deep .el-loading-spinner {
	margin-top: 0;
	transform: translateY(-50%);
}
::v-deep.charging-detail {
	.red {
		color: red;
		font-size: 12px;
	}
	.mt20 {
		margin-top: 20px;
	}
	.m10 {
		margin: 20px;
	}
	.box-card {
		margin: 24px 0;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
	.fileStyle {
		margin-left: 180px;
		margin-top: -40px;
	}
	.el-textarea__inner {
		height: 90px;
	}
	.title {
		margin-bottom: 30px;
		font-weight: 500;
		color: rgba(48, 51, 54, 1);
		.printing_btn {
			margin-left: 20px;
		}
	}
	.flex {
		display: flex;
		font-weight: 400;
		font-size: 14px;
		color: rgba(92, 98, 104, 1);
		.label {
			width: 180px;
			text-align: right;
		}
		.content {
			margin-left: 0px;
		}
	}
	.el-collapse-item__content {
		padding: 0;
	}
	.el-collapse-item__header {
		background-color: #f9f9f9;
	}
	.head_div {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f9f9f9;
		padding-left: 16px;
		padding-right: 5px;
	}
	.project_name {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		div {
			margin-right: 40px;
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
	.min-width {
		min-width: 1224px;
	}
	.self-width {
		width: 375px;
	}
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
	.handle_state_font {
		font-size: 26px;
		color: #1b7eda;
	}
	.examine_btn {
		margin: 6px 0 0 15px;
	}
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
.el-form-item {
	margin-bottom: 5px;
}
.opinion_div {
	font-size: 15px;
	.required {
		color: red;
		margin: 0 6px;
	}
}
</style>

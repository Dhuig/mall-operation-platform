<template>
	<div class="charging-detail">
		<!-- 基本信息 -->
		<el-card class="box-card">
			<div class="title">
				<span>基本信息</span>
				<el-button
					v-if="baseData.orderVo && ![1, 5].includes(baseData.orderVo.orderStatus)"
					class="printing_btn"
					type="primary"
					v-permission="'return_exchange_detail_printing'"
					@click="printing(orderId)"
				>
					打印
				</el-button>
			</div>
			<el-form
				:inline="true"
				:model="auditForm"
				:rules="RETURN_EXCHANGE_ADUIT_RULE"
				ref="auditForm"
				label-width="160"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="7">
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
									:disabled="!auditForm.returnInfo || baseData.opinionVoList.length === 0"
									v-if="type === 'audit'"
									v-permission="'return_exchange_detail_validate'"
									@click="examineState = true"
								>
									审核
								</el-button>
								<el-form-item label="退货单号">
									<span>{{ baseData.orderVo && baseData.orderVo.orderSn }}</span>
								</el-form-item>
								<el-form-item label="取消原因" v-if="baseData.orderVo && baseData.orderVo.cancelReason">
									<span>{{ baseData.orderVo && baseData.orderVo.cancelReason }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
					<!-- <el-col :span="8">
						<el-form-item label="退货单号">
							<span>{{ baseData.orderVo && baseData.orderVo.orderSn }}</span>
						</el-form-item>
					</el-col>-->
					<el-col :span="10">
						<el-steps :active="active" align-center>
							<el-step
								v-for="(item, index) in processOrderRecordVOList"
								:key="index"
								:title="item.processName"
								:description="item.createTime"
							></el-step>
						</el-steps>
					</el-col>
				</el-row>
				<el-row class="min-width mt20">
					<el-col :span="7">
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
									:key="option.id"
									:label="option.label"
									:value="option.label"
								></el-option>
							</el-select>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonFirst }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="一级原因备注说明" prop="reasonFirstRemarks">
							<el-input
								v-if="type == 'audit'"
								v-model="auditForm.reasonFirstRemarks"
								placeholder="请输入一级原因备注说明"
							></el-input>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonFirstRemarks }}</span>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="8">
						<el-form-item label="退货地址">
							<span>{{ baseData.orderVo && baseData.orderVo.returnAddress }}</span>
						</el-form-item>
					</el-col>-->
				</el-row>
				<el-row class="min-width">
					<el-col :span="7">
						<el-form-item label="二级原因" prop="reasonSecond">
							<el-select
								v-if="type == 'audit'"
								v-model="auditForm.reasonSecond"
								placeholder="请选择二级原因"
								style="height: 32px"
							>
								<el-option
									v-for="option in reasonSecondOptions"
									:key="option.id"
									:label="option.label"
									:value="option.label"
								></el-option>
							</el-select>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonSecond }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="二级原因备注说明" prop="reasonSecondRemarks">
							<el-input
								v-if="type == 'audit'"
								v-model="auditForm.reasonSecondRemarks"
								placeholder="请输入二级原因备注说明"
							></el-input>
							<span v-else>{{ baseData.orderVo && baseData.orderVo.reasonSecondRemarks }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width mt20" v-if="type === 'audit'">
					<el-col :span="12">
						<el-form-item label="退换货产品退回地址" prop="returnInfo">
							<el-input
								style="width: 400px"
								maxlength="200"
								type="textarea"
								placeholder="请输入分公司或指定仓库的产品接收地址，含：收货人姓名、电话、地址等信息"
								v-model="auditForm.returnInfo"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<!-- 审批意见 -->
		<el-card class="box-card" v-if="orderMark == 1 || orderMark == ''">
			<!-- <el-collapse>
			<el-collapse-item>-->
			<!-- <template slot="title"> -->
			<div class="opinion_div">
				<span class="required">*</span>
				审批意见
				<el-button
					type="primary"
					v-if="type == 'audit' && $permission('return_exchange_detail_add_suggestion')"
					@click="addConnent"
					class="m10"
				>
					添加意见
				</el-button>
			</div>
			<!-- </template> -->
			<el-dialog title="新增留言" :visible.sync="dialogFormVisible" v-drag>
				<el-form :model="contentForm" ref="contentForm" :rules="contentRules">
					<el-form-item label="输入留言" label-width="120" prop="content">
						<el-input v-model="contentForm.content" auto-complete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitContent('contentForm')">确 定</el-button>
				</div>
			</el-dialog>
			<el-table :data="baseData.opinionVoList" style="width: 100%" border>
				<el-table-column prop="opt" label="序号" width="80px">
					<template slot-scope="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productCode" label="留言时间" width="180">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productName" label="留言人">
					<template slot-scope="scope">
						<span>{{ scope.row.submitMan }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="specification" label="分公司">
					<template slot-scope="scope">
						<span>{{ scope.row.companyName }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="unit" label="留言内容">
					<template slot-scope="scope">
						<span>{{ scope.row.content }}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="type == 'audit'" prop="unit" label="操作">
					<template slot-scope="scope">
						<el-button
							v-permission="'return_exchange_detail_edit_suggestion'"
							type="text"
							@click="editContent(scope.row.id, scope.row.content)"
						>
							修改
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- </el-collapse-item> -->
			<!-- <div class="title">审批意见</div> -->
			<!-- </el-collapse> -->
		</el-card>
		<!--其它信息  -->
		<el-card class="box-card">
			<el-collapse>
				<el-collapse-item title="更多信息" name="1">
					<el-form :inline="true" label-width="140px" :model="otherForm" label-suffix=":">
						<el-row class="min-width">
							<el-col :span="6">
								<el-form-item label="退货单类型" prop="orderSource">
									<span>{{ baseData.orderVo && baseData.orderVo.orderSourceMsg }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="退货标识" prop="orderMark">
									<span>{{ baseData.orderVo && baseData.orderVo.orderMark | orderMark }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="服务中心编号" prop="storeCode">
									<span>{{ baseData.orderVo && baseData.orderVo.storeCode }}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="min-width">
							<el-col :span="6">
								<el-form-item label="提交人" prop="delivery">
									<span>{{ baseData.orderVo && baseData.orderVo.submitMan }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="提交编号" prop="recordTime">
									<span>{{ baseData.orderVo && baseData.orderVo.id }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="提交日期" prop="recordTime">
									<span>{{ baseData.orderVo && baseData.orderVo.createTime | format }}</span>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-collapse-item>
				<!-- <div class="title">更多信息</div> -->
			</el-collapse>
		</el-card>
		<!-- 申请退货产品 -->
		<el-card class="box-card">
			<div class="title">
				申请退货产品
				<span class="red">押货退货金额合计：￥{{ totalAmount || 0 }}</span>
				<span class="red">零售价合计：￥{{ retailPriceTotal || 0 }}</span>
			</div>
			<div class="tab_box">
				<el-table :data="baseData.productVoList" style="width: 100%" border show-summary :summary-method="getSummaries">
					<el-table-column prop="opt" label="序号" width="80px">
						<template slot-scope="scope">
							<span>{{ scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productCode" label="产品编号/ 定制品二级编码" width="200">
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
					<el-table-column prop="productMortgagePrice" label="押货价">
						<template slot-scope="scope">
							<span>￥{{ scope.row.productMortgagePrice }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productRetailPrice" label="零售价">
						<template slot-scope="scope">
							<span>¥{{ scope.row.productRetailPrice }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productNum" label="退货数量">
						<template slot-scope="scope">
							<span>{{ scope.row.productNum }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productRemarks" label="备注">
						<template slot-scope="scope">
							<span>{{ scope.row.productRemarks }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productRealNum" label="实退数量" width="120">
						<template slot-scope="scope">
							<el-input
								v-if="type == 'check'"
								@input="checkProductRealNum(scope.row)"
								v-model="scope.row.productRealNum"
								placeholder="请输入"
							></el-input>
							<span v-else>{{ scope.row.productRealNum }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="productRealAmount" label="实退总金额" width="140px">
						<!-- <template slot-scope="scope"> -->
						<!-- <el-input style="width: 100px" v-if="type == 'check'" v-model="scope.row.productRealAmount"></el-input> -->
						<!-- <span>{{ scope.row.productRealAmount }}</span> -->
						<!-- <span v-if="type === 'check'">{{ getData(scope.row) }}</span>
						<span v-else>{{ getAduitData(scope.row) }}</span>-->
						<!-- </template> -->
					</el-table-column>
				</el-table>
				<el-input
					v-if="['check', 'detail'].includes(type)"
					:disabled="type === 'detail'"
					class="all_money"
					v-model="checkForm.orderReturnRealAmount"
					placeholder="请输入"
				></el-input>
			</div>
		</el-card>

		<!--审核审批信息  -->
		<el-dialog title="审批信息" :visible.sync="examineState" v-drag>
			<el-form
				:inline="true"
				label-width="150px"
				:model="auditForm"
				:rules="RETURN_EXCHANGE_ADUIT_RULE"
				ref="auditForm"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="审核结果" prop="auditStatus">
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
				<el-button v-if="type !== 'detail'" :loading="submitLoading" @click="handleSubmit()">提交</el-button>
			</div>
		</el-dialog>
		<!-- <el-card class="box-card" v-if="type == 'audit' && (orderMark == 1 || orderMark == '')">
			<div class="title">审批</div>
			<el-form
				:inline="true"
				label-width="150px"
				:model="auditForm"
				:rules="RETURN_EXCHANGE_ADUIT_RULE"
				ref="auditForm"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="12">
						<el-form-item label="审核结果" prop="auditStatus">
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
						<el-form-item label="退货地址信息" prop="returnInfo">
							<el-input
								type="textarea"
								placeholder="请填写联系人，联系方式及退货地址"
								v-model="auditForm.returnInfo"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card> -->
		<!--审批信息  -->
		<el-card
			class="box-card"
			v-if="(type == 'return' || type == 'detail' || type == 'check') && (orderMark == 1 || orderMark == '')"
		>
			<div class="title">审批信息</div>
			<el-form :inline="true" label-width="160px" :model="otherForm" label-suffix=":">
				<el-row class="min-width">
					<el-col :span="6">
						<el-form-item label="审批日期" prop="auditTime">
							<span>{{ baseData.orderVo && baseData.orderVo.auditTime | format }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="审批人" prop="auditMan">
							<span>{{ baseData.orderVo && baseData.orderVo.auditMan }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="审批意见">
							<span>{{ baseData.orderVo && baseData.orderVo.auditStatus | auditStatus }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="6" v-if="baseData.orderVo">
						<el-form-item label="附件">
							<a
								v-if="baseData.orderVo.auditFileUrl"
								target="_blank"
								:href="baseData.orderVo && baseData.orderVo.auditFileUrl"
							>
								查看文件
							</a>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="审核备注" prop="auditRemarks">
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
		<el-card class="box-card" v-if="type != 'audit' && (orderMark == 1 || orderMark == '')">
			<div class="title">退回信息</div>
			<el-form
				:model="returnFrom"
				ref="returnFrom"
				:rules="RETURN_EXCHANGE_RETURN_RULE"
				:inline="true"
				label-width="140px"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="6">
						<el-form-item label="退回方式" prop="returnType">
							<el-select v-if="type == 'return'" v-model="returnFrom.returnType" placeholder="请选择">
								<el-option
									v-for="item in returns"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							<span v-else>{{ baseData.processVo && baseData.processVo.returnType | returnType }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="物流公司" prop="expressCompany">
							<el-input
								v-if="type == 'return' || returnFrom.returnType == 2"
								v-model="returnFrom.expressCompany"
								placeholder="请输入物流公司"
							></el-input>
							<span v-else>{{ baseData.processVo && baseData.processVo.expressCompany }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="运单号" prop="expressNo">
							<el-input
								v-if="type == 'return' || returnFrom.returnType == 2"
								v-model="returnFrom.expressNo"
								placeholder="请输入运单号"
							></el-input>
							<span v-else>{{ baseData.processVo && baseData.processVo.expressNo }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="6">
						<el-form-item label="快递凭证" prop="expressFreightProof">
							<div v-if="type == 'return' || returnFrom.returnType == 2">
								<el-upload
									class="avatar-uploader"
									:action="$store.getters['system/getOssUploadUrl']"
									:data="uploadData"
									:limit="1"
									:headers="$store.getters['system/getSignatureVerification']"
									list-type="picture-card"
									:on-preview="handlePictureCardPreview"
									:on-remove="handleRemove"
									:on-success="handleSuccess"
									:file-list="changeDataList"
									:class="changeDataList.length == 1 ? 'hide_box' : ''"
								>
									<i class="el-icon-plus"></i>
								</el-upload>
								<el-dialog :visible.sync="dialogVisible" v-drag>
									<img width="100%" :src="returnFrom.expressFreightProof" alt />
								</el-dialog>
							</div>
							<div v-else>
								<img
									width="100px"
									@click="dialogExpressProofVisible = true"
									v-if="baseData.processVo && baseData.processVo.expressFreightProof"
									:src="baseData.processVo.expressFreightProof"
									alt
								/>
								<el-dialog title="快递凭证" :visible.sync="dialogExpressProofVisible" width="30%" v-drag>
									<img
										v-if="baseData.processVo && baseData.processVo.expressFreightProof"
										width="100%"
										:src="baseData.processVo.expressFreightProof"
										alt
									/>
								</el-dialog>
							</div>
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
		<el-card class="box-card" v-if="(type == 'check' || type == 'detail') && (orderMark == 1 || orderMark == '')">
			<div class="title">验货信息</div>
			<el-form
				:inline="true"
				label-width="140px"
				ref="checkForm"
				:model="checkForm"
				:rules="RETURN_EXCHANGE_CHECK_RULE"
				label-suffix=":"
			>
				<el-row class="min-width">
					<el-col :span="6" v-if="type == 'detail' || type === 'detail'">
						<el-form-item label="验货日期" prop="createTime">
							<span>{{ baseData.inspectVo && baseData.inspectVo.createTime | format }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6" v-if="type == 'detail' || type === 'detail'">
						<el-form-item label="验货人" prop="inspectMan">
							<span>{{ baseData.inspectVo && baseData.inspectVo.inspectMan }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6" v-if="type == 'check' || type === 'detail'">
						<el-form-item label="验货意见" prop="inspectStatus">
							<el-select v-if="type == 'check'" v-model="checkForm.inspectStatus" placeholder="请选择">
								<el-option v-for="item in checks" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<span v-else>{{ baseData.inspectVo && baseData.inspectVo.inspectStatus | inspectStatus }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="min-width">
					<el-col :span="6" v-if="checkForm.inspectStatus !== '0'">
						<el-form-item label="运费补贴(<=500元)" prop="expressSubsidy">
							<el-input
								v-if="type == 'check'"
								type="number"
								v-model="checkForm.expressSubsidy"
								min="0"
								max="500"
								@blur="checkExpressSubsidy(checkForm.expressSubsidy)"
								placeholder="请输入运费补贴"
							></el-input>
							<span v-if="baseData.inspectVo && baseData.inspectVo.inspectStatus == 1">
								{{ baseData.inspectVo && baseData.inspectVo.expressSubsidy }}
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
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
				</el-row>
			</el-form>
		</el-card>
		<!-- 按钮 -->
		<!-- <div class="eidt-btn-footer" v-if="type != 'detail'">
		<div class="eidt-btn-footer-box">-->
		<actionBar>
			<el-button v-if="type === 'audit'" :loading="submitLoading" @click="updateReason()">保存</el-button>
			<el-button
				v-if="!['detail', 'audit'].includes(type) && $permission('return_exchange_detail_submit')"
				:loading="submitLoading"
				@click="handleSubmit()"
			>
				提交
			</el-button>
			<el-button @click="handleCancel()">返回</el-button>
		</actionBar>
		<!-- </div>
		</div>-->
	</div>
</template>
<script>
import {
	RETURN_EXCHANGE_CHECK_RULE,
	RETURN_EXCHANGE_ADUIT_RULE,
	RETURN_EXCHANGE_RETURN_RULE,
	ORDER_STATUS,
	ORDER_SOURCE,
	ORDER_MARK,
	AUDIT_STATUS,
	RETURN_TYPE,
	INSPECT_STATUS,
} from './config';
import qs from 'querystring';
import { formatDate } from 'util/formValidation';
import { filters } from 'plugins/filters';

export default {
	name: 'returnExchangeDetail',
	data() {
		return {
			headers: {
				Authorization: this.$store.getters['user/getFullToken'],
			},
			RETURN_EXCHANGE_CHECK_RULE, //验货校验规则
			RETURN_EXCHANGE_ADUIT_RULE, //审核校验规则
			RETURN_EXCHANGE_RETURN_RULE, //退回校验规则
			// 一级原因
			reasonFirstOptions: [],
			// 二级原因
			reasonSecondOptions: [],
			dialogExpressProofVisible: false,
			auditForm: {
				id: '',
				auditRemarks: '',
				auditFileName: '',
				auditStatus: '',
				auditFileUrl: '',
				reasonFirst: '',
				reasonFirstRemarks: '',
				reasonSecond: '',
				reasonSecondRemarks: '',
				returnInfo: '', //退回地址信息
			}, //审核
			returnFrom: {
				orderId: '',
				returnType: '',
				expressNo: '',
				expressCompany: '',
				expressFreightProof: '',
				expressFreightProofName: '',
				processRemarks: '',
			},
			checkForm: {
				orderId: '',
				inspectStatus: '',
				expressSubsidy: 0,
				inspectRemarks: '',
				orderReturnRealAmount: 0,
				productList: [],
			},
			checkData: {
				productCode: '',
				productName: '',
				productPacking: '',
				productUnit: '',
				productMortgagePrice: '',
				productRetailPrice: '',
				productNum: '',
				productRemarks: '',
				productRealNum: '',
				productRealAmount: '',
			},
			// 验货物品信息
			productListItem: {
				id: '',
				productRealNum: '',
				productRealAmount: '',
			},
			reasonList: [],
			changeDataList: [], // 变更信息图片列表
			baseData: {
				opinionVoList: [],
			},
			orderId: '',
			active: 0,
			type: '', // 页面来源（审核or详情）
			otherForm: {
				delivery: false,
			},
			detail: [],
			// 快递凭证
			imageUrl: '',
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
					label: '自带',
				},
				{
					value: '2',
					label: '邮寄',
				},
			],
			examineState: false, // 审核弹框
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
			dialogFormVisible: false, //留言框
			contentForm: {
				content: '',
			},
			contentRules: {
				content: [{ required: true, message: '请输入留言', trigger: 'blur' }],
			},
			orderMark: '',
			fileList: [],
			contentId: '', //单个留言Id
			processOrderRecordVOList: [], //进度信息
			auditRules: {
				result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
			},
			dialogVisible: false,
			orderSn: '',
			opinionState: false, // 添加、修改意见
			isReasonSecond: '', // 二级原因
			reasonFirstText: '',
			reasonSecondText: '',
			totalAmount: '', // 押货退货金额合计
			submitLoading: false, // 提交loading
		};
	},
	filters: {
		// 押货单状态
		orderStatus(val) {
			return val in ORDER_STATUS ? ORDER_STATUS[val] : '';
		},
		// 退货单类型
		orderSource(val) {
			return val in ORDER_SOURCE ? ORDER_SOURCE[val] : '';
		},
		// 退货单类型
		orderMark(val) {
			return val in ORDER_MARK ? ORDER_MARK[val] : '';
		},
		// 审批意见
		auditStatus(val) {
			return val in AUDIT_STATUS ? AUDIT_STATUS[val] : '';
		},
		// 退回方式
		returnType(val) {
			return val in RETURN_TYPE ? RETURN_TYPE[val] : '';
		},
		// 验货意见
		inspectStatus(val) {
			return val in INSPECT_STATUS ? INSPECT_STATUS[val] : '';
		},
		// 格式时间
		format(val) {
			if (!val) return;
			return formatDate(val);
		},
	},
	watch: {
		'checkForm.orderReturnRealAmount'(val) {
			if (this.type === 'check') {
				this.totalAmount = val;
			}
		},
	},
	computed: {
		// 零售价合计
		retailPriceTotal() {
			let totalRetailPrice = 0;
			this.baseData.productVoList &&
				this.baseData.productVoList
					.map(item => (totalRetailPrice += item.productRetailPrice * (item.productRealNum || item.productNum)))
					.reduce((acc, cur) => parseFloat(cur) + acc, 0);
			return filters.rounding(totalRetailPrice, 2);
		},
		uploadData() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.stock,
			};
			return params;
		},
	},
	mounted() {
		let type = this.$route.query.type;
		this.orderMark = this.$route.query.orderMark ? this.$route.query.orderMark : '';
		this.orderId = this.$route.query.id ? this.$route.query.id : '';
		this.orderSn = this.$route.query.orderSn ? this.$route.query.orderSn : '';
		// let returnInfo = sessionStorage.getItem('returnInfo') ? sessionStorage.getItem('returnInfo') : '';
		// this.auditForm.returnInfo = returnInfo;
		this.getReason();
		setTimeout(() => {
			this.loadData();
			this.type = type;
		}, 500);
	},
	methods: {
		// 打印
		printing(orderId) {
			this.$go('return_exchange_printing', { orderId });
		},
		// 后台押货退货单详情
		async loadData() {
			let res = '';
			// 单号请求
			if (this.orderSn) {
				let orderSn = this.orderSn;
				const params = {
					orderSn,
				};
				res = await this.$fetch(`/mgmt/inventory/returnOrder/getOrderDetailBySn?${qs.stringify(params)}`);
			} else {
				// id请求
				let orderId = this.orderId;
				const params = {
					orderId,
				};
				res = await this.$fetch(`/mgmt/inventory/returnOrder/getOrderDetail?${qs.stringify(params)}`);
			}
			if (res.code === 200) {
				this.baseData = res.data;
				if (this.baseData.orderVo.orderStatus === 4) {
					this.totalAmount = filters.rounding(this.baseData.orderVo.orderReturnRealAmount, 2);
				} else {
					this.totalAmount = filters.rounding(this.baseData.orderVo.orderReturnAmount, 2);
				}

				// let length = res.data.processOrderRecordVOList.length;
				// this.changereasonFirst(res.data.orderVo.reasonFirst);
				if (res.data.orderVo.reasonFirst && !this.opinionState) {
					this.changereasonFirst(res.data.orderVo.reasonFirst);
				}
				this.auditForm.returnInfo = this.baseData.orderVo.returnAddress;
				this.reasonSecondOptions.forEach(item => {
					if (item.value === this.baseData.orderVo.reasonSecond || item.label === this.baseData.orderVo.reasonSecond) {
						this.isReasonSecond = item.label;
					}
				});

				if (this.orderMark == 2) {
					this.processOrderRecordVOList = [
						{
							processName: '套装组合退货',
							createTime: '',
						},
						{
							processName: '完成',
							createTime: '',
						},
					];
					this.active = 2;
				} else if (this.orderMark === 3) {
					this.processOrderRecordVOList = [
						{
							processName: '套装拆分退货 ',
							createTime: '',
						},
						{
							processName: '完成',
							createTime: '',
						},
					];
					this.active = 2;
				} else if (this.orderMark === 4) {
					this.processOrderRecordVOList = [
						{
							processName: '押货修改退货 ',
							createTime: '',
						},
						{
							processName: '完成',
							createTime: '',
						},
					];
					this.active = 2;
				} else {
					this.processOrderRecordVOList = res.data.processOrderRecordVOList;
					let lastStepsData = [];
					res.data.processOrderRecordVOList.forEach((e, n) => {
						if (e.isFinish) {
							this.active = n + 1;
							// 完成/取消的展示数据
							lastStepsData.push(e);
						}
					});
					let processList = this.processOrderRecordVOList;
					this.processOrderRecordVOList = processList;
					// 1: '待审核',2: '待退回',3: '待验货',4: '已完成',5: '已取消',
					if ([4, 5].includes(this.baseData.orderVo.orderStatus)) {
						this.processOrderRecordVOList = lastStepsData;
						this.active = this.processOrderRecordVOList.length * 1;
					}
				}

				if (this.type == 'audit') {
					// 一二级原因赋值-添加意见接口刷新
					if (!this.opinionState) {
						this.auditForm.reasonFirst = this.baseData.orderVo.reasonFirst;
						// 获取二级原因文本
						let reasonSecond = this.reasonSecondOptions.find(({ label }) => {
							return label === this.baseData.orderVo.reasonSecond;
						});

						this.auditForm.reasonFirstRemarks = this.baseData.orderVo.reasonFirstRemarks;
						this.auditForm.reasonSecond = reasonSecond.label;
						this.auditForm.reasonSecondRemarks = this.baseData.orderVo.reasonSecondRemarks;
					}
				}
				// 一二级原因-添加意见接口刷新
				// if(this.opinionState){
				// 	this.auditForm.reasonFirst = this.baseData.orderVo.reasonFirst
				// 	this.auditForm.reasonFirstRemarks = this.baseData.orderVo.reasonFirstRemarks;
				// 	this.auditForm.reasonSecond = this.b	aseData.orderVo.reasonSecond
				// 	this.auditForm.reasonSecondRemarks = this.baseData.orderVo.reasonSecondRemarks;
				// }
				// this.auditForm.reasonFirst = this.opinionState
				// 	? this.auditForm.reasonFirst
				// 	: this.baseData.orderVo.reasonFirst;

				// this.auditForm.reasonFirstRemarks = this.opinionState
				// 	? this.reasonFirstText
				// 	: this.auditForm.reasonFirstRemarks;
				// 二级原因赋值、添加意见接口刷新
				// this.auditForm.reasonSecond = this.opinionState
				// 	? this.auditForm.reasonSecond
				// 	: this.baseData.orderVo.reasonSecond;

				// this.auditForm.reasonSecondRemarks = this.opinionState
				// 	? this.reasonSecondText
				// 	: this.auditForm.reasonSecondRemarks;
				// }
				// this.baseData.productVoList.forEach(e => {
				// 	if (!e.productRealNum && e.productRealNum !== 0) {
				// 		e.productRealNum = e.productRealNum || e.productNum;
				// 	}
				// });
				if (this.baseData.orderVo.orderStatus !== 4) {
					// this.baseData?.productVoList.forEach(e => (e.productRealAmount = e.productMortgagePrice * e.productNum));
					this.baseData?.productVoList.forEach(e => {
						e.productRealAmount = (e.productMortgagePrice * e.productNum).toFixed(2);
						e.productRealNum = e.productRealNum || e.productNum;
					});
				} else {
					this.checkForm.orderReturnRealAmount = this.baseData.orderVo.orderReturnRealAmount;
				}
			} else {
				this.$message({
					type: 'error',
					message: res.message,
				});
			}
		},
		getData(row) {
			row.productRealAmount = filters.rounding(Number(row.productRealNum) * Number(row.productMortgagePrice), 2);
		},
		// 校验实退数量<退货数量
		checkProductRealNum(row) {
			if (row.productRealNum > row.productNum) {
				row.productRealNum = row.productNum;
			}
			this.getData(row);
		},
		// 申请退货产品合计
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '总价';
					return;
				}
				const values = data.map(item => Number(item[column.property]));
				// 实退数量和实退总金额才会有总计
				if (
					!values.every(value => isNaN(value)) &&
					(column.property === 'productRealNum' || column.property === 'productRealAmount')
				) {
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr);
						if (!isNaN(value)) {
							if (this.type !== 'detail') {
								this.checkForm.orderReturnRealAmount =
									column.property === 'productRealAmount' ? filters.rounding(Number(prev) + Number(curr), 2) : 0;
							}
							return Number(prev) + Number(curr);
						} else {
							return Number(prev);
						}
					}, 0);
				}
			});
			return sums;
		},
		checkProductRealAmount(row) {
			let num = Number(row.productRealAmount);
			let price = Number(row.productMortgagePrice * row.productNum);
			if (num > price) {
				num = price;
			} else if (num < 0) {
				num = 0;
			}
			row.productRealAmount = num;
		},
		checkExpressSubsidy(num) {
			let n = Number(num);
			if (n > 500) {
				n = 500;
				this.checkForm.expressSubsidy = 500;
			}
			if (n < 0) {
				n = 0;
				this.checkForm.expressSubsidy = 0;
			}
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
		handlePictureCardPreview(file) {
			this.returnFrom.expressFreightProof = file.url;
			this.dialogVisible = true;
		},
		//变更资料图片上传成功
		handleSuccess(response, file, fileList) {
			this.returnFrom.expressFreightProof = response.datas.fileUrlKey;
			this.returnFrom.expressFreightProofName =
				response.datas.fileUrlKey.split('/')[response.datas.fileUrlKey.split('/').length - 1];
			this.changeDataList = fileList;
		},
		//变更图片删除
		handleRemove(file, fileList) {
			console.log(file, fileList);
			this.returnFrom.expressFreightProof = '';
			this.returnFrom.expressFreightProofName = '';
			this.changeDataList = fileList;
		},

		// 退货-后台退货添加审批意见
		async addOpinion(orderId, content) {
			let params = {
				orderId,
				content,
			};
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/returnOrder/addOpinion',
				data: params,
			});
			if (res && res.code === 200) {
				this.opinionState = true;
				this.reasonFirstText = this.auditForm.reasonFirstRemarks;
				this.reasonSecondText = this.auditForm.reasonSecondRemarks;
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.dialogFormVisible = false; //留言框
				this.contentForm.content = '';
				this.contentId = '';
				this.loadData();
			}
		},
		// 退货-后台退货修改审批意见
		async editOpinion(id, content) {
			let params = {
				id,
				content,
			};
			this.opinionState = true;
			this.reasonFirstText = this.auditForm.reasonFirstRemarks;
			this.reasonSecondText = this.auditForm.reasonSecondRemarks;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/returnOrder/editOpinion',
				data: params,
			});
			if (res && res.code === 200) {
				this.opinionState = true;
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.dialogFormVisible = false; //留言框
			this.contentForm.content = '';
			this.loadData();
		},
		// 删除文件
		handleRemoveFile(file, fileList) {
			console.log(file, fileList);
			this.auditForm.auditFileUrl = '';
			this.auditForm.auditFileName = '';
		},
		// 文件上传成功
		handleSuccessFile(response, file, fileList) {
			console.log(response, file, fileList);
			this.auditForm.auditFileUrl = response.datas.fileUrlKey;
			this.auditForm.auditFileName =
				response.datas.fileUrlKey.split('/')[response.datas.fileUrlKey.split('/').length - 1];
		},
		// 获取各种原因
		async getReason() {
			this.reasonFirstOptions = [];
			let type = 3;
			const params = {
				type,
			};
			const res = await this.$fetch(`/mgmt/inventory/common/getReason?${qs.stringify(params)}`);
			let list = res.data;
			list.forEach(e => {
				let item = {
					value: e.id,
					label: e.returnReason,
				};
				this.reasonFirstOptions.push(item);
			});
			this.reasonList = res.data;
		},
		changereasonFirst(id) {
			this.reasonSecondOptions = [];
			this.auditForm.reasonSecond = '';
			this.reasonList.forEach(e => {
				if (e.returnReason == id) {
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
		// 确认
		handleSave(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					alert('submit!');
				} else {
					return false;
				}
			});
		},
		// 退货-后台审核退货单
		async auditOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/returnOrder/auditOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res.code === 200) {
				this.auditForm.returnInfo = '';
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
		// 退货-后台退货单退回处理
		async processOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/returnOrder/processOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res.code == 200) {
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
		// 退货-后台退货单验货处理
		async inspectOrder(params) {
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/returnOrder/inspectOrder',
				data: params,
			});
			this.submitLoading = false;
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
				this.$nextTick(() => {
					this.$dispatch('UP_LIST');
					this.$closeSelf();
				});
			}
			if (!res) {
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
			};
			this.submitLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: 'mgmt/inventory/returnOrder/updateReason',
				data: params,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
				});
			}
			this.loadData();
			this.submitLoading = false;
		},
		// 提交
		handleSubmit() {
			if (this.type === 'audit') {
				this.$refs['auditForm'].validate(valid => {
					if (valid) {
						// let returnInfo = this.auditForm.returnInfo;
						// sessionStorage.setItem('returnInfo', returnInfo);
						this.auditForm.id = this.orderId;
						let params = this.auditForm;
						if (this.baseData.opinionVoList.length > 0) {
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
						let params = this.returnFrom;
						this.processOrder(params);
					} else {
						return false;
					}
				});
			} else if (this.type === 'check') {
				// 验货
				this.$refs['checkForm'].validate(valid => {
					if (valid) {
						this.checkForm.orderId = this.orderId;
						this.checkForm.productList = [];
						// if(this.checkForm.inspectStatus==1&&this.checkForm.expressSubsidy==0){
						// 	this.$message({
						// 		type: 'error',
						// 		message: '验货通过时，补贴不可为0',
						// 	});
						// 	return;
						// }
						this.baseData.productVoList.forEach(e => {
							let productListItem = {
								id: e.id,
								productRealNum: e.productRealNum,
								productRealAmount: e.productRealAmount,
							};
							this.checkForm.productList.push(productListItem);
						});
						let params = this.checkForm;
						// let list = this.baseData.productVoList;
						// list.map((e) => {
						// if (e.productRealAmount == 0) {
						// 	this.$message.error('申请退款产品的实退总金额不可为0');
						// } else {
						this.inspectOrder(params);
						// }
						// });
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
	},
};
</script>

<style lang="scss" scoped>
::v-deep.charging-detail {
	.red {
		color: red;
		font-size: 12px;
		margin-left: 50px;
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
	.fileStyle {
		margin-left: 180px;
		margin-top: -40px;
	}
	.btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
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
	.tab_box {
		min-width: 1108px;
		position: relative;
		overflow: auto;
		.all_money {
			position: absolute;
			bottom: 4px;
			width: 100px !important;
			height: 40px;
			right: 34px;
		}
	}
	.handle_state_font {
		font-size: 26px;
		color: #1b7eda;
	}
	.examine_btn {
		margin: 6px 0 0 15px;
	}
}
</style>

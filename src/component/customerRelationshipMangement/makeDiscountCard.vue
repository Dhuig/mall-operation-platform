<template>
	<div class="make_discount_card">
		<guideBar />
		<el-card class="card-gap">
			<h6>基本管理</h6>
			<el-row type="flex" class="form-width-protect">
				<div>
					<!-- 身份证正面 -->
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadDatas"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleIdCardARemove"
						:on-success="handleIdCardASuccess"
						:file-list="idCardA"
						:class="[idCardA.length === 1 ? 'hide_box' : 'avatar-gap']"
						:disabled="type === 'preview'"
						accept=".bmp, .jpg, .png, .gif"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" v-drag>
						<img width="100%" :src="dialogImageUrl" alt />
					</el-dialog>
					<span class="tipTitle" v-if="type === 'add'">只支持通用的bmp、jpg、png、pdf、gif图片上传</span>
					<!-- 身份证反面 -->
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadDatas"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleIdCardBRemove"
						:on-success="handleIdCardBSuccess"
						:file-list="idCardB"
						:class="[idCardB.length === 1 ? 'hide_box' : 'avatar-gap']"
						:disabled="type === 'preview'"
						accept=".bmp, .jpg, .png, .gif"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<!-- <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" v-drag>
						<img width="100%" :src="dialogImageUrl" alt />
					</el-dialog>-->
					<span class="tipTitle" v-if="type === 'add'">只支持通用的bmp、jpg、png、pdf、gif图片上传</span>
				</div>
				<el-form
					:model="detail"
					inline
					:rules="MEMBER_CARD_RULES"
					ref="oneselfForm"
					label-position="right"
					label-width="120px"
					label-suffix=":"
					:disabled="type === 'preview'"
					class="upload-gap"
				>
					<el-row>
						<el-col :span="24">
							<el-form-item label="卡号" prop="cardNo">
								<el-input
									size="small"
									v-model="detail.cardNo"
									:placeholder="placeholderData.cardNo"
									:disabled="type === 'edit'"
									class="discount-formitem"
									maxlength="10"
								>
									<el-button
										slot="append"
										icon="el-icon-refresh"
										:disabled="type !== 'add'"
										size="small"
										@click="generateCardNo"
									/>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="姓名" prop="realname">
								<el-input
									size="small"
									v-model="detail.realname"
									:placeholder="placeholderData.realname"
									class="discount-formitem"
									:disabled="type === 'edit'"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="证件号" class="info-item" prop="certificatesNo">
								<el-select
									v-model="detail.certificatesType"
									size="small"
									class="info-short-select"
									:disabled="type === 'edit'"
								>
									<el-option label="身份证" :value="1" />
									<el-option label="其它" :value="2" />
								</el-select>
								<el-input
									size="small"
									class="info-indentify-input"
									v-model="detail.certificatesNo"
									:placeholder="placeholderData.certificatesNo"
									:disabled="type === 'edit'"
									clearable
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="婚姻状况">
								<el-select
									v-model="detail.marital"
									size="small"
									:placeholder="placeholderData.marital"
									class="discount-formitem"
								>
									<el-option label="未婚" :value="1" />
									<el-option label="已婚" :value="2" />
									<el-option label="离异" :value="3" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="证件有效期">
								<el-date-picker
									v-model="detail.certificatesDateRange"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="yyyy-MM-dd"
									:disabled="type === 'edit'"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="文化程度">
								<el-select
									size="small"
									v-model="detail.education"
									:placeholder="placeholderData.education"
									class="discount-formitem"
								>
									<el-option
										v-for="(option, $idx) in EDUCATION_OPTIONS"
										:key="$idx"
										:label="option.label"
										:value="option.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="性别">
								<el-select
									v-model="detail.gender"
									size="small"
									class="discount-formitem"
									:disabled="type === 'edit'"
									:placeholder="placeholderData.gender"
								>
									<el-option label="男" :value="1" />
									<el-option label="女" :value="2" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="联系手机">
								<el-input
									size="small"
									v-model="detail.contactMobile"
									:placeholder="placeholderData.contactMobile"
									class="discount-formitem"
									maxlength="11"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9" v-if="type !== 'add'">
							<el-form-item label="注册手机">
								<el-input size="small" v-model="detail.mobile" class="discount-formitem" maxlength="11" disabled />
							</el-form-item>
						</el-col>

						<el-col :span="9">
							<el-form-item label="住宅电话">
								<el-input
									size="small"
									v-model="detail.homePhone"
									:placeholder="placeholderData.homePhone"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="邮政编码">
								<el-input
									size="small"
									v-model="detail.postcode"
									:placeholder="placeholderData.postcode"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="民族">
								<el-input
									size="small"
									v-model="detail.nation"
									:placeholder="placeholderData.nation"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="居住地">
								<el-select
									size="small"
									v-model="detail.livePlace"
									:placeholder="placeholderData.livePlace"
									class="discount-formitem"
								>
									<el-option
										v-for="(option, $idx) in LIVE_PLACE_OPTIONS"
										:key="$idx"
										:label="option.label"
										:value="option.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="电子邮件">
								<el-input
									size="small"
									v-model="detail.email"
									:placeholder="placeholderData.email"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<!-- <el-form-item label="所在地区">
								<el-input size="small" v-model="detail.province" class="discount-formitem" />
							</el-form-item>-->
							<el-form-item label="所在地区" style="marginbottom: 24px" prop>
								<el-cascader
									ref="pca-elcascader"
									size="medium"
									v-model="site"
									:props="lazyProps"
									:placeholder="placeholderData.site"
									@change="handleChangeSite"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="职业">
								<el-select
									size="small"
									v-model="detail.profession"
									:placeholder="placeholderData.profession"
									class="discount-formitem"
								>
									<el-option
										v-for="(option, $idx) in PROFESSION_TYPE_OPTIONS"
										:key="$idx"
										:label="option.label"
										:value="option.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="详细地址">
								<el-input
									style="width: 500px"
									size="small"
									v-model="detail.address"
									:placeholder="placeholderData.address"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="消费关注">
								<el-checkbox-group v-model="detail.consumeFollow">
									<el-checkbox :label="item.value" v-for="item in CONSUME_FOLLOW_OPTIONS" :key="item.value">
										{{ item.label }}
									</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
						<el-col :span="24" v-if="type === 'add'">
							<el-form-item label="是否有配偶">
								<el-radio-group v-model="detail.spouseOrNot" @change="spouseChange" :disabled="type === 'edit'">
									<el-radio :label="1">是</el-radio>
									<el-radio :label="0">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-row>
		</el-card>
		<el-card class="card-gap" v-show="detail.spouseOrNot === 1">
			<h6>配偶信息</h6>
			<el-row type="flex" class="form-width-protect">
				<div class="upload-gap">
					<!-- 配偶身份证正面 -->
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadDatas"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="spouseIdCardARemove"
						:on-success="spouseIdCardASuccess"
						:file-list="spouseIdCardA"
						:class="[spouseIdCardA.length === 1 ? 'hide_box' : 'avatar-gap']"
						:disabled="type === 'preview'"
						accept=".bmp, .jpg, .png, .gif"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<!-- <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" v-drag>
						<img width="100%" :src="dialogImageUrl" alt />
					</el-dialog>-->
					<span class="tipTitle" v-if="type === 'add'">只支持通用的bmp、jpg、png图片上传</span>
					<!-- 配偶身份证反面 -->
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadDatas"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="spouseIdCardBRemove"
						:on-success="spouseIdCardBSuccess"
						:file-list="spouseIdCardB"
						:class="[spouseIdCardB.length === 1 ? 'hide_box' : 'avatar-gap']"
						:disabled="type === 'preview'"
						accept=".bmp, .jpg, .png, .gif"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<!-- <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" v-drag>
						<img width="100%" :src="dialogImageUrl" alt />
					</el-dialog>-->
					<span class="tipTitle" v-if="type === 'add'">只支持通用的bmp、jpg、png图片上传</span>
				</div>
				<el-form
					:model="detail"
					inline
					:rules="MEMBER_CARD_RULES"
					ref="spouseForm"
					label-position="right"
					label-width="120px"
					label-suffix=":"
					:disabled="type === 'preview'"
					class="upload-gap"
				>
					<el-row>
						<el-col :span="9">
							<el-form-item label="姓名" prop="spouseRealname">
								<el-input
									size="small"
									v-model="detail.spouseRealname"
									:placeholder="placeholderData.spouseRealname"
									class="discount-formitem"
									:disabled="type === 'edit'"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="证件号" class="info-item" prop="spouseCertificatesNo">
								<el-select
									v-model="detail.spouseCertificatesType"
									size="small"
									class="info-short-select"
									:disabled="type === 'edit'"
								>
									<el-option label="身份证" :value="1" />
									<el-option label="其它" :value="2" />
								</el-select>
								<el-input
									size="small"
									class="info-indentify-input"
									v-model="detail.spouseCertificatesNo"
									:placeholder="placeholderData.spouseCertificatesNo"
									:disabled="type === 'edit'"
									clearable
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="婚姻状况">
								<el-select
									v-model="detail.spouseMarital"
									size="small"
									:placeholder="placeholderData.spouseMarital"
									class="discount-formitem"
								>
									<el-option label="未婚" :value="1" />
									<el-option label="已婚" :value="2" />
									<el-option label="离异" :value="3" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="证件有效期">
								<el-date-picker
									v-model="detail.spouseCertificatesDateRange"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="yyyy-MM-dd"
									:disabled="type === 'edit'"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="文化程度">
								<el-select
									size="small"
									v-model="detail.spouseEducation"
									:placeholder="placeholderData.spouseEducation"
									class="discount-formitem"
								>
									<el-option
										v-for="(option, $idx) in EDUCATION_OPTIONS"
										:key="$idx"
										:label="option.label"
										:value="option.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="性别">
								<el-select
									v-model="detail.spouseGender"
									size="small"
									:disabled="type === 'edit'"
									class="discount-formitem"
									:placeholder="placeholderData.spouseGender"
								>
									<el-option label="男" :value="1" />
									<el-option label="女" :value="2" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="联系手机">
								<el-input
									size="small"
									v-model="detail.spouseMobile"
									:placeholder="placeholderData.spouseMobile"
									maxlength="11"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9" v-if="type !== 'add'">
							<el-form-item label="配偶登陆手机号">
								<el-input
									size="small"
									v-model="detail.spouseLoginMobile"
									class="discount-formitem"
									maxlength="11"
									disabled
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="住宅电话">
								<el-input
									size="small"
									v-model="detail.spouseHomePhone"
									:placeholder="placeholderData.spouseHomePhone"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="邮政编码">
								<el-input
									size="small"
									v-model="detail.spousePostcode"
									:placeholder="placeholderData.spousePostcode"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="民族">
								<el-input
									size="small"
									v-model="detail.spouseNation"
									:placeholder="placeholderData.spouseNation"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="居住地">
								<el-select
									size="small"
									v-model="detail.spouseLivePlace"
									:placeholder="placeholderData.spouseLivePlace"
									class="discount-formitem"
								>
									<el-option
										v-for="(option, $idx) in LIVE_PLACE_OPTIONS"
										:key="$idx"
										:label="option.label"
										:value="option.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="电子邮件">
								<el-input
									size="small"
									v-model="detail.spouseCardEmail"
									:placeholder="placeholderData.spouseCardEmail"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="10">
							<!-- <el-form-item label="所在地区">
								<el-input size="small" v-model="detail.spouseProvince" class="discount-formitem" />
							</el-form-item>-->
							<el-form-item label="所在地区" prop>
								<el-cascader
									size="medium"
									ref="spouse-elcascader"
									v-model="spouseSite"
									:props="lazyProps"
									:placeholder="placeholderData.spouseSite"
									@change="handleChangeSite"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="15">
							<el-form-item label="职业">
								<el-select
									size="small"
									v-model="detail.spouseProfession"
									:placeholder="placeholderData.spouseProfession"
									class="discount-formitem"
								>
									<el-option
										v-for="(option, $idx) in PROFESSION_TYPE_OPTIONS"
										:key="$idx"
										:label="option.label"
										:value="option.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="详细地址">
								<el-input
									style="width: 500px"
									size="small"
									v-model="detail.spouseAddress"
									:placeholder="placeholderData.spouseAddress"
									class="discount-formitem"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="消费关注">
								<el-checkbox-group v-model="detail.spouseConsumeFollow">
									<el-checkbox :label="item.value" v-for="item in CONSUME_FOLLOW_OPTIONS" :key="item.value">
										{{ item.label }}
									</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-row>
		</el-card>
		<el-card class="card-gap">
			<h6>紧急联系人</h6>
			<el-form
				:model="detail"
				inline
				label-position="right"
				label-width="90px"
				label-suffix=":"
				:disabled="type === 'preview'"
			>
				<el-row class="form-width-protect">
					<el-col :span="12">
						<el-form-item label="姓名">
							<el-input
								size="small"
								v-model="detail.emerContactName"
								:placeholder="placeholderData.emerContactName"
								class="discount-formitem"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号码">
							<el-input
								size="small"
								v-model="detail.emerContactMobile"
								:placeholder="placeholderData.emerContactMobile"
								maxlength="11"
								class="discount-formitem"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="住宅电话">
							<el-input
								size="small"
								v-model="detail.emerContactHomePhone"
								:placeholder="placeholderData.emerContactHomePhone"
								class="discount-formitem"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="电子邮箱">
							<el-input
								size="small"
								v-model="detail.emerContactEmail"
								:placeholder="placeholderData.emerContactEmail"
								class="discount-formitem"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="card-gap" v-if="type !== 'edit'">
			<h6>经办人信息</h6>
			<el-form
				:model="detail"
				inline
				:rules="MEMBER_CARD_RULES"
				label-position="right"
				label-width="90px"
				label-suffix=":"
				:disabled="type === 'preview'"
			>
				<el-row class="form-width-protect">
					<el-col :span="24">
						<el-form-item label="卡号" prop="handledCardNo">
							<el-row type="flex" justify="center" align="middle">
								<el-input
									size="small"
									v-model="detail.handledCardNo"
									:placeholder="placeholderData.handledCardNo"
									class="discount-formitem"
									clearable
								>
									<el-button slot="append" icon="el-icon-search" @click="loadServiceId" v-if="type !== 'preview'" />
								</el-input>
							</el-row>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名">
							<el-input
								size="small"
								:value="detail.handleName"
								:placeholder="placeholderData.handleName"
								class="discount-formitem"
								disabled
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务中心号">
							<el-input
								size="small"
								:value="detail.handledStoreCode"
								:placeholder="placeholderData.handledStoreCode"
								class="discount-formitem"
								disabled
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="card-gap" v-if="type !== 'edit'">
			<h6>开卡店信息（线下开卡信息）</h6>
			<el-form
				:model="detail"
				inline
				:rules="MEMBER_CARD_RULES"
				label-position="right"
				label-width="140px"
				label-suffix=":"
				:disabled="type === 'preview'"
			>
				<el-row class="form-width-protect">
					<el-col :span="12">
						<el-form-item label="挂靠服务中心号" prop="relyStoreCode">
							<el-row type="flex" justify="center" align="middle">
								<el-input
									size="small"
									v-model="detail.relyStoreCode"
									:placeholder="placeholderData.relyStoreCode"
									class="discount-formitem"
									clearable
								>
									<el-button slot="append" icon="el-icon-search" @click="getMainStoreInfo" v-if="type !== 'preview'" />
								</el-input>
							</el-row>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务中心名称">
							<el-input
								size="small"
								:value="serviceName"
								:placeholder="placeholderData.serviceName"
								class="discount-formitem"
								disabled
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
		<el-card class="card-gap">
			<h6>优惠顾客开卡资料</h6>
			<el-row>
				<!-- 顾客线下开卡资料表正面 -->
				<el-col :span="6">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadDatas"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="openCardARemove"
						:on-success="openCardASuccess"
						:file-list="openCardA"
						:class="[openCardA.length === 1 ? 'hide_box' : 'avatar-gap']"
						:disabled="type === 'preview'"
						accept=".bmp, .jpg, .png, .gif,.pdf"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<!-- <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" v-drag>
						<img width="100%" :src="dialogImageUrl" alt />
					</el-dialog> -->
					<span class="pdf_link" @click="openCardLink(1)" v-if="openCardAPDF === 1">开卡资料表正面预览(PDF)</span>
					<span class="tipTitle" v-if="type === 'add'">顾客线下开卡资料表（正面）</span>
				</el-col>
				<!-- 顾客线下开卡资料表反面 -->
				<el-col :span="6">
					<el-upload
						:action="$store.getters['system/getOssUploadUrl']"
						:headers="$store.getters['system/getSignatureVerification']"
						:data="uploadDatas"
						:limit="1"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="openCardBRemove"
						:on-success="openCardBSuccess"
						:file-list="openCardB"
						:class="[openCardB.length === 1 ? 'hide_box' : 'avatar-gap']"
						:disabled="type === 'preview'"
						accept=".bmp, .jpg, .png, .gif, .pdf"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<span class="pdf_link" @click="openCardLink(2)" v-if="openCardBPDF === 1">开卡资料表反面预览(PDF)</span>
					<span class="tipTitle" v-if="type === 'add'">顾客线下开卡资料表（反面）</span>
				</el-col>
			</el-row>
		</el-card>
		<actionBar>
			<template v-if="type === 'add'">
				<!-- <el-button @click="exit">退出</el-button> -->
				<el-button type="primary" @click="submitDetail">提交</el-button>
			</template>
			<template v-if="type === 'edit'">
				<!-- <el-button @click="exit">退出</el-button> -->
				<el-button type="success" @click="updateDetail">更新</el-button>
			</template>
			<el-button @click="exit">退出</el-button>
		</actionBar>
	</div>
</template>

<script>
import { MEMBER_CARD_RULES } from './config';
const optionGenerator = options => options.map(({ code: value, name: label }) => ({ label, value }));
import city from 'config/city';
export default {
	name: 'makeDiscountCard',
	data() {
		return {
			headers: {
				Authorization: this.$store.getters['user/getFullToken'],
			},
			MEMBER_CARD_RULES, // 表单验证规则
			EDUCATION_OPTIONS: [], // 教育水平
			LIVE_PLACE_OPTIONS: [], // 居住地
			CONSUME_FOLLOW_OPTIONS: [], // 消费关注
			PROFESSION_TYPE_OPTIONS: [], // 职业类型
			id: '',
			extra: {
				covers: [],
			},
			hrefLink: '',
			uploadData: {
				storageType: '',
				clientKey: '',
				sign: '',
				timeStamp: '',
			},
			detail: {
				// 身份证
				certificatesPositiveUrl: '',
				certificatesReverseUrl: '',
				// 配偶身份证
				spouseCertificatesPositiveUrl: '',
				spouseCertificatesReverseUrl: '',
				// 基础信息
				cardNo: '',
				realname: '',
				gender: 2,
				certificatesDateRange: [],
				marital: '',
				certificatesType: 1,
				certificatesNo: '',
				education: '',
				phone: '',
				contactMobile: '',
				homePhone: '',
				nation: '',
				postcode: '',
				email: '',
				livePlace: '',
				province: '',
				city: '',
				district: '',
				profession: '',
				address: '',
				consumeFollow: [],
				spouseOrNot: 0,
				spouse: '',
				// 配偶信息
				spouseRealname: '',
				spouseGender: 1,
				spouseCertificatesDateRange: [],
				spouseMarital: 2,
				spouseCertificatesType: 1,
				spouseCertificatesNo: '',
				spouseEducation: '',
				spouseMobile: '',
				spouseHomePhone: '',
				spouseNation: '',
				spousePostcode: '',
				spouseCardEmail: '',
				spouseLivePlace: '',
				spouseProvince: '',
				spouseCity: '',
				spouseDistrict: '',
				spouseProfession: '',
				spouseAddress: '',
				spouseConsumeFollow: [],
				// 紧急联系人
				emerContactName: '',
				emerContactMobile: '',
				emerContactHomePhone: '',
				emerContactEmail: '',
				// 经办人
				handledStoreCode: '',
				handledMemberId: '',
				handledCardNo: '',
				handleName: '',
				// 开卡店信息
				relyStoreCode: '',
				// 优惠顾客开卡资料
				opencardPositiveUrl: '', // 正面
				opencardReverseUrl: '', // 反面
			},
			serviceName: '',
			// 图片上传
			dialogVisible: false, //图片预览
			dialogImageUrl: '', //图片路径
			idCardA: [], // 身份证正面
			idCardB: [], // 身份证方面
			spouseIdCardA: [], // 配偶身份证正面
			spouseIdCardB: [], // 配偶身份证方面
			openCardA: [], // 优惠顾客开卡资料正面
			openCardB: [], // 优惠顾客开卡资料反面
			openCardAPDF: 0, // pdf格式判断(正面)
			openCardBPDF: 0, // pdf格式判断(反面)
			site: null, // 本人省市区
			spouseSite: [], // 配偶省市区
			options: [],
			siteLabel: [], // 省市label
			lazyProps: {
				lazy: true, //  是否开启懒加载
				lazyLoad: this.lazyLoad, // 加载函数
			},
			// 占位符提示
			placeholderData: {
				cardNo: '卡号',
				realname: '请输入姓名',
				certificatesNo: '请输入证件号',
				gender: '请选择性别',
				marital: '请选择婚姻状况',
				education: '请选择文化程度',
				contactMobile: '请填写联系手机',
				homePhone: '请填写住宅电话',
				postcode: '邮政编码(6位数字)',
				nation: '请填写民族',
				profession: '请选择职业',
				livePlace: '请选择居住地',
				email: '请填写联系电子邮箱',
				site: '请选择所在地区',
				// 配偶信息
				spouseRealname: '请输入配偶姓名',
				spouseCertificatesNo: '请输入配偶证件号',
				spouseGender: '请选择性别',
				spouseMarital: '请选择婚姻状况',
				spouseEducation: '请选择配偶文化程度',
				spouseMobile: '请填写配偶联系手机',
				spouseHomePhone: '请填写住宅电话',
				spousePostcode: '邮政编码(6位数字)',
				spouseNation: '请填写配偶民族',
				spouseLivePlace: '请选择居住地',
				spouseCardEmail: '请填写联系电子邮箱',
				spouseSite: '请选择所在地区',
				spouseProfession: '请选择配偶职业',
				spouseAddress: '请填写详细地址',
				// 紧急联系人
				emerContactName: '请输入紧急联系人姓名',
				emerContactMobile: '请输入紧急联系人手机号码',
				emerContactHomePhone: '请输入紧急联系人住宅电话',
				emerContactEmail: '请输入紧急联系人电子邮箱',
				// 经办人信息
				handledCardNo: '请输入卡号',
				handleName: '姓名(输入卡号自动带出)',
				handledStoreCode: '服务中心号(输入卡号自动带出)',
				// 开卡店信息（线下开卡信息）
				relyStoreCode: '请输入服务中心号',
				serviceName: '服务中心名称(输入服务中心号自动带出)',
			},
			// end
		};
	},
	computed: {
		type() {
			return this.$route.query.type || 'preview';
		},
		// 编辑数据
		postData() {
			const {
				detail,
				detail: { certificatesDateRange, spouseCertificatesDateRange, consumeFollow, spouseConsumeFollow },
			} = this;

			const data = {
				...detail,
				certificatesStartDate: certificatesDateRange[0],
				certificatesEndDate: certificatesDateRange[1],
				spouseCertificatesStartDate: spouseCertificatesDateRange[0],
				spouseCertificatesEndDate: spouseCertificatesDateRange[1],
				consumeFollow: consumeFollow.join(','),
				spouseConsumeFollow: spouseConsumeFollow.join(','),
			};

			delete data.certificatesDateRange;
			delete data.spouseCertificatesDateRange;
			return data;
		},
		uploadDatas() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.crm,
			};
			return params;
		},
	},
	methods: {
		exit() {
			this.$confirm('是否需要保存提交?', '提示', {
				type: 'warning',
			})
				.then(() => {
					// 新增
					if (this.type === 'add') {
						this.submitDetail();
					} else {
						// 更新
						this.updateDetail();
					}
				})
				.catch(() => {
					this.$closeSelf();
				});
		},
		submitDetail() {
			// 表单验证
			this.$refs.oneselfForm.validate(valid => {
				// 经办人卡号验证
				if (this.detail.handledCardNo == '') {
					this.$message({
						type: 'warning',
						message: '请填写经办人卡号',
					});
					return false;
				}
				if (valid) {
					// 配偶表单验证
					if (this.detail.spouseOrNot == 1) {
						this.$refs.spouseForm.validate(valid => {
							if (valid) {
								this.insertNewDiscountCard();
							} else {
								this.$message({
									type: 'warning',
									message: '请填写配偶必填项',
								});
								return false;
							}
						});
					} else {
						this.insertNewDiscountCard();
					}
				} else {
					this.$message({
						type: 'warning',
						message: '请填写必填项',
					});
					return false;
				}
			});
		},
		updateDetail() {
			this.updateNewDiscountCard();
		},
		// 多级下拉框事件
		handleChangeSite() {
			if (this.site.length != 0) {
				this.detail.province = this.site[0];
				this.detail.city = this.site[1];
				this.detail.district = this.site[2];
			}
			if (this.spouseSite.length != 0) {
				this.detail.spouseProvince = this.spouseSite[0];
				this.detail.spouseCity = this.spouseSite[1];
				this.detail.spouseDistrict = this.spouseSite[2];
			}
		},
		// 懒加载
		lazyLoad(node, resolve) {
			const { level } = node;
			if (level == 0) {
				let nodes = city.map(item => {
					return {
						value: item.c,
						label: item.n,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 1) {
				const id = node.data.value;
				let data = [];
				city.forEach(i => {
					if (i.c === id) {
						data = i.r;
					}
				});
				let nodes = data.map(item => {
					return {
						value: item.c,
						label: item.n,
						leaf: false,
					};
				});
				resolve(nodes);
			} else if (level == 2) {
				const id = node.data.value;
				let data = [];
				city.forEach(i => {
					i.r &&
						i.r.length > 0 &&
						i.r.forEach(j => {
							if (j.c === id) {
								data = j.r;
							}
						});
				});
				let nodes = data.map(item => {
					return {
						value: item.c,
						label: item.n,
						leaf: true,
					};
				});
				resolve(nodes);
			}
		},
		rewritePlace(data, cityStore) {
			let index = 0;
			let result = [];
			if (!data) {
				return;
			}
			const loop = (data, cityStore) => {
				if (!cityStore) return;
				cityStore.forEach(item => {
					if (data[index]) {
						if (item.c == data[index]) {
							result.push(item.n);
							if (item.r) {
								index++;
								loop(data, item.r);
							}
						}
					}
				});
			};
			loop(data, cityStore);
			return result;
		},
		// 是否有配偶
		spouseChange() {
			if (this.detail.spouseOrNot == 1) {
				this.detail.spouseGender = this.detail.gender == 1 ? 2 : 1;
				this.detail.spouseAddress = this.detail.address;
				this.detail.spouseHomePhone = this.detail.homePhone; // 住宅电话
				this.detail.spousePostcode = this.detail.postcode; // 邮政编码
				this.detail.spouseLivePlace = this.detail.livePlace; // 居住地
				this.detail.spouseProvince = this.detail.province; // 所在地区
				// 省市区
				if (this.site.length != 0) {
					this.detail.spouseProvince = this.site[0];
					this.detail.spouseCity = this.site[1];
					this.detail.spouseDistrict = this.site[2];
					this.spouseSite = this.site;
					let spousePro = this.rewritePlace(
						[this.detail.spouseProvince, this.detail.spouseCity, this.detail.spouseDistrict],
						city
					);
					this.spouseSite = `${spousePro[0]}/${spousePro[1]}/${spousePro[2]}`;
					this.$nextTick(() => {
						this.$refs['spouse-elcascader'].inputValue = this.spouseSite;
					});
				}
			}
		},
		// 图片预览
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 身份证正面
		// 删除成功的回调
		handleIdCardARemove(file, fileList) {
			this.detail.certificatesPositiveUrl = '';
			this.idCardA = fileList;
		},
		// 上传成功
		handleIdCardASuccess(response, file, fileList) {
			this.detail.certificatesPositiveUrl = response.datas.fileUrlKey;
			this.idCardA = fileList;
			console.log(fileList);
		},
		// 身份证反面
		// 删除成功的回调
		handleIdCardBRemove(file, fileList) {
			this.detail.certificatesReverseUrl = '';
			this.idCardB = fileList;
		},
		// 上传成功
		handleIdCardBSuccess(response, file, fileList) {
			this.detail.certificatesReverseUrl = response.datas.fileUrlKey;
			this.idCardB = fileList;
		},
		// 配偶身份证正面
		// 删除成功的回调
		spouseIdCardARemove(file, fileList) {
			this.detail.spouseCertificatesPositiveUrl = '';
			this.spouseIdCardA = fileList;
		},
		// 上传成功
		spouseIdCardASuccess(response, file, fileList) {
			this.detail.spouseCertificatesPositiveUrl = response.datas.fileUrlKey;
			this.spouseIdCardA = fileList;
		},
		// 配偶身份证反面
		// 删除成功的回调
		spouseIdCardBRemove(file, fileList) {
			this.detail.spouseCertificatesReverseUrl = '';
			this.spouseIdCardB = fileList;
		},
		// 上传成功
		spouseIdCardBSuccess(response, file, fileList) {
			this.detail.spouseCertificatesReverseUrl = response.datas.fileUrlKey;
			this.spouseIdCardB = fileList;
		},
		// 顾客线下开卡资料表pdf跳转预览
		openCardLink(state) {
			let imgUrl = state === 1 ? this.detail.opencardPositiveUrl : this.detail.opencardReverseUrl;
			window.open(imgUrl, '_blank');
		},
		// 顾客线下开卡资料表正面
		// 删除成功的回调
		openCardARemove(file, fileList) {
			this.openCardAPDF = 0;
			this.detail.opencardPositiveUrl = '';
			this.openCardA = fileList;
		},
		// 上传成功
		openCardASuccess(response, file, fileList) {
			this.openCardAPDF = response.datas.relativePath.indexOf('.pdf') === -1 ? 0 : 1;
			this.detail.opencardPositiveUrl = response.datas.fileUrlKey;
			this.openCardA = fileList;
			console.log(this.detail.opencardPositiveUrl);
		},

		// 顾客线下开卡资料表反面
		// 删除成功的回调
		openCardBRemove(file, fileList) {
			this.openCardBPDF = 0;
			this.detail.opencardReverseUrl = '';
			this.openCardB = fileList;
		},
		// 上传成功
		openCardBSuccess(response, file, fileList) {
			this.openCardBPDF = response.datas.relativePath.indexOf('.pdf') === -1 ? 0 : 1;
			this.detail.opencardReverseUrl = response.datas.fileUrlKey;
			this.openCardB = fileList;
		},

		// 图片上传回调 [身份证正面]
		// handleUploadSuccessCertificate(response) {
		// 	if (response.success) {
		// 		this.detail.certificatesPositiveUrl = response.datas.fileUrlKey;
		// 	} else {
		// 		this.$message.error(response.errorMessage || '上传失败请重试');
		// 	}
		// },
		// 图片上传回调 [身份证反面]
		// handleUploadSuccessCertificateReverse(response) {
		// 	if (response.success) {
		// 		this.detail.certificatesReverseUrl = response.datas.fileUrlKey;
		// 	} else {
		// 		this.$message.error(response.errorMessage || '上传失败请重试');
		// 	}
		// },
		// 图片上传回调 [配偶身份证正面]
		// handleUploadSuccessSpouseCertificates(response) {
		// 	if (response.success) {
		// 		this.detail.spouseCertificatesPositiveUrl = response.datas.fileUrlKey;
		// 	} else {
		// 		this.$message.error(response.errorMessage || '上传失败请重试');
		// 	}
		// },
		// 图片上传回调 [配偶身份证反面]
		// handleUploadSuccessSpouseCertificatesReverse(response) {
		// 	if (response.success) {
		// 		this.detail.spouseCertificatesReverseUrl = response.datas.fileUrlKey;
		// 	} else {
		// 		this.$message.error(response.errorMessage || '上传失败请重试');
		// 	}
		// },
		// 能过会员卡号搜索经办人信息
		searchHandledPeopeInfoByCardNo() {
			const { handledCardNo } = this.detail;
			if (/(^[0-9]{8,10}$)/.test(handledCardNo)) {
				this.loadServiceId();
			}
		},
		// 生成卡号
		async generateCardNo() {
			const res = await this.$fetch('/crm/cardMgmt/getCardNo');
			if (res && res.code === 200) {
				this.detail.cardNo = res.data;
			} else {
				this.$message({
					type: 'error',
					message: '生成卡号失败, 请稍后重试',
				});
			}
		},
		// 新开优惠卡
		async insertNewDiscountCard() {
			const { postData: data } = this;
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/cardMgmt/createMemberCard',
				data,
			});
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message || '操作成功',
					onClose: () => {
						this.$dispatch('UPDATE_MEMBER_LIST');
						this.$closeSelf();
					},
				});
			} else {
				// this.$message({
				// 	type: 'error',
				// 	message: '操作失败',
				// });
				this.generateCardNo();
			}
		},
		// 获取优惠卡
		async loadDiscountCardInfo(id) {
			if (!id) return this.$message('优惠卡号Id 不存在或无效, 无法获取详情');
			const res = await this.$fetch({
				method: 'GET',
				url: `/crm/cardMgmt/getMemberCard?id=${id}`,
			});
			if (res && res.code === 200 && res.data) {
				const {
					data,
					data: {
						handledCardName: handleName,
						storeCode,
						certificatesStartDate = '',
						certificatesEndDate = '',
						spouseCertificatesStartDate = '',
						spouseCertificatesEndDate = '',
						consumeFollow = '',
						spouseConsumeFollow = '',
					},
				} = res;
				const detail = {
					...data,
					handleName,
					relyStoreCode: storeCode,
					certificatesDateRange: [certificatesStartDate || '', certificatesEndDate || ''],
					spouseCertificatesDateRange: [spouseCertificatesStartDate || '', spouseCertificatesEndDate || ''],
					consumeFollow: consumeFollow && consumeFollow.length ? consumeFollow.split(',') : [],
					spouseConsumeFollow: spouseConsumeFollow && spouseConsumeFollow.length ? spouseConsumeFollow.split(',') : [],
				};
				this.detail = detail;
				// this.site= [detail.province || '', detail.city || '', detail.district || '']; // 本人省市区
				// this.spouseSite= [detail.spouseProvince || '', detail.spouseCity || '', detail.spouseDistrict || '']; // 配偶省市区

				this.idCardA = detail.certificatesPositiveUrl ? [{ name: 'idCardA', url: detail.certificatesPositiveUrl }] : []; // 身份证正面
				this.idCardB = detail.certificatesReverseUrl ? [{ name: 'idCardB', url: detail.certificatesReverseUrl }] : []; // 身份证反面
				this.spouseIdCardA = detail.spouseCertificatesPositiveUrl
					? [{ name: 'spouseIdCardA', url: detail.spouseCertificatesPositiveUrl }]
					: []; // 配偶身份证正面
				this.spouseIdCardB = detail.spouseCertificatesReverseUrl
					? [{ name: 'spouseIdCardB', url: detail.spouseCertificatesReverseUrl }]
					: []; // 配偶身份证反面
				// 开卡资料
				this.openCardA = detail.opencardPositiveUrl ? [{ name: 'openCardA', url: detail.opencardPositiveUrl }] : []; // 正面
				this.openCardB = detail.opencardReverseUrl ? [{ name: 'openCardB', url: detail.opencardReverseUrl }] : []; // 反面
				// 返回pdf
				this.openCardAPDF = detail.opencardPositiveUrl && detail.opencardPositiveUrl.indexOf('.pdf') !== -1 ? 1 : 0;
				this.openCardBPDF = detail.opencardReverseUrl && detail.opencardReverseUrl.indexOf('.pdf') !== -1 ? 1 : 0;
				// 省市区回填
				if (detail.province) {
					let oneselfPro = this.rewritePlace([detail.province, detail.city, detail.district], city);
					this.site = [detail.province, detail.city, detail.district];
					let value = oneselfPro
						.map((x, index, arr) => arr[index] + '/')
						.join('')
						.slice(0, -1);
					this.$nextTick(() => {
						this.$refs['pca-elcascader'].inputValue = value;
					});
				}
				// 配偶省市区回填
				if (detail.spouseProvince) {
					let spousePro = this.rewritePlace([detail.spouseProvince, detail.spouseCity, detail.spouseDistrict], city);
					this.spouseSite = [detail.spouseProvince, detail.spouseCity, detail.spouseDistrict];
					let value = spousePro
						.map((x, index, arr) => arr[index] + '/')
						.join('')
						.slice(0, -1);
					this.$nextTick(() => {
						this.$refs['spouse-elcascader'].inputValue = value;
					});
				}
				// 根据服务中心号获取信息
				if (detail.relyStoreCode) {
					this.getMainStoreInfo(detail.relyStoreCode);
				}
			} else {
				this.$message({
					type: 'error',
					message: '获取优惠卡详情失败',
				});
			}
		},
		// 编辑优惠卡
		async updateNewDiscountCard() {
			const { id, postData } = this;
			const data = {
				id,
				...postData,
				postcode: postData.postcode && postData.postcode.trim(),
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/crm/cardMgmt/updateMemberCard',
				data,
			});

			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message,
					onClose: () => {
						this.$dispatch('UPDATE_MEMBER_LIST');
						this.$closeSelf();
					},
				});
			} else {
				this.$message({
					type: 'error',
					message: '操作失败',
				});
			}
		},
		// 获取字典
		async loadDictByType(dictType) {
			if (!dictType) return;
			const res = await this.$fetch(`/crm/lov/getCrmLovListByType?dictType=${dictType}`);
			return res && res.data ? res.data : [];
		},
		// 根据卡号获取经办人服务中心
		async loadServiceId() {
			const {
				detail: { handledCardNo },
			} = this;
			const res = await this.$fetch(`/crm/cardMgmt/getStoreByLeaderCardNo?leaderCardNo=${handledCardNo}`);
			if (res && res.code === 200 && res.data) {
				const { handledCardNo, handledMemberId, handledName, handledStoreCode } = res.data;
				this.detail.handledCardNo = handledCardNo;
				this.detail.handledMemberId = handledMemberId;
				this.detail.handleName = handledName;
				this.detail.handledStoreCode = handledStoreCode;
			} else {
				this.$message({
					type: 'warning',
					message: res.message || '无法搜索到对应经办人信息',
				});
			}
		},
		// 根据服务中心号获取信息
		async getMainStoreInfo() {
			const {
				detail: { relyStoreCode },
			} = this;
			const res = await this.$fetch(`mgmt/store/getMainStoreInfo?storeCode=${relyStoreCode}`);
			if (res && res.code === 200) {
				this.serviceName = res.data.name;
			} else {
				this.$message({
					type: 'warning',
					message: res.data.message || '无法搜索到对应开卡店信息',
				});
			}
		},
		// 获取配置字典
		async loadConfigs() {
			const DICT_ARR = ['education', 'live_place', 'consume_follow', 'profession_type'];
			Promise.all(DICT_ARR.map(type => this.loadDictByType(type)))
				.then(res => {
					if (res && res.length === DICT_ARR.length) {
						const [
							EDUCATION_OPTIONS,
							LIVE_PLACE_OPTIONS,
							CONSUME_FOLLOW_OPTIONS,
							PROFESSION_TYPE_OPTIONS,
						] = res.map(dict => optionGenerator(dict));

						this.EDUCATION_OPTIONS = EDUCATION_OPTIONS;
						this.LIVE_PLACE_OPTIONS = LIVE_PLACE_OPTIONS;
						this.CONSUME_FOLLOW_OPTIONS = CONSUME_FOLLOW_OPTIONS;
						this.PROFESSION_TYPE_OPTIONS = PROFESSION_TYPE_OPTIONS;
					} else {
						throw new Error('获取字典失败');
					}
				})
				.catch(err => {
					this.$message({
						type: 'error',
						message: typeof err === 'string' ? err : err.message,
					});
				});
		},
	},
	mounted() {
		this.idCardA = []; // 身份证正面
		this.idCardB = []; // 身份证方面
		const { id } = this.$route.query;
		this.loadConfigs();
		if (!id) {
			this.generateCardNo();
		} else {
			this.placeholderData = {
				profession: '',
				education: '',
				livePlace: '',
				site: '',
				gender: '',
				marital: '',
				spouseGender: '',
				spouseMarital: '',
				spouseEducation: '',
				spouseLivePlace: '',
				spouseSite: '',
				spouseProfession: '',
			};
			this.id = id;
			this.loadDiscountCardInfo(id);
		}
	},
};
</script>

<style lang="scss" scoped>
// .el-popup-parent--hidden ::v-deep.v-modal {
// 	z-index: 1000 !important;
// }
h6 {
	margin-bottom: 15px;
}
.upload-gap {
	margin-left: 24px;
}
.avatar-gap {
	margin-bottom: 16px;
}
.form-width-protect {
	min-width: 1060px;
}
.passer-search-button {
	height: 32px;
	margin-left: 10px;
}
.card-gap {
	margin: 15px auto;
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
	text-align: center;
}
.avatar {
	width: 100%;
	height: 100%;
	display: block;
}
::v-deep.hide_box .el-upload--picture-card {
	display: none;
}
::v-deep.hide_hook .el-upload-list__item.is-success .el-upload-list__item-status-label,
::v-deep.hide_hook .el-upload-list--picture-card .el-upload-list__item-actions {
	display: none;
}
.tipTitle {
	display: inline-block;
	line-height: 20px;
	color: #8c939b;
	font-size: 12px;
	margin-bottom: 10px;
}
.info-label {
	width: 120px;
}
.info-item {
	display: flex;
}
.info-short-select {
	width: 100px;
	margin-right: 10px;
}
.info-indentify-input {
	width: 250px;
}
.discount-formitem {
	width: 200px;
}
.el-dialog__wrapper {
	background: rgba($color: #000000, $alpha: 0.5);
}
.make_discount_card {
	::v-deep.el-dialog__header {
		min-height: 15px;
	}
	::v-deep.el-dialog__body {
		max-height: 500px;
		overflow: auto;
	}
}
.pdf_link {
	font-size: 15px;
	color: blue;
	padding-bottom: 10px;
	display: inline-block;
	cursor: pointer;
}
</style>

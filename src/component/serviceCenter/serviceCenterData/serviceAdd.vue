<template>
	<div class="serviceAdd">
		<div class="detailMessage self-detail-message">
			<el-form
				ref="ruleForm"
				:model="ruleForm"
				:rules="CREATE_NEW_SERVICE_RULES"
				label-width="128px"
				size="medium"
				style="width: 100%; margin: 0px"
			>
				<!-- 负责人资料 -->
				<el-card class="box-card">
					<h6 class="title">负责人资料</h6>
					<div class="detailMessage-box line">
						<div class="detailMessage-leftBox">
							<div class="detailMessage-leftBox-picBox">
								<h6 class="sub-title">负责人身份证正面</h6>
								<upload-image v-model="ruleForm.addMemberLeaderAo.certificatesPositiveUrl" />
								<h6 class="sub-title">负责人身份证反面</h6>
								<upload-image v-model="ruleForm.addMemberLeaderAo.certificatesReverseUrl" />
							</div>
						</div>
						<div class="detailMessage-rightBox">
							<div class="dataBox">
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="负责人卡号" prop="addMemberLeaderAo.cardNo">
											<el-input
												@blur="getMasterMemberInfoByCardNo(ruleForm.addMemberLeaderAo.cardNo, 'main')"
												v-model.trim="ruleForm.addMemberLeaderAo.cardNo"
												size="small"
												clearable
												:disabled="!isTransfer && isEditStore"
												placeholder="请输入负责人卡号"
											>
												<el-button
													slot="append"
													icon="el-icon-search"
													size="small"
													@click="getMasterMemberInfoByCardNo(ruleForm.addMemberLeaderAo.cardNo, 'main')"
												/>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="负责人姓名" prop="addMemberLeaderAo.realname">
											<el-input
												size="small"
												v-model.trim="ruleForm.addMemberLeaderAo.realname"
												placeholder="请输入负责人姓名"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="顾客身份">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.memberType"
												disabled
												placeholder="请选择顾客身份"
												style="height: 32px"
											>
												<el-option
													v-for="option in CLENTOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="手机号码" prop="addMemberLeaderAo.mobile">
											<el-input
												v-model="ruleForm.addMemberLeaderAo.mobile"
												size="small"
												placeholder="请输入手机号码"
												clearable
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="性别" prop="addMemberLeaderAo.gender">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.gender"
												placeholder="请选择性别"
												style="height: 32px"
											>
												<el-option
													v-for="option in SEXOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="负责人固定电话" prop="addMemberLeaderAo.homePhone">
											<el-input
												min="0"
												v-model.trim="ruleForm.addMemberLeaderAo.homePhone"
												size="small"
												placeholder="请输入负责人固定电话"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="证件类型" prop="addMemberLeaderAo.certificatesType">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.certificatesType"
												placeholder="请选择证件类型"
												style="height: 32px"
											>
												<el-option
													v-for="option in CARDLIST"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="民族" prop="addMemberLeaderAo.nation">
											<el-input
												type="text"
												min="0"
												v-model.trim="ruleForm.addMemberLeaderAo.nation"
												size="small"
												placeholder="请输入民族"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="讲师级别" prop="addMemberLeaderAo.lecturerLevel">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.lecturerLevel"
												size="small"
												placeholder="请输入讲师级别"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="证件号码" prop="addMemberLeaderAo.certificatesNo">
											<el-input
												v-model="ruleForm.addMemberLeaderAo.certificatesNo"
												size="small"
												placeholder="请输入证件号码"
												@blur="checkStoreCertificatesNoIsExist"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="职业" prop="addMemberLeaderAo.profession">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.profession"
												placeholder="请选择职业"
												style="height: 32px"
											>
												<el-option
													v-for="option in OCCUPATIONOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="培训次数" prop="addMemberLeaderAo.trainingTimes">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.trainingTimes"
												size="small"
												placeholder="请输入培训次数"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="证件有效期" prop="addMemberLeaderAo.certificatesDate">
											<el-date-picker
												@change="changeCertificatesDate"
												value-format="yyyy-MM-dd"
												v-model.trim="ruleForm.addMemberLeaderAo.certificatesDate"
												type="daterange"
												range-separator="至"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
											></el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="文化程度" prop="addMemberLeaderAo.education">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.education"
												placeholder="请选择文化程度"
												style="height: 32px"
											>
												<el-option
													v-for="option in EDUCATIONOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="饮食习惯" prop="addMemberLeaderAo.eatingHabbits">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.eatingHabbits"
												size="small"
												placeholder="请输入饮食习惯"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="居住地" prop="addMemberLeaderAo.livePlace">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.livePlace"
												placeholder="请选择居住地"
												style="height: 32px"
											>
												<el-option
													v-for="option in PLACEOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="资委身份" prop="addMemberLeaderAo.resourceCommitteeIdentity">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.resourceCommitteeIdentity"
												size="small"
												placeholder="请输入资委身份"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</div>
					</div>
					<div class="detailMessage-box">
						<div class="detailMessage-leftBox">
							<div class="detailMessage-leftBox-picBox">
								<h6 class="sub-title">负责人配偶身份证正面</h6>
								<upload-image v-model="ruleForm.addMemberLeaderAo.spouseCertificatesPositiveUrl" />
								<h6 class="sub-title">负责人配偶身份证反面</h6>
								<upload-image v-model="ruleForm.addMemberLeaderAo.spouseCertificatesReverseUrl" />
							</div>
						</div>
						<div class="detailMessage-rightBox">
							<div class="dataBox">
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="(配偶)姓名" prop="addMemberLeaderAo.spouseRealname">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.spouseRealname"
												size="small"
												placeholder="请输入(配偶)姓名"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)居住地" prop="addMemberLeaderAo.spouseLivePlace">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.spouseLivePlace"
												placeholder="请选择(配偶)居住地"
												style="height: 32px"
											>
												<el-option
													v-for="option in PLACEOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)文化程度" prop="addMemberLeaderAo.spouseEducation">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.spouseEducation"
												placeholder="请选择(配偶)文化程度"
												style="height: 32px"
											>
												<el-option
													v-for="option in EDUCATIONOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)培训次数" prop="addMemberLeaderAo.spouseTrainingTimes">
											<el-input
												type="number"
												min="0"
												v-model.trim="ruleForm.addMemberLeaderAo.spouseTrainingTimes"
												size="small"
												placeholder="请输入(配偶)培训次数"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)证件类型" prop="addMemberLeaderAo.spouseCertificatesType">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.spouseCertificatesType"
												placeholder="请选择(配偶)证件类型"
												style="height: 32px"
											>
												<el-option
													v-for="option in CARDLIST"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)手机号码" prop="addMemberLeaderAo.spouseMobile">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.spouseMobile"
												size="small"
												placeholder="请输入(配偶)手机号码"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)职业" prop="addMemberLeaderAo.spouseProfession">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.spouseProfession"
												placeholder="请选择(配偶)职业"
												style="height: 32px"
											>
												<el-option
													v-for="option in OCCUPATIONOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)饮食习惯" prop="addMemberLeaderAo.spouseEatingHabbits">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.spouseEatingHabbits"
												size="small"
												placeholder="请输入(配偶)饮食习惯"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)证件号码" prop="addMemberLeaderAo.spouseCertificatesNo">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.spouseCertificatesNo"
												size="small"
												placeholder="请输入(配偶)证件号码"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)性别" prop="addMemberLeaderAo.spouseGender">
											<el-select
												v-model.trim="ruleForm.addMemberLeaderAo.spouseGender"
												placeholder="请选择(配偶)性别"
												style="height: 32px"
											>
												<el-option
													v-for="option in SEXOPTION"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)资委身份" prop="addMemberLeaderAo.spouseResourceCommitteeIdentity">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.spouseResourceCommitteeIdentity"
												size="small"
												placeholder="请输入(配偶)资委身份"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)证件有效期" prop="addMemberLeaderAo.spouseCertificatesDate">
											<el-date-picker
												@change="changeSpouseCertificatesDate"
												value-format="yyyy-MM-dd"
												v-model.trim="ruleForm.addMemberLeaderAo.spouseCertificatesDate"
												type="daterange"
												range-separator="至"
												start-placeholder="开始日期"
												end-placeholder="结束日期"
											></el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)民族" prop="addMemberLeaderAo.spouseNation">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.spouseNation"
												size="small"
												placeholder="请输入(配偶)民族"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="(配偶)讲师级别" prop="addMemberLeaderAo.spouseLecturerLevel">
											<el-input
												v-model.trim="ruleForm.addMemberLeaderAo.spouseLecturerLevel"
												size="small"
												placeholder="请输入(配偶)讲师级别"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</div>
					</div>
				</el-card>

				<template v-if="!isTransfer">
					<!-- 服务中心资料 -->

					<el-card class="box-card">
						<h6 class="title">服务中心资料</h6>
						<div class="detailMessage-box line">
							<div class="dataBox">
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="网点类型" prop="storeVO.shopType">
											<el-select
												v-model.trim="ruleForm.storeVO.shopType"
												@change="shopTypeChange"
												placeholder="请选择网点类型"
												style="height: 32px"
											>
												<el-option
													v-for="option in DOT"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="服务中心编号" prop="storeVO.code">
											<el-input
												v-model.trim="ruleForm.storeVO.code"
												size="small"
												:disabled="true"
												placeholder="请输入服务中心编号"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="服务中心名称" prop="storeVO.name">
											<el-input
												v-model.trim="ruleForm.storeVO.name"
												size="small"
												placeholder="请输入服务中心名称"
												@blur="checkStoreNameIsExist"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8" v-if="!isWechatStore">
										<el-form-item label="是否分店" prop="storeVO.isMainShop">
											<el-select
												@change="changeisMainShop"
												v-model.trim="ruleForm.storeVO.isMainShop"
												placeholder="请选择是否分店"
												style="height: 32px"
											>
												<el-option
													v-for="option in ISSERVICESHOP"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8" v-if="!isWechatStore">
										<el-form-item label="总店负责人卡号" prop="storeVO.leaderNo">
											<el-input
												v-model.trim="ruleForm.storeVO.leaderNo"
												size="small"
												disabled
												placeholder="请输入总店负责人卡号"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8" v-if="!isWechatStore">
										<el-form-item label="总店服务中心编号" prop="storeVO.extraInfo.code">
											<el-input
												v-model.trim="ruleForm.storeVO.extraInfo.code"
												size="small"
												disabled
												placeholder="请输入总店服务中心编号"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24" v-if="!isWechatStore">
									<el-col :span="8" v-if="ruleForm.storeVO.isMainShop == 2">
										<el-form-item label="分店管理员卡号" prop="storeVO.shopkeeperNo">
											<el-input
												v-model.trim="ruleForm.storeVO.shopkeeperNo"
												size="small"
												@blur="getMasterMemberInfoByCardNo(ruleForm.storeVO.shopkeeperNo, 'sub')"
												placeholder="请输入分店管理员卡号"
											>
												<el-button
													slot="append"
													icon="el-icon-search"
													size="small"
													@click="getMasterMemberInfoByCardNo(ruleForm.storeVO.shopkeeperNo, 'sub')"
												/>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8" v-if="ruleForm.storeVO.isMainShop == 2">
										<el-form-item label="分店管理员姓名" prop="storeVO.shopkeeperName">
											<el-input
												v-model.trim="ruleForm.storeVO.shopkeeperName"
												size="small"
												placeholder="请输入分店管理员姓名"
												disabled
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<!-- <el-col :span="6">
										<el-form-item label="服务中心名称" prop="storeVO.name">
											<el-input
												v-model.trim="ruleForm.storeVO.name"
												size="small"
												placeholder="请输入服务中心名称"
												@blur="checkStoreNameIsExist"
											></el-input>
										</el-form-item>
									</el-col> -->
									<el-col :span="8">
										<el-form-item label="所属分公司" prop="storeVO.companyCode">
											<el-select
												v-model.trim="ruleForm.storeVO.companyCode"
												:disabled="isEditStore"
												placeholder="请选择所属分公司"
												style="height: 32px"
											>
												<el-option
													v-for="{ label, value } in BRANCH_COMPANY"
													:key="value"
													:label="label"
													:value="value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="是否服务网点" prop="storeVO.isServiceShop">
											<el-select
												v-model.trim="ruleForm.storeVO.isServiceShop"
												placeholder="请选择是否服务网点"
												style="height: 32px"
											>
												<el-option
													v-for="option in ISTRUE"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="是否签订合同" prop="storeVO.isSignContract">
											<el-select
												v-model.trim="ruleForm.storeVO.isSignContract"
												placeholder="请选择是否签订合同"
												style="height: 32px"
											>
												<el-option
													v-for="option in ISTRUE"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="8" v-show="isWechatStore">
										<el-form-item label="油葱编号" prop="storeVO.ucongNo">
											<el-input
												v-model="ruleForm.storeVO.ucongNo"
												placeholder="请输入油葱编号"
												@blur="checkUCongNoIsExist"
											/>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="未签合同原因" prop="storeVO.extraInfo.unContactReason">
											<el-input
												v-model.trim="ruleForm.storeVO.extraInfo.unContactReason"
												size="small"
												placeholder="请输入未签合同原因"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="detailMessage-box line">
							<div class="dataBox">
								<el-row :gutter="24">
									<el-col :span="6">
										<el-form-item label="批准时间" prop="storeVO.ratifyDate">
											<el-date-picker
												v-model.trim="ruleForm.storeVO.ratifyDate"
												type="date"
												placeholder="选择批准时间"
												style="width: 100%"
											></el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="电话1" prop="storeVO.extraInfo.phone1">
											<el-input
												v-model.trim="ruleForm.storeVO.extraInfo.phone1"
												size="small"
												placeholder="请输入电话1"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="9">
										<el-form-item label="服务中心邮箱" prop="storeVO.email">
											<el-input v-model.trim="ruleForm.storeVO.email" placeholder="请输入服务中心邮箱">
												<template slot="append">@perfect99.com</template>
											</el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="6">
										<el-form-item label="开业时间" prop="storeVO.openDate">
											<el-date-picker
												v-model.trim="ruleForm.storeVO.openDate"
												type="date"
												placeholder="选择开业时间"
												style="width: 100%"
											></el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="电话2" prop="storeVO.extraInfo.phone2">
											<el-input
												v-model.trim="ruleForm.storeVO.extraInfo.phone2"
												size="small"
												placeholder="请输入电话2"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="6">
										<el-form-item label="联系手机" prop="storeVO.phone">
											<el-input
												v-model.trim="ruleForm.storeVO.phone"
												size="small"
												placeholder="请输入联系手机"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="邮编" prop="storeVO.zipCode">
											<el-input
												v-model.trim="ruleForm.storeVO.zipCode"
												size="small"
												placeholder="请输入邮编"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="传真" prop="storeVO.fax">
											<el-input v-model.trim="ruleForm.storeVO.fax" size="small" placeholder="请输入传真"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="detailMessage-box line">
							<div class="dataBox">
								<el-row :gutter="24">
									<el-col :span="12">
										<el-form-item label="收货人" prop="storeVO.deliveryInfo.person">
											<el-input
												v-if="ruleForm.storeVO.deliveryInfo"
												v-model.trim="ruleForm.storeVO.deliveryInfo.person"
												size="small"
												placeholder="请输入收货人"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="收货人电话" prop="storeVO.deliveryInfo.phoneNum">
											<el-input
												v-if="ruleForm.storeVO.deliveryInfo"
												v-model.trim="ruleForm.storeVO.deliveryInfo.phoneNum"
												size="small"
												placeholder="请输入收货人电话"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="12">
										<el-form-item label="经营场所" prop="storeVO.site">
											<div slot="label">
												<span style="color: #fe5353">*</span>
												经营场所
											</div>
											<addressSelect
												@chooseAddress="chooseBusinessAddress"
												:defalutData="ruleForm.storeVO.site"
												:needValid="true"
											></addressSelect>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="" prop="storeVO.deliveryInfo.detailAddress" class="no-label">
											<el-input
												v-if="ruleForm.storeVO.deliveryInfo"
												v-model.trim="ruleForm.storeVO.deliveryInfo.detailAddress"
												placeholder="请输入详细地址"
												@blur="checkBusinessAddressIsExist"
											></el-input>
										</el-form-item>
									</el-col>
									<template v-if="isEditStore">
										<el-col :span="24">
											<el-form-item label="导航地址" prop="storeVO.deliveryInfo.navigationAddressType">
												<el-radio-group
													v-if="ruleForm.storeVO.deliveryInfo"
													v-model="ruleForm.storeVO.deliveryInfo.navigationAddressType"
												>
													<el-radio :label="1">经营地址</el-radio>
													<el-radio :label="2">其他地址</el-radio>
												</el-radio-group>
											</el-form-item>
										</el-col>
										<el-col :span="24" v-if="ruleForm.storeVO.deliveryInfo.navigationAddressType == 2">
											<el-form-item label="" prop="storeVO.deliveryInfo.navigationAddress">
												<el-input
													v-if="ruleForm.storeVO.deliveryInfo"
													v-model="ruleForm.storeVO.deliveryInfo.navigationAddress"
													disabled
												>
													<el-button slot="append" @click="openMap">调整导航地址</el-button>
												</el-input>
											</el-form-item>
										</el-col>
									</template>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="12">
										<el-form-item label="收货地址" prop="storeVO.receiveGoodsSite">
											<div slot="label">
												<span style="color: #fe5353">*</span>
												收货地址
											</div>
											<addressSelect
												@chooseAddress="chooseReceiveGoodsAddress"
												:defalutData="ruleForm.storeVO.receiveGoodsSite"
												:needValid="true"
											></addressSelect>
											<!-- <el-button @click="showDialog" type="success" class="ml20" icon="el-icon-message">
												发送通知邮件
											</el-button>
											<div class="tipTitle" style="color: #d9001b">
												输入新地址后，点击【发送通知邮件】，可以将原地址和当前录入最新的地址以邮件形式通知到指定邮箱
											</div> -->
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="" prop="storeVO.deliveryInfo.address" class="no-label">
											<el-input
												v-if="ruleForm.storeVO.deliveryInfo"
												v-model.trim="ruleForm.storeVO.deliveryInfo.address"
												placeholder="请输入收货地址"
												ref="receiveGoodsAddressDetail"
											>
												<el-button type="primary" slot="append" class="el-button-primary" @click="copyDetailAddress">
													复制经营地址
												</el-button>
											</el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="收讫章" prop="storeVO.deliveryInfo.receiptSeal">
											<upload-image v-model="ruleForm.storeVO.deliveryInfo.receiptSeal" />
										</el-form-item>
									</el-col>
									<el-col :span="24">
										<el-form-item label="拟搬迁地址" prop="storeVO.deliveryInfo.planMoveAddress">
											<el-input
												v-if="ruleForm.storeVO.deliveryInfo"
												style="width: 75%"
												v-model.trim="ruleForm.storeVO.deliveryInfo.planMoveAddress"
												placeholder="请输入拟搬迁地址"
												size="small"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="联系地址" prop="storeVO.contactSite">
											<addressSelect
												@chooseAddress="chooseContactSiteAddress"
												:defalutData="ruleForm.storeVO.contactSite"
												:needValid="true"
											></addressSelect>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="" prop="storeVO.deliveryInfo.contactDetailAddress" class="no-label">
											<el-input
												v-model.trim="ruleForm.storeVO.deliveryInfo.contactDetailAddress"
												placeholder="请输入详细地址"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="detailMessage-box">
							<div class="dataBox">
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="法人姓名" prop="storeVO.extraInfo.legalPerson">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.legalPerson"
												placeholder="请输入法人姓名"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="法人身份证" prop="storeVO.extraInfo.legalInfo">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.legalInfo"
												placeholder="请输入法人身份证"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="微信号" prop="storeVO.wechat">
											<el-input v-model.trim="ruleForm.storeVO.wechat" placeholder="请输入微信号"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="原店号" prop="storeVO.extraInfo.originalStore">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.originalStore"
												placeholder="请输入原店号"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="是否跨省搬迁" prop="storeVO.extraInfo.isTransProvincial">
											<el-select
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.isTransProvincial"
												placeholder="请选择是否跨省搬迁"
												style="height: 32px"
											>
												<el-option :value="0" label="否"></el-option>
												<el-option :value="1" label="是"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="担保人1卡号" prop="storeVO.extraInfo.guaranteeCard1">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.guaranteeCard1"
												placeholder="请输入担保人1卡号"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="担保人1姓名" prop="storeVO.extraInfo.guaranteeName1">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.guaranteeName1"
												placeholder="请输入担保人1姓名"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="担保人1服务中心" prop="storeVO.extraInfo.guaranteeCenter1">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.guaranteeCenter1"
												placeholder="请输入担保人1服务中心"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="担保人2卡号" prop="storeVO.extraInfo.guaranteeCard2">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.guaranteeCard2"
												placeholder="请输入担保人2卡号"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="担保人2姓名" prop="storeVO.extraInfo.guaranteeName2">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.guaranteeName2"
												placeholder="请输入担保人2姓名"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="担保人2服务中心" prop="storeVO.extraInfo.guaranteeCenter2">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.guaranteeCenter2"
												placeholder="请输入担保人2服务中心"
											></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6" v-if="shopTypeCancelStatus">
										<el-form-item label="取消时间" prop="storeVO.extraInfo.cancelTime">
											<el-date-picker
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.cancelTime"
												type="date"
												value-format="timestamp"
												placeholder="选择取消时间"
												style="width: 100%"
											></el-date-picker>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24" v-show="shopTypeFrozenStatus">
									<el-col :span="6">
										<el-form-item label="冻结/解冻时间" prop="storeVO.extraInfo.frozenTime">
											<el-date-picker
												v-if="ruleForm.storeVO.extraInfo"
												type="date"
												v-model.trim="ruleForm.storeVO.extraInfo.frozenTime"
												value-format="timestamp"
												placeholder="选择冻结/解冻时间"
												style="width: 100%"
											></el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="18">
										<el-form-item label="冻结/解冻原因" prop="storeVO.extraInfo.frozenReason">
											<el-input
												v-if="ruleForm.storeVO.extraInfo"
												v-model.trim="ruleForm.storeVO.extraInfo.frozenReason"
												placeholder="请输入冻结/解冻原因"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="24">
										<el-form-item label="服务中心权限" prop="storeVO.permission">
											<el-checkbox-group v-model="ruleForm.storeVO.permission">
												<el-checkbox
													v-for="(item, index) in SERVICEAUTHORITY"
													:key="index"
													:label="item.value"
													:disabled="(!isEditStore && item.value == 7) || item.disabled"
													@change="dealPermission(item.value)"
												>
													{{ item.label }}
													<el-popover placement="top-start" width="120" trigger="hover" :content="item.tips">
														<i slot="reference" class="el-icon-question" />
													</el-popover>
												</el-checkbox>
											</el-checkbox-group>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="24">
									<el-col :span="8">
										<el-form-item label="服务中心星级" prop="storeVO.level">
											<el-popover :disabled="!isEditStore" placement="top-start" width="200" trigger="hover">
												<div>
													<i class="el-icon-warning warning"></i>
													请通过“服务中心星级管理”进行修改
												</div>
												<el-select
													v-model.trim="ruleForm.storeVO.level"
													:disabled="isEditStore"
													placeholder="请选择服务中心星级"
													style="height: 32px"
													slot="reference"
												>
													<el-option
														v-for="(item, index) in GRADE_OPTIONS"
														:key="index"
														:label="item"
														:value="Number(index)"
													></el-option>
												</el-select>
											</el-popover>
										</el-form-item>
									</el-col>
									<el-col :span="8">
										<el-form-item label="星级类型" prop="storeVO.levelResult">
											<el-input v-model.trim="ruleForm.storeVO.levelResult" disabled />
										</el-form-item>
									</el-col>
									<el-col :span="24">
										<el-form-item label="备注" prop="storeVO.remarks">
											<el-input
												v-model.trim="ruleForm.storeVO.remarks"
												type="textarea"
												maxlength="200"
												show-word-limit
												resize="none"
											></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</div>
					</el-card>
				</template>
			</el-form>
		</div>
		<actionBar>
			<template v-if="!isTransfer">
				<el-button
					type="primary"
					@click="createNewServiceCentre('ruleForm')"
					v-loading.fullscreen.lock="fullscreenLoading"
				>
					保存
				</el-button>
			</template>
			<template v-else>
				<el-button type="primary" @click="submitTransfer('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">
					保存
				</el-button>
			</template>
			<el-button @click="resetForm('ruleForm')">返回</el-button>
		</actionBar>

		<el-dialog title="发送邮件通知" :visible.sync="centerDialogVisible" width="30%" class="dialog-box" v-drag>
			<el-form :model="form" ref="form" label-width="128px" size="medium">
				<el-form-item label="通知接收邮件" prop="receiveEmail">
					<el-input min="0" v-model.trim="form.receiveEmail" size="small" placeholder="请输入通知接收邮件"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog('form')">取 消</el-button>
				<el-button type="primary" @click="sendEmailConfirm('form')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 确认变更内容 -->
		<el-dialog title="确认变更内容" :visible.sync="changeConfirmVisible" width="500px">
			<div>
				<el-checkbox-group v-model="editTypeStrs">
					<el-checkbox :label="item.label" disabled v-for="item in CHANGE_CONFIRM_LIST" :key="item.value"></el-checkbox>
				</el-checkbox-group>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="changeCacel" class="cacel">取 消</el-button>
				<el-button type="primary" @click="changeSave" class="save">确定</el-button>
			</span>
		</el-dialog>
		<!-- 地图弹窗 -->
		<el-dialog v-drag destroy-on-close title="地图展示" :visible.sync="mapPopVisible" width="100%">
			<GdMap
				:style="'width:100%;height:600px'"
				:position="ruleForm.storeVO.lng ? [ruleForm.storeVO.lng, ruleForm.storeVO.lat] : null"
				:title="ruleForm.storeVO.deliveryInfo.navigationAddress"
				failedText="未搜索到当前地址信息，请输入详细到街道的地址信息"
				@markerConfirm="markerConfirm"
			/>
		</el-dialog>
	</div>
</template>

<script>
import uploadImage from './module/uploadImage.vue';
import {
	CREATE_NEW_SERVICE_RULES,
	ISSERVICESHOP,
	ISTRUE,
	CARDLIST,
	SEXOPTION,
	OCCUPATIONOPTION,
	EDUCATIONOPTION,
	PLACEOPTION,
	MANAGEMENTOPTION,
	PROPERTYOPTION,
	COMPOSTIONOPTION,
	DataKey,
	CLENTOPTION,
	MODULE_TO_NAME,
	BRANCH_COMPANY,
	CAN_BUILD_STORE_ARR,
	CHANGE_CONFIRM_LIST,
	CHANGE_CONFIRM_NAME_TO_VALUE,
	CHANGE_CONFIRM_NAME_TO_LABEL,
	// SPECIAL_CITY_CODE_COLLECTION,
} from './config.js';
import { GRADE_OPTIONS } from '../serviceCenterGrade/config.js';
import { SERVICEAUTHORITY } from '../serviceCenterLimit/config';
import {
	diffParams,
	deepCopy,
	ObjectHaveValue,
	arrayToString,
	echoImagesDeal,
	emptyObject,
	jsonString,
	requiredArray,
} from './util.js';
import qs from 'querystring';
import GdMap from 'haha-gd-map';
// import { uploadFileType } from 'util/formValidation';
let companyData = {};
export default {
	name: 'serviceAdd',
	components: {
		'upload-image': uploadImage,
		GdMap,
	},
	data() {
		return {
			headers: {
				Authorization: this.$store.getters['user/getFullToken'],
			},
			SEXOPTION, //性别类型
			CARDLIST, //证件类型
			ISSERVICESHOP, //是否为分店
			OCCUPATIONOPTION, //职业
			EDUCATIONOPTION, //文化
			PLACEOPTION, //居住地
			SERVICEAUTHORITY, //服务中心权限
			MANAGEMENTOPTION, //经营类型
			PROPERTYOPTION, //房产类型
			ISTRUE, //是否选项
			COMPOSTIONOPTION, //经营形式
			DOT: [], //网点类型
			CLENTOPTION, //顾客身份
			GRADE_OPTIONS, //服务中心等级
			CREATE_NEW_SERVICE_RULES,
			BRANCH_COMPANY,
			CHANGE_CONFIRM_LIST,
			// SPECIAL_CITY_CODE_COLLECTION,
			isEditStore: false, // 以此判断是否未修改或新增
			ruleForm: Object.assign({ ...DataKey }),
			canBuildStoreArr: CAN_BUILD_STORE_ARR, // 可建服务中心顾客身份集合
			imageUrl: '',
			centerDialogVisible: false, //弹窗
			dialogVisible: false, //图片预览
			hrefLink: '',
			// uploadData: {},
			dialogImageUrl: '', //图片路径
			idCardAList: [], //身份证正面
			idCardBList: [], //身份证反面
			spouseIdCardAList: [], //配偶身份证正面
			spouseIdCardBList: [], //配偶身份证反面
			receiptSealList: [], //收讫章
			businessLicenseAList: [], //营业执照正面
			businessLicenseBList: [], //营业执照反面
			taxationAList: [], //税务登记证正面
			taxationBList: [], //税务登记证反面
			foodList: [], //食品经营许可证
			shopList: [], //店铺装修图
			form: {
				receiveEmail: '', //通知接收邮件
			},
			site: [], // 省市地址
			siteLabel: [], // 省市label
			place: [], // 省市地址
			placeLabel: [], // 省市label
			sitePalce: '请选择', // 省市占位符
			initDatas: Object.assign({ ...DataKey }), //修改服务中心 - 初始数据
			afterEditData: {}, // 修改服务中心 - 修改后数据
			changeConfirmVisible: false,
			editTypeStrs: [], // 确认变更内容数组
			editTypes: [],
			fullscreenLoading: false, // 全屏遮罩
			isWechatStore: false, // 是否微店
			shopTypeFrozenStatus: false, // 网点类型选择冻结状态
			shopTypeCancelStatus: false, //网点类型选择取消状态
			controlledArr: [1, 2, 4, 5], // 权限修改受控选项集合
			businessAddressCache: {}, //缓存经营场所省市区街道修改
			receiveGoodsAddressCache: {}, //缓存收货地址省市区街道修改
			mapPopVisible: false, //地图弹窗状态
		};
	},
	computed: {
		uploadParams() {
			const params = {
				storageType: this.$config.OSS_UPLOAD_TYPE,
				clientKey: this.$config.CLIENT_KEY.service,
			};
			return params;
		},
		isTransfer() {
			return this.$route.query.type === 'transfer';
		},
	},
	methods: {
		// 经营场所省市区选择
		chooseBusinessAddress(data) {
			if (data) {
				let filterData = data.map(item => [item.label, item.value]);
				this.ruleForm.storeVO.site = data.map(item => item.value);
				filterData.length == 3 && filterData.splice(3, 1, []);
				const [[provinceName, provinceCode], [cityName, cityCode], [areaName, areaCode], [streetName, streetCode]] =
					filterData;
				this.ruleForm.storeVO = {
					...this.ruleForm.storeVO,
					provinceName,
					provinceCode,
					cityName,
					cityCode,
					areaName,
					areaCode,
					streetName,
					streetCode,
				};
				this.businessAddressCache = {
					provinceName,
					provinceCode,
					cityName,
					cityCode,
					areaName,
					areaCode,
					streetName,
					streetCode,
				};
			} else {
				this.ruleForm.storeVO.site = [];
			}
		},
		// 收货地址省市区选择
		chooseReceiveGoodsAddress(data) {
			if (data) {
				let filterData = data.map(item => [item.label, item.value]);
				this.ruleForm.storeVO.receiveGoodsSite = data.map(item => item.value);
				filterData.length == 3 && filterData.splice(3, 1, []);
				const [
					[deliveryProvinceName, deliveryProvinceCode],
					[deliveryCityName, deliveryCityCode],
					[deliveryAreaName, deliveryAreaCode],
					[deliveryStreetName, deliveryStreetCode],
				] = filterData;
				this.ruleForm.storeVO.deliveryInfo = {
					...this.ruleForm.storeVO.deliveryInfo,
					deliveryProvinceName,
					deliveryProvinceCode,
					deliveryCityName,
					deliveryCityCode,
					deliveryAreaName,
					deliveryAreaCode,
					deliveryStreetName,
					deliveryStreetCode,
				};
				this.receiveGoodsAddressCache = {
					deliveryProvinceName,
					deliveryProvinceCode,
					deliveryCityName,
					deliveryCityCode,
					deliveryAreaName,
					deliveryAreaCode,
					deliveryStreetName,
					deliveryStreetCode,
				};
				this.queryProvinceHasWare(deliveryProvinceCode);
			} else {
				this.ruleForm.storeVO.receiveGoodsSite = [];
			}
		},
		// 证件资料经营场所选择
		chooseCredentBusinessAddress(data) {
			if (data) {
				let filterData = data.map(item => [item.label, item.value]);
				this.ruleForm.credentialVO1.info.businessSite = data.map(item => item.value);
				filterData.length == 3 && filterData.splice(3, 1, []);
				const [
					[businessProvinceName, businessProvinceCode],
					[businessCityName, businessCityCode],
					[businessAreaName, businessAreaCode],
					[businessStreetName, businessStreetCode],
				] = filterData;
				this.ruleForm.credentialVO1.info = {
					...this.ruleForm.credentialVO1.info,
					businessProvinceName,
					businessProvinceCode,
					businessCityName,
					businessCityCode,
					businessAreaName,
					businessAreaCode,
					businessStreetName,
					businessStreetCode,
				};
			} else {
				this.ruleForm.credentialVO1.info.businessSite = [];
			}
		},
		// 联系地址 省市区选择
		chooseContactSiteAddress(data) {
			if (data) {
				let filterData = data.map(({ label, value }) => [label, value]);
				this.ruleForm.storeVO.contactSite = data.map(item => item.value);
				filterData.length == 3 && filterData.splice(3, 1, []);
				const [
					[contactProvinceName, contactProvinceCode],
					[contactCityName, contactCityCode],
					[contactAreaName, contactAreaCode],
					[contactStreetName, contactStreetCode],
				] = filterData;
				this.ruleForm.storeVO.deliveryInfo = {
					...this.ruleForm.storeVO.deliveryInfo,
					contactProvinceName,
					contactProvinceCode,
					contactCityName,
					contactCityCode,
					contactAreaName,
					contactAreaCode,
					contactStreetName,
					contactStreetCode,
				};
			} else {
				this.ruleForm.storeVO.contactSite = [];
			}
		},

		// 添加服务中心
		async addStore(data) {
			this.fullscreenLoading = true;
			const res = await this.$fetch({
				method: 'post',
				url: '/mgmt/store/addStore',
				data,
			});
			this.fullscreenLoading = false;
			console.log('新建服务中心响应: ', res);
			if (res && res.code === 200) {
				this.$message({
					type: 'success',
					message: res.message || '新建服务中心成功!',
					onClose: () => {
						this.$dispatch('UPDATE_SERVICE_CENTRE_LIST');
						this.$refs['ruleForm'].resetFields();
						this.ruleForm = emptyObject(this.ruleForm);
						this.ruleForm.addMemberLeaderAo.cardNo = '';
						this.$closeSelf();
					},
				});
			} else {
				this.$message.error(res.data.message || '操作失败');
			}
		},

		// 生成服务中心编号
		async requestStoreCode() {
			const { isEditStore } = this;
			const { storeVO } = this.ruleForm;
			if (isEditStore || storeVO.code) {
				return;
			}
			if (!storeVO.site || (storeVO.site && storeVO.site.length == 0)) {
				return this.$message.warning('请选择经营场所的省市区');
			}
			const res = await this.$fetch(`/mgmt/store/product/StoreCode?provinceCode=${storeVO.site[0]}`);
			if (res && res.code === 200 && res.data) {
				const { code, isFull } = res.data;
				this.ruleForm.storeVO.code = code;
				if (isFull) {
					this.$message.error('服务中心编号已满，无法新建服务中心');
				}
			} else {
				this.$message.error('生成服务中心编号失败, 请查询服务是否可用');
			}
		},
		//根据服务中心code获取服务中心
		async getStoreByCode(code) {
			if (!code) return;

			const res = await this.$fetch(`/mgmt/store/getStoreByCode?code=${code}`);
			if (res && res.code === 200) {
				let data = res.data;
				let store = data.store;
				store.addressInfo = data.store.addressInfo && JSON.parse(data.store.addressInfo);
				store.decorationInfo = JSON.parse(data.store.decorationInfo) || {};
				store.extraInfo = JSON.parse(data.store.extraInfo) || {};
				store.deliveryInfo = JSON.parse(data.store.deliveryInfo) || {};
				this.ruleForm.storeVO = {
					...store,
				};
			} else {
				this.$message.warning(`无法根据服务中心编号: ${code} 查询到服务中心信息`);
			}
		},
		// 网点类型列表
		async shopTypeList() {
			const { shopTypeOptions } = this.$store.getters['system/getOptions'];
			this.DOT = shopTypeOptions.map(({ label, value }) => ({ label, value }));
		},
		changeCertificatesDate() {
			this.ruleForm.addMemberLeaderAo.certificatesStartDate = this.ruleForm.addMemberLeaderAo.certificatesDate[0];
			this.ruleForm.addMemberLeaderAo.certificatesEndDate = this.ruleForm.addMemberLeaderAo.certificatesDate[1];
		},
		changeExpiryDate() {
			this.ruleForm.credentialVO1.info.startTime = this.ruleForm.credentialVO1.expiryDate[0];
			this.ruleForm.credentialVO1.info.endTime = this.ruleForm.credentialVO1.expiryDate[1];
		},
		changeSpouseCertificatesDate() {
			this.ruleForm.addMemberLeaderAo.spouseCertificatesStartDate =
				this.ruleForm.addMemberLeaderAo.spouseCertificatesDate[0];
			this.ruleForm.addMemberLeaderAo.spouseCertificatesEndDate =
				this.ruleForm.addMemberLeaderAo.spouseCertificatesDate[1];
		},
		async showDialog() {
			const {
				site,
				deliveryInfo: { deliveryProvinceCode },
			} = this.ruleForm.storeVO;
			await this.requestStoreCode();
			if (!site || (site && site.length == 0)) {
				return this.$message.warning('请选择经营场所的省市区县');
			}
			if (!deliveryProvinceCode) {
				return this.$message.warning('请选择收货地址的省市区县');
			}
			this.centerDialogVisible = true;
		},
		closeDialog(formName) {
			this.$refs[formName].resetFields();
			this.centerDialogVisible = !this.centerDialogVisible;
		},
		// 确定发送邮件
		async sendEmailConfirm() {
			const {
				deliveryInfo: { address, deliveryProvinceName, deliveryCityName, deliveryAreaName, deliveryStreetName },
				code,
			} = this.ruleForm.storeVO;
			const detailAddress = `${deliveryProvinceName}${deliveryCityName}${deliveryAreaName}${deliveryStreetName}${address}`;
			const params = {
				email: this.form.receiveEmail,
				newAddress: detailAddress,
				storeCode: code,
			};
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/sendAddressChangeMsg',
				data: params,
			});
			if (res && res.code === 200) {
				this.centerDialogVisible = false;
				this.$message.success('发送成功');
			} else {
				this.$message.error('发送失败');
			}
		},
		// 是否分店
		changeisMainShop() {
			//分店
			if (this.ruleForm.storeVO.isMainShop == 2) {
				this.ruleForm.storeVO.leaderNo = this.ruleForm.addMemberLeaderAo.cardNo;
				this.ruleForm.addMemberLeaderAo.storeCode = this.ruleForm.storeVO.extraInfo.code;
				// this.ruleForm.storeVO.extraInfo.code = this.ruleForm.addMemberLeaderAo.storeCode;//不管是否新建分店，这个storeCode都是不变的
				if (!this.ruleForm.addMemberLeaderAo.storeCode) {
					this.$message({
						type: 'warning',
						message: '该负责人卡号下，没有服务中心',
					});
				}
				// 总店
			} else {
				this.ruleForm.addMemberLeaderAo.storeCode = '';
			}
		},
		// 根据会员卡号获取服务中心总店信息(新增相关)
		async getBaseStoreInfoByCardNo(cardNo) {
			if (!cardNo) return;
			const res = await this.$fetch(`/mgmt/store/leader/getLeaderByCardNo?cardNo=${cardNo}`);
			if (res && res.data) {
				this.ruleForm.storeVO.leaderNo = res.data.cardNo;
				this.ruleForm.storeVO.extraInfo.code = res.data.storeCode;
			} else {
				this.$message.error('获取总店信息失败');
			}
		},
		// 根据会员卡号获取主卡顾客信息
		async getMasterMemberInfoByCardNo(cardNo, type) {
			if (!cardNo) return;
			if (type == 'main') {
				this.getBaseStoreInfoByCardNo(cardNo);
			}
			const res = await this.$fetch(`/mgmt/store/getMasterMemberInfoByCardNo?cardNo=${cardNo}`);
			if (res && res.code === 200) {
				console.info('根据会员卡号获取主卡顾客信息: ', res.data);
				let data = res.data;
				let certificatesPositiveUrl = '';
				let certificatesReverseUrl = '';
				if (type == 'main') {
					this.ruleForm.addMemberLeaderAo = {
						...data,
						certificatesPositiveUrl,
						certificatesReverseUrl,
					};
					// this.ruleForm.storeVO.leaderNo = res.data.cardNo;
					// this.ruleForm.storeVO.extraInfo.code = res.data.leaderStoreCode;
					this.ruleForm.storeVO.companyCode = res.data.companyCode;
				} else {
					this.ruleForm.storeVO.shopkeeperName = data.realname;
					this.checkShopKeeperNoIsExist();
				}
			} else {
				this.$message.error(`无法根据卡号:${cardNo} 查询到顾客信息, 请确认卡号的正确性`);
			}
		},
		// 获取公司的信息
		async getBranComByType() {
			const { serviceCompanyOptions } = this.$store.getters['system/getOptions'];
			this.BRANCH_COMPANY = serviceCompanyOptions.map(({ label, value }) => {
				companyData[value] = label;
				return {
					label: `${value} ${label}`,
					value,
				};
			});
		},
		// 取消
		resetForm(formName) {
			this.$confirm('是否确认离开当前页面？', '提示')
				.then(() => {
					this.$refs[formName].resetFields();
					this.ruleForm = emptyObject(this.ruleForm);
					this.$closeSelf();
				})
				.catch(() => {});
		},

		// 保存
		async createNewServiceCentre(formName) {
			// 先检查是否具有权限新建服务中心 @todo 未来改用责任链模式组织这块代码
			const { memberType } = this.ruleForm.addMemberLeaderAo;
			// console.info('用户类型: ', memberType, typeof memberType);
			if (![3, 4].includes(memberType)) {
				return this.$message.warning('当前顾客无法新建服务中心');
			}
			// fix:需要先选择经营场所，才能获取storeCode （tips：屏蔽，由于不需要发送邮件，所以可以在后台自动生成code）
			// await this.requestStoreCode();
			// 常规表单字段校验
			if (!requiredArray(this.ruleForm.storeVO.site)) {
				return this.$message.warning('请选择经营场所省市区');
			}
			if (!this.isWechatStore && !requiredArray(this.ruleForm.storeVO.receiveGoodsSite)) {
				return this.$message.warning('请选择收货地址省市区');
			}

			this.$refs[formName].validate(async (valid, object) => {
				let params = deepCopy(this.ruleForm);
				params.storeVO.decorationInfo = jsonString(params.storeVO.decorationInfo);
				params.storeVO.deliveryInfo = jsonString(params.storeVO.deliveryInfo);
				params.storeVO.extraInfo = jsonString(params.storeVO.extraInfo);
				params.storeVO.addressInfo = jsonString(params.storeVO.addressInfo);
				params.credentialVO1.info = jsonString(params.credentialVO1.info);
				params.credentialVO2.info = jsonString(params.credentialVO2.info);
				params.credentialVO3.info = jsonString(params.credentialVO3.info);
				params.credentialVO1.expiryDate =
					params.credentialVO1 && params.credentialVO1.expiryDate && params.credentialVO1.expiryDate.join(',');
				params.credentialVO2.expiryDate =
					params.credentialVO2 && params.credentialVO2.expiryDate && params.credentialVO2.expiryDate.join(',');
				params.credentialVO3.expiryDate =
					params.credentialVO3 && params.credentialVO3.expiryDate && params.credentialVO3.expiryDate.join(',');
				params.storeVO.permission =
					(params.storeVO && params.storeVO.permission && params.storeVO.permission.join(',')) || ',';
				params.storeVO.leaderNo = this.ruleForm.addMemberLeaderAo.cardNo;
				params.storeVO.companyName =
					params.storeVO.companyCode in companyData ? companyData[params.storeVO.companyCode] : '';
				delete params.storeVO.site;

				if (valid) {
					if (this.isEditStore) {
						await this.editStoreDatadeal(deepCopy(this.ruleForm));
					} else {
						await this.addStore(params);
					}
				} else {
					const MODULE_TO_NAME_ARR = Object.keys(MODULE_TO_NAME);
					for (let index in object) {
						if (MODULE_TO_NAME_ARR.includes(index.split('.')[0])) {
							this.$message({
								type: 'error',
								message: '请填写完整' + MODULE_TO_NAME[index.split('.')[0]],
							});
							break;
						}
					}
				}
			});
		},
		// **********************************************************************

		// 查询所在地是否存在可用仓库
		async queryProvinceHasWare(code) {
			if (!code) return this.$message.warning('请选择收货地址');
			const res = await this.$fetch(`/mgmt/sys/checkWareByProvinceCode?provinceCode=${code}`);
			if (res && !res.data) {
				this.$message.warning(`该地址未查找到相应仓库信息，请重新输入`);
			}
		},
		/********* 2.0.2修复版 2021/2/22添加 *********/
		// 校验服务中心名称是否存在
		async checkStoreNameIsExist() {
			const { name } = this.ruleForm.storeVO;
			const { memberType } = this.ruleForm.addMemberLeaderAo;
			if (!name) return this.$message.warning('请输入服务中心名称');
			const res = await this.$fetch(`/mgmt/store/checkStoreNameIsExist?storeName=${name}&memberType=${memberType}`);
			if (res && res.code != 200) {
				this.$message.error((res && res.data.message) || '该服务中心名称已经存在，请输入其他名称');
			}
		},
		// 校验管理员卡号是否存在
		async checkShopKeeperNoIsExist() {
			const { shopkeeperNo } = this.ruleForm.storeVO;
			if (!shopkeeperNo) return this.$message.warning('请输入分店管理员卡号');
			const res = await this.$fetch(`/mgmt/store/checkShopKeeperNoIsExist?shopKeeperNo=${shopkeeperNo}`);
			if (res && res.data) {
				this.$message.error('该分店管理员卡号已经存在，请输入其他卡号');
			}
		},
		// 校验证件号唯一性
		async checkStoreCertificatesNoIsExist() {
			const { certificatesNo } = this.ruleForm.addMemberLeaderAo;
			if (!certificatesNo) return this.$message.warning('请输入证件号码');
			const res = await this.$fetch(`/mgmt/store/checkStoreCertificatesNoIsExist?certificatesNo=${certificatesNo}`);
			if (res && res.data) {
				this.$message.error('该证件号码已经存在，请输入其他号码');
			}
		},
		// 校验油葱编号是否存在
		async checkUCongNoIsExist() {
			const { ucongNo } = this.ruleForm.storeVO;
			if (!ucongNo) return this.$message.warning('请输入油葱编号');
			const res = await this.$fetch(`/mgmt/store/checkUCongNoIsExist?uCongNo=${ucongNo}`);
			if (res && res.data) {
				this.$message.error('该油葱编号已经存在，请输入其他编号');
			}
		},
		// 校验经营地址是否存在
		async checkBusinessAddressIsExist() {
			const {
				provinceName,
				cityName,
				areaName,
				streetName,
				deliveryInfo: { detailAddress },
			} = this.ruleForm.storeVO;
			if (provinceName && cityName && areaName) {
				if (detailAddress) {
					const data = { provinceName, cityName, areaName, streetName, detailAddress };
					const res = await this.$fetch(`/mgmt/store/checkBusinessAddressIsExist?${qs.stringify(data)}`);
					if (res && res.data) {
						this.$message.error(`该经营地址已被店铺${res.data}使用`);
					}
				} else {
					this.$message.warning('请输入经营详细地址');
				}
			} else {
				this.$message.warning('请选择经营地址省市区');
				this.ruleForm.storeVO.deliveryInfo.detailAddress = '';
			}
		},
		// 复制经营场所详细地址
		copyDetailAddress() {
			this.ruleForm.storeVO.deliveryInfo.address = this.ruleForm.storeVO.deliveryInfo.detailAddress;
			this.$refs.receiveGoodsAddressDetail.focus();
			this.$refs.receiveGoodsAddressDetail.blur();
		},
		// 2021/3/18添加
		// 修改网点类型调用
		shopTypeChange() {
			this.$nextTick(() => {
				if (this.shopTypeFrozenStatus) {
					this.ruleForm.storeVO.extraInfo.frozenTime = new Date().getTime();
					this.ruleForm.storeVO.extraInfo.cancelTime = null;
				}
				if (this.shopTypeCancelStatus) {
					this.ruleForm.storeVO.extraInfo.cancelTime = new Date().getTime();
					this.ruleForm.storeVO.extraInfo.frozenTime = null;
					this.ruleForm.storeVO.extraInfo.frozenReason = null;
				}
			});
		},
		/********************************************************************** */
		/* *************************2021/5/21 添加***************************** */
		popRemind() {
			console.log(323232);
			return false;
		},
		// 打开地图弹窗
		openMap() {
			this.mapPopVisible = true;
		},
		// 地图位置确定 回调
		markerConfirm(data) {
			const {
				address,
				location: { lat, lng },
				pname,
				cityname,
				adname,
			} = data;
			this.ruleForm.storeVO.lat = lat || '';
			this.ruleForm.storeVO.lng = lng || '';
			this.ruleForm.storeVO.deliveryInfo.navigationAddress = `${pname || ''}${cityname || ''}${adname || ''}${
				address || ''
			}`;
			this.mapPopVisible = false;
		},

		// =============================  修改服务中心  ==================================
		// 根据会员卡号获取服务中心负责人信息
		async getLeaderByCardNo(cardNo) {
			const res = await this.$fetch(`/mgmt/store/leader/getLeaderByCardNo?cardNo=${cardNo}`);
			if (res && res.data) {
				const {
					certificatesPositiveUrl,
					certificatesReverseUrl,
					spouseCertificatesPositiveUrl,
					spouseCertificatesReverseUrl,
					certificatesStartDate,
					certificatesEndDate,
					spouseCertificatesStartDate,
					spouseCertificatesEndDate,
				} = res.data;
				if (certificatesStartDate && certificatesEndDate) {
					res.data.certificatesDate = [certificatesStartDate, certificatesEndDate];
				}
				if (spouseCertificatesStartDate && spouseCertificatesEndDate) {
					res.data.spouseCertificatesDate = [spouseCertificatesStartDate, spouseCertificatesEndDate];
				}
				this.ruleForm.addMemberLeaderAo = { ...res.data };
				this.idCardAList = echoImagesDeal(certificatesPositiveUrl);
				this.idCardBList = echoImagesDeal(certificatesReverseUrl);
				this.spouseIdCardAList = echoImagesDeal(spouseCertificatesPositiveUrl);
				this.spouseIdCardBList = echoImagesDeal(spouseCertificatesReverseUrl);
				this.ruleForm.storeVO.extraInfo.code = res.data.storeCode;
				this.ruleForm.storeVO.leaderNo = res.data.cardNo;
				this.initDatas = JSON.parse(jsonString(this.ruleForm));
			} else {
				this.$message.error('获取负责人信息失败');
			}
		},
		// 根据服务中心编号获取服务信息--店铺装修/通讯地址/额外信息/证件信息
		async getStoreBaseInfoByCode(code) {
			const params = { storeCode: code };
			const res = await this.$fetch(`/mgmt/store/getStoreBaseInfo?${qs.stringify(params)}`);
			if (res && res.data) {
				const { storeInfo, list, deliveryInfo, extraInfo, storeDecoration } = res.data;
				const { provinceCode, cityCode, areaCode, streetCode } = storeInfo;
				const {
					deliveryProvinceCode,
					deliveryCityCode,
					deliveryAreaCode,
					deliveryStreetCode,
					contactProvinceCode,
					contactCityCode,
					contactAreaCode,
					contactStreetCode,
				} = deliveryInfo ? deliveryInfo : {};
				this.echoImages(res.data);
				list &&
					list.length &&
					list.map(v => {
						v.expiryDate && (v.expiryDate = v.expiryDate.split(','));
						v.info = JSON.parse(v.info) ? JSON.parse(v.info) : {};
					});
				let data = {};
				data.addMemberLeaderAo = {};
				data.storeVO = storeInfo;
				data.credentialVO1 = (list && list.length && list[0]) || { info: {} };
				data.credentialVO2 = (list && list.length && list[1]) || { info: {} };
				data.credentialVO3 = (list && list.length && list[2]) || { info: {} };
				data.storeVO.deliveryInfo = deliveryInfo || {};
				data.storeVO.extraInfo = extraInfo || {};
				data.storeVO.decorationInfo = storeDecoration || {};
				if (data.credentialVO1) {
					const { businessProvinceCode, businessCityCode, businessAreaCode, businessStreetCode } =
						data.credentialVO1.info;
					data.credentialVO1.info.businessSite = this.addressDisplay(
						businessProvinceCode,
						businessCityCode,
						businessAreaCode,
						businessStreetCode
					);
				}
				data.storeVO.site = this.addressDisplay(provinceCode, cityCode, areaCode, streetCode);
				data.storeVO.receiveGoodsSite = this.addressDisplay(
					deliveryProvinceCode,
					deliveryCityCode,
					deliveryAreaCode,
					deliveryStreetCode
				);
				// 新增联系地址 省市区 2021-07-14
				data.storeVO.contactSite = this.addressDisplay(
					contactProvinceCode,
					contactCityCode,
					contactAreaCode,
					contactStreetCode
				);
				data.storeVO.permission = (data.storeVO.permission && data.storeVO.permission.split(',').map(Number)) || [];
				this.ruleForm = { ...this.ruleForm, ...data };
				this.dealPermissionDisabled();
			}
		},
		// 处理保存数据格式(修改和新增的数据格式有稍微区别)
		dealSumbitParams(params) {
			if (!params) return;
			const { credentialVO1, credentialVO2, credentialVO3 } = params;
			let data = {};
			data.editLeaderAo = params.addMemberLeaderAo;
			data.storeDataDto = params.storeVO;
			data.storeDecorationDto = params.storeVO.decorationInfo;
			data.credentialList = [credentialVO1, credentialVO2, credentialVO3];
			return data;
		},
		// 编辑服务中心-回显图片
		echoImages(data) {
			if (!data) return;
			const [business, food, taxation] = data.list;
			this.receiptSealList = echoImagesDeal(data.deliveryInfo.receiptSeal);
			if (business) {
				this.businessLicenseAList = echoImagesDeal(business.imageFrontUrl);
				this.businessLicenseBList = echoImagesDeal(business.imageBackUrl);
			}
			if (taxation) {
				this.taxationAList = echoImagesDeal(taxation.imageFrontUrl);
				this.taxationBList = echoImagesDeal(taxation.imageBackUrl);
			}
			if (food) {
				this.foodList = echoImagesDeal(food.imageFrontUrl);
			}
			data.storeDecoration &&
				data.storeDecoration.storePic &&
				(this.shopList = data.storeDecoration.storePic.split(',').map(item => ({ url: item })));
		},

		// 更新服务中心资料信息数据处理
		editStoreDatadeal(params) {
			diffParams(this.initDatas, params);
			let newParams = this.dealSumbitParams(params);
			this.editTypes.length = 0;
			this.editTypeStrs.length = 0;
			for (let index in newParams) {
				if (ObjectHaveValue(newParams[index])) {
					this.editTypeStrs.push(CHANGE_CONFIRM_NAME_TO_LABEL[index]);
					this.editTypes.push(CHANGE_CONFIRM_NAME_TO_VALUE[index]);
				}
			}
			// 服务中心资料经营场所修改逻辑（包括详细地址都要传给后台）
			newParams = this.businessSiteChangeLink(deepCopy(this.initDatas), deepCopy(newParams));
			newParams = this.receiveGoodsSiteChangeLink(deepCopy(this.initDatas), deepCopy(newParams));

			// 处理导航地址 切换功能（navigationAddressType字段无需置为null）
			const { navigationAddressType } = this.initDatas?.storeVO?.deliveryInfo || {};
			const { navigationAddress, navigationAddressType: newNavigationAddressType } =
				newParams?.storeDataDto?.deliveryInfo || {};
			if (navigationAddressType && navigationAddress && !newNavigationAddressType) {
				newParams.storeDataDto.deliveryInfo.navigationAddressType = navigationAddressType;
			}

			this.changeConfirmVisible = true;
			this.afterEditData = deepCopy(newParams);
			console.log(newParams, 'newParams');
		},
		// 服务中心资料经营场所修改逻辑（包括详细地址都要传给后台）
		businessSiteChangeLink(initData, newData) {
			if (newData.storeDataDto?.site) {
				newData.storeDataDto = { ...newData.storeDataDto, ...this.businessAddressCache };
				if (!newData.storeDataDto.deliveryInfo.detailAddress) {
					newData.storeDataDto.deliveryInfo.detailAddress = initData.storeVO.deliveryInfo.detailAddress;
				}
			}
			if (newData.storeDataDto?.deliveryInfo?.detailAddress) {
				if (!newData.storeDataDto.site) {
					const { provinceName, provinceCode, cityName, cityCode, areaName, areaCode, streetName, streetCode } =
						initData.storeVO;
					newData.storeDataDto = {
						...newData.storeDataDto,
						provinceName,
						provinceCode,
						cityName,
						cityCode,
						areaName,
						areaCode,
						streetName,
						streetCode,
					};
				} else {
					newData.storeDataDto = { ...newData.storeDataDto, ...this.businessAddressCache };
				}
			}
			return newData;
		},
		// 服务中心资料收货地址修改逻辑（包括详细地址都要传给后台）
		receiveGoodsSiteChangeLink(initData, newData) {
			if (newData.storeDataDto?.receiveGoodsSite) {
				newData.storeDataDto.deliveryInfo = { ...newData.storeDataDto?.deliveryInfo, ...this.receiveGoodsAddressCache };
				if (!newData.storeDataDto.deliveryInfo.address) {
					newData.storeDataDto.deliveryInfo.address = initData.storeVO.deliveryInfo.address;
				}
			}
			if (newData.storeDataDto?.deliveryInfo?.address) {
				if (!newData.storeDataDto.receiveGoodsSite) {
					const {
						deliveryProvinceName,
						deliveryProvinceCode,
						deliveryCityName,
						deliveryCityCode,
						deliveryAreaName,
						deliveryAreaCode,
						deliveryStreetName,
						deliveryStreetCode,
					} = initData.storeVO.deliveryInfo;
					newData.storeDataDto.deliveryInfo = {
						...newData.storeDataDto.deliveryInfo,
						deliveryProvinceName,
						deliveryProvinceCode,
						deliveryCityName,
						deliveryCityCode,
						deliveryAreaName,
						deliveryAreaCode,
						deliveryStreetName,
						deliveryStreetCode,
					};
				} else {
					newData.storeDataDto.deliveryInfo = {
						...newData.storeDataDto.deliveryInfo,
						...this.receiveGoodsAddressCache,
					};
				}
			}
			return newData;
		},
		// 地址选择器回显（判断中山市，只有三联）
		addressDisplay(province, city, area, street) {
			let list = [];
			if (province) {
				list = [province, city, area, street];
			}
			// if (this.SPECIAL_CITY_CODE_COLLECTION.includes(city)) {
			// 	list.pop();
			// }
			return list;
		},
		// 修改取消保存
		changeCacel() {
			this.changeConfirmVisible = false;
			this.editTypeStrs.length = 0;
			this.editTypes.length = 0;
		},
		// 修改确认保存
		async changeSave() {
			if (this.editTypes.length == 0) {
				this.$message.warning('未变更任何内容，请确认是否修改');
				return;
			}
			const { code } = this.$route.query;
			this.afterEditData.editTypes = this.editTypes;
			this.afterEditData.storeCode = code;
			let params = this.afterEditData;
			params.storeDecorationDto.storeCode = code;
			params.storeDataDto.decorationInfo = jsonString(params.storeDataDto.decorationInfo);
			params.storeDataDto.deliveryInfo = jsonString(params.storeDataDto.deliveryInfo);
			params.storeDataDto.extraInfo = jsonString(params.storeDataDto.extraInfo);
			params.storeDataDto.addressInfo = jsonString(params.storeDataDto.addressInfo);
			if (params.storeDataDto && params.storeDataDto.permission) {
				params.storeDataDto.permission = arrayToString(params.storeDataDto.permission);
			} else {
				params.storeDataDto.permission = null;
			}
			params.credentialList.forEach((item, index) => {
				item.storeCode = code;
				item.expiryDate = arrayToString(item.expiryDate);
				item.info = jsonString(item.info);
				item.credentialType = [1, 3, 2][index]; // 兼容后端字段顺序
			});

			params.editLeaderAo.id = this.initDatas.addMemberLeaderAo.id;

			this.fullscreenLoading = true;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/editStore',
				data: params,
			});
			this.fullscreenLoading = false;
			if (res && res.code === 200) {
				// this.$dispatch('UPDATE_SERVICE_DETAIL')
				this.$message.success('修改服务中心内容成功');
				this.$refs['ruleForm'].resetFields();
				this.$closeSelf();
				this.$dispatch('UPDATE_SERVICE_CENTRE_DETAIL');
			} else {
				this.$message.error((res.data && res.data.message) || '修改服务中心内容失败');
			}
		},

		// =============================  转让服务中心  ==================================
		// 校验负责人转移的卡号有效性 @todo 暂不用
		async validLeaderNoUsed() {
			const { cardNo, leaderStoreCode: storeCode } = this.ruleForm.addMemberLeaderAo;
			const params = { cardNo, storeCode };
			const res = await this.$fetch(`/mgmt/store/leader/validLeaderTransfer?${qs.stringify(params)}`);
			if (res && res.code === 200) {
				return res.data;
			} else {
				this.$message.warning(res.data.message || '此卡号无效');
				return false;
			}
		},
		// 转让店铺 保存
		async submitTransfer() {
			const { addMemberLeaderAo } = this.ruleForm;
			const res = await this.$fetch({
				method: 'POST',
				url: '/mgmt/store/leader/leaderTransfer',
				data: { ...addMemberLeaderAo, storeCode: this.$route.query.code },
			});
			if (res && res.code === 200) {
				this.$message.success('操作成功');
				this.$dispatch('UPDATE_LEADER_DATA_MODULE');
				this.$refs['ruleForm'].resetFields();
				this.$closeSelf();
			} else {
				this.$message.error((res.data && res.data.message) || '操作失败');
			}
		},
		// 处理权限选项是否置灰规则
		dealPermissionDisabled() {
			const { controlledArr } = this;
			const { permission } = this.ruleForm.storeVO;
			let SERVICEAUTHORITY = deepCopy(this.SERVICEAUTHORITY);
			if (permission.includes(6) || permission.includes(7)) {
				SERVICEAUTHORITY.map(item => {
					if (controlledArr.includes(item.value)) {
						item.disabled = true;
					}
				});
			} else {
				SERVICEAUTHORITY.map(item => {
					if (controlledArr.includes(item.value)) {
						item.disabled = false;
					}
				});
			}
			this.SERVICEAUTHORITY = SERVICEAUTHORITY;
		},
		// 处理服务中心权限修改逻辑
		dealPermission(val) {
			const { controlledArr } = this;
			const { permission } = this.ruleForm.storeVO;
			let result = [];
			if (val == 6 || val == 7) {
				result = permission.filter(item => !controlledArr.includes(item));
				if (val == 7) {
					if (permission.includes(7)) {
						!result.includes(6) ? result.push(6) : '';
					} else {
						result.includes(6) ? result.splice(result.indexOf(6), 1) : '';
					}
				}
			} else {
				result = permission.map(item => item);
			}
			this.ruleForm.storeVO.permission = result;
			this.dealPermissionDisabled();
		},
	},
	watch: {
		'ruleForm.credentialVO1.certificateDate': {
			handler(val) {
				console.log(val, 'val');
			},
		},
		'ruleForm.addMemberLeaderAo.memberType'(val) {
			this.isWechatStore = val == 4;
		},
		'ruleForm.storeVO.shopType'(val) {
			const result = this.DOT.filter(item => {
				return item.value == val;
			});
			if (result && result.length > 0) {
				// 网点类型暂未确定，暂以冻结来匹配四项冻结状态（“油葱微店（冻结）”、“冻结资格/申请微店中”、“冻结资格（美容中心转）”、“冻结资格”）
				this.shopTypeFrozenStatus = result[0].label.indexOf('冻结') != -1;
				this.shopTypeCancelStatus = result[0].label.indexOf('取消') != -1;
			}
		},
	},
	mounted() {
		this.ruleForm = emptyObject(this.ruleForm);
		this.shopTypeList();
		this.getBranComByType();
		const { code, cardNo, type } = this.$route.query;
		if (type == 'transfer') {
			this.getLeaderByCardNo(cardNo);
		} else if (code) {
			this.isEditStore = true;
			const callOrder = async () => {
				// await this.getStoreByCode(code);
				// this.getLeaderByStoreCode(code);
				await this.getStoreBaseInfoByCode(code);
				await this.getLeaderByCardNo(cardNo);
			};
			callOrder.call(this);
		}
	},
};
</script>
<style lang="scss" scoped>
.serviceAdd {
	.my-cascader {
		width: 503px;
		margin-right: 10px;
	}
	::v-deep.place {
		.el-input__inner::placeholder {
			color: #333;
		}
	}
	::v-deep.el-form-item {
		&.no-label {
			.el-form-item__content {
				margin-left: 0px !important;
			}
		}
	}
	.ml20 {
		margin-left: 20px;
	}
	.detailMessage {
		margin: 24px 0;
		.box-card {
			width: 100%;
			border-bottom: 1px solid #ececec;
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 24px;
			.title {
				font-size: 16px;
				width: 100%;
				padding-bottom: 12px;
				border-bottom: 1px solid #ececec;
				display: inline-block;
			}
			.detailMessage-box {
				padding: 24px 0;
				width: 100%;
				overflow: hidden;
			}
			.line {
				border-bottom: 1px solid #ececec;
			}
			.detailMessage-leftBox {
				width: 15%;
				float: left;
				.detailMessage-leftBox-picBox {
					.sub-title:first-of-type {
						margin-top: 10px;
					}
					.sub-title {
						font-size: 14px;
						margin-bottom: 15px;
						margin-top: 24px;
					}
				}
			}
			.detailMessage-rightBox {
				width: 85%;
				float: left;
			}
			> div {
				width: 33%;
				font-size: 12px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				color: rgba(134, 134, 134, 1);
				line-height: 17px;
				margin-bottom: 8px;
			}
		}
		.tipTitle {
			display: inline-block;
			line-height: 20px;
			color: #8c939b;
			font-size: 12px;
			margin-top: 10px;
		}
	}
}
::v-deep.self-detail-message {
	.el-range-editor--medium.el-input__inner,
	.el-select {
		width: 100%;
	}
	.el-cascader--medium {
		width: 100%;
	}
	.el-icon-warning {
		&.warning {
			color: $warning;
		}
	}
}
</style>

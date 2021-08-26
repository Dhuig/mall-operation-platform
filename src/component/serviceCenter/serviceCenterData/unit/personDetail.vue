<template>
	<div class="personDetail">
		<el-form :model="dataSource" label-width="130px" label-suffix=":">
			<el-row class="el-row" type="flex">
				<el-col :span="8">
					<el-form-item label="负责人卡号">{{ dataSource.cardNo || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="负责人姓名">{{ dataSource.realname || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="顾客身份">{{ CUSTOMER_TYPE[dataSource.memberType] || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="手机号码">{{ dataSource.mobile || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="证件类型">
						{{ (dataSource.certificatesType && CARDLIST_CONFIG[dataSource.certificatesType]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="证件类型号码">{{ dataSource.certificatesNo || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="证件有效期">
						{{ dataSource.certificatesStartDate }} ~ {{ dataSource.certificatesEndDate }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="负责人固定电话">{{ dataSource.homePhone || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="性别">{{ (dataSource.gender && SEX_CONFIG[dataSource.gender]) || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="文化程度">
						{{ (dataSource.education && EDUCATIONOPTION_CONFIG[dataSource.education]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="民族">{{ dataSource.nation || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="居住地">
						{{ (dataSource.livePlace && PLACEOPTION_CONFIG[dataSource.livePlace]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="职业">
						{{ (dataSource.profession && OCCUPATIONOPTION_CONFIG[dataSource.profession]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="培训次数">{{ dataSource.trainingTimes || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="讲师级别">{{ dataSource.lecturerLevel || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="资委身份">{{ dataSource.resourceCommitteeIdentity || '' }}</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item label="饮食习惯">{{ dataSource.eatingHabbits || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)姓名">{{ dataSource.spouseRealname || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)手机号码">{{ dataSource.spouseMobile || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)证件类型">
						{{ (dataSource.spouseCertificatesType && CARDLIST_CONFIG[dataSource.spouseCertificatesType]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)证件号码">{{ dataSource.spouseCertificatesNo || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)性别">
						{{ (dataSource.spouseGender && SEX_CONFIG[dataSource.spouseGender]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)文化程度">
						{{ (dataSource.spouseEducation && EDUCATIONOPTION_CONFIG[dataSource.spouseEducation]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)民族">{{ dataSource.spouseNation || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)居住地">
						{{ (dataSource.spouseLivePlace && PLACEOPTION_CONFIG[dataSource.spouseLivePlace]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)职业">
						{{ (dataSource.spouseProfession && OCCUPATIONOPTION_CONFIG[dataSource.spouseProfession]) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)培训次数">{{ dataSource.spouseTrainingTimes || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)讲师级别">{{ dataSource.spouseLecturerLevel || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)资委身份">{{ dataSource.spouseResourceCommitteeIdentity || '' }}</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="(配偶)饮食习惯">{{ dataSource.spouseEatingHabbits || '' }}</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item label="负责人身份证正面">
						<el-image
							fit="scale-down"
							class="image-wrap"
							v-if="dataSource.certificatesPositiveUrl"
							:src="dataSource.certificatesPositiveUrl"
							:preview-src-list="[dataSource.certificatesPositiveUrl]"
							alt="身份证正面"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="负责人身份证反面">
						<el-image
							fit="scale-down"
							class="image-wrap"
							v-if="dataSource.certificatesReverseUrl"
							:src="dataSource.certificatesReverseUrl"
							:preview-src-list="[dataSource.certificatesReverseUrl]"
							alt="身份证反面"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item label="负责人配偶身份证正面">
						<el-image
							fit="scale-down"
							class="image-wrap"
							v-if="dataSource.spouseCertificatesPositiveUrl"
							:src="dataSource.spouseCertificatesPositiveUrl"
							:preview-src-list="[dataSource.spouseCertificatesPositiveUrl]"
							alt="负责人配偶身份证正面"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="负责人配偶身份证反面">
						<el-image
							fit="scale-down"
							class="image-wrap"
							v-if="dataSource.spouseCertificatesReverseUrl"
							:src="dataSource.spouseCertificatesReverseUrl"
							:preview-src-list="[dataSource.spouseCertificatesReverseUrl]"
							alt="负责人配偶身份证反面"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
import { CUSTOMER_TYPE } from '@/component/customerManagement/config';
import {
	CARDLIST_CONFIG,
	SEX_CONFIG,
	EDUCATIONOPTION_CONFIG,
	PLACEOPTION_CONFIG,
	OCCUPATIONOPTION_CONFIG,
} from './config.js';
export default {
	name: 'personDetail',
	props: {
		dataSource: {
			type: Object,
		},
	},
	data() {
		return {
			CUSTOMER_TYPE,
			CARDLIST_CONFIG,
			SEX_CONFIG,
			EDUCATIONOPTION_CONFIG,
			PLACEOPTION_CONFIG,
			OCCUPATIONOPTION_CONFIG,
		};
	},
};
</script>
<style lang="scss" scoped>
::v-deep.personDetail {
	color: rgba(92, 98, 104, 1);
	.el-row {
		flex-wrap: wrap;
	}
	.el-form-item {
		margin-bottom: 0;
		.el-form-item__label {
			color: rgba(92, 98, 104, 1);
		}
	}
	.image-wrap {
		> img {
			width: 100px;
			height: 100px;
		}
	}
}
</style>

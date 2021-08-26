<template>
	<div class="personDetail">
		<el-form :model="dataSource" label-suffix=":" label-width="130px">
			<template v-if="dataSource">
				<el-row class="el-row">
					<el-col :span="24">
						<el-form-item label="五证合一">
							{{ dataSource.certificateVO1 && dataSource.certificateVO1.info.isFive == 1 ? '是' : '否' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="营业执照名称">
							{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.certificateName) || '' }}
						</el-form-item>
					</el-col>
					<!-- <el-col :span="8">
					<el-form-item label="执照证件号码">
						{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.certificateCode) || '' }}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="营业执照法人">
						{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.certificatePerson) || '' }}
					</el-form-item>
				</el-col> -->
					<el-col :span="8">
						<el-form-item label="经营类型">
							{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.operatorType) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="社会信用代码">
							{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.socialCreditCode) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="经营者">
							{{ (dataSource.certificateVO1.info && dataSource.certificateVO1.info.operatorName) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="办证机关">
							{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.certificationAuthority) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="办证日期">
							{{ formatDateDefault(dataSource.certificateVO1.certificateDate) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="证件有效期">
							{{
								dataSource.certificateVO1 &&
								dataSource.certificateVO1.expiryDate &&
								dataSource.certificateVO1.expiryDate[0]
							}}~{{
								dataSource.certificateVO1 &&
								dataSource.certificateVO1.expiryDate &&
								dataSource.certificateVO1.expiryDate[1]
							}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="经营场所">{{ businessSelectPlace }}</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="详细地址">
							{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.businessPlace) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="范围是否包含销售">
							{{ dataSource.certificateVO1 && dataSource.certificateVO1.info.isSale == '1' ? '是' : '否' }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="执照经营范围">
							{{ (dataSource.certificateVO1 && dataSource.certificateVO1.info.businessScope) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="税务登记证税字号">
							{{ (dataSource.certificateVO2 && dataSource.certificateVO2.info.code) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="纳税人识别号">
							{{ (dataSource.certificateVO2 && dataSource.certificateVO2.info.code) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="证件有效期">
							{{
								dataSource.certificateVO2 &&
								dataSource.certificateVO2.expiryDate &&
								dataSource.certificateVO2.expiryDate[0]
							}}~{{
								dataSource.certificateVO2 &&
								dataSource.certificateVO2.expiryDate &&
								dataSource.certificateVO2.expiryDate[1]
							}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="办证机关">
							{{ (dataSource.certificateVO2 && dataSource.certificateVO2.info.certificationAuthority) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="办证日期">
							{{ formatDateDefault(dataSource.certificateVO2.certificateDate) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="经营范围">
							{{ (dataSource.certificateVO2 && dataSource.certificateVO2.info.businessScope) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="食品经营许可证">
							{{ dataSource.certificateVO1 && dataSource.certificateVO1.info.isFoodBusinessLicense == 1 ? '有' : '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="许可证号">
							{{ (dataSource.certificateVO3 && dataSource.certificateVO3.info.licenseKey) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="办证日期">
							{{ formatDateDefault(dataSource.certificateVO3.certificateDate) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="证件有效期">
							{{
								dataSource.certificateVO3 &&
								dataSource.certificateVO3.expiryDate &&
								dataSource.certificateVO3.expiryDate[0]
							}}~{{
								dataSource.certificateVO3 &&
								dataSource.certificateVO3.expiryDate &&
								dataSource.certificateVO3.expiryDate[1]
							}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="办证机关">
							{{ (dataSource.certificateVO3 && dataSource.certificateVO3.info.certificationAuthority) || '' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="经营项目">
							{{ (dataSource.certificateVO3 && dataSource.certificateVO3.info.businessScope) || '' }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24" type="flex">
					<el-col :span="8">
						<el-form-item label="营业执照正本">
							<el-image
								v-if="dataSource.certificateVO1.imageFrontUrl"
								fit="scale-down"
								class="image-wrap"
								:src="dataSource.certificateVO1.imageFrontUrl"
								:preview-src-list="[dataSource.certificateVO1.imageFrontUrl]"
								alt
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="营业执照副本">
							<el-image
								v-if="dataSource.certificateVO1.imageBackUrl"
								fit="scale-down"
								class="image-wrap"
								:src="dataSource.certificateVO1.imageBackUrl"
								:preview-src-list="[dataSource.certificateVO1.imageBackUrl]"
								alt
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="税务登记证正本">
							<el-image
								v-if="dataSource.certificateVO2.imageFrontUrl"
								fit="scale-down"
								class="image-wrap"
								:src="dataSource.certificateVO2.imageFrontUrl"
								:preview-src-list="[dataSource.certificateVO2.imageFrontUrl]"
								alt
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="24" type="flex">
					<el-col :span="8">
						<el-form-item label="税务登记证副本">
							<el-image
								v-if="dataSource.certificateVO2.imageBackUrl"
								fit="scale-down"
								class="image-wrap"
								:src="dataSource.certificateVO2.imageBackUrl"
								:preview-src-list="[dataSource.certificateVO2.imageBackUrl]"
								alt
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="食品经营许可证">
							<el-image
								v-if="dataSource.certificateVO3.imageFrontUrl"
								fit="scale-down"
								class="image-wrap"
								:src="dataSource.certificateVO3.imageFrontUrl"
								:preview-src-list="[dataSource.certificateVO3.imageFrontUrl]"
								alt
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</template>
			<template v-else>
				<el-row type="flex" justify="center" class="tips">暂无证件资料</el-row>
			</template>
		</el-form>
	</div>
</template>

<script>
import { formatDateDefault } from 'util/formValidation.js';
import { COMPOSITION_SHAPE } from './config';
export default {
	name: 'cardDetail',
	props: {
		dataSource: {
			type: Object,
			default() {
				return {
					certificateVO1: {},
					certificateVO2: {},
					certificateVO3: {},
				};
			},
		},
	},
	data() {
		return {
			COMPOSITION_SHAPE,
			formatDateDefault,
		};
	},
	watch: {
		dataSource: {
			handler(val) {
				for (let index in val) {
					if (val[index].expiryDate && typeof val[index].expiryDate == 'string') {
						val[index].expiryDate = val[index].expiryDate.split(',');
					}
					if (!val[index].info) {
						val[index].info = {};
					}
				}
			},
			deep: true,
			immediate: true,
		},
	},
	computed: {
		businessSelectPlace() {
			const { businessProvinceName, businessCityName, businessAreaName, businessStreetName } =
				(this.dataSource && this.dataSource.certificateVO1 && this.dataSource.certificateVO1.info) || {};
			return `${businessProvinceName || ''} ${businessCityName || ''} ${businessAreaName || ''} ${
				businessStreetName || ''
			}`;
		},
	},
	mounted() {},
	methods: {},
};
</script>
<style lang="scss" scoped>
.tips {
	padding: 50px 0;
	font-size: 12px;
}
::v-deep.personDetail {
	.el-form-item {
		margin-bottom: 0;
	}
	.el-row {
		line-height: 30px;
	}
	.image-wrap {
		> img {
			width: 150px;
			height: 150px;
		}
	}
}
</style>

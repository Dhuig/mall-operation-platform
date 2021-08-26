<template>
    <div class="bank_statement_download_center">
        <guideBar></guideBar>

        <!-- 表格 -->
        <el-card class="box-card">
            <tableList
				border
				:dataSource="list"
				:columns="EAS_COLUMNS"
				slotcontent
			>
                <template slot-scope="scope">
					<div>
						<span class="btns" @click="handleDownload(scope.data)">点击下载</span>
						<span class="btns" @click="handleDelRecord(scope.data)">删除记录</span>
					</div>
				</template>
			</tableList>
        </el-card>
    </div>
</template>

<script>
import { EAS_COLUMNS } from './config.js';
export default {
    name: 'downloadCenter',
    data() {
        return {
            EAS_COLUMNS,
            list: [
                {
                    index: 1,
                    createTime: '2020-08-28 15:56:18',
                    filename: 'EAS凭证'
                }
            ]
        }
    },
    methods: {
        handleDownload(row) {
            console.log(row)
        },
        handleDelRecord(row) {
            console.log(row)
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep.bank_statement_download_center {
    .box-card {
        margin: 24px 0;
    }
    .btns {
		color: #0877fd;
		cursor: pointer;
		margin-right: 18px;
	}
}
</style>
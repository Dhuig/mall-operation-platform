<template>
	<div class="tinymce">
		<editor :disabled="disabled" :id="id" v-model="tinymceHtml" :init="initEditor"></editor>
	</div>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import './plugins/icons/icons.min.js';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/imagetools/plugin.min.js';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import './plugins/lineheight/plugin.min.js';
// import './tinyEditor/skins/zh_CN.js';
import { generateRandomCode } from '@/util';
// import { zh_CN } from './language/zh_CN_json.js';
export default {
	name: 'tinymce',
	props: {
		value: {
			type: String,
			dafault: '',
		},
		init: {
			type: Object,
			dafault: () => {
				return {};
			},
		},
		disabled: {
			type: Boolean,
		},
		id: {
			type: String,
			default: generateRandomCode(),
		},
	},
	data() {
		return {
			tinymceHtml: '请输入内容',
			initEditor: {
				language_url: require('./language/skins/zh_CN.js'),
				language: 'zh_CN',
				height: 400,
				menubar: '',
				plugins: 'link lists image code table wordcount imagetools lineheight',
				toolbar:
					'bold italic underline lineheight strikethrough | fontsizeselect | forecolor backcolor |image code | alignleft aligncenter alignright alignjustify | undo redo ',
				//  link:插入链接 unlink bullist：无序列表 numlist:有序列表 outdent:取消缩进 indent:增加缩进 blockquote:添加引号 removeformat:清楚格式
				automatic_uploads: true,
				elementpath: false,
				imagetools_toolbar: 'editimage',
				fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
				lineheight_formats: '1 2 4 6 8 12 16',
				image_advtab: true,
				font_formats:
					'微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif',
				images_upload_handler: async (blobInfo, succFun) => {
					var file = blobInfo.blob(); //转化为易于理解的file对象
					let formData = new FormData();
					formData.append('file', file, file.name); //此处与源文档不一样
					formData.append('storageType', this.$config.OSS_UPLOAD_TYPE);
					formData.append('clientKey', this.$config.CLIENT_KEY.promotion);
					let res = await this.$fetch({
						method: 'POST',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						url: '/storage/upload',
						data: formData,
					});
					if (res && res.status == 200 && res.data.success) {
						succFun(res.data.datas.fileUrlKey);
					} else {
						succFun('');
						this.$message.error('上传失败！');
					}
				},
				// 监听 tyinymce 初始化完成事件
				setup: editor => {
					editor.on('init', () => {
						editor.setContent(this.value);
					});
				},
				// 监听input 和change事件，实时更新vlaue
				init_instance_callback: editor => {
					editor.on('input', e => {
						this.isInput = false;
						this.$emit('input', e.target.innerHTML);
					});
					editor.on('change', e => {
						// this.$emit('input', editor.getContent());
						this.isInput = false;
						this.$emit('input', e.level.content);
					});
					editor.on('blur', () => {
						this.isInput = true;
					});
				},
			},
			isInput: true,
		};
	},
	methods: {
		tinyIsEnable(boolean) {
			if (boolean) {
				this.tinymce.get(this.id).mode.set('readonly');
			} else {
				this.tinymce.get(this.id).mode.set('design');
			}
		},
	},
	watch: {
		init: {
			handler(val) {
				if (!val) return;
				this.$nextTick(() => {
					this.tinyIsEnable(val.readonly);
				});
			},
			deep: true,
			immediate: true,
		},
		value(val) {
			if (!this.isInput) return;
			if (!val) return;
			this.$nextTick(() => {
				this.tinymce.get(this.id).setContent(val);
			});
		},
	},
	mounted() {
		this.tinymceHtml = this.value;
		this.tinymce = tinymce;
		// this.tinymce.addI18n('zh_CN', zh_CN);
		this.initEditor = Object(this.initEditor, this.init);
		this.tinymce.init(this.initEditor);
	},
	components: { Editor },
};
</script>

<style lang="scss" scoped>
@import url('./css/skin.min.css');
</style>
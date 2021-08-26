import Vue from 'vue';
// import store from '@/store/index';
import { throttle } from 'underscore';

import {
  Skeleton,// 骨架屏
  SkeletonItem, // 骨架屏
  Dialog,
  Empty,
  Breadcrumb,
  Badge,
  BreadcrumbItem,
  Input,
  Select,
  Option,
  Button,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Table,
  TableColumn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Descriptions,
  DescriptionsItem,
  Cascader,
  Tabs,
  TabPane,
  Row,
  Col,
  Form,
  FormItem,
  DatePicker,
  Card,
  Pagination,
  Loading,
  Tag,
  Popover,
  Popconfirm,
  Checkbox,
  CheckboxGroup,
  Steps,
  Step,
  Radio,
  RadioGroup,
  RadioButton,
  MessageBox,
  Message,
  Alert,
  Tree,
  InputNumber,
  Collapse,
  CollapseItem,
  Image,
  Divider,
  Switch,
  Autocomplete,
  TimePicker,
	Notification,
} from 'element-ui';
import Upload from 'component/common/eleUpload/index.js'

// throttle Message tips frequency
['error', 'success', 'info', 'warning'].forEach(type => {
  Message[type] = throttle(function (options) {
    if (typeof options === 'string') {
      options = { message: options }
    }
    options.type = type;
    return Message(options);
  }, 500);
});
// disable dialog mask close event when click the mask behind
Dialog.props.closeOnClickModal.default = false;
// append general upload token(from data store)
// Upload.props.onChange.default = function() {
//   store.commit('system/UPDATE_SIGNATURE_VERIFICATION');
// };

[
  Skeleton,// 骨架屏
  SkeletonItem, // 骨架屏
  Dialog,
  Empty,
  Breadcrumb,
  BreadcrumbItem,
  Badge,
  Input,
  Select,
  Option,
  Button,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Table,
  TableColumn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Descriptions,
  DescriptionsItem,
  Cascader,
  Tabs,
  TabPane,
  Row,
  Col,
  Form,
  FormItem,
  DatePicker,
  Card,
  Pagination,
  Loading,
  Tag,
  Popover,
  Popconfirm,
  Checkbox,
  CheckboxGroup,
  Steps,
  Step,
  Radio,
  RadioGroup,
  RadioButton,
  Upload,
  Alert,
  Tree,
  InputNumber,
  Collapse,
  CollapseItem,
  Image,
  Divider,
  Switch,
  Autocomplete,
  TimePicker,
].forEach(plugin => Vue.use(plugin));

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

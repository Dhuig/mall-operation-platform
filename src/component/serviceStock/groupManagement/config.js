import { formatDate, addPrefixForAmount } from 'util/formValidation';
// 团购单搜索列表
export const GROUP_BUY_ORDER__MANAGEMENT_SERACH = {
  form: [
    {
      label: '分公司编号',
      key: 'companyCode',
      type: 'input',
      value: '',
      placeholder: '请填写分公司编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '服务中心编号',
      key: 'storeCode',
      type: 'input',
      value: '',
      placeholder: '请填写服务中心编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '产品编号',
      key: 'productCode',
      type: 'input',
      value: '',
      placeholder: '请填写产品编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '团购订单编号',
      key: 'orderNo',
      type: 'input',
      value: '',
      placeholder: '请填写团购订单编号',
      rules: [
        { min: 1, max: 20, message: '长度在 1 到 20 个字符' },
      ],
    },
    {
      label: '订单月份',
      key: 'month',
      type: 'datePicker',
      value: '',
      config: {
        type: 'month',
        valueFormat: 'yyyyMM',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        placeholder: '请选择月份'
      },
    },
    {
      label: '月结月份',
      key: 'settleMonth',
      type: 'datePicker',
      value: '',
      config: {
        type: 'month',
        valueFormat: 'yyyyMM',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        placeholder: '请选择月份'
      },
    }
  ]
}

export const GROUP_BUY_ORDER_MANAGEMENT_COLUMNS = [
  { label: '分公司编号', prop: 'companyCode', align: 'center' },
  { label: '服务中心号', prop: 'storeCode', align: 'center' },
  { label: '团购订单编号', prop: 'orderNo', align: 'center', width: '200' },
  {
    label: '订单时间',
    prop: 'createTime',
    align: 'center',
    width: '150',
    formatter: ({ createTime }) => {
      return formatDate(createTime);
    },
  },
  { label: '产品编码', prop: 'productCode', align: 'center' },
  { label: '产品名称', prop: 'productName', align: 'center' },
  { label: '单位', prop: 'meterUnit', align: 'center' },
  {
    label: '团购价',
    prop: 'groupPrice',
    align: 'center',
    formatter: ({ groupPrice }) => {
      return addPrefixForAmount(groupPrice);
    },
  },
  {
    label: '零售价',
    prop: 'retailPrice',
    align: 'center',
    formatter: ({ retailPrice }) => {
      return addPrefixForAmount(retailPrice);
    },
  },
  {
    label: '上期结余', prop: 'priorBalance', align: 'center',
    formatter: ({ priorBalance }) => {
      return String(priorBalance);
    },
  },
  {
    label: '本期已报', prop: 'reportNum', align: 'center',
    formatter: ({ reportNum }) => {
      return String(reportNum);
    },
  },
  {
    label: '当前库存', prop: 'productNum', align: 'center',
    formatter: ({ productNum }) => {
      return String(productNum);
    },
  },
  {
    label: '团购价合计',
    prop: 'groupPriceSum',
    align: 'center',
    formatter: ({ groupPriceSum }) => {
      return addPrefixForAmount(groupPriceSum);
    },
  },
  {
    label: '零售价合计',
    prop: 'retailPriceSum',
    align: 'center',
    formatter: ({ retailPriceSum }) => {
      return addPrefixForAmount(retailPriceSum);
    },
  },
]

// 团购单详情
export const GROUP_BUY_STOCK_DETAIL_COLUMNS = [
  {
    label: '报单时间',
    prop: 'reportTime',
    align: 'center',
    width: 140,
    formatter: ({ reportTime }) => {
      return formatDate(reportTime);
    },
  },
  { label: '报单订单号', prop: 'reportNo', align: 'center', width: 170 },
  { label: '购货人姓名', prop: 'purchaserName', align: 'center' },
  { label: '购货人卡号', prop: 'purchaserCardNo', align: 'center', width: 120 },
  { label: '购货人手机', prop: 'purchaserPhone', align: 'center', width: 120 },
  {
    label: '报单数量',
    prop: 'diffNum',
    align: 'center',
    formatter: ({ diffNum }) => {
      return diffNum === 0 ? 0 : diffNum;
    }
  },
  {
    label: '零售价',
    prop: 'retailPrice',
    align: 'center',
    formatter: ({ retailPrice }) => {
      return retailPrice === 0 ? 0 : '￥' + retailPrice;
    }
  },
  {
    label: '团购价',
    prop: 'groupPrice',
    align: 'center',
    formatter: ({ groupPrice }) => {
      return groupPrice === 0 ? 0 : '￥' + groupPrice;
    }
  },
  {
    label: 'PV',
    prop: 'pv',
    align: 'center',
    formatter: ({ pv }) => {
      return pv === 0 ? 0 : pv;
    }
  },
  {
    label: '运费补贴券',
    prop: 'haulageSubsidy',
    align: 'center',
    formatter: ({ haulageSubsidy }) => {
      return haulageSubsidy === 0 ? 0 : '￥' + haulageSubsidy;
    }
  },
  {
    label: '电子礼券',
    prop: 'electronGift',
    align: 'center',
    formatter: ({ electronGift }) => {
      return electronGift === 0 ? 0 : '￥' + electronGift;
    }
  },
  {
    label: '团购价合计',
    prop: 'totalGroupPrice',
    align: 'center',
    formatter: ({ totalGroupPrice }) => {
      return totalGroupPrice === 0 ? 0 : '￥' + totalGroupPrice;
    }
  },
  {
    label: '零售价合计',
    prop: 'totalRetailPrice',
    align: 'center',
    formatter: ({ totalRetailPrice }) => {
      return totalRetailPrice === 0 ? 0 : '￥' + totalRetailPrice;
    }
  },
  {
    label: '剩余库存', prop: 'productNum', align: 'center', formatter: ({ productNum }) => {
      return productNum === 0 ? 0 : productNum;
    }
  },
];

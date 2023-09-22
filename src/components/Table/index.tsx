import 'element-plus/es/components/table/style/css';
import 'element-plus/es/components/table-column/style/css';


// import type ElTable from 'element-plus/lib/components/table';
// import type { ElTableColumn } from 'element-plus/lib/components/table';
import { ElTable, ElTableColumn } from 'element-plus';
import { isFun } from '@/hooks/utils';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { MySkeleton } from "../skeleton";

import './index.scss';


type ElTableType = InstanceType<typeof ElTable>;
type ElTableProps = ElTableType['$props'];

type UserElTableColumnProps = {
  slotName?: string;
  headerSlot?: string;
  render?: (...arg: any[]) => any;
  children?: ElTableColumnProps[];
};

export type ElTableColumnProps = InstanceType<typeof ElTableColumn>['$props'] &
  UserElTableColumnProps;

export type ConditionalKeys<Base, Condition> = NonNullable<
  // Wrap in `NonNullable` to strip away the `undefined` type from the produced union.
  {
    // Map through all the keys of the given base type.
    [Key in keyof Base]: Key extends Condition // Pick only keys with types extending the given `Condition` type.
      ? // Retain this key since the condition passes.
        Key
      : // Discard this key since the condition fails.
        never;

    // Convert the produced object into a union type of the keys which passed the conditional test.
  }[keyof Base]
>;

type eventKeyVal = {
  [key in keyof ElTableType]: key extends `on${infer stringA}` ? `on${stringA}` : never;
};
type EmitKeyMethod = ConditionalKeys<ElTableType, `on${string}`>;
type eventKey = NonNullable<eventKeyVal[keyof eventKeyVal]>;
type CamelEventKey<T extends string> = {
  [key in T]: key extends `on${infer stringA}-${infer stringB}`
    ? `on${stringA}${Capitalize<stringB>}`
    : key;
};
type eventJsx = CamelEventKey<CamelEventKey<EmitKeyMethod>[keyof CamelEventKey<EmitKeyMethod>]>;
type eventKeyName = eventJsx[keyof eventJsx];

type eventMethodProps = {
  [key in eventKeyName]: (...args: any[]) => any;
};

export const tableProps = {
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  align: {
    type: String,
    default: 'left',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Array as PropType<ElTableColumnProps[]>,
    default: () => [],
  },
};
type OmitTableProp = Required<Omit<ElTableProps, 'data' | 'class' | eventKey>>;

type KeyConstructor<Base extends object> = {
  [KeyProp in keyof Base]: PropType<Base[KeyProp]>;
};
type TableValidProps = KeyConstructor<OmitTableProp>;

export type MergeTableProps = typeof tableProps &
  eventMethodProps & {
    otherProps: PropType<Record<string, any>>;
    summaryMethod: PropType<(...param: any[]) => string[]>;
  } & TableValidProps;

const MyTable = defineComponent({
  name: 'MyTable',
  props: {
    ...(tableProps as MergeTableProps),
  },
  setup(
    props: {
      data: any;
      column: any;
      align: string;
      loading: boolean;
    },
    { attrs, slots }
  ) {
    // 集中处理 每一列
    const renderHeaderWidth = (column) => {
      if(column&&column.length){
        column.forEach(_item => {
        let span = document.createElement("span");
      // 设置表头名称
        span.innerText = _item.label;
      // 临时插入 document
      document.body.appendChild(span);
      // 重点：获取 span 最小宽度，设置当前列，注意这里加了 20，字段较多时还是有挤压，
      // 且渲染后的 div 内左右 padding 都是 10，所以 +20 。（可能还有边距/边框等值，需要根据实际情况加上）
       _item.minWidth=span.getBoundingClientRect().width + 20;
       if(_item.minWidth<80){
        _item.minWidth=80
       }
       document.body.removeChild(span)
       });
      }
    };
    renderHeaderWidth(props.column)

    return () => {
      const { data, column, align,loading } = props;
      const renderColumn = (columnDict: Record<string, any>, index: number) => {
        const { render, slotName, headerSlot, children,isHidden=false,minWidth,...restAtts } = columnDict;
        const vSlots: {
          default?: (scope: Record<string, any>) => any;
          header?: (scope: Record<string, any>) => any;
        } = {};
        // console.log("attrs",slots,attrs);
        if (isFun(render)) {
          vSlots.default = scope => {
            if (restAtts.prop) {
              return render(scope.row[restAtts.prop], scope);
            }
            return render(scope);
          };
        }
        if (slotName && isFun(slots[slotName])) {
          // 自定义列的内容 作用域参数为 { row, column, $index }
          vSlots.default = scope => (slots[slotName] as any)(scope);
        }
        if (headerSlot && slots[headerSlot]) {
          // 自定义表头的内容， 作用域参数为 { column, $index }
          // console.log("===>",headerSlot);
          vSlots.header = scope => (slots[headerSlot] as any)(scope);
        }
        if (children?.length > 0) {
          vSlots.default = () => children.map(renderColumn);
        }
        return isHidden?null: <ElTableColumn  key={index} align={align||'left'}   minWidth={minWidth} {...restAtts} v-slots={vSlots}  />;
      };
      const columnsSlots = column.map(renderColumn);

      return (
        <div className='table-wrap'>
            <MySkeleton loading={loading}>
            <ElTable
              data={data}
              ref="elTableRef"
              highlightCurrentRow={true}
              stripe
              border={true}
              fit
              {...attrs}
              v-slots={{
                // 插入至表格最后一行之后的内容， 如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。 若表格有合计行，该 slot 会位于合计行之上
                append: () => slots.append && slots.append(),
                // 当数据为空时自定义的内容
                empty: () =>
                  (slots.empty && slots.empty()) ,
              }}
            >
              {columnsSlots}
            </ElTable>
            </MySkeleton>
        </div>
      );
    };
  },
  mounted() {
    this.injectTablePrimaryMethods();
  },
  methods: {
    // 将$refs.Table上的属性映射到this上, 防止父组件访问Table链过长
    // https://element-plus.org/zh-CN/component/table.html#table-方法
    injectTablePrimaryMethods() {
      const _self = this as any;
      const { elTableRef } = _self.$refs;
      // Table 方法
      const tableMethodNameList = [
        'clearSelection',
        'toggleRowSelection',
        'toggleAllSelection',
        'toggleRowExpansion',
        'setCurrentRow',
        'clearSort',
        'clearFilter',
        'doLayout',
        'sort',
      ];
      tableMethodNameList.map(methodName => {
        if (_self[methodName]) {
          console.warn(`the ${methodName} method is exist!, please rename it `);
        } else {
          _self[methodName] = elTableRef?.[methodName as keyof ElTableType];
        }
        return null;
      });
    },
  },
});

export { MyTable };
export default MyTable;

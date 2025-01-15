// CustomBreadcrumb.types.ts

// パンくずリストの各項目の型
export type CustomBreadcrumbItem = {
  label: string; // パンくずリストに表示するテキスト
  href?: string; // リンク先 (省略可能)
};

// CustomBreadcrumb コンポーネントのプロパティ
export type CustomBreadcrumbProps = {
  items: CustomBreadcrumbItem[]; // パンくずリストのデータ配列
};

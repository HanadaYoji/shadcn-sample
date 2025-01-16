import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomBreadcrumbItem } from "@/types/CustomBreadcrumb.types";
import { CustomBreadcrumb } from "@/components/CustomBreadcrumb/CustomBreadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// `axios` インスタンスの作成（必要に応じて）
const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// データ取得
const getTodos = async () => {
  const response = await apiClient.get("/posts");
  return response.data;
};

// 新規データ登録
const postTodo = async (newTodo: {
  title: string;
  body: string;
  userId: number;
}) => {
  const response = await apiClient.post("/posts", newTodo);
  return response.data;
};

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];
const breadcrumbItems: CustomBreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Breadcrumb" },
];

const StarredPage = () => {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const {
    data: todos,
    status,
    isFetching,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  if (isFetching) return "loading...";
  console.log(todos);

  // // Mutations
  // const mutation = useMutation({
  //   mutationFn: postTodo,
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ["todos"] });
  //   },
  // });
  // const { data, status, error, isFetching } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       "https://jsonplaceholder.typicode.com/posts"
  //     );
  //     return data;
  //   },
  // });

  // console.log(data);

  return (
    <div className="p-4 w-full ">
      {/* パンくずリスト */}
      <div className="mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      {/* テーブル */}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default StarredPage;

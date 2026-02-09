import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.status) queryParams.append("status", params.status);
                if (params?.search) queryParams.append("search", params.search);
                if (params?.page) queryParams.append("page", params.page.toString());
                if (params?.limit) queryParams.append("limit", params.limit.toString());

                return `/api/orders?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.orders
                    ? [
                        ...result.orders.map(({ _id }) => ({ type: "Order", id: _id })),
                        { type: "Order", id: "LIST" },
                    ]
                    : [{ type: "Order", id: "LIST" }],
        }),
        getComboOrders: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.status) queryParams.append("status", params.status);
                if (params?.search) queryParams.append("search", params.search);
                if (params?.page) queryParams.append("page", params.page.toString());
                if (params?.limit) queryParams.append("limit", params.limit.toString());

                return `/api/orders/combo?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result?.orders
                    ? [
                        ...result.orders.map(({ _id }) => ({ type: "Order", id: _id })),
                        { type: "Order", id: "LIST" },
                    ]
                    : [{ type: "Order", id: "LIST" }],
        }),
        getOrder: builder.query({
            query: (id) => `/api/orders/${id}`,
            providesTags: (result, error, id) => [{ type: "Order", id }],
        }),
        updateOrder: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/orders/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Order", id },
                { type: "Order", id: "LIST" },
                "DashboardStats"
            ],
        }),
        checkFraudRisk: builder.query({
            query: (phone) => `/api/orders/fraud-check?phone=${phone}`,
        }),
        sendToCourier: builder.mutation({
            query: (data) => ({
                url: `/api/courier/create-order`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Order", id: "LIST" }],
        }),
        checkCourierStatus: builder.query({
            query: (consignmentId) => `/api/courier/check-status?consignmentId=${consignmentId}`,
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/api/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Order", id },
                { type: "Order", id: "LIST" },
                "DashboardStats"
            ],
        }),
        deleteMultipleOrders: builder.mutation({
            query: (ids) => ({
                url: `/api/orders`,
                method: "DELETE",
                body: { ids },
            }),
            invalidatesTags: [
                { type: "Order", id: "LIST" },
                "DashboardStats"
            ],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetComboOrdersQuery,
    useGetOrderQuery,
    useUpdateOrderMutation,
    useLazyCheckFraudRiskQuery,
    useSendToCourierMutation,
    useLazyCheckCourierStatusQuery,
    useDeleteOrderMutation,
    useDeleteMultipleOrdersMutation,
} = orderApi;

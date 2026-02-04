import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/api/products",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: "Product", id: _id })),
                        { type: "Product", id: "LIST" },
                    ]
                    : [{ type: "Product", id: "LIST" }],
        }),
        getProduct: builder.query({
            query: (id) => `/api/products/${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Product", id },
                { type: "Product", id: "LIST" },
                "DashboardStats",
            ],
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/api/products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }, "DashboardStats"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/api/products/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id },
                { type: "Product", id: "LIST" },
                "DashboardStats",
            ],
        }),
        updateProductStock: builder.mutation({
            query: ({ id, body }) => ({
                url: `/api/products/updatestocks/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id },
                { type: "Product", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useDeleteProductMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUpdateProductStockMutation,
} = productApi;

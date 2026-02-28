import { apiSlice } from "./apiSlice";

export const comboApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCombos: builder.query({
            query: () => "/api/combos",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: "Combo", id: _id })),
                        { type: "Combo", id: "LIST" },
                    ]
                    : [{ type: "Combo", id: "LIST" }],
        }),
        getCombo: builder.query({
            query: (id) => `/api/combos/${id}`,
            providesTags: (result, error, id) => [{ type: "Combo", id }],
        }),
        deleteCombo: builder.mutation({
            query: (id) => ({
                url: `/api/combos/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Combo", id },
                { type: "Combo", id: "LIST" },
                "DashboardStats",
            ],
        }),
        createCombo: builder.mutation({
            query: (data) => ({
                url: "/api/combos",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Combo", id: "LIST" }, "DashboardStats"],
        }),
        updateCombo: builder.mutation({
            query: ({ id, body }) => ({
                url: `/api/combos/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Combo", id },
                { type: "Combo", id: "LIST" },
                "DashboardStats",
            ],
        }),
    }),
});

export const {
    useGetCombosQuery,
    useGetComboQuery,
    useDeleteComboMutation,
    useCreateComboMutation,
    useUpdateComboMutation,
} = comboApi;

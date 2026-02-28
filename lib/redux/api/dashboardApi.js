import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.filter) queryParams.append("filter", params.filter);
                if (params?.month) queryParams.append("month", params.month);
                if (params?.year) queryParams.append("year", params.year);

                return `/api/admin/stats?${queryParams.toString()}`;
            },
            providesTags: ["DashboardStats"],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;

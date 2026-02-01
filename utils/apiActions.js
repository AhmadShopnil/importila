
import { BASE_URL } from '@/utils/baseUrl';

export async function getProducts() {
    try {
        const res = await fetch(`${BASE_URL}/api/products`, {
            next: { revalidate: 60 },
        })

        if (!res.ok) return []

        const data = await res.json()
        return Array.isArray(data) ? data : data?.data || []
    } catch (error) {
        console.error("Failed  fetch products :", error)
        return []
    }
}


export async function getCombos() {
    try {
        const res = await fetch(`${BASE_URL}/api/combos`, {
            next: { revalidate: 60 },
        })

        if (!res.ok) return []

        const data = await res.json()
        return Array.isArray(data) ? data : data?.data || []
    } catch (error) {
        console.error("Failed to fetch combos:", error)
        return []
    }
}




export const getSliders = async (location) => {
    const url = `${BASE_URL}/api/sliders/location/${location}`


    try {
        const res = await fetch(url
            ,
            {
                next: { revalidate: 60 },
            }
        );


        if (!res.ok) {
            throw new Error("Failed  fetch slider");
        }

        const data = await res.json();
        return data?.slides || [];
    } catch (error) {
        console.error("Failed to fetch sliders:", error);
        return [];
    }
};

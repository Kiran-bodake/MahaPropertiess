// lib/fetcher.ts

export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include", // send auth cookie
      cache: "no-store",
    });

    const data = await res.json();

    console.log("=================================");
    console.log("FETCH URL:", url);
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data?.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("FETCHER ERROR:", error);
    throw error;
  }
};
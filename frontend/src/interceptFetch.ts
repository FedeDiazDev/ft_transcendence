const originalFetch = window.fetch;

window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
	let response = await originalFetch(input, addAuth(init)) 
	if (response.status == 401){
		const refreshResponse = await originalFetch("/api/auth/refresh", { 
			method : "POST",
			credentials: "include",
		});
		if (refreshResponse.status == 200){
			const { accessToken } = await refreshResponse.json();
			localStorage.setItem("authToken", accessToken);
			
			response = await originalFetch(input, addAuth(init));
		}
		else
			localStorage.clear();
	}
	return response;
}

function addAuth(init?: RequestInit) : RequestInit
{
	const token = localStorage.getItem("authToken");
    const headers = new Headers(init?.headers || {});
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return {
        ...init,
        headers,
        credentials: "include"
    };
}
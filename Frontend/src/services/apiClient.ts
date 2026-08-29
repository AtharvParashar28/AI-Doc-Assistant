const API_BASE_URL = "http://localhost:8080/api";

const post = async <TResponse>(path: string, payload: unknown): Promise<TResponse> => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response.json() as Promise<TResponse>;
};

export const apiClient = {
	post,
};

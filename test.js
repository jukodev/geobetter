fetch(
	`http://localhost:4000/users/${encodeURIComponent(
		"Andrei Alexandru Parfeni"
	)}`
)
	.then(response => response.json())
	.then(data => {
		console.log("API response:", data);
	});

async function api(url, method = "GET", data) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.log(`Error ${method.toUpperCase()} ${url}`, err);
    throw err;
  }
}

export async function login(data) {
  return api("/api/auth/login", "POST", data);
}

export async function register(data) {
  return api("/api/auth/register", "POST", data);
}

export async function getTrendingMovies() {
  return api("/api/movies/trending");
}

export async function searchMovies(title) {
  return api(`/api/movies/search/${title}`);
}

export async function searchSuggestions(title) {
  return api(`/api/movies/suggestions/${title}`);
}

async function api(url, method, data) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
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
  return api("/api/movies/trending", "GET");
}

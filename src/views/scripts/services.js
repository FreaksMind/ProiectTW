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

export async function checkToken() {
  return api("/api/auth/check-token", "GET");
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

export async function getMovieById(id) {
  return api(`/api/movies/${id}`, "GET");
}

export async function searchActors(name) {
  return api(`/api/actors/search/${name}`);
}

export async function getActorById(id) {
  return api(`/api/actors/${id}`, "GET");
}

export async function getMoviesByActorId(id) {
  return api(`/api/actors/movies/${id}`, "GET");
}

export async function createList(name) {
  return api(`/api/lists/new`, "POST", { name });
}

export async function addMovieToList(listId, movieId) {
  return api(`/api/lists/add-movie`, "POST", { listId, movieId });
}

export async function deleteMovieFromList(listId, movieId) {
  return api(`/api/lists/delete-movie`, "POST", { listId, movieId });
}

export async function deleteList(listId) {
  return api("/api/lists/delete", "POST", { listId });
}

export async function getUserLists() {
  return api("/api/lists/get", "GET");
}

export async function getList(id) {
  return api(`/api/lists/get/${id}`, "GET");
}

export async function getListPosterPreview(id) {
  return api(`/api/lists/poster-preview/${id}`, "GET");
}

export async function getUsers() {
  return api("/api/admin/users", "GET");
}

export async function deleteUser(userId) {
  return api("/api/admin/delete-user", "POST", { userId });
}

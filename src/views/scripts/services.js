export async function login(data) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.log("error logging in", err);
    throw err;
  }
}

export async function register(data) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.log("error registering", err);
    throw err;
  }
}

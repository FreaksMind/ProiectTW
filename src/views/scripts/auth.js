import jwt_decode from "../lib/jwt.js";
import { checkToken } from "./services.js";

// TODO: maybe there's a way to fix the page redirect delay

function isTokenExpired(token) {
  const currentTime = Math.floor(Date.now() / 1000);
  return token.exp < currentTime;
}

export default async function checkAuth() {
  const localToken = localStorage.getItem("token");

  if (!localToken) {
    return false;
  }

  const logout = () => {
    window.location.href = "/";
    localStorage.removeItem("token");
  };

  const decoded = jwt_decode(localToken);

  if (isTokenExpired(decoded)) {
    return false;
  }

  try {
    await checkToken();
  } catch (err) {
    return false;
  }

  return { user: decoded, logout };
}

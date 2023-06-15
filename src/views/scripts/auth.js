import jwt_decode from "../lib/jwt.js";

// TODO: maybe there's a way to fix the page redirect delay

function isTokenExpired(token) {
  const currentTime = Math.floor(Date.now() / 1000);
  return token.exp < currentTime;
}

export default function checkAuth() {
  const localToken = localStorage.getItem("token");

  if (!localToken) {
    return false;
  }

  // TODO: validate token

  const logout = () => {
    window.location.href = "/";
    localStorage.removeItem("token");
  };

  const decoded = jwt_decode(localToken);

  if (isTokenExpired(decoded)) {
    return false;
  }

  return { user: decoded, logout };
}

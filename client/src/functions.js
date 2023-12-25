export const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  const slicedToken = token.slice(1, -1);

  return slicedToken;
};

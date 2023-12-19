export const getToken = () => {
  const token = localStorage.getItem("token");

  const slicedToken = token.slice(1, -1);

  return slicedToken;
};

export const isAuthenticated = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return !!userInfo; // Returns true if userInfo exists
  };
  
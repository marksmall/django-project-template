import { useState } from 'react';

const useAuthorization = (user, roles) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  setIsAuthorized(user.roles.some(role => roles.includes(role)));

  return isAuthorized;
};

export default useAuthorization;

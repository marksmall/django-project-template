import { useState, useEffect } from 'react';

const useAuthorization = (user, roles) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthorized(user.roles.some(role => roles.includes(role.name)));
    }
  }, [user, roles]);

  return isAuthorized;
};

export default useAuthorization;

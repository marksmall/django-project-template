const cookiesToArray = () => {
  // Map cookies to an array of object key/value pairs.
  const cookiesArray = document.cookie.split(' ');
  let cookies = cookiesArray.map(cookieString => {
    const cookie = cookieString.split('=');

    return { name: cookie[0], value: cookie[1] };
  });

  return cookies;
};

export const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export const FORM_HEADERS = {
  Accept: 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary2QT6fGjSCgRZuMif'
};

export const sendData = (url, data = '', headers = {}, method = 'POST') => {
  const csrfCookie = cookiesToArray().find(cookie => cookie.name === 'csrftoken');

  if (csrfCookie && csrfCookie.value) {
    // Merge headers, appending commonly needed ones.
    const heads = headers ? { ...headers, 'X-CSRFToken': csrfCookie.value } : { 'X-CSRFToken': csrfCookie.value };

    let submission = { ...data };
    if (Object.prototype.toString.call(data) !== '[object FormData]') {
      submission = JSON.stringify(submission);
    } else {
      submission = data;
    }

    if (method === 'DELETE') {
      return fetch(`${url}${data}/`, {
        credentials: 'include',
        method,
        headers: heads
      })
        .then(response => response)
        .catch(error => error);
    } else if (method === 'PUT') {
      return fetch(url, {
        credentials: 'include',
        method,
        headers: heads,
        body: submission
      })
        .then(response => response)
        .catch(error => error);
    } else {
      return fetch(url, {
        credentials: 'include',
        method,
        headers: heads,
        body: submission
      })
        .then(response => response)
        .catch(error => error);
    }
  } else {
    throw Error('csrfCookie is not set or has no value');
  }
};

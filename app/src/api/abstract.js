const apiUrl = 'http://10.1.1.44/api';

const fetchJson = async (method, endpoint, expectedResponse, body, headers) => {
  const requestHeaders = {
    ...(headers || {}),
  };

  const requestBody = body && (body instanceof FormData ? body : JSON.stringify(body));

  const response = await fetch(`${apiUrl}/${endpoint}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status !== expectedResponse) {
    throw new Error('Unexpected response');
  }

  return response.json();
};


const fetchUploadJson = async (method, endpoint, expectedResponse, body, files, headers) => {
  const requestHeaders = {
    ...(headers || {}),
  };
  const formData = new FormData();
  if (body) {
    Object.keys(body).forEach((key) => formData.append(key, JSON.stringify(body[key])));
  }
  if (files) {
    Object.keys(files).forEach((key) => formData.append(key, files[key]));
  }
  return fetchJson(method, endpoint, expectedResponse, formData, requestHeaders);
};

export {
  fetchJson,
  fetchUploadJson,
};

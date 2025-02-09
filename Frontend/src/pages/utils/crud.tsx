export const fetchData = async (endpoint: any, method = 'GET', body = null, bearerToken: any) => {
    const baseApi = import.meta.env.VITE_BACKEND;
    const headers = {
      'Content-Type': 'application/json',
    };
  
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
  
    try {
      const response = await fetch(`${baseApi}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };
  
  export const dataPost = async (endpoint: any, method = 'POST', body: any, bearerToken: any) => {
    const baseApi = import.meta.env.VITE_BACKEND;
    const headers = {
      'Content-Type': 'application/json',
    };
  
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
  
    try {
      const response = await fetch(`${baseApi}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Capture detailed error response
        console.error('Error details:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  
  export const deleteData = async (endpoint, id, bearerToken) => {
    const baseApi = import.meta.env.VITE_BACKEND;
    const url = `${baseApi}${endpoint}/${id}/`;
  
    const headers = {
      'Content-Type': 'application/json',
    };
  
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response}`);
      }
  
      return 'Data deleted successfully';
    } catch (error) {
      console.error('An error occurred while deleting data:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };
  
  
// Login function
export const loginPostFunction = async (
  cred: any,
  redirect: string,
  navigate: (path: string) => void
) => {
  const baseApi = import.meta.env.VITE_BACKEND;
  try {
    const response = await fetch(`${baseApi}auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cred),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};
    if (result.access) {
      localStorage.setItem('jwt', result.access);
      navigate(redirect);
    } else {
      alert('Enter Correct Credentials');
    }
  } catch (error) {
    console.error(error);
  }
};

export const UserPostFunction = async (
  data: any,
  endpoint: any,
  redirect: string,
  navigate: (path: string) => void
) => {
  const baseApi = import.meta.env.VITE_BACKEND;
  try {
    console.log('Data being sent:', data);
    const response = await fetch(`${baseApi}${endpoint}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      navigate(redirect);
      alert('User added successfully');
    } else {
      console.error('Failed to add batch:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
};
import axios from 'axios';
import authHeader from './auth-header';

class AuthService {
  login(user) {
    return axios
      .post('/api/login', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', JSON.stringify(response.data.token));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('token');
  }

  // USER CRUD
  registerUser(user) {
    return axios.post('/api/register', user, { headers: authHeader() });
  }
  updateUser(user) {
    return axios.patch(`/api/users/${user.userID}`, user, {
      headers: authHeader()
    });
  }
  updatePassword(user) {
    return axios.post(
      `/api/updateUserPassword`,
      {
        userID: user.userID,
        password: user.password
      },
      {
        headers: authHeader()
      }
    );
  }
  getUsers() {
    return axios.get('/api/users', { headers: authHeader() });
  }
  deleteUser(user) {
    console.log(user);
    const userId = user.userID;
    return axios.delete(`api/users/${userId}`, { headers: authHeader() });
  }
}

export default new AuthService();

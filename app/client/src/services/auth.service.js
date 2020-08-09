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

  register(user) {
    return axios.post(
      '/api/register',
      {
        firstName: user.firstname,
        lastName: user.lastName,
        userName: user.username,
        email: user.email,
        password: user.password,
        relatedRoleID: user.relatedRoleID
      },
      { headers: authHeader() }
    );
  }
}

export default new AuthService();

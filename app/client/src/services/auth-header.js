export default function authHeader() {
  let token = JSON.parse(localStorage.getItem('token'));
  if (token) {
    return { Authorization: token };
  } else {
    return {};
  }
}

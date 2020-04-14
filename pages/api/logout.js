import auth0 from '../../lib/auth0'

const logout = async (req, res) => {
  await auth0.handleLogout(req, res)
}
export default logout

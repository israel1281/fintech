export default function ({ $auth, redirect }) {
  if (!$auth.loggedIn) {
    return redirect('/')
  }
  if ($auth.user && $auth.user.email_verified_at) {
    return redirect('/dashboard')
  }
}

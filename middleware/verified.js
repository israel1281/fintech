export default function ({ $auth, redirect }) {
  if ($auth.loggedIn && $auth.user.email_verified_at === null) {
    return redirect('/email/verify')
  }
}

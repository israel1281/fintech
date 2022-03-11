export default function ({ $auth, redirect }) {
  if ($auth.user.is_blocked) {
    return redirect('/')
  }
}

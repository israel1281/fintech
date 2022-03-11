export default function ({ $axios }) {
  $axios.onError(
    (error) => {
      // nuxtError({
      //   statusCode: error.response.status,
      //   message: error.response.data.message
      // })
      //   if (
      //     error.response &&
      //       [401, 419].includes(error.response.status) &&
      //       $store.getters['auth/getAuthUser'] &&
      //       !$store.getters['auth/getGuest']
      //   ) {
      //     $store.dispatch('auth/logoutUser')
      //   }
      return Promise.reject(error)
    }
  )
}

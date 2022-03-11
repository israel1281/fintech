<template>
  <div class="page-content">
    <Title :title="title" />
    <el-dialog title="Block this User?" width="80%" :visible.sync="blockUserDiag">
      <el-form @submit.prevent>
        <el-form-item>
          <el-input v-model="blockUserReason" rows="5" type="textarea" placeholder="Type in reason here.." required />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="loading" @click="processBlockUser()">
          Continue
        </el-button>
      </span>
    </el-dialog>
    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="card-title">
                <el-input v-model="search" placeholder="Type in name of user" @input="searchUsers" />
              </div>
              <el-table v-loading="loading" :data="users" style="width: 100%">
                <el-table-column prop="name" label="Name" width="150" sortable />
                <el-table-column prop="email" label="Email" width="200" />
                <el-table-column prop="phone" label="Phone Number" width="150" />
                <el-table-column prop="bvn.bvn" label="BVN" />
                <el-table-column prop="has_kyc" label="KYC">
                  <template slot-scope="scope">
                    {{ scope.row.has_kyc ? 'Yes' : 'No' }}
                  </template>
                </el-table-column>
                <el-table-column prop="phone_verified_at" label="Phone Verified" sortable :sort-by="sortPhoneVerification">
                  <template slot-scope="scope">
                    {{ scope.row.phone_verified_at ? 'Yes' : 'No' }}
                  </template>
                </el-table-column>
                <el-table-column prop="has_kyc" label="Blacklist">
                  <template slot-scope="scope">
                    {{ scope.row.is_blacklist_ng ? 'Yes' : 'No' }}
                    <el-link :type="scope.row.is_blacklist_ng ? 'info' : 'danger'" style="font-size: 12px; text-decoration: underline;" @click="updateBlacklist(scope.row.id, scope.row.is_blacklist_ng)">
                      <i>{{ scope.row.is_blacklist_ng ? 'Remove From' : 'Add To' }} Blacklist</i>
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="Balance" sortable :sort-by="sortBalance">
                  <template slot-scope="scope">
                    <div>{{ scope.row.wallet ? scope.row.wallet.amount_string : 'N/A' }}</div>
                    <el-link v-if="scope.row.wallet && scope.row.can_update_balance" type="success" style="font-size: 12px; text-decoration: underline;" @click="updateBalance(scope.row.id, scope.row.wallet.amt)">
                      <i>...Update</i>
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="Loan" sortable :sort-by="sortLoanBalance">
                  <template slot-scope="scope">
                    <div>{{ scope.row.wallet ? scope.row.wallet.loan_amount_string : 'N/A' }}</div>
                    <el-link v-if="scope.row.wallet && scope.row.can_update_balance" type="warning" style="font-size: 12px; text-decoration: underline;" @click="updateLoanBalance(scope.row.id, scope.row.wallet.loan_amt)">
                      <i>...Update</i>
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="created_at" label="Date Registered" sortable width="170px">
                  <template slot-scope="scope">
                    {{
                      $dateFns.format(
                        new Date(scope.row.created_at),
                        'dd-MM-yyyy hh:mm a'
                      )
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status.title"
                  label="Status"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <el-tag
                      size="medium"
                      :type="scope.row.status.colour.split(',')[0]"
                    >
                      {{ scope.row.status.title }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="role.title"
                  label="Role"
                  width="100px"
                  sortable
                >
                  <template slot-scope="scope">
                    <el-tag
                      size="medium"
                      :type="scope.row.role.title === 'user' ? 'success' : 'warning'"
                    >
                      {{ scope.row.role.title }}
                    </el-tag>
                    <el-link :type="scope.row.role.title === 'admin' ? 'success' : 'warning'" style="font-size: 12px; text-decoration: underline;" @click="changeRole(scope.row.id)">
                      <i>Make {{ scope.row.role.title === 'admin' ? 'User' : 'Admin' }}</i>
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Action"
                >
                  <template slot-scope="scope">
                    <button
                      v-if="scope.row.wallet && scope.row.wallet.loan_amt"
                      class="btn btn-light btn-sm mb-2"
                      :disabled="loading"
                      @click="clearLoan(scope.row.id)"
                    >
                      Clear Loan
                    </button>
                    <button
                      v-if="scope.row.is_blocked"
                      class="btn btn-success btn-sm mb-2"
                      @click="activateUser(scope.row.id)"
                    >
                      Activate
                    </button>
                    <button
                      v-else
                      class="btn btn-danger btn-sm mb-2"
                      @click="blockUser(scope.row.id)"
                    >
                      Block
                    </button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                class="mt-3 overflow-auto"
                background
                layout="prev, pager, next, jumper, sizes, total"
                :page-size="count"
                :page-sizes="[25, 50, 100, 200, 400]"
                :total="total"
                @current-change="pageChange"
                @size-change="sizeChange"
              />
            </div>
          </div>
          <!-- <div
            v-if="!users.length && !loading"
            class="alert border-0 border-start border-5 border-secondary alert-dismissible fade show py-2"
          >
            <div class="d-flex align-items-center">
              <div class="font-35 text-secondary">
                <i class="bx bx-tag-alt" />
              </div>
              <div class="ms-3">
                <h6 class="mb-0">
                  No Users
                </h6>
                <div>
                  There are no registered users!
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore, useContext, computed, ref, onMounted } from '@nuxtjs/composition-api'
import { Notification, MessageBox } from 'element-ui'

export default {
  layout: 'dashboard',
  setup () {
    const title = 'Users'
    const store = useStore()
    const users = computed(() => store.state.users.data)
    const errors = computed(() => store.state.users.errors)
    const message = computed(() => store.state.users.message)
    const loading = computed(() => store.state.users.loading)
    const total = computed(() => store.state.users.total)
    const context = useContext()
    const search = ref('')
    const blockUserDiag = ref(false)
    const selectedUserId = ref(null)
    const blockUserReason = ref('')
    const count = ref(25)
    const searchUsers = context.$lodash.debounce(function () {
      loadUsers(count.value, null, search.value)
    }, 500)

    function clearLoan (id) {
      MessageBox.confirm("This user's loan balance will be cleared. Confirm?", 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await processLoanClear(id)
      })
    }

    function blockUser (id) {
      blockUserDiag.value = true
      selectedUserId.value = id
    }

    function activateUser (id) {
      MessageBox.confirm('Activate this user?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await processActivateUser(id)
      })
    }

    function updateBlacklist (id, isBlacklist) {
      MessageBox.confirm(!isBlacklist ? 'Add this user to blacklist?' : 'Remove this user from blacklist?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await processBlacklist(id, isBlacklist)
      })
    }

    function updateBalance (id, amount) {
      MessageBox.prompt('Amount', 'Update Balance', {
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: 'Invalid Amount',
        inputValue: amount
      }
      ).then(async ({ value }) => {
        await processUpdateBalance(id, value)
      })
    }

    function updateLoanBalance (id, amount) {
      MessageBox.prompt('Amount', 'Update Loan Balance', {
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: 'Invalid Amount',
        inputValue: amount
      }
      ).then(async ({ value }) => {
        await processUpdateLoanBalance(id, value)
      })
    }

    // Process Actions from API
    async function processUpdateBalance (id, amount) {
      try {
        await store.dispatch('users/updateBalance', { id, count: count.value, amount })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
          })
          .catch(() => {
            if (errors.value.length !== 0) {
              Notification.error({
                title: 'Error',
                message: errors.value.amount,
                position: 'bottom-right'
              })
            } else {
              Notification.error({
                title: 'Error',
                message: message.value,
                position: 'bottom-right'
              })
            }
          })
      } catch (_) {}
    }

    async function processUpdateLoanBalance (id, amount) {
      try {
        await store.dispatch('users/updateLoanBalance', { id, count: count.value, amount })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
          })
          .catch(() => {
            if (errors.value.length !== 0) {
              Notification.error({
                title: 'Error',
                message: errors.value.amount,
                position: 'bottom-right'
              })
            } else {
              Notification.error({
                title: 'Error',
                message: message.value,
                position: 'bottom-right'
              })
            }
          })
      } catch (_) {}
    }

    async function processLoanClear (id) {
      try {
        await store.dispatch('users/clearLoan', { id, count: count.value })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
          })
          .catch(() => {
            Notification.error({
              title: 'Error',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    async function processActivateUser (id) {
      try {
        await store.dispatch('users/activateUser', { id, count: count.value })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
          })
          .catch(() => {
            Notification.error({
              title: 'Error',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    async function processBlacklist (id, isBlacklist) {
      try {
        if (isBlacklist) {
          await store.dispatch('users/removeFromBlacklist', { id, count: count.value })
            .then(() => {
              Notification.success({
                title: 'Success',
                message: message.value,
                position: 'bottom-right'
              })
            })
            .catch(() => {
              Notification.error({
                title: 'Error',
                message: message.value,
                position: 'bottom-right'
              })
            })
        } else {
          await store.dispatch('users/addToBlacklist', { id, count: count.value })
            .then(() => {
              Notification.success({
                title: 'Success',
                message: message.value,
                position: 'bottom-right'
              })
            })
            .catch(() => {
              Notification.error({
                title: 'Error',
                message: message.value,
                position: 'bottom-right'
              })
            })
        }
      } catch (_) {}
    }

    async function processBlockUser () {
      try {
        await store.dispatch('users/blockUser', { id: selectedUserId.value, reason: blockUserReason, count: count.value })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
            blockUserDiag.value = false
          })
          .catch(() => {
            Notification.error({
              title: 'Error',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    async function changeRole (id) {
      try {
        await store.dispatch('users/changeRole', { id, count: count.value })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
          })
          .catch(() => {
            Notification.error({
              title: 'Error',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    // Table functions
    function sortBalance (row, index) {
      return row.wallet?.amt ?? 0
    }

    function sortLoanBalance (row, index) {
      return row.wallet?.phone_verified_at ? 'Yes' : 'No'
    }

    function sortPhoneVerification (row, index) {
      return row.wallet?.loan_amt ?? 0
    }

    async function pageChange (page) {
      await loadUsers(count.value, page)
    }

    async function sizeChange (size) {
      count.value = size
      await loadUsers(count.value)
    }

    // async function searchUsers (e) {
    //   await context.$lodash.debounce(function () {
    //     console.log(e)
    //   }, 2000, {
    //     leading: false,
    //     trailing: true
    //   })()
    // }

    async function loadUsers (count, page = null, search = null, status = null) {
      try {
        await store.dispatch('users/get', { count, page, search, status })
          .catch(() => {
            Notification.error({
              title: 'Error',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }
    onMounted(async () => {
      await loadUsers(count.value)
    })

    return {
      title,
      errors,
      loading,
      users,
      message,
      search,
      count,
      total,
      blockUserDiag,
      selectedUserId,
      blockUserReason,
      clearLoan,
      activateUser,
      updateBalance,
      updateLoanBalance,
      changeRole,
      pageChange,
      updateBlacklist,
      sizeChange,
      searchUsers,
      sortBalance,
      processBlockUser,
      blockUser,
      sortLoanBalance,
      sortPhoneVerification
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

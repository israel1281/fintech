<template>
  <div class="page-content">
    <el-dialog title="Give reason for rejecting withdrawal" width="80%" :visible.sync="rejectDialog">
      <el-form @submit.prevent>
        <el-form-item>
          <el-input v-model="reason" rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" :disabled="loading" @click="reject">
          Reject <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        </el-button>
      </span>
    </el-dialog>
    <Title :title="title" />
    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <el-table v-loading="loading" :data="pendingWithdraws" style="width: 100%">
                <el-table-column prop="bank_name" label="Bank Name" />
                <el-table-column prop="account_name" label="Account Name" />
                <el-table-column prop="account_number" label="Account Number" />
                <el-table-column prop="amount_string" label="Amount" />
                <el-table-column
                  prop="created_at"
                  label="Date"
                  width="135px"
                >
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
                    <el-tag size="medium" :type="scope.row.status.colour.split(',')[0]">
                      {{ scope.row.status.title }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Action" width="200px">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.status.title == 'processing'"
                      size="mini"
                      type="success"
                      @click="accept(scope.row.id)"
                    >
                      Complete
                    </el-button>
                    <el-button
                      v-if="scope.row.status.title == 'pending'"
                      size="mini"
                      type="primary"
                      @click="process(scope.row.id)"
                    >
                      Process
                    </el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="rejectModal(scope.row.id)"
                    >
                      Reject
                    </el-button>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore, ref, computed, onMounted } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Pending Withdrawals'
    const store = useStore()
    const reason = ref('Sorry, but we cannot process your withdrawal at the moment. Please try again later!')
    const selectedRow = ref('')
    const rejectDialog = ref(false)
    const pendingWithdraws = computed(() => store.state.withdraw.pendingWithdraws)
    const errors = computed(() => store.state.withdraw.errors)
    const loading = computed(() => store.state.withdraw.loading)
    const message = computed(() => store.state.withdraw.message)
    const total = computed(() => store.state.withdraw.total)
    const count = ref(25)

    async function accept (id) {
      try {
        await store.dispatch('withdraw/accept', { count: count.value, id })
      } catch (_) {}
    }

    async function process (id) {
      try {
        await store.dispatch('withdraw/process', { count: count.value, id })
      } catch (_) {}
    }

    function rejectModal (id) {
      rejectDialog.value = true
      selectedRow.value = id
    }

    async function reject () {
      try {
        await store.dispatch('withdraw/reject', { count: count.value, id: selectedRow.value, reason: reason.value })
          .then(() => {
            rejectDialog.value = false
          })
      } catch (_) {}
    }

    async function cancel (id) {
      try {
        await store.dispatch('withdraw/cancel', { count: count.value, id })
      } catch (_) {}
    }

    async function loadWithdrawals (count, page = null) {
      try {
        await store.dispatch('withdraw/getAdminPending', { count, page })
          .catch(() => {
            Notification.error({
              title: 'Error',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    async function pageChange (page) {
      await loadWithdrawals(count.value, page)
    }

    async function sizeChange (size) {
      count.value = size
      await loadWithdrawals(count.value)
    }

    onMounted(async () => {
      await loadWithdrawals(count.value)
    })

    return {
      title,
      errors,
      loading,
      pendingWithdraws,
      reason,
      rejectDialog,
      total,
      count,
      pageChange,
      sizeChange,
      accept,
      reject,
      rejectModal,
      process,
      cancel
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

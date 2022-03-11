<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <el-table v-loading="loading" :data="pendingLoans" style="width: 100%">
                <el-table-column prop="user.name" label="User" />
                <el-table-column prop="amount_string" label="Amount" />
                <el-table-column
                  prop="interest_string"
                  label="Interest (14 days)"
                />
                <el-table-column
                  prop="created_at"
                  label="Date"
                  width="250px"
                >
                  <template slot-scope="scope">
                    {{ $dateFns.format(new Date(scope.row.created_at), 'dd-MM-yyyy hh:mm a') }}
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
                      size="mini"
                      type="success"
                      @click="accept(scope.row.id)"
                    >
                      Accept
                    </el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="reject(scope.row.id)"
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
import { useStore, computed, onMounted, ref } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Pending Loan Requests'
    const store = useStore()
    const pendingLoans = computed(() => store.state.loan.pendingLoans)
    const errors = computed(() => store.state.loan.errors)
    const loading = computed(() => store.state.loan.loading)
    const total = computed(() => store.state.loan.total)
    const count = ref(25)
    const message = computed(() => store.state.loan.message)

    async function accept (id) {
      try {
        await store.dispatch('loan/accept', { id, count: count.value })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    async function reject (id) {
      try {
        await store.dispatch('loan/reject', { id, count: count.value })
          .then(() => {
            Notification.success({
              title: 'Success',
              message: message.value,
              position: 'bottom-right'
            })
          })
      } catch (_) {}
    }

    async function loadLoans (count, page = null) {
      try {
        await store.dispatch('loan/getPending', { count, page })
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
      await loadLoans(count.value, page)
    }

    async function sizeChange (size) {
      count.value = size
      await loadLoans(count.value)
    }

    onMounted(async () => {
      await loadLoans(count.value)
    })

    return { title, errors, loading, pendingLoans, total, count, accept, reject, pageChange, sizeChange }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <el-table v-loading="loading" :data="withdraws" style="width: 100%">
                <el-table-column prop="bank_name" label="Bank Name" />
                <el-table-column prop="account_name" label="Account Name" />
                <el-table-column prop="account_number" label="Account Number" />
                <el-table-column prop="amount_string" label="Amount" />
                <el-table-column
                  prop="created_at"
                  label="Date"
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
                >
                  <template slot-scope="scope">
                    <el-tag size="medium" :type="scope.row.status.colour.split(',')[0]">
                      {{ scope.row.status.title }}
                    </el-tag>
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
    const title = 'All Withdrawals'
    const store = useStore()
    const withdraws = computed(() => store.state.withdraw.withdraws)
    const loading = computed(() => store.state.withdraw.loading)
    const message = computed(() => store.state.withdraw.message)
    const total = computed(() => store.state.withdraw.total)
    const count = ref(25)

    async function loadWithdrawals (count, page = null, status = null) {
      try {
        await store.dispatch('withdraw/get', { count, page, status })
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
      loading,
      withdraws,
      total,
      count,
      pageChange,
      sizeChange
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

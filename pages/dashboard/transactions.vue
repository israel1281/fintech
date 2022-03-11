<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div v-loading="loading" class="col-md-12 p-3">
                  <el-table :data="transactions" style="width: 100%">
                    <el-table-column prop="txn_no" width="250px" label="Transaction no." />
                    <el-table-column prop="amount_string" label="Amount" />
                    <el-table-column prop="model_type" label="Type" />
                    <el-table-column
                      prop="status.title"
                      label="Status"
                      width="120px"
                    >
                      <template slot-scope="scope">
                        <el-tag size="medium" :type="scope.row.status.colour.split(',')[0]">
                          {{ scope.row.status.title }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="created_at"
                      label="Date"
                      width="250px"
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
                  </el-table>
                  <el-pagination
                    background
                    :hide-on-single-page="true"
                    layout="prev, pager, next"
                    :page-size="count"
                    :total="transactions.length"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, useStore, computed, ref } from '@nuxtjs/composition-api'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Transactions'
    const store = useStore()
    const loading = computed(() => store.state.transactions.loading)
    const transactions = computed(() => store.state.transactions.data)
    const count = ref(20)

    async function loadTransactions () {
      try {
        await store.dispatch('transactions/get', { count: count.value })
      } catch (_) { }
    }
    onMounted(async () => {
      await loadTransactions()
    })

    return {
      title,
      transactions,
      loading,
      count
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

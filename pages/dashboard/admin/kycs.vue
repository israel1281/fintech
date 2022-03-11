<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <el-table v-loading="loading" :data="kycs" style="width: 100%">
                <el-table-column prop="user.name" width="150px" label="User" />
                <el-table-column prop="name" width="200px" label="Full Name" />
                <el-table-column prop="dob" label="Date of Birth" width="120px">
                  <template slot-scope="scope">
                    {{ $dateFns.format(new Date(scope.row.dob), 'dd-MM-yyyy') }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="Phone Number"
                  width="140px"
                />
                <el-table-column prop="address" width="200px" label="Address" />
                <el-table-column
                  prop="kin_name"
                  width="170px"
                  label="Next of Kin (Name)"
                />
                <el-table-column
                  prop="kin_phone"
                  width="170px"
                  label="Next of Kin (Phone)"
                />
                <el-table-column
                  prop="relationship_status"
                  width="100px"
                  label="Relationship Status"
                />
                <el-table-column prop="city" label="City" />
                <el-table-column prop="state" label="State" />
                <el-table-column prop="created_at" label="Date" width="170px">
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
                  width="120px"
                  sortable
                  :filters="[{text: 'Pending', value: 'pending'}, {text: 'Rejected', value: 'rejected'}, {text: 'Accepted', value: 'accepted'}]"
                  :filter-method="filterStatus"
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
                  v-if="hasPendingKycs.length"
                  label="Action"
                  width="130px"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.user.has_kyc_pending"
                      type="success"
                      icon="el-icon-check"
                      circle
                      @click="accept(scope.row.id)"
                    />
                    <el-button
                      v-if="scope.row.user.has_kyc_pending"
                      type="danger"
                      icon="el-icon-close"
                      circle
                      @click="reject(scope.row.id)"
                    />
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
import { useStore, computed, ref, onMounted } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'KYCS'
    const store = useStore()
    const kycs = computed(() => store.state.loan.kycs)
    const errors = computed(() => store.state.loan.errors)
    const message = computed(() => store.state.loan.message)
    const loading = computed(() => store.state.loan.loading)
    const total = computed(() => store.state.loan.total)
    const count = ref(25)
    const hasPendingKycs = computed(() => {
      return kycs.value.filter(kyc => kyc.status.title === 'pending')
    })

    async function accept (id) {
      try {
        await store
          .dispatch('loan/kycAccept', { id, count: count.value })
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

    async function reject (id) {
      try {
        await store
          .dispatch('loan/kycReject', { id, count: count.value })
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

    function filterStatus (value, row) {
      return row.status.title === value
    }

    async function loadKycs (count, page = null) {
      try {
        await store.dispatch('loan/getKycs', { count, page })
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
      await loadKycs(count.value, page)
    }

    async function sizeChange (size) {
      count.value = size
      await loadKycs(count.value)
    }

    onMounted(async () => {
      await loadKycs(count.value)
    })

    return { title, errors, loading, total, count, kycs, message, hasPendingKycs, pageChange, sizeChange, accept, reject, filterStatus }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

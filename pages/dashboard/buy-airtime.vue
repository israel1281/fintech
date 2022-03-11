<template>
  <div class="page-content">
    <Title :title="title" />
    <div class="container">
      <div class="row">
        <div class="col-md-12 d-flex align-items-stretch">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div v-loading="isLoading" class="col-md-6 mb-3">
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <h5>Select Network Provider</h5>
                    </div>
                  </div>
                  <div class="row gx-3 mb-5">
                    <div v-for="networkProvider in networkProviders" :key="networkProvider.id" class="col-3 airtime-select">
                      <img
                        :src="networkProvider.image_url"
                        class="img-fluid"
                        :class="{ selected: networkProvider.id === selectedNetworkId }"
                        @click="selectedNetworkId = networkProvider.id"
                      >
                    </div>
                  </div>
                  <form class="row gy-3 mb-3" @submit.prevent="buyAirtime">
                    <div class="col-12">
                      <div class="form-group">
                        <label>Phone Number</label>
                        <input
                          v-model="phone"
                          type="text"
                          class="form-control"
                          placeholder="Phone Number"
                          @input="checkPhoneForNonNumbers"
                        >
                        <div v-if="formErrors.phone" class="text-danger">
                          {{ formErrors.phone }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label>Amount</label>
                        <input v-model="amount" type="text" class="form-control" placeholder="Amount" @input="checkAmountForNonNumbers">
                        <div v-if="formErrors.amount" class="text-danger">
                          {{ formErrors.amount }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary" :disabled="!selectedNetworkId">
                        Buy Airtime
                      </button>
                    </div>
                  </form>
                </div>
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-md-12">
                      <h5>Transactions</h5>
                    </div>
                    <div class="col-md-12">
                      <div v-loading="isTransactionsLoading" class="col-md-12">
                        <el-table :data="airtimeTransactions" style="width: 100%">
                          <el-table-column prop="reference_no" width="120px" label="Reference" />
                          <el-table-column prop="service" label="Network" />
                          <el-table-column prop="amount_string" label="Amount" />
                          <el-table-column prop="customer_no" width="120px" label="Phone Number" />
                          <el-table-column
                            prop="status"
                            label="Status"
                            width="100px"
                          >
                            <template slot-scope="scope">
                              <el-tag size="medium" :type="scope.row.status_colour">
                                {{ scope.row.status }}
                              </el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="created_at"
                            label="Date"
                            width="200px"
                          >
                            <template slot-scope="scope">
                              {{
                                $dateFns.format(
                                  new Date(scope.row.date),
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
                          :total="total"
                          @current-change="pageChange"
                        />
                      </div>
                    </div>
                  </div>
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
import { onMounted, ref, useContext, reactive } from '@nuxtjs/composition-api'
import { Notification } from 'element-ui'
export default {
  layout: 'dashboard',
  setup () {
    const title = 'Buy Airtime'
    const isLoading = ref(true)
    const isTransactionsLoading = ref(false)
    const networkProviders = ref([])
    const selectedNetworkId = ref(0)
    const airtimeTransactions = ref([])
    const errors = ref([])
    const context = useContext()
    const phone = ref('')
    const amount = ref('')
    const count = ref(15)
    const total = ref(0)
    const formErrors = reactive({
      phone: '',
      amount: ''
    })

    function pageChange (page) {
      getAirtimeTransactions(count.value, page)
    }

    async function getNetworkProviders () {
      isLoading.value = true
      try {
        await context.$api.bp.vtuAirtimeAll()
          .then((response) => {
            isLoading.value = false
            networkProviders.value = response.data.data
            selectedNetworkId.value = networkProviders.value[0].id
          })
          .catch((error) => {
            isLoading.value = false
            if (error.response && (error.response.status === 422)) {
              errors.value = error.response.data.errors
            }
          })
      } catch (_) {
      }
    }

    async function getAirtimeTransactions (count, page = null) {
      isTransactionsLoading.value = true
      try {
        await context.$api.bp.vtuTransactions('airtime', count, page)
          .then((response) => {
            isTransactionsLoading.value = false
            airtimeTransactions.value = response.data.data.data
            total.value = response.data.data.links.total
          })
          .catch((error) => {
            isTransactionsLoading.value = false
            if (error.response && (error.response.status === 422)) {
              errors.value = error.response.data.errors
            }
          })
      } catch (_) {
      }
    }

    async function buyAirtime () {
      if (validatePhone() && validateAmount()) {
        isLoading.value = true
        try {
          await context.$api.bp.vtuAirtimeBuy(selectedNetworkId.value, {
            phone: phone.value,
            amount: Number(amount.value)
          })
            .then((response) => {
              isLoading.value = false
              phone.value = ''
              amount.value = ''
              Notification.success({
                title: 'Success',
                message: response.data.message,
                position: 'bottom-right'
              })
            })
            .catch((error) => {
              isLoading.value = false
              if (error.response && (error.response.status === 422)) {
                errors.value = error.response.data.errors
              } else {
                Notification.error({
                  title: 'Error',
                  message: error.response.data.message,
                  position: 'bottom-right'
                })
              }
            })
        } catch (_) {
        }
      }
    }

    // function allowOnlyNumberKey (evt) {
    //   // Only ASCII character in that range allowed
    //   const ASCIICode = (evt.which) ? evt.which : evt.keyCode
    //   if ((ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) || phone.value.length > 11) {
    //     evt.preventDefault()
    //     return false
    //   }
    //   return true
    // }

    function checkPhoneForNonNumbers () {
      if (phone.value.length > 11) {
        phone.value = phone.value.substring(0, 11)
      }
      if (phone.value.match(/[^0-9]/gm)) {
        phone.value = phone.value.replace(/[^0-9]/gm, '')
      }
    }

    function checkAmountForNonNumbers () {
      if (amount.value.length > 5) {
        amount.value = amount.value.substring(0, 5)
      }
      if (amount.value.match(/[^0-9]/gm)) {
        amount.value = amount.value.replace(/[^0-9]/gm, '')
      }
    }

    function validatePhone () {
      if (phone.value.match(/0[7-9][01]\d{8}$/gm)) {
        formErrors.phone = ''
        return true
      } else {
        formErrors.phone = 'Please input a valid phone number'
        return false
      }
    }

    function validateAmount () {
      if (amount.value < 50) {
        formErrors.amount = 'Amount must be at least 50'
        return false
      } else {
        formErrors.amount = ''
        return true
      }
    }

    onMounted(() => {
      getNetworkProviders()
      getAirtimeTransactions(count.value)
    })

    return {
      title,
      isLoading,
      isTransactionsLoading,
      networkProviders,
      selectedNetworkId,
      formErrors,
      phone,
      count,
      amount,
      total,
      airtimeTransactions,
      buyAirtime,
      checkPhoneForNonNumbers,
      checkAmountForNonNumbers,
      validatePhone,
      getAirtimeTransactions,
      pageChange
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

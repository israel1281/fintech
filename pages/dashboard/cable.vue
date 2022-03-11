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
                      <h5>Select Service Provider</h5>
                    </div>
                  </div>
                  <div class="row gx-3 mb-5">
                    <div v-for="serviceProvider in serviceProviders" :key="serviceProvider.id" class="col-3 airtime-select">
                      <img
                        :src="serviceProvider.image_url"
                        class="img-fluid"
                        :class="{ selected: serviceProvider.service_provider === selectedServiceProvider }"
                        @click="selectServiceProvider(serviceProvider)"
                      >
                    </div>
                  </div>
                  <!-- Input smart card -->
                  <form v-if="steps === 1" class="row gy-3 mb-3" @submit.prevent="verifyCustomer">
                    <div class="col-12">
                      <div class="form-group">
                        <label>{{ selectedSPLabel }}</label>
                        <input
                          v-model="smartCardNumber"
                          type="text"
                          class="form-control"
                          :placeholder="selectedSPLabel"
                          @input="checkSmartCardForNonNumbers"
                        >
                        <div v-if="formErrors.smartCardNumber" class="text-danger">
                          {{ formErrors.smartCardNumber }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary" :disabled="!selectedServiceProvider">
                        Next
                      </button>
                    </div>
                  </form>
                  <!-- Verify customer name -->
                  <form v-if="steps === 2" class="row" @submit.prevent="getCablePackages">
                    <div class="col-12 d-flex flex-column p-2">
                      <div class="d-flex justify-content-between py-3 border-bottom">
                        <div>Name</div>
                        <div>{{ customerName }}</div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-between py-3 border-bottom">
                      <div>{{ selectedSPLabel }}</div>
                      <div>{{ smartCardNumber }}</div>
                    </div>
                    <div class="col-12 py-3">
                      <button class="btn btn-danger" :disabled="!selectedServiceProvider" type="button" @click="steps = 1">
                        Back
                      </button>
                      <button class="btn btn-primary" :disabled="!selectedServiceProvider">
                        Continue
                      </button>
                    </div>
                  </form>
                  <!-- Select bouquet -->
                  <form v-if="steps === 3" class="row gy-3 mb-3" @submit.prevent="gotoSummaryPage">
                    <div class="col-12">
                      <div class="form-group">
                        <label>Select Bouquet:</label>
                        <select v-model="selectedPackage" class="form-select">
                          <option v-for="cablePackage in cablePackages" :key="cablePackage.id" :value="cablePackage">
                            {{ cablePackage.name }} - {{ cablePackage.amount_string }}
                          </option>
                        </select>
                      </div>
                    </div>
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
                      <button class="btn btn-primary" :disabled="!selectedServiceProvider">
                        Next
                      </button>
                    </div>
                  </form>
                  <!-- Summary of order -->
                  <form v-if="steps === 4" class="row" @submit.prevent="subscribeCable">
                    <div class="d-flex justify-content-between py-3 border-bottom">
                      <div>Name</div>
                      <div>{{ customerName }}</div>
                    </div>
                    <div class="d-flex justify-content-between py-3 border-bottom">
                      <div>{{ selectedSPLabel }}</div>
                      <div>{{ smartCardNumber }}</div>
                    </div>
                    <div class="d-flex justify-content-between py-3 border-bottom">
                      <div>Bouquet</div>
                      <div>{{ selectedPackage.name }}</div>
                    </div>
                    <div class="d-flex justify-content-between py-3 border-bottom">
                      <div>Amount</div>
                      <div>{{ selectedPackage.amount_string }}</div>
                    </div>
                    <div class="d-flex justify-content-between py-3 border-bottom">
                      <div>Fee</div>
                      <div>{{ selectedPackage.service_charge_string }}</div>
                    </div>
                    <div class="col-12 py-3">
                      <button class="btn btn-danger" :disabled="!selectedServiceProvider" type="button" @click="steps = 3">
                        Back
                      </button>
                      <button class="btn btn-primary" :disabled="!selectedServiceProvider">
                        Make Payment
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
                          <el-table-column prop="service" width="120px" label="Bouquet" />
                          <el-table-column prop="amount_string" label="Amount" />
                          <el-table-column prop="customer_no" width="150px" label="Smart Card/IUC Number" />
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
    const title = 'Cable / TV Bills'
    const isLoading = ref(true)
    const isTransactionsLoading = ref(false)
    const serviceProviders = ref([])
    const cablePackages = ref([])
    const selectedServiceProvider = ref('')
    const selectedSPLabel = ref('')
    const airtimeTransactions = ref([])
    const isCustomerVerified = ref(false)
    const errors = ref([])
    const context = useContext()
    const smartCardNumber = ref('')
    const customerName = ref('')
    const phone = ref('')
    const selectedPackage = ref('')
    const amount = ref('')
    const count = ref(15)
    const total = ref(0)
    const steps = ref(1)
    const formErrors = reactive({
      phone: '',
      smartCardNumber: ''
    })

    function pageChange (page) {
      getCableTransactions(count.value, page)
    }

    // Select Service Providers
    function selectServiceProvider (sp) {
      selectedServiceProvider.value = sp.service_provider
      selectedSPLabel.value = sp.label
      smartCardNumber.value = ''
      steps.value = 1
    }

    // Go to Summary Page
    function gotoSummaryPage () {
      if (validatePhone()) {
        steps.value = 4
      }
    }

    // Fetch Service Providers list
    async function getServiceProviders () {
      isLoading.value = true
      try {
        await context.$api.bp.vtuCableAll()
          .then((response) => {
            isLoading.value = false
            serviceProviders.value = response.data.data
            selectedServiceProvider.value = serviceProviders.value[0].service_provider
            selectedSPLabel.value = serviceProviders.value[0].label
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

    // Fetch Packages list
    async function getCablePackages () {
      isLoading.value = true
      try {
        await context.$api.bp.vtuCablePackages(selectedServiceProvider.value)
          .then((response) => {
            isLoading.value = false
            cablePackages.value = response.data.data
            selectedPackage.value = response.data.data[0]
            steps.value = 3
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

    // Fetch Service Providers Packages
    async function subscribeCable () {
      if (validatePhone() && validateSmartCard()) {
        isLoading.value = true
        try {
          await context.$api.bp.vtuCableSubscribe(selectedPackage.value.id, {
            phone: phone.value,
            smartcard_number: smartCardNumber.value
          })
            .then((response) => {
              isLoading.value = false
              smartCardNumber.value = ''
              phone.value = ''
              selectedPackage.value = ''
              Notification.success({
                title: 'Success',
                message: response.data.message,
                position: 'bottom-right'
              })
              getCableTransactions(count.value)
              steps.value = 1
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

    async function getCableTransactions (count, page = null) {
      isTransactionsLoading.value = true
      try {
        await context.$api.bp.vtuTransactions('cable', count, page)
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

    async function verifyCustomer () {
      if (validateSmartCard()) {
        isLoading.value = true
        try {
          await context.$api.bp.vtuVerifyCustomer({
            customer_id: smartCardNumber.value,
            service_id: selectedServiceProvider.value
          })
            .then((response) => {
              isLoading.value = false
              customerName.value = response.data.data.customer_name
              steps.value = 2
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

    function checkSmartCardForNonNumbers () {
      // if (smartCardNumber.value.length > 11) {
      //   smartCardNumber.value = smartCardNumber.value.substring(0, 11)
      // }
      if (smartCardNumber.value.match(/[^0-9]/gm)) {
        smartCardNumber.value = smartCardNumber.value.replace(/[^0-9]/gm, '')
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

    function validateSmartCard () {
      if (smartCardNumber.value.length < 10) {
        formErrors.smartCardNumber = 'Invalid smart card number'
        return false
      } else {
        formErrors.smartCardNumber = ''
        return true
      }
    }

    onMounted(() => {
      getServiceProviders()
      getCableTransactions(count.value)
    })

    return {
      title,
      isLoading,
      isTransactionsLoading,
      serviceProviders,
      selectedServiceProvider,
      formErrors,
      phone,
      count,
      amount,
      total,
      airtimeTransactions,
      isCustomerVerified,
      selectedSPLabel,
      steps,
      cablePackages,
      selectedPackage,
      customerName,
      smartCardNumber,
      getCablePackages,
      verifyCustomer,
      checkSmartCardForNonNumbers,
      checkPhoneForNonNumbers,
      validatePhone,
      validateSmartCard,
      selectServiceProvider,
      getCableTransactions,
      pageChange,
      subscribeCable,
      gotoSummaryPage
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

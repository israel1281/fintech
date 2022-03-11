<template>
  <div class="sidebar-wrapper" data-simplebar="true">
    <div class="sidebar-header">
      <div>
        <img src="/favicon.png" class="logo-icon" alt="logo icon">
      </div>
      <div>
        <h4 class="logo-text">
          {{ $config.appName }}
        </h4>
      </div>
      <div class="toggle-icon ms-auto">
        <i class="bx bx-arrow-to-left" />
      </div>
    </div>
    <!--navigation-->
    <ul id="menu" class="metismenu">
      <li>
        <NuxtLink :to="{ name: 'dashboard'}">
          <div class="parent-icon">
            <i class="bx bx-home-circle" />
          </div>
          <div class="menu-title">
            Dashboard
          </div>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'dashboard-admin'}">
          <div class="parent-icon">
            <i class="bx bx-home-circle" />
          </div>
          <div class="menu-title">
            Dashboard
          </div>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'dashboard-transfer'}">
          <div class="parent-icon">
            <i class="bx bx-money" />
          </div>
          <div class="menu-title">
            Transfer
          </div>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'dashboard-withdraw'}">
          <div class="parent-icon">
            <i class="bx bx-receipt" />
          </div>
          <div class="menu-title">
            Withdraw
          </div>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'dashboard-admin-kycs' }">
          <div class="parent-icon">
            <i class="bx bx-user-check" />
          </div>
          <div class="menu-title">
            KYCs
          </div>
        </NuxtLink>
      </li>
      <li>
        <a href="javascript:;" class="has-arrow" aria-expanded="true">
          <div class="parent-icon"><i class="bx bx-diamond" />
          </div>
          <div class="menu-title">Loan</div>
        </a>
        <ul class="mm-collapse" style="">
          <li>
            <NuxtLink :to="{ name: 'dashboard-loan-apply' }" aria-expanded="true">
              <i class="bx bx-right-arrow-alt" />Apply for a Loan
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'dashboard-admin-loan-pending' }" aria-expanded="true">
              <i class="bx bx-right-arrow-alt" />Pending Loan Requests
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'dashboard-admin-loan-all' }" aria-expanded="true">
              <i class="bx bx-right-arrow-alt" />All Loan Requests
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <a href="javascript:;" class="has-arrow" aria-expanded="true">
          <div class="parent-icon"><i class="bx bx-receipt" />
          </div>
          <div class="menu-title">Withdrawals</div>
        </a>
        <ul class="mm-collapse" style="">
          <li>
            <NuxtLink :to="{ name: 'dashboard-admin-withdraw-pending' }" aria-expanded="true">
              <i class="bx bx-right-arrow-alt" />Pending Withdrawals
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'dashboard-admin-withdraw-all' }" aria-expanded="true">
              <i class="bx bx-right-arrow-alt" />All Withdrawals
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <NuxtLink :to="{ name: 'dashboard-transactions' }">
          <div class="parent-icon">
            <i class="bx bx-stats" />
          </div>
          <div class="menu-title">
            Transactions
          </div>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'dashboard-buy-airtime' }">
          <div class="parent-icon">
            <i class="bx bx-collection" />
          </div>
          <div class="menu-title">
            Buy Airtime
          </div>
        </NuxtLink>
      </li>
      <li>
        <a href="javascript:;" class="has-arrow" aria-expanded="true">
          <div class="parent-icon"><i class="bx bx-tv" />
          </div>
          <div class="menu-title">Bill Payments</div>
        </a>
        <ul class="mm-collapse" style="">
          <li>
            <NuxtLink :to="{ name: 'dashboard-cable' }" aria-expanded="true">
              <i class="bx bx-right-arrow-alt" />Cable/TV Bills
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'dashboard-electricity' }" aria-expanded="true">
              <i class="bx bx-right-arrow-alt" />Electricity Bills
            </NuxtLink>
          </li>
        </ul>
      </li>
      <!-- <li>
        <a href="#">
          <div class="parent-icon"><i class="bx bx-user-circle" />
          </div>
          <div class="menu-title">Profile</div>
        </a>
      </li> -->
      <!-- <li>
        <a href="#">
          <div class="parent-icon"><i class="bx bx-wrench" />
          </div>
          <div class="menu-title">Settings</div>
        </a>
      </li> -->
      <li>
        <NuxtLink :to="{ name: 'dashboard-admin-users' }">
          <div class="parent-icon">
            <i class="bx bx-group" />
          </div>
          <div class="menu-title">
            Users
          </div>
        </NuxtLink>
      </li>
      <li>
        <a href="javascript:;">
          <div class="parent-icon"><i class="bx bx-log-out-circle" />
          </div>
          <div class="menu-title">Logout</div>
        </a>
      </li>
    </ul>
    <!--end navigation-->
  </div>
</template>

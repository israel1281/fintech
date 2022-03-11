<template>
  <header>
    <div class="topbar d-flex align-items-center">
      <nav class="navbar navbar-expand">
        <div class="mobile-toggle-menu">
          <i class="bx bx-menu" />
        </div>
        <div class="top-menu ms-auto">
          <ul class="navbar-nav align-items-center">
            <li class="nav-item dropdown dropdown-large">
              <a
                id="notifications"
                class="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              > <span class="alert-count"></span>
                <i class="bx bx-bell" />
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <a href="javascript:;">
                  <div class="msg-header">
                    <div class="msg-header-title">Notifications</div>
                    <p href="#" class="msg-header-clear ms-auto">Clear all</p>
                  </div>
                </a>
                <div class="header-notifications-list">
                  <a class="dropdown-item" href="javascript:;">
                    <div class="d-flex align-items-center">
                      <div class="flex-grow-1">
                        <p class="msg-info">There are no notifications at the moment</p>
                      </div>
                    </div>
                  </a>
                  <a class="dropdown-item" href="javascript:;">
                    <div class="d-flex align-items-center">
                      <div class="flex-grow-1">
                        <h6 class="msg-name fw-bold mb-2"><span class="msg-time float-end">4 hrs
                          ago</span></h6>
                        <p class="msg-info"></p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="user-box dropdown">
          <a class="d-flex align-items-center nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/images/avatars/avatar-2.png" class="user-img" alt="user avatar">
            <img class="user-image" alt="user avatar">
            <div class="user-info ps-3">
              <p class="user-name mb-0">Welcome User</p>
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="javascript:;"><i class="bx bx-user" /><span>Profile</span></a>
            </li>
            <li>
              <a class="dropdown-item" href="javascript:;"><i class="bx bx-cog" /><span>Settings</span></a>
            </li>
            <li>
              <div class="dropdown-divider mb-0" />
            </li>
            <li>
              <a class="dropdown-item" href="javascript:;"><i class="bx bx-log-out-circle" /><span>Logout</span></a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>

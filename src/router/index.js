import { createRouter, createWebHistory } from 'vue-router'
import { getisAuthenticated } from "@/requests/requests";

// Layouts
const DashboardLayout = () => import('@/layout/DashboardLayout.vue');
const LoginLayout = () => import('@/layout/LoginLayout.vue')
const ProfileLayout = () => import('@/layout/ProfileLayout.vue')

// Pages
const Orders = () => import('@/views/Orders/Main.vue')
const Positions = () => import('@/views/Positions/Main.vue')
const Strategies = () => import('@/views/Strategies/Main.vue');
const DeployedStrategies = () => import('@/views/deployedStrategies/Main.vue')
const Brokers = () => import('@/views/Brokers/Main.vue')
const Profile = () => import('@/views/profile/Main.vue')
// const StrategyDetails = () => import('@/views/deployedStrategies/StrategyDetails.vue')
const LoginView = () => import('@/views/Auth/LoginView.vue')
const RegistrationView = () => import('@/views/Auth/RegistrationView.vue')
const Users = () => import('@/views/Users/Main.vue')
const Subscriptions = () => import('@/views/Subscription/Main.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: '',
      component: LoginLayout,
      children: [
        {
          path:'/register',
          name:'register',
          component: RegistrationView
        },
        {
          path:'',
          name:'new-login',
          component: LoginView
        },
      ]
    },
    {
      path: '/',
      name: '',
      component: DashboardLayout,
      children:[
        {
          path: "",
          name: "users",
          component: Users,
          meta: { requiresAuth: true }
        },
        {
          path: "/orders",
          name: "orders",
          component: Orders,
          meta: { requiresAuth: true }
        },
        {
          path: "/positions",
          name: "positions",
          component: Positions,
          meta: { requiresAuth: true }
        },
        {
          path: "/strategies",
          name: "strategies",
          component: Strategies,
          meta: { requiresAuth: true }
        },
        {
          path: "/deployed-strategies",
          name: "deployed-strategies",
          component: DeployedStrategies,
          meta: { requiresAuth: true }
        },
        // {
        //   path: "/strategy-details",
        //   name: "strategy-details",
        //   component: StrategyDetails,
        //   meta: { requiresAuth: true }
        // },
        {
          path: "/brokers",
          name: "brokers",
          component: Brokers,
          meta: { requiresAuth: true }
        },
        {
          path: "/subscriptions",
          name: "subscriptions",
          component: Subscriptions,
          meta: { requiresAuth: true }
        },
        {
          path: "/watchlist",
          name: "watchlist",
          component: () => import('@/views/watchlist/Main.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: "/feed",
          name: "feed",
          component: () => import('@/views/timeline/Main.vue'),
          meta: { requiresAuth: true }
        },
      ]
    },
    {
      path: '/profile',
      name: '',
      component: ProfileLayout,
      children:[
        {
          path: "",
          name: "profile",
          component: Profile,
          meta: { requiresAuth: true }
        },
      ]
    },
    {
          path: "/telegram-premium",
          name: "telegram-premium",
          component: () => import('@/components/TelegramExclusive.vue'),
          meta: { requiresAuth: true }
        },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/error.vue')
    }
  ],
})

// Navigation guard to check authentication before navigating to protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
   
    if (getisAuthenticated()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router

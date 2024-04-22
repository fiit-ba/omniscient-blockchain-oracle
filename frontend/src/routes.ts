export default [
    {
        name: 'Home',
        path: '/',
        component: require('@/components/HomePage').default,
    },
    {
        name: 'New',
        path: '/new',
        component: require('@/components/NewSubscription').default,
    },
    {
        name: 'Subscriptions',
        path: '/all',
        component: require('@/components/ActiveSubscriptions').default,
    }
]
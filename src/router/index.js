import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/views/layout/Layout'


/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  {
    path: '/goodsmanagerbase',
    component: Layout,
    redirect: '/goodsmanagerbase/goodsmanager/spulist',
    name: 'goodsmanagerbase',
    meta: {
      authorities: 'goodsmanagerbase',
      title:'商品管理'
    },
    children: [
      {
        path: '/goodsmanagerbase/goodsmanager', // Must write the full path
        component: () => import('@/views/goods/index'), // Parent router-view
        name: 'goodsmanager',
        meta: { title: '商品管理' ,
                authorities:'goodsmanager'
              },
        children: [
          {
            path: 'spulist',
            component: () => import('@/views/goods/spu/spu'),
            name: 'spulist',
            meta: { title: '商品列表' ,authorities:'spulist'}
          }
          ]
      },
      {
        path: '/goodsmanagerbase/goodsconfiguration', // Must write the full path
          component: () => import('@/views/goods/index'), // Parent router-view
        name: 'goodsconfiguration',
        meta: { title: '商品配置' ,authorities:'goodsconfiguration'},
        children: [
          {
            path: 'brandlist',
            component: () => import('@/views/goods/brand/brand'),
        name: 'brandlist',
          meta: { title: '商品品牌', authorities:'brandlist'}
      },
        {
          path: 'catelist',
            component: () => import('@/views/goods/category/category'),
          name: 'catelist',
          meta: { title: '商品分类' ,authorities:'catelist'}
        }
      ]
      }
    ]
},
{
  path: '/customermanagerbase',
    component: Layout,
  redirect: '/customermanagerbase/customermanager/customerlist',
  name: 'customermanagerbase',
  meta: {
  authorities: 'customermanagerbase',
    title:'会员管理'
},children:[
  {
    path: '/customermanagerbase/customermanager', // Must write the full path
    component: () => import('@/views/customer/index'), // Parent router-view
  name: 'goodsmanager',
    meta: { title: '会员管理' ,
  authorities:'customermanager'
},
  children: [
    {
      path: 'customerlist',
      component: () => import('@/views/customer/customer/customer'),
  name: 'customerlist',
    meta: { title: '会员列表' ,authorities:'customerlist'}
}
]
}
]
},{
  path: '/systemmanagerbase',
    component: Layout,
    redirect: '/systemmanagerbase/authoritymanager/rolelist',
    name: 'systemmanagerbase',
    meta: {
    authorities: 'systemmanagerbase',
      title:'系统管理'
  },children:[
    {
      path: '/systemmanagerbase/authoritymanager', // Must write the full path
      component: () => import('@/views/system/index'), // Parent router-view
  name: 'authoritymanager',
    meta: { title: '权限管理' ,
    authorities:'authoritymanager'
  },children:[
    {
      path: 'rolelist',
      component: () => import('@/views/system/role/role'),
  name: 'rolelist',
    meta: { title: '角色列表' ,authorities:'rolelist'}
},    {
    path: 'stafflist',
      component: () => import('@/views/system/manager/manager'),
      name: 'stafflist',
      meta: { title: '员工列表' ,authorities:'stafflist'}
  }
  ]
    }
  ],
},
{ path: '', redirect: '/goodsmanagerbase', hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

import Vue from 'vue'
import VueRouter from 'vue-router'
import TodoPage from '../components/todo/TodoPage'
import MoviesPage from '../components/movies/MoviesPage'

Vue.use(VueRouter)

const routes = [
  {path: '/', component: TodoPage},
  {path: '/movies', component: MoviesPage}
]

export default new VueRouter({
  routes
})

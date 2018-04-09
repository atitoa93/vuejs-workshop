import Vue from 'vue'
import VueRouter from 'vue-router'
import TodoPage from '../components/todo/TodoPage'
import MoviesPage from '../components/movies/MoviesPage'
import MoviePage from '../components/movies/MoviePage'


Vue.use(VueRouter)

const routes = [
  {path: '/', component: TodoPage},
  {path: '/movies', component: MoviesPage},
  {path: '/movie/:id', component: MoviePage}
]

export default new VueRouter({
  routes
})

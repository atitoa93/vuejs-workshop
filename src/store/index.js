import Vue from 'vue'
import Vuex from 'vuex'
import MovieService  from '../services/MovieService'

Vue.use(Vuex)

const store = {
  state: {
    movie: {},
    hello: 'world',
    movies: [],
    savedMovies: [],
    genres: [],
    selectedGenre: null,
    pages: 1,
    currentPage: 1,
    loading: false,
    currentSection: 'discover'
  },

  actions: {
    async fetchMovie (context, id) {
      context.commit('setLoading', true)
      const response = await MovieService.getMovie({ id })
      context.commit('setMovie', response.data)
      context.commit('setLoading', false)
    },
    async fetchMovies (context, page = 1) {
      context.commit('setLoading', true)
      const response = await MovieService.getMovies({
        page: page,
        genre: context.state.selectedGenre
      })
      context.commit('setMovies', response.data)
      context.commit('setLoading', false)
    },
    async fetchGenres (context) {
      const response = await MovieService.getGenres()
      context.commit('setGenres', response.data)
    },
    fetchPage(context, page) {
      context.dispatch('fetchMovies', page)
    },
    fetchByGenre(context, genre) {
      context.commit('setSelectedGenre', genre)
      context.dispatch('fetchMovies')
    },
    fetchSavedMovies (context) {
      const savedMovies = localStorage.getItem('savedMovies')
      context.commit('setSavedMovies', JSON.parse(savedMovies))
    }
  },

  mutations: {
    setMovie(state, movieData) {
      state.movie = movieData
    },
    setMovies(state, moviesData) {
      state.movies = moviesData.results
      state.pages = moviesData.total_pages
      state.currentPage = moviesData.page
    },
    setGenres(state, genresData) {
      state.genres = genresData.genres
    },
    setSelectedGenre(state, genre) {
      state.selectedGenre = genre
    },
    setLoading(state, value) {
      state.loading = value
    },
    setSection(state, section) {
      state.currentSection = section
    },
    setSavedMovies (state, savedMovies) {
      if(savedMovies) {
        state.savedMovies = savedMovies
      }
    },
    saveMovie (state, movieObject) {
      state.savedMovies.push(movieObject)
      localStorage.setItem('savedMovies', JSON.stringify(state.savedMovies))
    },
    removeSavedMovie (state, movie) {
      const movieIndex = this.getters.savedMoviesIds.indexOf(movie.id)
      if (movieIndex >= 0) {
        state.savedMovies.splice(movieIndex, 1)
      }
      localStorage.setItem('savedMovies', JSON.stringify(state.savedMovies))
    }
  },

  getters: {
    movie (state) {
      const imageBasePath = 'http://image.tmdb.org/t/p/w370_and_h556_bestv2'
      return {
        id: state.movie.id,
        title: state.movie.title,
        description: state.movie.description,
        image: `${imageBasePath}${state.movie.poster_path}`,
        voteAverage: state.movie.vote_average
      }
    },
    movieCards (state) {
      if(state.currentSection === 'backlog') {
        return state.savedMovies
      }

      const imageBasePath = 'http://image.tmdb.org/t/p/w370_and_h556_bestv2'
      return state.movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        image: `${imageBasePath}${movie.poster_path}`,
        voteAverage: movie.vote_average
      }))
    },
    selectedGenreName (state) {
      const genre = state.genres.filter(genre => genre.id === state.selectedGenre)
      return genre[0] ? genre[0].name : null
    },
    savedMoviesIds (state) {
      if (!state.savedMovies)
        return []
      return state.savedMovies.map(movie => movie.id)
    }
  }
}

export default new Vuex.Store(store)

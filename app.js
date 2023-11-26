const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()
//get players 1  ##########   director movie

app.get('/movies/', async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      movie
      ORDER BY
      movie_id;`
  const booksArray = await db.all(getBooksQuery)
  let movie = booksArray.map(num => {
    return {
      movieName: num.movie_name,
    }
  })
  response.send(movie)
})

//post player   2
app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const addBookQuery = `
    INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (${directorId},'${movieName}','${leadActor}');`

  await db.run(addBookQuery)
  response.send('Movie Successfully Added')
})

//get player id 3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getBookQuery = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id = ${movieId};`
  const book = await db.get(getBookQuery)
  let movie = {
    movieId: book.movie_id,
    directorId: book.director_id,
    movieName: book.movie_name,
    leadActor: book.lead_actor,
  }
  response.send(movie)
})

//put player    4
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const playerDetails = request.body
  const {directorId, movieName, leadActor} = playerDetails
  const updateBookQuery = `
    UPDATE
      movie
    SET
      director_id=${directorId},
      movie_name='${movieName}',
      lead_actor='${leadActor}'
    WHERE
      movie_id = ${movieId};`

  await db.run(updateBookQuery)
  response.send('Movie Details Updated')
})
//player delete   5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteBookQuery = `
    DELETE FROM
      movie
    WHERE 
      movie_id = ${movieId};`
  await db.run(deleteBookQuery)
  response.send('Movie Removed')
})

//get players 6  ##########   director movie

app.get('/directors/', async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      director
      ORDER BY
      director_id;`
  const booksArray = await db.all(getBooksQuery)
  let movie = booksArray.map(num => {
    return {
      directorId: num.director_id,
      directorName: num.director_name,
    }
  })
  response.send(movie)
})

//get players   7  ##########   director movie

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getBooksQuery = `
    SELECT
      *
    FROM
      movie
      WHERE director_id=${directorId}
      ORDER BY
      director_id;`
  const booksArray = await db.all(getBooksQuery)
  let movie = booksArray.map(num => {
    return {
      movieName: num.movie_name,
    }
  })
  response.send(movie)
})

module.exports = app

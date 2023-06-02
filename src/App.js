import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Quiz from './Quiz';
import Recommendations from './Recommendations';
import TIPIForm from './TIPIForm';

const defaultQuestions = [
    {
      questionText: "Please select a letter:",
      choices: [
        {
          "text": "Choice A",
          "value": "A"
        },
        {
          "text": "Choice B",
          "value": "B"
        },
        {
          "text": "Choice C",
          "value": "C"
        }
      ]
    },
    {
      questionText: "Please select a number:",
      choices: [
        {
          "text": "Choice 1",
          "value": "1"
        },
        {
          "text": "Choice 2",
          "value": "2"
        },
        {
          "text": "Choice 3",
          "value": "3"
        }
      ]
    }
];

// Genres recognized by the TMDB API, and their respective TMDB IDs

const GENRE_IDs = {
  "adventure": 12,
  "fantasy": 14,
  "animation": 16,
  "drama": 18,
  "horror": 27,
  "action": 28,
  "comedy": 35,
  "history": 36,
  "western": 37,
  "thriller": 53,
  "crime": 80,
  "documentary": 99,
  "science fiction": 878,
  "mystery": 9648,
  "music": 10402,
  "romance": 10749,
  "family": 10751,
  "war": 10752,
  "tv movie": 10770
};


function App() {

  const [quizDone, setQuizDone] = useState(false);

  const [recommendations, setRecommendations] = useState([]);

  // Get recommendations from the TMDB API, based on genre aj;sdfojaogj
  async function getRecommendations(genreID) {
    if(GENRE_IDs[genreID]) { // Accept genre name as input
      genreID = GENRE_IDs[genreID];
    }
  
    // request syntax and example req. from here: https://developer.themoviedb.org/reference/discover-movie

    const apiKeys = require("./api-keys.json");

    //const requestURL = "https://cdkwmfgujumqg5lqlxojlvuqci0hzonl.lambda-url.us-east-2.on.aws";

    const requestURL = "https://api.themoviedb.org/3/discover/movie?"  + new URLSearchParams({
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: 1,
      sort_by: "popularity.desc",
      with_genres: genreID,
      api_key: apiKeys.TMDB.key
    });

    const requestOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: apiKeys.TMDB.auth
      }
    }
  
    // should create some kind of loading symbol
  
    console.log(requestURL);
    const response = await fetch(requestURL, requestOptions);
    const jsonData = await response.json();
    // get the top 5 results (note: if results.length < 5, results.slice(0,5) returns the entire array without issue)
    setRecommendations(jsonData.results.slice(0,5));
    // jsonData.results.slice(0,5).map((result) => {
    //   console.log(result.id);
    //   console.log(result.title);
    //   console.log(result.poster_path);
    //   console.log(result.popularity);
    //   console.log(result.release_date);
    //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    // })
  
  
    // set up loading symbol or whatever
    fetch(requestURL).then((response) => {
      console.log("movies or whatever");
      response.json().then((f) => {
        console.log(f);
        // set state about recommended films
      })
    })
  
  }
  
  function onScoresCalculated(traitScores) {
    setQuizDone(true);
    getRecommendations(34);
    console.log(traitScores);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <body>
        {
          (!quizDone) ? (
            <TIPIForm questions={defaultQuestions} onFinished={onScoresCalculated} />
          )
          : (
            <Recommendations films={recommendations}/>
          )
        }
        <button onClick={() => getRecommendations(12)}>Get Recommendations (test)</button>
      </body>
    </div>
  );
}

export default App;

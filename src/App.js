import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Quiz from './Quiz';
import Recommendations from './Recommendations';
import TIPIForm from './TIPIForm';
import getPreferredGenres from './getGenreRanking';

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

const apiKeys = require("./api-keys.json");


function App() {

  const [quizInProgress, setQuizInProgress] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [baseImgURL, setBaseImgURL] = useState("");

  // Get recommendations from the TMDB API, based on genre aj;sdfojaogj
  async function getRecommendations(genres) {
    setLoadingRecommendations(true);
  
    // request syntax and example req. from here: https://developer.themoviedb.org/reference/discover-movie

    

    //const requestURL = "https://cdkwmfgujumqg5lqlxojlvuqci0hzonl.lambda-url.us-east-2.on.aws";

    const requestURL = "https://api.themoviedb.org/3/discover/movie?"  + new URLSearchParams({
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: 1,
      sort_by: "popularity.desc",
      with_genres: (genres.map((g) => GENRE_IDs[g])).join('|'),
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
    setLoadingRecommendations(false);

    updateBaseImgPath();
  }

  async function updateBaseImgPath() {
    if(baseImgURL === "") {
      const requestURL = "https://api.themoviedb.org/3/configuration?" + new URLSearchParams({
        api_key: apiKeys.TMDB.key
      })

      const requestOptions = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: apiKeys.TMDB.auth
        }
      };
      fetch(requestURL, requestOptions).then((response) => {
        response.json().then((data) => {
          console.log(data);
          const size_str = data.images.backdrop_sizes[0];
          setBaseImgURL(data.images.secure_base_url + size_str);
        })
      })

    };
  }

  function startQuiz() {
    setQuizDone(false);
    setQuizInProgress(true);
  }
  
  function onScoresCalculated(traitScores) {
    setQuizDone(true);
    setQuizInProgress(false);
    
    const preferredGenres = getPreferredGenres(traitScores);
    getRecommendations(preferredGenres);
    console.log(traitScores);
    console.log(preferredGenres);
  }

  function reset() {
    setRecommendations([]);
    startQuiz();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie Recommender</h1>
        <h4>
        {/* Inclusion of the following disclaimer is mandated by the TMDB API terms of service:
        https://www.themoviedb.org/documentation/api/terms-of-use */}
        Disclaimer:
        This product uses the TMDB API but is not endorsed or certified by TMDB.
        (See below to learn more)
        </h4>
      </header>
      <body>
        <div className="bodyInner">
          {
            (quizInProgress) ? (
              <TIPIForm questions={defaultQuestions} onFinished={onScoresCalculated} />
            )
            : (quizDone) ? (
              <>

                <Recommendations loading={loadingRecommendations} imgBasePath={baseImgURL} films={recommendations}/>

                <button onClick={reset} className="primaryButton">
                  Retake Quiz
                </button>

              </>
            )
            : (
              <div>
                <p>
                  Take a brief quiz to describe your personality, and we'll predict which film genres you enjoy most. Then, we will show you the most popular films in those genres.
                </p>
                <button onClick={startQuiz} className="primaryButton">
                  Start Quiz
                </button>
              </div>
            )
          }
        </div>

      </body>
      <footer>
        <h2>Acknowledgements</h2>
        <ul style={{textAlign: "left"}}>
          <li>
            <p>
              Personality Quiz based on the following paper:
              <br/>
              Gosling, S. D., Rentfrow, P. J., & Swann Jr, W. B. (2003). A very brief measure of the Big-Five personality domains. Journal of Research in personality, 37(6), 504-528.
            </p>
          </li>
          <li>
            <p>
              Personality-to-genre mapping based on the following paper:
              <br/>
              Rentfrow, P. J., Goldberg, L. R., & Zilca, R. (2011). Listening, watching, and reading: The structure and correlates of entertainment preferences. Journal of personality, 79(2), 223-258.
            </p>
          </li>
          <li>
            <p>
              Information on recommended films comes from The Movie Database (TMDB) API
            </p>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default App;

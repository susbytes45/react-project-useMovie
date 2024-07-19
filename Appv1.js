import { useEffect, useState } from "react";
import Star from "./star";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const Logo = function () {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};
const Result = function ({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};
const Searchbar = function ({ setQuery, query }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};
const Main = function ({ children }) {
  return <main className="main">{children}</main>;
};
const Navbar = function ({ children }) {
  return (
    <nav className="nav-bar">
      <Logo></Logo>
      {children}
    </nav>
  );
};
const key = "1c0a74d6";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [iserror, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, isSelectedId] = useState(null);
  function ONclickmovie(imdbID) {
    isSelectedId((selectedId) => (selectedId === imdbID ? null : imdbID));

    // console.log(imdbID);
  }
  function onClickclosemoviedetails() {
    isSelectedId(null);
  }
  function onClickmoviewatchedreview(id) {
    const filterwatched = watched.filter((movie) => movie.imdbID !== id);
    setWatched(filterwatched);
  }
  function handleAddwatched(movie) {
    if (watched.filter((el) => el.imdbID === movie.imdbID).length > 0) {
      return;
    }
    setWatched((watched) => [...watched, movie]);
    // console.log(watched, movie);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setisLoading(true);
          // console.log(query);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("failed to fetch something went wrong!");
          }
          const data = await res.json();
          // console.log(data);
          if (data.Response === "False") {
            throw new Error(data.Error);
            // throw new Error("failed to fetch something went wrong!");
          }
          // setisLoading(false);
          setMovies(data.Search);
        } catch (err) {
          // console.error(err.message);

          // console.log(isLoading);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setisLoading(false);
        }
      }
      if (query.length < 3) {
        setisLoading("");
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      <Navbar>
        <Searchbar setQuery={setQuery} query={query}></Searchbar>
        <Result movies={movies}></Result>
      </Navbar>
      <Main>
        <Box>
          {/* {console.log(isLoading)} */}
          {isLoading && <Loader></Loader>}
          {!isLoading && !iserror && (
            <MoviesList movies={movies} onclick={ONclickmovie}></MoviesList>
          )}
          {iserror && <ErrorMessage message={iserror}></ErrorMessage>}
        </Box>
        <Box>
          {/* {console.log(selectedId)} */}
          {selectedId ? (
            <MovieDetails
              watched={watched}
              onAddWatched={handleAddwatched}
              selectedId={selectedId}
              onBtnclose={onClickclosemoviedetails}
            ></MovieDetails>
          ) : (
            <>
              <MoviesSummary watched={watched}></MoviesSummary>
              <MovieWatchedList
                watched={watched}
                ONclickmovie={onClickmoviewatchedreview}
              ></MovieWatchedList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <h2 className="loader">{message}</h2>;
}
function Loader() {
  return <p className="loader"> Listening.....</p>;
}
const MoviesList = function ({ movies, onclick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movies onclick={onclick} movie={movie} key={movie.imdbID}></Movies>
      ))}
    </ul>
  );
};
const Movies = function ({ movie, onclick }) {
  return (
    <li
      role="button"
      style={{ cursor: "pointer" }}
      onClick={() => onclick(movie.imdbID)}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};
const MovieDetails = function ({
  selectedId,
  onBtnclose,
  onAddWatched,
  watched,
}) {
  const [movieselect, ismovieselect] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [userRating, setuserRating] = useState("");
  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  // console.log(iswatched);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: realeased,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieselect;
  // console.log(director, actors);
  const handleAdd = function () {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);

    // console.log(newWatchedMovie);
    onBtnclose();
  };
  useEffect(function () {
    const callbackfun = (el) => {
      if (el.code === "Escape") {
        // console.log("Closing");
        onBtnclose();
      }
    };
    document.addEventListener("keydown", callbackfun);
    return function () {
      document.removeEventListener("keydown", callbackfun);
    };
  }, []);
  useEffect(
    function () {
      setisLoading(true);
      async function getmovieDetails() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
          );
          const data = await res.json();
          // console.log(data);
          setisLoading(false);
          ismovieselect(data);
        } catch (err) {}
      }
      getmovieDetails();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "use Movie";
        // console.log(title);
        // setTimeout(() => console.log("cleanup function"), 10000);
      };
    },
    [title]
  );
  return isLoading ? (
    <Loader></Loader>
  ) : (
    <div className="details" style={{ display: "flex" }}>
      <button onClick={onBtnclose}>Close</button>
      <img src={poster} alt={`poster of ${title} movie`}></img>
      <div className="details-overview">
        <h2>{title}</h2>
        <p>
          {realeased} &bull; {runtime}
        </p>
        <p>{genre}</p>
        <p>
          <span>🌟</span>
          {imdbRating} IMDB Rating
        </p>
        {iswatched ? (
          <p>{`you have already rated the movie ${watchedUserRating}`}</p>
        ) : (
          <>
            <Star size="24" onsetRating={setuserRating}></Star>

            {userRating && (
              <button className="btn-add" onClick={handleAdd}>
                Add
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
const Box = function ({ movies, children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
};

const BoxStats = function ({ children }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && children}
    </div>
  );
};
const MovieWatchedList = function ({ watched, ONclickmovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          ONclickmovie={ONclickmovie}
        ></WatchedMovie>
      ))}
    </ul>
  );
};
const WatchedMovie = function ({ movie, ONclickmovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          style={{ cursor: "pointer" }}
          onClick={() => ONclickmovie(movie.imdbID)}
        >
          ❌
        </button>
      </div>
    </li>
  );
};
const MoviesSummary = function ({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

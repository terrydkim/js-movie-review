(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const BASE_URL = "https://api.themoviedb.org/3";
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmM3NDExMjc0MWMwYTZhZjZkOTg5MTdiNGIzZDlkZiIsIm5iZiI6MTc0MDY2MTgwMC44ODIsInN1YiI6IjY3YzA2NDI4YmM2OTM1YTAwMWEyNGQzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tkRKKtEkn2IqP7MagRKRaWIU_OO3HJtxKCpl6DhSnNA";
const MAX_RETRIES = 3;
const fetchPopularMovies = async (page = 1, retries = 0) => {
  try {
    const url = `${BASE_URL}/movie/popular?language=ko-KR&page=${page}`;
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`
    };
    const response = await fetch(url, { headers });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        `HTTP Status ${result.status_code} : ${result.status_message}`
      );
    }
    return result;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      return fetchPopularMovies(page, retries + 1);
    }
    throw Error(`최대 재시도 횟수를 초과했습니다. ${error.message}`);
  }
};
const DEFAULT_MOVIE_RENDER_COUNT = 20;
const SkeletonItems = (count = 4) => {
  return Array.from(
    { length: count },
    () => `
      <li class="skeleton-list">
          <div class="skeleton-item">
              <img class="skeleton-thumbnail" />
              <div class="skeleton-item-desc">
                  <p class="skeleton-rate">
                      <img class="skeleton-star" />
                      <span class="skeleton-rate-value"></span>
                  </p>
                  <div class="skeleton-title"></div>
              </div>
          </div>
      </li>
    `
  ).join("");
};
const addSkeleton = () => {
  const movieSection = document.querySelector(".thumbnail-list");
  movieSection.insertAdjacentHTML("beforeend", SkeletonItems());
};
const removeSkeleton = () => {
  const skeletonLists = document.querySelectorAll(".skeleton-list");
  skeletonLists.forEach((skeletonList) => {
    skeletonList.remove();
  });
};
const Headers = (movie) => {
  const { title, backdrop_path, vote_average } = movie;
  const backdrop = `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${backdrop_path}`;
  const rate = vote_average.toFixed(1);
  return (
    /*html*/
    `<header>
    <div class="background-container">
      <div class="overlay" aria-hidden="true" style="background-image: url('${backdrop}');"></div>
      <div class="top-rated-container">
        <h1 class="logo">
          <img src="./images/logo.png" alt="MovieList" />
        </h1>
        <div class="top-rated-movie">
          <div class="rate">
            <img src="./images/star_empty.png" class="star" />
            <span class="rate-value">${rate}</span>
          </div>
          <div class="title">${title}</div>
          <button class="primary detail">자세히 보기</button>
        </div>
      </div>
    </div>
  </header>`
  );
};
const LoadMoreButton = (isVisible) => {
  if (!isVisible) return "";
  return (
    /* html */
    `
    <button class="primary" id="load-more-button">
        더 보기
    </button>
    `
  );
};
const MovieItem = (props) => {
  const { title, poster_path, vote_average } = props;
  const rate = vote_average.toFixed(1);
  return (
    /*html*/
    `
    <li>
        <div class="item">
            <img
                class="thumbnail"
                src="https://media.themoviedb.org/t/p/w440_and_h660_face${poster_path}"
                alt="${title}"
            />
            <div class="item-desc">
                <p class="rate">
                    <img src="./images/star_empty.png" class="star" />
                    <span>${rate}</span>
                </p>
                <strong>${title}</strong>
            </div>
        </div>
    </li>`
  );
};
const MovieList = (props) => {
  const { movies } = props;
  return (
    /* html */
    `
    <h2>지금 인기 있는 영화</h2>
    <ul class="thumbnail-list">
        ${renderMovieItems(movies)}
    </ul>
    `
  );
};
const renderHeaders = (movie) => {
  const wrap = document.querySelector("#wrap");
  wrap.insertAdjacentHTML("afterbegin", Headers(movie));
};
const renderMovieSection = (movies) => {
  const movieSection = document.querySelector(".movie-section");
  movieSection.innerHTML = MovieList({ movies });
  const initHasMoreMovies = movies.length === DEFAULT_MOVIE_RENDER_COUNT;
  const loadMoreButtonHTML = LoadMoreButton(initHasMoreMovies);
  movieSection.insertAdjacentHTML("beforeend", loadMoreButtonHTML);
};
const renderMovieItems = (movies) => {
  return movies.map((movie) => MovieItem(movie)).join("");
};
const appendMovieItems = (movies) => {
  const movieSection = document.querySelector(".thumbnail-list");
  movieSection.insertAdjacentHTML("beforeend", renderMovieItems(movies));
};
let currentPage = 1;
let allMovies = [];
let hasMoreMovies = true;
const MAX_PAGE = 500;
const initializeMovieSection = async () => {
  const initialMovies = await fetchPopularMovies();
  allMovies = initialMovies.results;
  if (allMovies.length === 0) {
    throw Error("영화 정보가 로드되지 않았습니다.");
  }
  renderHeaders(allMovies[0]);
  renderMovieSection(allMovies);
  addLoadMoreButtonEvent();
};
const loadMoreMovies = async () => {
  if (!hasMoreMovies) return;
  addSkeleton();
  const newMovies = await fetchPopularMovies(currentPage + 1);
  allMovies = [...allMovies, ...newMovies.results];
  currentPage++;
  appendMovieItems(newMovies.results);
  removeSkeleton();
  updateLoadMoreButtonDisplay(newMovies.results.length);
};
const addLoadMoreButtonEvent = () => {
  const loadMoreButton = document.getElementById("load-more-button");
  loadMoreButton == null ? void 0 : loadMoreButton.addEventListener("click", loadMoreMovies);
};
const updateLoadMoreButtonDisplay = (loadedMovieCount, currentPage2) => {
  if (loadedMovieCount < DEFAULT_MOVIE_RENDER_COUNT || currentPage2 === MAX_PAGE) {
    hasMoreMovies = false;
    const loadMoreButton = document.getElementById("load-more-button");
    if (loadMoreButton) {
      loadMoreButton.style.display = "none";
    }
    return;
  }
};
addEventListener("load", async () => {
  await initializeMovieSection();
});

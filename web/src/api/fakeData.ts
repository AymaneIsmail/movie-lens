import { Recommendation } from "@/api/types";

export const fakeRecommendations: Recommendation[] = [
  {
    userid: "42",
    movieid: "tt0111161",
    score: 9.3,
    rank: 1,
    title: "The Shawshank Redemption",
    genres: ["Drama", "Crime"],
  },
  {
    userid: "42",
    movieid: "tt0068646",
    score: 9.2,
    rank: 2,
    title: "The Godfather",
    genres: ["Crime", "Drama"],
  },
  {
    userid: "42",
    movieid: "tt0071562",
    score: 9.0,
    rank: 3,
    title: "The Godfather: Part II",
    genres: ["Crime", "Drama"],
  },
  {
    userid: "42",
    movieid: "tt0468569",
    score: 8.9,
    rank: 4,
    title: "The Dark Knight",
    genres: ["Action", "Crime", "Drama"],
  },
  {
    userid: "42",
    movieid: "tt0050083",
    score: 8.9,
    rank: 5,
    title: "12 Angry Men",
    genres: ["Drama"],
  },
]

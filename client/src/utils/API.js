import axios from "axios";

export default {
  searchNYT: function(searchTerm, start, end) {

    if(!start) {
      start = "2017";
    }

    if(!end) {
      end = "2017";
    }

    let queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?" +
                  "api-key=4bce339f20814296bc35821befa93d46&q=" + searchTerm +
                  "&begin_date=" + start + "0101&end_date=" + end + "1231";

    return axios.get(queryURL);
  },

  saveArticle: function(article) {
    console.log(article);
    return axios.post("/save", article)
    .then(res => console.log(res));
  },
  getArticles: function() {
    return axios.get("/all");
  },
  deleteArticle: function(headline) {
    return axios.post("/delete/", headline);
  }
};
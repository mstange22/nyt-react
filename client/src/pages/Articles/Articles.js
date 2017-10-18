import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
// import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, Label, FormBtn } from "../../components/Form";

class Articles extends Component {
  state = {
    newArticles: [],
    savedArticles: [],
    topic: "",
    startDate: "",
    endDate: ""
  };

  componentDidMount() {
    this.loadSavedArticles();
  }

  loadSavedArticles = () => {
    API.getArticles()
      .then(res =>
        this.setState({ savedArticles: res.data })
      )
      .catch(err => console.log(err));
  };

  saveArticle = (article) => {
    API.saveArticle(article)
      .then(res => 
        this.loadSavedArticles()
      )
      .catch(err => console.log(err));
  };

  deleteArticle = (headline) => {
    API.deleteArticle(headline)
      .then(res =>
        this.loadSavedArticles()
      )
      .catch(err => console.log(err));
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    if (this.state.topic) {

      API.searchNYT(this.state.topic, this.state.startDate, this.state.endDate)
        .then(result => this.setState({newArticles: result.data.response.docs}))
        .then(result => console.log(this.state.newArticles))
        .catch(err => console.log(err));
    }

    // clear out input forms on submit
    this.setState({
      topic: "",
      startDate: "",
      endDate: ""});
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron id="search-jumbo">
              <h1>Search</h1>
              <form>
              <Label>Topic: {this.state.topic}</Label>
              <Input
                value={this.state.topic}
                onChange={this.handleInputChange}
                name="topic"
                placeholder="Topic (required)"
              />
              <Row>
                <Col size="md-6">
                  <Label>Start Year: {this.state.startDate}</Label>
                  <Input
                    value={this.state.startDate}
                    onChange={this.handleInputChange}
                    name="startDate"
                    type="number"
                    min="1900"
                    max="2017"
                    placeholder="2017"
                  />
                </Col>
                <Col size="md-6">
                  <Label>End Year: {this.state.endDate}</Label>
                  <Input
                    value={this.state.synopsis}
                    onChange={this.handleInputChange}
                    name="endDate"
                    type="number"
                    min="1900"
                    max="2017"
                    placeholder="2017"
                  />
                </Col>
              </Row>
              <Row>
                <Col size="md-12">
                  <FormBtn
                    disabled={!(this.state.topic)}
                    onClick={this.handleFormSubmit}
                  >
                    Search
                  </FormBtn>
                </Col>
              </Row>
            </form>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <Jumbotron id="results-jumbo">
              <h1>Results</h1>
              {this.state.newArticles.length ? (
                // <h3>There are results to display</h3>
                <List>
                   {this.state.newArticles.map(article => (
                    <ListItem key={article._id}>
                        {<strong>{article.headline.main}</strong>}
                        <br />
                        {article.pub_date}
                        <br />
                        <a href={article.web_url} target="_blank">{article.web_url}</a>
                        {<SaveBtn onClick={() => this.saveArticle({headline: article.headline.main,
                                                    date: article.pub_date, url: article.web_url})} />}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <h3>No Results to Display</h3>
              )}
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <Jumbotron id="saved-jumbo">
              <h1>Saved Articles</h1>
              {this.state.savedArticles.length ? (
                <List>
                  {this.state.savedArticles.map(article => (
                    <ListItem key={article._id}>
                        {<strong>{article.headline}</strong>}
                        {<DeleteBtn onClick={() => this.deleteArticle({headline: article.headline})} />}
                        <br />
                        {article.date}
                        <br />
                        <a href={article.url} target="_blank">{article.url}</a>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <h3>No Results to Display</h3>
              )}
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Articles;
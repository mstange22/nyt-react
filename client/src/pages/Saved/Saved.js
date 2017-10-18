import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, Label, FormBtn } from "../../components/Form";

class Articles extends Component {
  state = {
    articles: [],
    topic: "",
    startDate: "",
    endDate: "",
    title: "",
    date: "",
    url: ""
  };

  componentDidMount() {
    this.loadArticles();
  }

  loadArticles = () => {
    API.getArticles()
      .then(res =>
        this.setState({ articles: res.data, title: "", date: "", url: "" })
      )
      .catch(err => console.log(err));
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadArticles())
      .catch(err => console.log(err));
  };

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
        .then(result => this.setState({articles: result.data.response.docs}))
        .then(result => console.log(this.state.articles))
        // .then(res => this.loadArticles())
        .catch(err => console.log(err));
    }

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
            <Jumbotron>
              <h1>Search</h1>
              <form>
              <Label>Topic: {this.state.topic}</Label>
              <Input
                value={this.state.topic}
                onChange={this.handleInputChange}
                name="topic"
                placeholder="Topic (required)"
              />
              <Label>Start Year: {this.state.startDate}</Label>
              <Input
                value={this.state.startDate}
                onChange={this.handleInputChange}
                name="startDate"
                type="number"
                min="1900"
                max="2017"
                placeholder="Start Date"
              />
              <Label>End Year: {this.state.endDate}</Label>
              <Input
                value={this.state.synopsis}
                onChange={this.handleInputChange}
                name="endDate"
                type="number"
                min="1900"
                max="2017"
                placeholder="EndDate"
              />
              <FormBtn
                disabled={!(this.state.topic) || (this.startDate < 1900 || this.startDate > this.endDate)}
                onClick={this.handleFormSubmit}
              >
              <i class="fa fa-newspaper-o" aria-hidden="true"></i> Search
              </FormBtn>
            </form>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Results</h1>
              {this.state.articles.length ? (
                <List>
                  {this.state.articles.map(article => (
                    <ListItem key={article._id}>
                      <Link to={"/articles/" + article._id}>
                        {<strong>{article.title}</strong>}
                        {article.pub_date}
                        {article.web_url}
                      </Link>
                      {<DeleteBtn onClick={() => this.deleteArticle(article._id)} />}
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
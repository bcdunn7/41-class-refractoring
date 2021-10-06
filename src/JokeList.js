import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.numJokesToGet = this.props.numJokesToGet;
    this.state = { jokes: []};
    this.getJokes = this.getJokes.bind(this);
    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.generateNewJokes.bind(this);
  }

  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({...jokeObj, votes: 0});
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({jokes: j});
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
    this.getJokes();
  }

  vote(id, delta) {
    this.setState({jokes: this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))})
  }

  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }
  
    return null;
  }
}

JokeList.defaultProps = {
  numJokesToGet: 10
}

export default JokeList;

import React from 'react';
import './App.css';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'

// Redux
const ADD_QUOTES = 'ADD_QUOTES';

const defaultQuotes = [
  { quote: "This is it", author: "no one"},
  { quote: "It's absolute madness", author: "anonymous" },
  { quote: "Whomever had been afflicted, must reconcile.", author: "James Jones" }, 
  { quote: "A pity, he was a good man.", author: "Brendon Weasley" },
  { quote: "It was a fool's errand", author: "Bartender" },
  { quote: "A miserable affair, that was.", author: "Warden Dave"}
]

const quotesReducer = (state = defaultQuotes, action) => {
  switch (action.type) {
    case ADD_QUOTES:
      return [...state, action.quotes];
    default:
      return state;
  }
}

const addQuotes = (quotes) => {
  return {
    type: ADD_QUOTES,
    quotes
  }
}

const store = createStore(quotesReducer);

// React-Redux

const mapStateToProps = (state) => {
  return { quotes: state }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addQuotes: (quotes) => {
      dispatch(addQuotes(quotes));
    }
  }
}

// React

class QuoteComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <p id="text">❝ {this.props.quote}</p>
        <p id="author">- {this.props.author}</p>
      </div>
    )
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuote: {}
    }

    // bind stuff to appease the 'this' gods
    this.addQuotes = this.addQuotes.bind(this);
    this.newQuote = this.newQuote.bind(this);
    this.fetchQuotes = this.fetchQuotes.bind(this); 
  }

  componentDidMount() {
    this.newQuote(); 
  }

  fetchQuotes() {
    // async call using middleware dispatch
  }

  newQuote() {
    let quotes = this.props.quotes; 
    let randomValue = Math.random() * quotes.length;
    let randomIndex = Math.floor(randomValue); 
    this.setState({
      currentQuote: quotes[randomIndex]
    }) 
  }

  addQuotes() {
    this.props.addQuotes("This is a quote")
  }

  render() {
    let randomQuote = this.state.currentQuote;
    let quote = randomQuote.quote; 
    let author = randomQuote.author; 
    return (
      <div className="App">
        <div className="App-wrapper">
        <div id="quote-box">
          <QuoteComponent quote={quote} author={author} />
          
          <div id="buttons">
          <a href="twitter.com/intent/tweet" target="_blank">
            <button type="button" class="button" id="tweet-quote">Tweet</button>
          </a>
          <button type="button" class="button" id="new-quote" onClick={this.newQuote} >New Quote</button>
          </div>
          </div>
        </div>
      </div>
    )
  }
}


function App() {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Wrapper)

export default App;

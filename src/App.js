import React from 'react';
import './App.css';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

// Utilities

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Redux
const ADD_QUOTES = 'ADD_QUOTES';

const defaultQuotes = [
  { quote: "This is it", author: "no one" },
  { quote: "It's absolute madness", author: "anonymous" },
  { quote: "Whomever had been afflicted, must reconcile.", author: "James Jones" },
  { quote: "A pity, he was a good man.", author: "Brendon Weasley" },
  { quote: "It was a fool's errand", author: "Bartender" },
  { quote: "A miserable affair, that was.", author: "Warden Dave" }
]

const quotesReducer = (state = defaultQuotes, action) => {
  switch (action.type) {
    case ADD_QUOTES:
      return action.quotes;
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

const addAsyncQuotes = () => {
  return function (dispatch) {
    fetch("https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json")
      .then(result => result.json())
      .then(
        (result) => {
          let jasonMomoa = result;
          dispatch(addQuotes(shuffle(jasonMomoa.quotes)));
        },
        (error) => {
          console.log(error);
          alert("Unable to retrieve quotes. Please try again later.")
        }
      )
  }
}

const store = createStore(
  quotesReducer,
  applyMiddleware(thunk)
);

// React-Redux

const mapStateToProps = (state) => {
  return { quotes: state }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuotes: () => {
      addAsyncQuotes()(dispatch);
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
    this.displayNewQuote = this.displayNewQuote.bind(this);
    this.requestNewQuote = this.requestNewQuote.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.displayNewQuote(newProps);
  }

  componentDidMount() {
    this.props.fetchQuotes();
  }

  requestNewQuote() {
    this.displayNewQuote();
  }

  getNextQuoteIndex() {
    let finalIndex = 0;
    this.props.quotes.find((element, index) => {
      finalIndex = index;
      if (element.quote == this.state.currentQuote.quote) {
        finalIndex = index;
        return true;
      } else {
        return false;
      }
    })
    return finalIndex + 1;
  }

  displayNewQuote(props = this.props) {
    let quotes = props.quotes;
    let randomIndex = this.state.currentQuote.hasOwnProperty('quote') ? this.getNextQuoteIndex() : 0;
    this.setState({
      currentQuote: quotes[randomIndex]
    })
  }

  render() {
    let randomQuote = this.state.currentQuote;
    let quote = randomQuote.quote;
    let author = randomQuote.author;

    let tweet = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + quote + '" ' + author);

    return (
      <div className="App">
        <div className="App-wrapper">
          <div id="quote-box">
            <QuoteComponent quote={quote} author={author} />

            <div id="buttons">
              <a href={tweet} target="_blank">
                <button title="Tweet this quote" type="button" className="button" id="tweet-quote">
                  <i className="fab fa-twitter"></i> Tweet
            </button>
              </a>
              <button title="Get next quote" type="button" className="button" id="new-quote" onClick={this.requestNewQuote} >New Quote</button>
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

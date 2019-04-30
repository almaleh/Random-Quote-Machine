import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware} from 'redux'

// Redux
const ADD_QUOTE ='ADD_QUOTE'; 
const quotesReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_QUOTE:
      return [...state, action.quote]; 
      default: 
      return state; 
  }
}

const addQuote = (quote) => {
  return {
    type: ADD_QUOTE,
    quote
  }
}

const store = createStore(quotesReducer); 

// React-Redux

const mapStateToProps = (state) => {
  return { quotes: state }
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitNewQuote: (quote) => {
      dispatch(addQuote(quote));
    }
  }
}

// React

class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    }
    this.submitQuote = this.submitQuote.bind(this); 
  }

  submitQuote() {
    this.props.submitNewQuote("This is a quote")
  }

  render() {
    let quotes = this.props.quotes.map( (quote, index) => {
      return (
        <p key={index}>{quote}</p>
      )
      })
    console.log(this.props.quotes)
    return(
      <div className="App">
      <header className="App-header">
        
      </header>
    </div>
    )
  }
}


function App() {
  return (        
    <Provider store={store}>
      <Container/>
    </Provider>
  );
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational)



export default App;

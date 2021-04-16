import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import './App.css';
function App() {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [guess, setGuess] = useState('');
  const [correctGuess, setCorrectGuess] = useState(null);
  const [value, setValue] = useState('');

  const newQuestion = async () => {
    const res = await axios.get('http://jservice.io/api/random');
    // const res = await axios.get('http://jservice.io/api/clues?offset=61971');
    const data = await res.data[0];
    const categoryName = await axios.get(`http://jservice.io/api/category?id=${data.category_id}`);
    const fixed = await fixCategory(categoryName.data.title);
    setGuess('');
    setCorrectGuess(null);
    setCategory(fixed);
    setQuestion(data.question);
    setAnswer(data.answer);
    setValue(data.value);
  };

  const fixCategory = (data) => {
    const splitCategory = data.split(' ');
    const joinCategory = splitCategory.map((item) => {
      return item[0].toUpperCase().concat(item.slice(1));
    });
    const fixCategory = joinCategory.join(' ');
    return fixCategory;
  };

  const fixAnswer = () => {
    if (answer !== '') {
      const firstLetter = answer[0].toUpperCase();
      // const start = firstLetter;
      return `${firstLetter}${answer.slice(1)}`;
    } else return answer;
  };

  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  const checkGuess = (e) => {
    e.preventDefault();
    if (guess !== '' && answer.toLowerCase().includes(guess.toLowerCase())) {
      setCorrectGuess(true);
    } else {
      setGuess('');
      setCorrectGuess(false);
      setTimeout(() => setCorrectGuess(null), 3000);
    }
    e.currentTarget.blur();
  };

  useEffect(
    () => {
      newQuestion();
    },
    // eslint-disable-next-line
    []
  );

  return (
    <div className="App">
      <h1>Let's Play Jeopardy!</h1>
      <span>
        These are actual categories and questions taken from the TV show Jeopardy! See what answers
        you know.
      </span>
      <Card>
        <CardTitle>
          <span>{`Category: ${category}`}</span>
          <span>{`${value} pts`}</span>
        </CardTitle>
        <div>
          <span>{question}</span>
        </div>
      </Card>
      <form>
        <label>
          <Input type="text" value={guess} onChange={handleInputChange} placeholder="Your Answer" />
        </label>
        <Button onClick={(e) => checkGuess(e)} type="button">
          Submit
        </Button>
      </form>
      <Button onClick={() => newQuestion()} type="button">
        New Question
      </Button>
      {correctGuess === true ? (
        <AnswerCard>
          <span>Correct</span>
          <br />
          <span>{fixAnswer()}</span>
        </AnswerCard>
      ) : correctGuess === false ? (
        <p>Try Again!</p>
      ) : null}
    </div>
  );
}

export default App;

const Card = styled.div`
  margin: 1.5rem;
  min-height: 150px;
  width: 450px;
  div:first-child {
    background: #fafafa;
    border-bottom: 2px solid lightgray;
    border-radius: 1rem 1rem 0 0;
    padding: 0.5rem 1rem;
    margin: 0;
    font-weight: 500;
    box-shadow: 0 0.25rem 0.5rem gray;
  }
  div:last-child {
    box-shadow: 0 0.25rem 0.5rem gray;
    background: #fafafa;
    border-radius: 0 0 1rem 1rem;
    padding: 1rem;
    margin: 0;
    height: auto;
  }
`;

const CardTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Input = styled.input`
  outline: none;
  border: 1px solid lightblue;
  padding: 0.5rem;
  border-radius: 0.25rem;
  &:focus {
    border: 1px solid gray;
  }
`;

const Button = styled.button`
  outline: none;
  border: 1px solid lightblue;
  margin: 1rem 0 0;
  padding: 0.5rem;
  background: #fafafa;
  border-radius: 0.25rem;
  &:hover {
    cursor: pointer;
    background: lightgray;
    border: 1px solid gray;
  }
  &:focus {
    border: 1px solid darkgray;
  }
`;

const AnswerCard = styled.div`
  margin: 1rem;
`;

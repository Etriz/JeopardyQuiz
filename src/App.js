import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import './App.css';
function App() {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  // const [value, setValue] = useState('');

  const newQuestion = async () => {
    // const res = await axios.get('http://jservice.io/api/random');
    const res = await axios.get('http://jservice.io/api/clues?offset=61971');
    const data = await res.data[0];
    const categoryName = await axios.get(`http://jservice.io/api/category?id=${data.category_id}`);
    const fixed = await fixCategory(categoryName.data.title);
    setCategory(fixed);
    setQuestion(data.question);
    setAnswer(data.answer);
    // setValue(data.value);
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
      const firstLetter = answer[0];
      const start = firstLetter.toUpperCase();
      return `${start}${answer.slice(1)}`;
    } else return answer;
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
      <Card>
        {category ? <h3>{`Category: ${category}`}</h3> : null}
        <p>{question}</p>
      </Card>
      <form>
        <label>
          <input type="text" placeholder="Your Answer"></input>
        </label>
        <button>Submit</button>
      </form>
      <button onClick={() => newQuestion()}>New Question</button>
      <p>{fixAnswer()}</p>
    </div>
  );
}

export default App;

const Card = styled.div`
  /* border: 1px solid lightgray; */
  border-radius: 1rem;
  box-shadow: 0 0.25rem 0.5rem gray;
  padding: 0.5rem 1rem;
  margin: 1rem;
  max-width: 450px;
`;

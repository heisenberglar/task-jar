import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Finder from '../components/sections/Finder';
import '@testing-library/jest-dom/extend-expect';

const collections = [
  {
    id: 0,
    name: '5 minutes',
    tasks: [
      {name: 'Full body stretch', id: 1},
    ]
  },
  {
    id: 1,
    name: '15 minutes',
    tasks: [
      {name: 'Go for a walk', id: 4},
      {name: 'Journal', id: 5},
    ]
  }
]

test('Shows that the heading is changed from the prompt to a new task', () => {
  render(<Finder hidden={true} setHidden={jest.fn()} collections={collections}/>);
  const heading = screen.getByRole('heading', {level: 1})
  expect(heading).toHaveTextContent("Lost, overwhelmed, or just... bored?")

  fireEvent.click( screen.getByRole('button'))

  // expect(heading).toHaveTextContent("Lost, overwhelmed, or just... bored?")
  expect(heading).not.toHaveTextContent("Lost, overwhelmed, or just... bored?")
});
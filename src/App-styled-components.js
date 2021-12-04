import React, { useState } from 'react'
import {
	Switch, Route, Link,
	useHistory, useRouteMatch
} from "react-router-dom"
import { useField } from './hooks'
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer2 = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <Navigation>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </Navigation>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
				<li key={anecdote.id} >
					<Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
				</li>
			)}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => {
	return (
		<div>
			<h2>{anecdote.content} by {anecdote.author}</h2>
			<p>has {anecdote.votes} votes</p>
			<p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
		</div>
	)
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <Footer2>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </Footer2>
)

const CreateNew = (props) => {
  // const [content, setContent] = useState('')
  // const [author, setAuthor] = useState('')
  // const [info, setInfo] = useState('')
	const history = useHistory()

	const content = useField('text')
	const author = useField('text')
	const info = useField('text')


  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
		props.setNotification(`a new anecdote ${content.value} created!`)
		setTimeout(() => props.setNotification(''), 10000)
		history.push('/')
  }

	const reset = () => {
		content.reset()
		author.reset()
		info.reset()
	}

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <Input {...content} reset='1'/>
        </div>
        <div>
          author
          <Input {...author} reset='1'/>
        </div>
        <div>
          url for more info
          <Input {...info} reset='1'/>
        </div>
        <Button>create</Button>
				<Button type="button" onClick={reset}>reset</Button>
			</form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState('')

	const match = useRouteMatch('/anecdotes/:id')
	const anecdote = match 
		? anecdotes.find(anecdote => anecdote.id === match.params.id)
		: null
	
  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
			<Page>
				<h1>Software anecdotes</h1>
				<Menu />
				{notification}
				<Switch>
					<Route path="/create">
						<CreateNew addNew={addNew} setNotification={setNotification} />
					</Route>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/anecdotes/:id">
						<Anecdote anecdote={anecdote} />
					</Route>
					<Route path="/">
						<AnecdoteList anecdotes={anecdotes} />
					</Route>
				</Switch>
				<Footer />
			</Page>
  )
}

export default App;
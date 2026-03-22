import { useEffect, useMemo, useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  ThemeProvider,
  createTheme,
} from '@mui/material'

const theme = createTheme()

type PostItem = {
  id: number
  title: string
  body: string
  userId: number
}

function App() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchId, setSearchId] = useState('')
  const [displayedPosts, setDisplayedPosts] = useState<PostItem[]>([])

  const isEditing = editId !== null

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data: PostItem[] = await response.json()
        setPosts(data)
        setDisplayedPosts(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const createPost = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), body: body.trim(), userId: 1 }),
    })
    if (!response.ok) throw new Error('Create failed')
    const created: PostItem = await response.json()
    setPosts((prev) => [created, ...prev])
    setDisplayedPosts((prev) => [created, ...prev])
  }

  const updatePost = async (id: number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: title.trim(), body: body.trim(), userId: 1 }),
    })
    if (!response.ok) throw new Error('Update failed')
    const updated: PostItem = await response.json()
    setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)))
    setDisplayedPosts((prev) => prev.map((post) => (post.id === id ? updated : post)))
    setEditId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError(null)

    try {
      if (isEditing && editId !== null) {
        await updatePost(editId)
      } else {
        await createPost()
      }

      setTitle('')
      setBody('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post: PostItem) => {
    setEditId(post.id)
    setTitle(post.title)
    setBody(post.body)
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      setPosts((prev) => prev.filter((post) => post.id !== id))
      setDisplayedPosts((prev) => prev.filter((post) => post.id !== id))
      if (editId === id) {
        setEditId(null)
        setTitle('')
        setBody('')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPostById = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      if (!response.ok) throw new Error('Post not found')
      const post: PostItem = await response.json()
      setPosts((prev) => {
        const exists = prev.some((p) => p.id === id)
        return exists ? prev : [post, ...prev]
      })
      setDisplayedPosts((prev) => {
        const exists = prev.some((p) => p.id === id)
        return exists ? prev : [post, ...prev]
      })
      setSearchId('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const trimmed = searchId.trim()
    if (!trimmed) {
      setError('Please enter a search term')
      return
    }
    const id = parseInt(trimmed)
    if (!isNaN(id) && id > 0) {
      // search by id
      fetchPostById(id)
    } else {
      // search by title
      const filtered = posts.filter(post => post.title.toLowerCase().includes(trimmed.toLowerCase()))
      setDisplayedPosts(filtered)
      setSearchId('')
      setError(null)
    }
  }

  const handleClearSearch = () => {
    setDisplayedPosts(posts)
    setSearchId('')
    setError(null)
  }

  const totalPosts = useMemo(() => displayedPosts.length, [displayedPosts])

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          JSONPlaceholder CRUD Practice
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total posts: {totalPosts}
        </Typography>

        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'flex-end' }}>
          <TextField
            label="Search Post by ID or Title"
            value={searchId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
            placeholder="Enter post ID (number) or title (text)"
            fullWidth
            variant="outlined"
          />
          <Button variant="contained" onClick={handleSearch} disabled={loading}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleClearSearch} disabled={loading}>
            Clear
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Title"
            required
            fullWidth
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            label="Body"
            value={body}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBody(e.target.value)}
            placeholder="Body"
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {isEditing ? 'Update' : 'Create'} Post
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="outlined"
                disabled={loading}
                onClick={() => {
                  setEditId(null)
                  setTitle('')
                  setBody('')
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>

        <List>
          {displayedPosts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No posts available
            </Typography>
          ) : (
            displayedPosts.map((post) => (
              <Card key={post.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.body}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEdit(post)} disabled={loading}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(post.id)} disabled={loading}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </List>
      </Container>
    </ThemeProvider>
  )
}

export default App


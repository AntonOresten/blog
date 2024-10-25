import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import { theme } from '../styles/theme'

export function BlogPost({ posts }) {
  const { slug } = useParams()
  const post = posts.find(p => p.path === slug)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div>
      <Link 
        to="/"
        className={`inline-block mb-8 ${theme.text.link}`}
      >
        ← Back
      </Link>
      <article className={theme.prose}>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
      </article>
    </div>
  )
}

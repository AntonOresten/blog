import { useState, useEffect } from 'react'
import { marked } from 'marked'
import katex from 'katex'
import 'katex/dist/katex.min.css'

function App() {
  const [posts, setPosts] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [selectedTag, setSelectedTag] = useState('all')

  // Configure marked for math
  marked.use({
    extensions: [{
      name: 'math',
      level: 'inline',
      start(src) { return src.indexOf('$') },
      tokenizer(src) {
        const match = src.match(/^\$([^\n$]*?)\$/)
        if (match) {
          return {
            type: 'math',
            raw: match[0],
            text: match[1].trim()
          }
        }
      },
      renderer(token) {
        try {
          return katex.renderToString(token.text, {
            throwOnError: false,
            displayMode: false
          })
        } catch (err) {
          console.error('KaTeX error:', err)
          return token.raw
        }
      }
    }, {
      name: 'math_block',
      level: 'block',
      start(src) { return src.indexOf('$$') },
      tokenizer(src) {
        const match = src.match(/^\$\$([\s\S]*?)\$\$/)
        if (match) {
          return {
            type: 'math_block',
            raw: match[0],
            text: match[1].trim()
          }
        }
      },
      renderer(token) {
        try {
          return `<div class="math-block">${
            katex.renderToString(token.text, {
              throwOnError: false,
              displayMode: true
            })
          }</div>`
        } catch (err) {
          console.error('KaTeX error:', err)
          return token.raw
        }
      }
    }]
  })

  useEffect(() => {
    const postFiles = import.meta.glob('./posts/*.md', { 
      query: '?raw',
      import: 'default'
    })
    
    Promise.all(
      Object.entries(postFiles).map(async ([path, loader]) => {
        const content = await loader()
        const [, frontMatter, markdown] = content.split('---')
        
        const metadata = Object.fromEntries(
          frontMatter.trim().split('\n').map(line => {
            const [key, ...value] = line.split(':')
            return [key.trim(), value.join(':').trim()]
          })
        )

        // Add preview text - first 150 characters of the markdown content
        const preview = markdown.trim().slice(0, 150) + '...'
        
        // Convert tags string to array and trim whitespace
        const tags = metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : []

        return {
          ...metadata,
          content: markdown,
          preview,
          tags,
          path: path.replace('./posts/', '').replace('.md', '')
        }
      })
    ).then(loadedPosts => {
      setPosts(loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })
  }, [])

  // Get unique tags from all posts
  const allTags = ['all', ...new Set(posts.flatMap(post => post.tags))]

  // Filter posts based on selected tag
  const filteredPosts = selectedTag === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag))

  return (
    <div className="min-h-screen bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          {currentPost ? (
            <div>
              <button 
                onClick={() => setCurrentPost(null)}
                className="mb-8 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <span>←</span>
                <span>Back</span>
              </button>
              <article className="prose prose-lg max-w-none
                prose-headings:font-extrabold 
                prose-h1:text-4xl prose-h2:text-3xl
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-md
              ">
                <h1>{currentPost.title}</h1>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: marked(currentPost.content) 
                  }} 
                />
              </article>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-12 border-b pb-4">
                <h1 className="text-4xl font-bold text-gray-800">Writings</h1>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-8">
                {filteredPosts.map(post => (
                  <button
                    key={post.path}
                    onClick={() => setCurrentPost(post)}
                    className="block text-left w-full group"
                  >
                    <div className="border border-gray-200 rounded-lg p-6 
                      hover:border-blue-300 hover:shadow-lg transition-all duration-300 ease-in-out
                      hover:scale-[1.02] hover:bg-gray-50"
                    >
                      <h2 className="text-2xl font-bold text-gray-800 
                        group-hover:text-blue-600 mb-3 transition-colors duration-300"
                      >
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4">{post.preview}</p>
                      <div className="flex items-center gap-4">
                        <time className="text-sm text-gray-500 font-medium">
                          {new Date(post.date).toLocaleDateString()}
                        </time>
                        <div className="flex gap-2">
                          {post.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

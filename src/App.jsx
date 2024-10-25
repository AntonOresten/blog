import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { marked } from 'marked'
import { BlogList } from './components/BlogList'
import { BlogPost } from './components/BlogPost'
import katex from 'katex'
import 'katex/dist/katex.min.css'  // Important: Add this import

function App() {
  const [posts, setPosts] = useState([])
  const [selectedTag, setSelectedTag] = useState('Filter by tag')

  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true
    });

    marked.use({
      extensions: [{
        name: 'math_block',
        level: 'block',
        start(src) { return src.match(/^\$\$/)?.index },
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
          return katex.renderToString(token.text, {
            displayMode: true,
            throwOnError: false
          })
        }
      }, {
        name: 'math_inline',
        level: 'inline',
        start(src) { return src.indexOf('$') },
        tokenizer(src) {
          const match = src.match(/^\$([^\n$]*?)\$/)
          if (match) {
            const prev = src.charAt(match.index - 1)
            if (prev && prev !== ' ') return

            return {
              type: 'math_inline',
              raw: match[0],
              text: match[1].trim()
            }
          }
        },
        renderer(token) {
          return katex.renderToString(token.text, {
            displayMode: false,
            throwOnError: false
          })
        }
      }]
    });
  }, []);

  useEffect(() => {
    const postFiles = import.meta.glob('./posts/*.md', { 
      eager: true,
      import: 'default',
      query: '?raw'
    })
    
    const getPreview = (markdown) => {
      // Split into blocks (paragraphs, equations, etc.)
      const blocks = markdown.split('\n\n')
      let preview = ''
      let length = 0
      const targetLength = 150

      // Add blocks until we exceed target length
      for (const block of blocks) {
        // Skip if it's a LaTeX block
        if (block.includes('\\begin{') || block.includes('$$')) {
          // If it's the first block, include it
          if (preview === '') {
            return marked(block)
          }
          break
        }

        const nextLength = length + block.length
        if (nextLength > targetLength && preview !== '') {
          break
        }

        preview += (preview ? '\n\n' : '') + block
        length = nextLength
      }

      // If preview is empty (e.g., only had LaTeX blocks), take first block
      if (!preview) {
        preview = blocks[0]
      }

      return marked(preview + (blocks.length > 1 ? '...' : ''))
    }

    const loadedPosts = Object.entries(postFiles).map(([path, content]) => {
      const [, frontMatter, markdown] = content.split('---')
      
      const metadata = Object.fromEntries(
        frontMatter.trim().split('\n').map(line => {
          const [key, ...value] = line.split(':')
          return [key.trim(), value.join(':').trim()]
        })
      )

      return {
        ...metadata,
        content: markdown,
        preview: getPreview(markdown.trim()),
        tags: metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [],
        path: path.replace('./posts/', '').replace('.md', '')
      }
    })

    setPosts(loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }, [])

  return (
    <BrowserRouter basename="/blog/">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Routes>
              <Route 
                path="/" 
                element={
                  <BlogList 
                    posts={posts} 
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                  />
                } 
              />
              <Route 
                path="/posts/:slug" 
                element={<BlogPost posts={posts} />} 
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App

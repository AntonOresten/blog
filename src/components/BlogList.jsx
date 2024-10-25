import { Link } from 'react-router-dom'
import { theme } from '../styles/theme'
import { marked } from 'marked'

export function BlogList({ posts, selectedTag, setSelectedTag }) {
  const allTags = ['all', ...new Set(posts.flatMap(post => post.tags))]
  const filteredPosts = selectedTag === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag))

  return (
    <div>
      <div className="flex justify-between items-center mb-12 border-b pb-4">
        <h1 className={theme.text.title}>Writings</h1>
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
          <Link
            key={post.path}
            to={`/posts/${post.path}`}
            className="block text-left w-full group"
          >
            <div className="border border-gray-200 rounded-lg p-6 
              hover:border-blue-300 hover:shadow-lg transition-all duration-300 ease-in-out
              hover:scale-[1.02] hover:bg-gray-50"
            >
              <h2 className={`${theme.text.subtitle} group-hover:text-blue-600 mb-3 transition-colors duration-300`}>
                {post.title}
              </h2>
              <div 
                className={`${theme.text.body} mb-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-12 after:bg-gradient-to-t after:from-white after:to-transparent`}
              >
                <div dangerouslySetInnerHTML={{ 
                  __html: marked(post.preview) 
                }} />
              </div>
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

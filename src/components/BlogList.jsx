import { Link } from 'react-router-dom'
import { theme } from '../styles/theme'

export function BlogList({ posts, selectedTag, setSelectedTag }) {
  const allTags = ['Filter by tag', ...new Set(posts.flatMap(post => post.tags))]
  const filteredPosts = selectedTag === 'Filter by tag' 
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
              {tag.charAt(0) + tag.slice(1)}
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
              
              <div className="relative h-[120px] overflow-hidden">
                <div 
                  className={theme.text.body}
                  dangerouslySetInnerHTML={{ 
                    __html: post.preview 
                  }} 
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
              </div>

              <div className="mt-4 flex items-center gap-4">
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
          </Link>
        ))}
      </div>
    </div>
  )
}

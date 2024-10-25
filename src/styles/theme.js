export const theme = {
  fonts: {
    heading: 'Montserrat',
    body: 'Inter',
  },
  prose: [
    'prose prose-lg max-w-none',
    'prose-headings:font-["Montserrat"] prose-headings:font-bold',
    'prose-h1:text-4xl',
    'prose-h2:text-3xl',
    'prose-h3:text-2xl',
    'prose-p:font-["Inter"] prose-p:text-gray-700 prose-p:leading-relaxed',
    'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
    'prose-img:rounded-lg prose-img:shadow-md'
  ].join(' '),
  text: {
    title: 'text-4xl font-bold text-gray-800 font-["Montserrat"]',
    subtitle: 'text-2xl font-bold text-gray-800 font-["Montserrat"]',
    body: 'text-gray-600 font-["Inter"]',
    link: 'text-blue-500 hover:text-blue-700 font-["Inter"]',
  }
}

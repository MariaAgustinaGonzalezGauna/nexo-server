export const data = {
  url: process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.SERVER_URL
}

export default data
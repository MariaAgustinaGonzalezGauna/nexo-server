export const data = {}

if(process.env.NODE_ENV === 'development') {
    data.url = 'http://localhost:5000'
}

data.url = process.env.SERVER_URL

export default data
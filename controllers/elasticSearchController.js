const { Client } = require('@elastic/elasticsearch')
const elasticSearch = new Client({ node: 'http://localhost:9200' });

const basicSearch = (req, res) => {
    return res.json({ Message: 'Basic Search' })
}

module.exports = basicSearch
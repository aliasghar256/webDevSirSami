const { Client } = require('@elastic/elasticsearch')
const elasticSearch = new Client({ node: 'http://localhost:9200' });
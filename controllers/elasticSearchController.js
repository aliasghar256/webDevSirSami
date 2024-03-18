const { Client } = require('@elastic/elasticsearch')
const elasticSearch = new Client({ node: 'http://localhost:9200' });

const basicSearch = async (req, res) => {
    try {
      // Extract query parameters for basic search
      const { searchTerm } = req.query;
  
      // Optional: Validate searchTerm (if necessary)
  
      // Build a query object based on the search term
      const query = { $text: { $search: searchTerm } };  // Full-text search using $text
  
      // Execute the search using Mongoose's find() method
      const judgments = await judgmentmodel.find(query);
  
      // Return the search results
      return res.json(judgments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error occurred during search' });
    }
  };

module.exports = basicSearch
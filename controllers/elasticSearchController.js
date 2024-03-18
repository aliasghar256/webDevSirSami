const { Client } = require('@elastic/elasticsearch')
const elasticSearch = new Client({ node: 'http://localhost:9200' });

const basicSearch = async (req, res) => {
    try {
      // Extract query parameters for basic search, pagination, and sorting
      const { searchTerm, page = 1, limit = 10, sortBy = 'JudgmentID', sortOrder = 'asc' } = req.query;
  
      // Optional: Validate searchTerm, sortBy, and sortOrder (if necessary)
  
      // Build a query object based on the search term
      const query = { $text: { $search: searchTerm } };
  
      // Sanitize and validate sorting criteria (important for security)
      const validSortFields = ['JudgmentID', 'CaseYear', /* Add other allowed fields */];
      const validSortOrders = ['asc', 'desc'];
  
      if (!validSortFields.includes(sortBy)) {
        return res.status(400).json({ message: 'Invalid sort field provided' });
      }
  
      if (!validSortOrders.includes(sortOrder)) {
        return res.status(400).json({ message: 'Invalid sort order provided' });
      }
  
      // Create sort object based on sanitized parameters
      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  
      // Pagination options
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
      };
  
      // Execute the paginated search using Mongoose's find() with pagination options
      const judgments = await judgmentmodel.find(query, null, options);
      const total = await judgmentmodel.countDocuments(query);
  
      // Return the search results with pagination information
      return res.json({
        judgments,
        pagination: {
          total,
          page: options.page,
          limit: options.limit,
          totalPages: Math.ceil(total / options.limit),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error occurred during search' });
    }
  };

module.exports = basicSearch
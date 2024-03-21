const express = require('express')
const judgmentmodel = require('../models/judgmentModel')

const judgmentIdSearch = async (req, res) => {
    try {
        const id = Number(req.headers.searchvalue)
        const judgmentFound = await judgmentmodel.findOne({ JudgmentID: id })
        if (judgmentFound) return res.status(200).json({ Message: "Judgment Found", judgment: judgmentFound })

        return res.status(404).json({ Message: "Error! Judgment not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })

    }
}

const judgmentValueSearch = async (req, res) => {
    try {
        const searchValue = req.headers.searchvalue
        const judgmentFound = await judgmentmodel.find({ JudgmentText: searchValue })
        if (!judgmentFound) return res.status(404).json({ Message: "Error! Judgment not found" })

        return res.status(200).json({ Message: "Judgment(s) Found", judgment: judgmentFound })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

const caseYearSearch = async (req, res) => {
  try {
    const year = Number(req.headers.searchValue);
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sort: { CaseYear: 1 },
    };

    const judgments = await judgmentmodel.paginate({ CaseYear: year }, options);
    const totalPages = Math.ceil(judgments.totalDocs / options.limit);

    return res.status(200).json({ ...judgments, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};



const basicSearch = async (req, res) => {
   // return res.status(200).json({ message: "Basic Search" })
    try {
      // Extract query parameters for basic search, pagination, and sorting
      const { searchTerm, page = 1, limit = 10, sortBy = 'JudgmentID', sortOrder = 'asc' } = req.query;
  
      // Optional: Validate searchTerm, sortBy, and sortOrder (if necessary)
  
      // Build a query object based on the search term
      const query = { $text: { $search: searchTerm } };
      //const query = await judgmentmodel.find({ JudgmentText: searchValue })
  
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
      return res.status(500).json({ message: 'Error occurred during search' });
    }
  };

module.exports = { judgmentIdSearch, judgmentValueSearch, basicSearch, caseYearSearch}
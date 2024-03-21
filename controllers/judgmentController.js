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

const partySearch = async (req, res) => {
  try {
    const searchValue = req.query.searchValue;
    const query = {
      $or: [
        { Party1: { $regex: searchValue, $options: 'i' } },
        { Party2: { $regex: searchValue, $options: 'i' } },
      ],
    };
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const judgments = await judgmentmodel.paginate(query, options);
    const totalPages = Math.ceil(judgments.totalDocs / options.limit);

    return res.status(200).json({ ...judgments, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};

const benchSearch = async (req, res) => {
  try {
    const searchValue = req.query.searchValue;
    const query = { Bench: { $regex: searchValue, $options: 'i' } }; // Case-insensitive search
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const judgments = await judgmentmodel.paginate(query, options);
    const totalPages = Math.ceil(judgments.totalDocs / options.limit);

    return res.status(200).json({ ...judgments, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};

const caseNoSearch = async (req, res) => {
  try {
    const searchValue = req.query.searchValue;
    const query = { CaseNo: { $regex: searchValue, $options: 'i' } }; // Case-insensitive search
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const judgments = await judgmentmodel.paginate(query, options);
    const totalPages = Math.ceil(judgments.totalDocs / options.limit);

    return res.status(200).json({ ...judgments, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};

const judgeIdSearch = async (req, res) => {
  try {
    const id = Number(req.query.searchValue);
    const query = { JudgeID: id };
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const judgments = await judgmentmodel.paginate(query, options);
    const totalPages = Math.ceil(judgments.totalDocs / options.limit);

    return res.status(200).json({ ...judgments, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};


const judgementMultiSearch = async (req, res) => {
  try {
    const { searchValue, ...filters } = req.query; // Destructure query params

    // Build the query object based on provided filters
    const query = {};
    for (const key in filters) {
      if (filters[key]) { // Check if filter value exists
        query[key] = { $regex: searchValue || '', $options: 'i' }; // Case-insensitive search
      }
    }

    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };

    const judgments = await judgmentmodel.paginate(query, options);
    const totalPages = Math.ceil(judgments.totalDocs / options.limit);

    return res.status(200).json({ ...judgments, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};


module.exports = { judgmentIdSearch, judgmentValueSearch, caseYearSearch, partySearch, caseNoSearch, benchSearch, judgeIdSearch, judgementMultiSearch}
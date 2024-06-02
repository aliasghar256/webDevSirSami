const express = require('express')
const judgmentmodel = require('../models/judgmentModel')

//Default search is a Judgment Keyword Search, Alternatively we have ID searches & other search options

const judgmentIdSearch = async (req, res) => {
    try {
        const id = Number(req.query.JudgmentID)
        const judgmentFound = await judgmentmodel.findOne({ JudgmentID: id })
        if (judgmentFound) return res.status(200).json({ Message: "Judgment Found", judgment: judgmentFound })

        return res.status(404).json({ Message: "Error! Judgment not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

const judgmentAdvancedSearch = async (req, res) => {
  try {
    const { 
        keyword, 
        court, 
        judgeName, 
        lawyerName, 
        appellantOpponent, 
        section, 
        actOrdinance, 
        rule 
    } = req.query;

    let query = {};

    if (keyword) {
        query.$or = [
            { Party1: new RegExp(keyword, 'i') },
            { Party2: new RegExp(keyword, 'i') },
            { JudgmentText: new RegExp(keyword, 'i') }
        ];
    }

    // if (judgeName) {
    //     query.JudgeID = judgeName; // Assuming JudgeID refers to judgeName
    // }

    if (court) {
        query.Bench = court;
    }

    // if (lawyerName) {
    //     query.$or = [
    //         { Party1: new RegExp(lawyerName, 'i') },
    //         { Party2: new RegExp(lawyerName, 'i') }
    //     ];
    // }

    if (appellantOpponent) {
        query.$or = [
            { Party1: new RegExp(appellantOpponent, 'i') },
            { Party2: new RegExp(appellantOpponent, 'i') }
        ];
    }

    if (section) {
        query.Section = section;
    }

    if (actOrdinance) {
        query.ActOrdinance = actOrdinance;
    }

    if (rule) {
        query.Rule = rule;
    }

    const results = await judgmentmodel.find(query).exec();
    res.json(results);
} catch (error) {
    res.status(500).send(error.message);
}
}

const judgmentKeywordSearch = async (req, res) => {
  try {
      // Retrieve the search keyword from the headers
      const searchValue = req.query.query;

      // Use a case-insensitive regex search for broader matching
      const regex = new RegExp(searchValue, 'gi'); 

      // Find documents where JudgmentText contains the search keyword
      const judgments = await judgmentmodel.find({ JudgmentText: { $regex: regex } }, 
          'JudgmentID CaseYear Party1 Party2 JudgeID CaseNo JudgmentText');

      // Check if any judgments were found
      if (judgments.length === 0) {
          return res.status(404).json({ Message: "Error! Judgment not found" });
      }

      // Process each judgment to extract snippets and indexes
      const results = judgments.map(judgment => {
          const indexes = [];
          let match;

          // Find all matches and their indexes
          while ((match = regex.exec(judgment.JudgmentText)) !== null) {
              indexes.push(match.index);
          }

          // Determine snippet extraction
          const firstIndex = indexes[0];
          const start = Math.max(0, firstIndex - 120); // Adjust start to not be negative
          const end = Math.min(judgment.JudgmentText.length, firstIndex + 120 + searchValue.length); // Adjust end to not exceed text length

          const snippet = judgment.JudgmentText.substring(start, end);

          // Return judgment details along with the snippet and indexes
          return {
              JudgmentID: judgment.JudgmentID,
              CaseYear: judgment.CaseYear,
              Party1: judgment.Party1,
              Party2: judgment.Party2,
              JudgeID: judgment.JudgeID,
              CaseNo: judgment.CaseNo,
              snippet,
              indexes
          };
      });

      // Return the processed results
      return res.status(200).json({ Message: "Judgment(s) Found", results });
  } catch (error) {
      return res.status(500).json({ message: "Error! " + error.message });
  }
}



const caseYearSearch = async (req, res) => {
  try {
    const year = Number(req.headers.searchValue);
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sort: { CaseYear: 1 },
      select: 'CaseYear -JudgmentText', // Add all fields you want to retrieve here
    };

    // Using aggregate with mongoose-paginate-v2 to trim JudgmentText
    const aggregate = judgmentmodel.aggregate([
      { $match: { CaseYear: year } },
      {
        $project: {
          JudgmentTextSnippet: { $substr: ["$JudgmentText", 0, 240] },
          // include all other fields you want to return here
        }
      }
    ]);

    const judgments = await judgmentmodel.aggregatePaginate(aggregate, options);
    const totalPages = Math.ceil(judgments.totalDocs / options.limit);

    return res.status(200).json({ ...judgments, totalPages });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};


const partySearch = async (req, res) => {
  try {
    const searchValue = req.query.searchValue;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      // You might want to add other options here
    };

    const aggregateQuery = judgmentmodel.aggregate([
      {
        $match: {
          $or: [
            { Party1: { $regex: searchValue, $options: 'i' } },
            { Party2: { $regex: searchValue, $options: 'i' } },
          ],
        },
      },
      {
        $project: {
          Party1: 1,
          Party2: 1,
          JudgmentTextSnippet: { $substr: ["$JudgmentText", 0, 240] },
          // include other fields if needed
        },
      },
    ]);

    const result = await judgmentmodel.aggregatePaginate(aggregateQuery, options);
    const totalPages = Math.ceil(result.totalDocs / options.limit);

    return res.status(200).json({ ...result, totalPages });
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


module.exports = { judgmentIdSearch, judgmentKeywordSearch, caseYearSearch, partySearch, caseNoSearch, benchSearch, judgeIdSearch, judgementMultiSearch,judgmentAdvancedSearch}
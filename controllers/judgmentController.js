const express = require('express')
const judgmentmodel = require('../models/judgmentModel')

//Default search is a Judgment Keyword Search, Alternatively we have ID searches & other search options

const judgmentIdSearch = async (req, res) => {
    try {
        const id = Number(req.query.JudgmentID)
        // console.log("Judgment ID from :9 judgController: ", id)
        const judgmentFound = await judgmentmodel.findOne({ JudgmentID: id })
        if (judgmentFound) return res.status(200).json({ Message: "Judgment Found", judgment: judgmentFound })

        return res.status(404).json({ Message: "Error! Judgment not found" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

const judgmentKeywordSearch = async (req, res) => {
  try {
    // Retrieve the search keyword from the headers
    const searchValue = req.header('keyword');
    
    if (!searchValue || searchValue.trim() === "") {
      return res.status(400).json({ Message: "Error! Keyword must be provided" });
    }

    // Retrieve pagination parameters from headers, with defaults
    const page = parseInt(req.header('page')) || 1;
    const limit = parseInt(req.header('limit')) || 10;

    // Use a case-insensitive regex search for broader matching
    const regex = new RegExp(searchValue, 'gi');

    // Perform the search with pagination
    const options = {
      page,
      limit,
      select: 'JudgmentID CaseYear Party1 Party2 JudgeID CaseNo JudgmentText'
    };

    const result = await judgmentmodel.paginate({ JudgmentText: { $regex: regex } }, options);

    // Check if any judgments were found
    if (result.docs.length === 0) {
      return res.status(404).json({ Message: "Error! Judgment not found" });
    }

    // Process each judgment to extract snippets and indexes
    const results = result.docs.map(judgment => {
      const indexes = [];
      let match;

      // Reset the lastIndex to 0 before using exec() in a loop
      regex.lastIndex = 0;

      // Find all matches and their indexes
      while ((match = regex.exec(judgment.JudgmentText)) !== null) {
        indexes.push(match.index);

        // To prevent infinite loop in case of zero-width matches,
        // we manually move the lastIndex forward if the match is zero-width.
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
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

    // Return the processed results along with pagination metadata
    return res.status(200).json({
      Message: "Judgment(s) Found",
      results,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalResults: result.totalDocs
    });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};


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
    } = req.headers;

    console.log("Keyword",keyword)
    console.log("Court",court)
    console.log("JudgeName",judgeName)

    let query = {};

    if (keyword !== "" && keyword !== undefined) {
      query.$or = [
        { Party1: new RegExp(keyword, 'i') },
        { Party2: new RegExp(keyword, 'i') },
        { JudgmentText: new RegExp(keyword, 'i') }
      ];
    }

    if (judgeName !== "" && judgeName !== undefined) {
      query.JudgeID = judgeName; // Assuming JudgeID refers to judgeName
    }

    if (court !== "" && court !== undefined) {
      query.Bench = court;
    }

    if (lawyerName !== "" && lawyerName !== undefined) {
      query.$or = [
        { Lawyer1: new RegExp(lawyerName, 'i') }, // Assuming Lawyer1 is a field in your model
        { Lawyer2: new RegExp(lawyerName, 'i') }  // Assuming Lawyer2 is a field in your model
      ];
    }

    if (appellantOpponent !== "" && appellantOpponent !== undefined) {
      query.$or = [
        { Party1: new RegExp(appellantOpponent, 'i') },
        { Party2: new RegExp(appellantOpponent, 'i') }
      ];
    }

    if (section !== "" && section !== undefined) {
      query.Section = section;
    }

    if (actOrdinance !== "" && actOrdinance !== undefined) {
      query.ActOrdinance = actOrdinance;
    }

    if (rule !== "" && rule !== undefined) {
      query.Rule = rule;
    }

    console.log("Query: ",query);

    const judgments = await judgmentmodel.find(query, 
      'JudgmentID CaseYear Party1 Party2 JudgeID CaseNo JudgmentText'
    ).exec();

    if (judgments.length === 0) {
      return res.status(404).json({ Message: "Error! Judgment not found" });
    }

    const regex = new RegExp(keyword, 'gi');
    const results = judgments.map(judgment => {
      const indexes = [];
      let match;

      while ((match = regex.exec(judgment.JudgmentText)) !== null) {
        indexes.push(match.index);
      }

      const firstIndex = indexes[0];
      const start = Math.max(0, firstIndex - 120);
      const end = Math.min(judgment.JudgmentText.length, firstIndex + 120 + keyword.length);
      const snippet = judgment.JudgmentText.substring(start, end);

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

    return res.status(200).json({ Message: "Judgment(s) Found", results });
  } catch (error) {
    return res.status(500).json({ message: "Error! " + error.message });
  }
};






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

const modifyJudgmentText = async (req, res) => {
  const judgmentid = req.headers.judgmentid;
  const newtext = req.headers.newtext;
  console.log("Req Headers: from controller",req.headers)
  try {
      // Find the user note with the specified judgmentID and userID
      const judgment = await judgmentmodel.findOne({ JudgmentID: judgmentid });
      console.log("judgment: from controller",judgment)

      if (!judgment) {
          return res.status(404).json({ Message: "Error! User note not found" });
      }

      // Update the text value
      judgment.JudgmentText = newtext;

      // Save the updated judgment text
      await judgment.save();

      return res.status(200).json({ Message: "Judgement Modified", judgment: judgment });

  } catch (error) {
      return res.status(500).json({ message: "Error! " + error.message });
  }
};


module.exports = { modifyJudgmentText, judgmentIdSearch, judgmentKeywordSearch, caseYearSearch, partySearch, caseNoSearch, benchSearch, judgeIdSearch, judgementMultiSearch,judgmentAdvancedSearch}
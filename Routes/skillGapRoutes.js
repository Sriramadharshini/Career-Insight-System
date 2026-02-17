const express = require('express');
const router = express.Router();

const skillGapController = require('../Controllers/skillGapController');
const authorization = require('../middleware/authorization');

router.post('/analyze', authorization, async (req, res) => {
  try {
    const email = req.email;

    const SkillGapAnalyzer = require('../ai_agent/skillGapAnalyzer');
    const analyzer = new SkillGapAnalyzer();

    const result = await analyzer.analyze(email);

    res.status(200).json({
      message: "Skill gap analysis success",
      data: result
    });

  } catch (error) {
    console.error("Skill gap route error:", error);
    res.status(500).json({
      error: "Internal server error",
      error_details: error.message
    });
  }
});

module.exports = router;
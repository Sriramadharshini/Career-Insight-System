const SkillGapAnalyzer = require('../ai_agent/skillGapAnalyzer');
const Profile = require('../Models/userprofile');

const analyzer = new SkillGapAnalyzer();
class SkillGapController {
async analyze(req, res) {
    try {
      const email = req.email;
      const aiResponse = await analyzer.analyze(email);

      // Save only roles_for_storage
      await Profile.findOneAndUpdate(
        { created_by: email },
        { $set: { roles_for_storage: aiResponse.roles_for_storage } },
        { new: true }
      );

      // Return only required data
      return res.status(200).json({
        skill_gap_analysis: aiResponse.skill_gap_analysis,
        role_categories: aiResponse.role_categories
      });

    } catch (error) {
      console.error("Skill gap error:", error);
      return res.status(500).json({
        error: "Internal server error",
        error_details: error.message
      });
    }
  }
}

module.exports = new SkillGapController();

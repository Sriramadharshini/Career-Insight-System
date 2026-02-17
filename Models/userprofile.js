const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  created_by: {
    type: String,
    required: true
  },

  career_level: {
    type: String,
    enum: ["Fresher", "Experienced", "Leadership"]
  },

  personal_information: {
    Fullname: { type: String, required: true },
    Location: String,
    PhoneNumber: String,
    EmailAddress: { type: String, required: true },
    LinkedinProfile: String,
    GithubProfile: String,
    Portfoliowebsite: String,
    ProfileVideoUrl: String,
    DateOfBirth: String
  },

  Summary: String,

  skills: {
    type: [String]
  },

  experience: {
    type: 
      {
        position: String,
        company: String,
        location: String,
        start_date: String,
        end_date: String,
        description: [String],
      }
  },

  internships: {
    type: 
      {
        position: String,
        company: String,
        location: String,
        start_date: String,
        end_date: String,
        description: [String],
      }
  },

  projects: {
    type: 
      {
        name: String,
        description: [String],
        prjt_url_or_github_url: String,
        duration: String,
      }
  },

  education: {
    type: 
      {
        degree: String,
        field_of_study: String,
        university: String,
        start_date: String,
        end_date: String,
        cgpa: Number,
      }
  },

  achievements_or_awards: {
    type: [String],
    default: undefined
  },

  certifications: {
    type: 
      {
        name: String,
        issue_date: String,
      }
    
  },

  languages: {
    type: 
      {
        language: String,
        proficiency: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"],
        },
      }
    
  },

  job_preferences: {
    job_type: {
      type: String,
      enum: ["Full-time", "Internship", "Contract"],
    },
    preferred_locations: [String],
    salary_expectation: String,
    preferred_shift: [{
      type: String,
      enum: ['Day', 'Night', 'Flexible']
    }],
  },

}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);

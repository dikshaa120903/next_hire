# Role-Based Resume Scoring System

## Overview

The CareerBoost AI Dashboard now features an intelligent **role-based scoring system** that provides fair evaluation across multiple career paths. Instead of using a single set of keywords optimized for tech roles, the system now:

1. **Auto-detects** your career role from your resume content
2. **Evaluates** your resume using role-specific keywords and criteria
3. **Provides fair scoring** whether you're in tech, management, sales, design, or any other field

---

## Supported Career Roles

The system currently supports scoring for 11 different career domains:

### 1. **Software Engineer** 👨‍💻
**Keywords:** python, java, javascript, typescript, c++, react, django, node.js, api, rest, graphql, microservices, architecture, git, github, docker, kubernetes, ci/cd, agile, scrum

### 2. **Data Scientist** 📊
**Keywords:** python, machine learning, deep learning, tensorflow, pytorch, scikit-learn, pandas, numpy, sql, data analysis, statistics, nlp, computer vision, data mining, predictive modeling, r programming

### 3. **Data Engineer** 🔧
**Keywords:** sql, python, spark, hadoop, etl, data pipeline, kafka, aws, gcp, azure, airflow, docker, java, scala, data warehouse

### 4. **Product Manager** 🎯
**Keywords:** product management, roadmap, user research, stakeholder management, agile, ux design, market analysis, kpi, analytics, metrics, strategic planning, cross-functional, leadership, communication

### 5. **Project Manager** 📋
**Keywords:** project management, pmp, agile, scrum, kanban, jira, scheduling, budget management, risk management, stakeholder, team leadership, timeline, deliverables, communication, planning

### 6. **Management** 👔
**Keywords:** leadership, team management, strategic planning, budget, business development, stakeholder management, mentoring, performance management, organizational, executive, director, manager, communication, negotiation

### 7. **Sales** 💼
**Keywords:** sales, crm, pipeline management, revenue, negotiation, client relationships, business development, territory, forecasting, quota, customer acquisition, sales strategy, deal closure, relationship building

### 8. **Marketing** 📢
**Keywords:** marketing, digital marketing, seo, content marketing, social media, advertising, campaign, brand, analytics, market research, customer acquisition, growth, email marketing, marketing automation, crm

### 9. **Finance** 💰
**Keywords:** accounting, financial analysis, excel, sql, python, finance, audit, budgeting, forecasting, financial modeling, reporting, statements, tax, compliance, risk management, valuation

### 10. **Human Resources** 👥
**Keywords:** human resources, recruitment, talent management, employee engagement, payroll, benefits, training, performance management, organization development, compliance, labor relations, hris, compensation

### 11. **Design** 🎨
**Keywords:** ui design, ux design, figma, adobe, prototyping, user research, wireframing, animation, design systems, graphic design, web design, interaction design, accessibility, design thinking

---

## How It Works

### Step 1: Resume Upload
When you upload your resume, the system automatically:
- Extracts text content
- Analyzes the content to detect your career role
- Stores the detected role with your resume

### Step 2: Role Detection Algorithm
The detection algorithm:
1. Counts keyword matches for each of the 11 career roles
2. Compares match percentages
3. Selects the role with the highest keyword match
4. Defaults to "Software Engineer" if no clear match is found

### Step 3: Score Calculation
Your score is calculated based on 4 features using role-specific keywords:

1. **Skills Count** (0-20 points)
   - Number of unique skills extracted from your resume
   - Maximum: 20 skills for 100%

2. **Projects Count** (0-10 points)
   - Count of "project", "projects", or "portfolio" mentions
   - Maximum: 10 projects for 100%

3. **Experience Years** (0-15 points)
   - Years of experience mentioned in resume
   - Maximum: 15 years for 100%

4. **Keyword Match** (0-100%)
   - Percentage of role-specific keywords found
   - Uses your role's specific keyword set
   - Fair comparison across different career paths

### Step 4: Machine Learning Model
A RandomForest model trained on diverse resume samples predicts your final score from 0-100.

---

## Example Scoring Comparison

### Scenario: Management Professional Resume

**❌ OLD SYSTEM (Tech-only Keywords)**
- Keywords checked: python, django, api, sql, aws, docker, machine learning, data, leadership
- Management resume found: "leadership" only (1/9 = 11%)
- Score: ~35/100 ❌ (Unfairly low)

**✅ NEW SYSTEM (Role-Aware Keywords)**
- Role detected: Management
- Keywords checked: leadership, team management, strategic planning, budget, business development, stakeholder management, mentoring, performance management, organizational, executive, director, manager, communication, negotiation
- Management resume found: "leadership", "team management", "strategic planning", "budget", "stakeholder management", "director", "communication" (7/14 = 50%)
- Score: ~70/100 ✅ (Fair evaluation)

---

## Changing Your Detected Role

If the system incorrectly detects your role, you can manually update it:

1. Go to Dashboard
2. See "Detected Career Role" section
3. **Coming Soon:** Click the role selector dropdown to choose your correct role
4. Your score will automatically recalculate

---

## API Endpoints

### Score Resume
```
POST /api/score-resume/

Request:
{
  "resume_id": 1
}

Response:
{
  "resume_id": 1,
  "score": 75,
  "breakdown": {...},
  "features": {
    "skills_count": 16,
    "projects_count": 3,
    "experience_years": 8,
    "keyword_match_percent": 64.29,
    "detected_role": "software_engineer"
  }
}
```

### Update Resume Role
```
POST /api/update-resume-role/

Request:
{
  "resume_id": 1,
  "role": "product_manager"
}

Response:
{
  "resume_id": 1,
  "career_role": "Product Manager",
  "message": "Career role updated successfully..."
}
```

---

## How to Improve Your Score

### Universal Tips (All Roles)
1. ✅ **Add more relevant skills** - Include 15-20 skills matching your role
2. ✅ **Describe projects** - Add 4-5 concrete examples of work you've done
3. ✅ **Quantify experience** - Write "5 years" or "10+ years" of experience
4. ✅ **Use role-relevant keywords** - Match the keywords for your career field

### Role-Specific Tips

**Software Engineers:**
- Mention specific tech stacks (Python, Java, React, etc.)
- Describe APIs and architectures
- List DevOps tools (Docker, Kubernetes, AWS)

**Data Scientists:**
- Mention ML frameworks (TensorFlow, PyTorch)
- Include statistics and modeling mentions
- Describe datasets and analysis work

**Product Managers:**
- Emphasize roadmap and strategy
- Mention user research and analytics
- Describe stakeholder management

**Sales Professionals:**
- Highlight pipeline and revenue figures
- Mention negotiation outcomes
- Describe client relationships and growth

---

## Technical Details

### Backend
- **File:** `backend/utils/feature_extractor.py`
- **Model:** `backend/utils/model_loader.py`
- **Database:** Stores `career_role` field in Resume model

### Frontend
- **Display:** `frontend/src/pages/Dashboard.tsx`
- **API Integration:** `frontend/src/lib/api.ts`
- **Detection:** Automatic on upload, updatable via API

---

## Future Enhancements

🚀 **Planned Features:**
- [ ] Role selector dropdown on Dashboard
- [ ] Role-specific improvement suggestions
- [ ] Custom keyword addition per role
- [ ] Multiple role support (for multi-disciplinary roles)
- [ ] Industry-specific keywords (e.g., Healthcare, Finance, Tech)
- [ ] Visual keyword highlighting
- [ ] Role benchmark comparison

---

## FAQ

**Q: Why did my score change when I haven't updated my resume?**
A: The role detection algorithm evolved. Your resume might now be correctly identified as a different role with more relevant keywords.

**Q: Can I have multiple roles?**
A: Currently, each resume has one primary detected role, but we're exploring multi-role support.

**Q: How often does the role detection run?**
A: On initial upload (automatic) and when you manually update it (manual).

**Q: Are the keywords hardcoded or ML-based?**
A: Keywords are manually curated by domain experts, while the final score uses ML prediction.

**Q: Can I add custom keywords for my role?**
A: Coming soon! You'll be able to add custom keywords specific to your industry.

---

## Support

For questions or issues with role-based scoring:
1. Check the Dashboard "Detected Career Role" section
2. Review role-specific keywords above
3. Ensure your resume mentions relevant keywords for your field
4. Try updating your role manually if misdetected

**Need help?** Contact support with your resume ID and detected role details.

---

## Version History

- **v2.0** (April 2026) - Role-based scoring with 11 career domains
- **v1.0** (2025) - Original tech-only keyword scoring

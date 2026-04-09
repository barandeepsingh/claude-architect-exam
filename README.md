# Claude Certified Architect — Mock Test Portal

A comprehensive, interactive mock exam preparation platform for the Claude Certified Architect: Foundations certification.

**🎮 [Live Demo: Practice Mode](https://claude-architect-exam-lwtwynyvq-barandeepsinghs-projects.vercel.app/practice)**

## Features

✅ **Adaptive Question Selection** - AI-powered system that adjusts difficulty based on your weak domains  
✅ **Analytics Dashboard** - Track progress over 14 days with domain-wise breakdown  
✅ **Practice Mode** - Unlimited practice with immediate feedback and explanations  
✅ **Mock Exam Mode** - 60-question timed simulation (90 min) matching real exam format  
✅ **History Tracking** - All sessions and performance metrics stored locally  
✅ **~500 Questions** - Comprehensive question bank across all 5 domains with proper weightage  

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript + Tailwind CSS
- **Storage**: Browser localStorage (fully client-side, no backend needed)
- **Adaptive Engine**: ML-inspired weighting based on domain accuracy and question recency
- **Charts**: Recharts for analytics visualizations
- **Deployment**: Vercel (free tier)

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## How the Adaptive Algorithm Works

The system intelligently adjusts which questions you see based on:

1. **Domain Accuracy** - Calculates your accuracy per domain
2. **Recent Performance** - Weights recent attempts (last 50) 70% vs all-time 30%
3. **Unseen Questions** - Prioritizes new questions you haven't answered (2x boost)
4. **Difficulty Ramp** - Increases difficulty as your accuracy improves

**Formula**: `adjusted_weight = exam_weight × (1 + (1 - accuracy) × 1.5)`

Weak domains get more questions while respecting the exam's official domain weightage.

## Question Bank

- **Domain 1** (Agent Architecture): ~70 questions
- **Domain 2** (Tool Design & MCP): ~33 questions
- **Domain 3** (Claude Code Configuration): ~40 questions
- **Domain 4** (Prompt Engineering): ~30 questions
- **Domain 5** (Context Management): ~25 questions

*Total: ~500 unique questions covering all exam topics*

## Data Storage

All data is stored **locally in your browser** using localStorage:

- **Questions answered**: Stored with correctness, time spent, domain
- **Exam sessions**: Full session results with domain breakdowns
- **Progress analytics**: Computed on-demand from answer history

**No data is sent to any server.** Your practice history is completely private.

## Deployment to Vercel (Free)

### Prerequisites
- GitHub account (free)
- Vercel account (free)

### Step 1: Create Private GitHub Repository

```bash
cd /path/to/claude-architect-exam

# Initialize git
git init
git add .
git commit -m "Initial commit: Claude Certified Architect exam portal"

# Create a private repo on GitHub and add remote
git remote add origin https://github.com/YOUR_USERNAME/claude-architect-exam.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (free tier)
3. Click "New Project"
4. Select your `claude-architect-exam` repository
5. Framework: **Next.js** (auto-detected)
6. Click "Deploy"

**Your app will be live in ~2 minutes!** 🚀

Access it at: `https://your-username-claude-architect-exam.vercel.app`

### Updating Deployment

Push changes to GitHub, and Vercel auto-deploys:

```bash
git add .
git commit -m "Update questions or features"
git push
```

## Exam Format Reference

- **Total Questions**: 60 (on actual exam)
- **Time Limit**: 90 minutes
- **Passing Score**: 720 / 1000
- **Scenarios**: 4 of 6 randomly selected
- **Format**: Multiple choice (1 correct from 4 options)

This portal simulates the real exam and can generate unlimited 60-question exams with random scenarios.

## Key Exam Concepts

### Five Domains (by exam weight):
1. **Agent Architecture & Orchestration** (27%)
   - Agentic loop, stop_reason values
   - Hub-and-spoke patterns
   - Task decomposition
   - Hooks vs Prompts

2. **Tool Design & MCP Integration** (18%)
   - Tool descriptions and routing
   - MCP Resources, configuration
   - Structured error handling
   - JSON schema design

3. **Claude Code Configuration & Workflows** (20%)
   - CLAUDE.md hierarchy
   - Conditional rules (.claude/rules/)
   - Skills and slash commands
   - Planning mode vs direct execution
   - CI/CD integration

4. **Prompt Engineering & Structured Output** (20%)
   - Few-shot prompting
   - Explicit criteria design
   - Structured output with tool_use
   - Validation and retry loops
   - Prompt chaining

5. **Context Management & Reliability** (15%)
   - Lost-in-the-middle effect
   - Persistent context blocks
   - Tool output trimming
   - Escalation patterns
   - Provenance tracking

## Tips for Success

1. **Track Weak Areas** - The analytics show your lowest-accuracy domains
2. **Focus on Heaviest Weights** - Agent Architecture (27%) and Prompt Eng (20%) carry significant weight
3. **Understand Hooks vs Prompts** - This distinction appears frequently:
   - **Hooks** = deterministic (100%) for compliance/enforcement
   - **Prompts** = probabilistic (~90%) for guidance
4. **Practice Regularly** - Aim for 20+ questions per session; analytics track improvement
5. **Review Explanations** - Each question includes thinking process and key takeaway

## Troubleshooting

### Questions not saving?
- Ensure localStorage isn't disabled in browser settings
- Check browser's storage quota (usually >10MB available)

### Slow performance?
- Large answer history (1000+ questions) might slow analytics
- Clear history if needed (Settings page)

### Exam mode timing off?
- Browser tabs running in background consume resources
- Close other tabs during timed exams

## Sources & References

Based on official Anthropic documentation:
- [Claude API Documentation](https://platform.claude.com/docs)
- [Agent SDK Guide](https://www.anthropic.com/news)
- [Claude Code Documentation](https://code.claude.com)
- [Claude Certified Architect Study Guide](https://github.com/paullarionov/claude-certified-architect)

## License

MIT - Free to use for personal study

## Support

Found a bug or have feedback? Open an issue on GitHub.

---

**Good luck with your Claude Certified Architect exam! 🎯**

Target: **720/1000 passing score**  
Study Time: **2-3 months with consistent practice**  
Success Rate: **High with structured preparation**

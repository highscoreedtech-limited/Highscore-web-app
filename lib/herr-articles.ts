// AUTO-GENERATED from the HERR paper PDF (tool/build_herr.js). The HERR
// section reads these directly so research content is independent of the blog.
import type { BlogPost } from './blog-posts';

export const HERR_ARTICLES: BlogPost[] = [
  {
    "slug": "playing-to-learn-gamification-quiz-performance",
    "title": "Playing to Learn: How Gamification, Not Feedback Delay, Improves Quiz Performance",
    "category": "HighScore EdTech Research Review",
    "subcategory": "Volume 1, Issue 1 · 2026",
    "tag": "Research",
    "tags": [
      "feedback timing",
      "gamification",
      "working memory",
      "logical reasoning",
      "educational technology"
    ],
    "excerpt": "We tested how feedback timing and gamification together affect short term memory. Participants took an online quiz with non factual logic questions. They were randomly placed in a gamified or non gami",
    "body": [
      "## Abstract",
      "We tested how feedback timing and gamification together affect short term memory. Participants took an online quiz with non factual logic questions. They were randomly placed in a gamified or non gamified group. In the gamified group each trial showed corrective feedback right away or after 10 seconds. Learning was measured by accuracy on the second showing of each question. Immediate and delayed feedback produced the same accuracy. Reaction times and learning gains did not differ either. But the gamified group performed much better than the non gamified group. This advantage appeared from the very first presentation. Subjective engagement was similar across groups. Yet engagement correlated positively with overall accuracy. A regression analysis showed gamification was the strongest predictor of performance. It beat age, gender, and engagement. So a 10 second feedback delay gave no extra benefit in a motivating gamified setting. Gamification itself sharply improved reasoning accuracy. The null feedback timing effect questions whether the delay retention effect works in gamified contexts. More research is needed.",
      "## Introduction",
      "NeuroEdTech combines brain science with learning tech. It builds tools that match how we think (Pradeep et al., 2024; Goldberg, 2022).",
      "Gamified quizzes are one such tool. They add points, timers, and rewards. These features engage the brain’s reward pathways. They help hold attention and support memory (Edwards et al., 2023; Sandrone & Carlson, 2021).",
      "Our study examined how gamification and feedback timing together influence learning. Feedback timing was either immediate or delayed by 10 seconds. Many studies looked at these factors alone. Their combined effect is still unknown. Several experiments compared immediate and delayed feedback without gamification (Opitz et al., 2011; Ryan et al., 2024; Kandemir et al., 2026). Gamification research shows that game elements can boost engagement and memory. But no experiment has tested a fixed 10 second delay alongside gamification in an online multiple choice task.",
      "Two early studies used a 10 second delay with plain materials.",
      "Sassenrath and Yonge (1969) found delayed feedback improved retention after five days. Rankin and Trepper (1978) found a similar benefit. Later work linked brief delays to curiosity and deeper processing (Carpenter & Vul, 2011; Metcalfe et al., 2009; Mullaney et al., 2014). All these studies lacked gamification. Gamification studies usually keep feedback constant. The interplay between a curiosity inducing delay and gamification’s motivational push was not examined.",
      "We chose a 10 second delay for clear reasons. It worked before without gamification. Delays of 3 to 10 seconds promote curiosity and anticipatory processing (Berlyne, 1954; Kang et al., 2009). This interval is long enough for thought but short enough to keep the quiz flowing. It also fits mechanisms like the hypercorrection effect (Butterfield & Metcalfe, 2001). Testing this inside gamification addresses a clear gap in NeuroEdTech research.",
      "We asked these questions. Does feedback timing affect learning accuracy in a gamified quiz? Does it change reaction time? Does it alter learning gains? Does it influence subjective experience? Are there overall learning differences between gamified and non gamified groups?",
      "We did not predict a direction for the timing effect. We expected gamification to boost accuracy.",
      "## Method",
      "A total of 55 adults took part (27 male, 28 female). Mean age was 21.84 years. They were recruited through social media, email, and in person visits. All gave informed consent. The study was approved by the ethics committee of the National Research University Higher School of Economics, Moscow.",
      "Participants were randomly assigned. The gamified group had 34 people. The non gamified group had 21. The groups did not differ in age, gender, or education after correction for multiple comparisons. The experiment ran online using Gorilla Experiment Builder. It had 20 unique multiple choice questions. Each question used novel logical premises. For example, “All glocks are blocks; some blocks are trocks.” The correct answer depended only on deductive logic. No factual knowledge was needed. Each question appeared twice. The order of options was shuffled on the second showing. This made the second presentation a test of learning, not recognition.",
      "The gamified interface had a dark neon theme. It showed points, a progress bar, a countdown timer, and reward sounds. Correct answers earned 100 points and 100 virtual rubles. A high bell sounded. Wrong answers gave 0 points and a low buzz. High total scores triggered a confetti animation. The non gamified interface was plain. It had only the questions and a timer. No feedback was given.",
      "Within the gamified group, each trial randomly gave feedback immediately or after a 10 second delay. During the delay a fixation cross and ticking sound appeared. Both groups had a 59 second time limit per trial. After two missed trials the experiment ended.",
      "After the quiz, all participants filled out subjective experience questionnaires. These measured enjoyment, competence, flow, pressure, perceived difficulty, and positive emotions. The tools were UEQ-S, IMI, FSS, and GEQ items. All were presented in Russian.",
      "The design was a 2 (Group) × 2 (Presentation) mixed factorial. The gamified group also had a within subjects factor of Feedback Timing. Main outcomes were accuracy on the second presentation, reaction time, and learning gain. Subjective engagement was a composite of enjoyment, absorption, and positive emotions.",
      "Because many variables were not normally distributed, we used non parametric tests. Mann Whitney U tests compared groups. Wilcoxon signed rank tests compared first and second presentations. A mixed ANOVA checked the interaction. We applied false discovery rate correction for multiple comparisons.",
      "## Results",
      "Feedback timing had no effect. Second presentation accuracy was nearly identical. Immediate feedback mean was 0.80. Delayed feedback mean was also 0.80. The difference was not significant.",
      "Reaction times did not differ between immediate and delayed trials. Learning gain from first to second presentation was also the same for both timings. All effect sizes were near zero. Post hoc power was very low.",
      "Gamification had a strong effect. The gamified group scored 75% correct on second presentation. The non gamified group scored 51% correct. This difference was large and significant (U = 562, p < .001, r = .479). The same advantage appeared on the first presentation. A mixed ANOVA confirmed a main effect of Group. There was no main effect of Presentation. No interaction was found. This means the gamification benefit was present right away and stayed stable.",
      "Subjective engagement did not differ between groups. Enjoyment, competence, flow, and positive emotion scores were similar. Yet engagement correlated positively with overall accuracy (r = .35, p = .010). Multiple regression showed that being in the gamified group was the strongest predictor of accuracy. Age and gender did not predict performance. Engagement was a marginal predictor (p = .070).",
      "Within the gamified group, the lack of feedback timing effect held for both males and females.",
      "## Discussion",
      "Why did a 10 second delay give no advantage? Three reasons seem likely. First, overall accuracy was high. That ceiling may have hidden any timing benefit. Second, the gamified setting itself may have created high curiosity. Both immediate and delayed feedback might have been equally motivating. Third, logical reasoning tasks may not need the same delay driven processing as factual memory tasks.",
      "The delay did not increase reaction times. This suggests participants did not use the waiting period for deep elaboration. They might have just waited. In an already engaging environment, the extra seconds may not have triggered additional cognitive processing.",
      "Gamification boosted performance strongly. The effect was large and immediate. This aligns with the idea that game features engage dopamine pathways. They capture attention automatically. The progress bar, points, and sounds might have increased alertness. They reduced mind wandering. These automatic processes would not need a person to feel more engaged. That explains why subjective ratings did not differ. Scharinger et al. (2023) found similar results. Gamification increased cognitive effort measured by EEG without changing motivation ratings. So gamification works partly beneath conscious awareness.",
      "Our null feedback timing result challenges the delay retention effect. The classic studies by Sassenrath and Yonge and Rankin and Trepper used plain materials. When gamification is added, that benefit might disappear. Both methods may activate overlapping neural circuits. The dopamine boost from rewards could overshadow any hippocampal contributions from delayed feedback (Foerde & Shohamy, 2011). This remains a hypothesis for future imaging studies.",
      "This study has limits. The sample was modest. Group sizes were unequal. The experiment was online and unsupervised. Learning was measured only within the same session. No long term retention test was used. The questions were logical reasoning items. The results may not generalize to factual learning. Subjective measures were taken only at the end. Moment to moment curiosity during delays was not captured.",
      "## Practical Implications",
      "Educators and edtech designers can take a clear message. Adding simple gamification elements can sharply improve reasoning performance. Points, sounds, and progress bars work. The exact timing of corrective feedback may matter less in such contexts. Design effort is better spent on making tasks engaging rather than fine tuning feedback delays. And gamification does this without raising frustration or perceived difficulty.",
      "## Conclusion",
      "A 10 second feedback delay did not improve learning in a gamified logical reasoning quiz. Gamification itself boosted accuracy by a wide margin. Engagement did not differ between groups but still correlated with success. These findings refine feedback timing theories. They also show how powerful gamification can be as a standalone tool. Future work should test longer delays and factual materials. Neuroimaging studies can uncover the brain mechanisms behind these effects."
    ],
    "source": "Author: Ijeoma Tochukwu Charles · Institute for Cognitive Neuroscience, HSE University & HighScore EdTech Limited. Published in HighScore EdTech Research Review (HERR), Vol 1, Issue 1, 2026.",
    "img": "/quiz.jpg",
    "author": "Ijeoma Tochukwu Charles",
    "downloadUrl": "https://drive.google.com/file/d/1Fdc4Pr4L4bG7no_OUuwVl_Y05c4FO",
    "date": "Jul 20, 2026"
  }
];

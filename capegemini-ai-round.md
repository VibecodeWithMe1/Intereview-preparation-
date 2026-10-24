# Capgemini Placement — AI Literacy Crash Course

**Purpose:** Last-minute mobile-friendly revision for the Capgemini placement assessment.  
**Scope:** AI Literacy concepts, scenario-based MCQs, AI-assisted development/testing, and a practice test.

> **Important:** This is a focused study guide based on commonly tested AI concepts and candidate-recalled assessment topics. It is not an official Capgemini question paper, and exact questions, timing, format, and difficulty can vary. No guide can guarantee selection.

---

## Contents

1. AI foundations
2. Prompt engineering
3. RAG, AI agents, and multimodal AI
4. Responsible AI and evaluation
5. AI-assisted software development and testing
6. Practice MCQs with answers
7. Last-minute revision sheet

---

# Part 1 — AI Foundations

## 1. AI vs ML vs Deep Learning vs Generative AI

- **Artificial Intelligence (AI):** Machines performing tasks that normally require human intelligence.
- **Machine Learning (ML):** AI systems learn patterns from data rather than relying only on explicitly programmed rules.
- **Deep Learning (DL):** Machine learning using neural networks with multiple layers.
- **Generative AI (GenAI):** AI that generates content such as text, images, code, audio, or video.

A useful relationship to remember:

`AI → Machine Learning → Deep Learning`

Generative AI overlaps with deep learning; it is not a separate replacement for AI.

### Practice MCQ

A system learns from thousands of previous transactions to predict whether a new transaction is fraudulent. Which technology is primarily being used?

A. Generative AI  
B. Machine Learning  
C. Prompt engineering  
D. RAG

**Answer: B — Machine Learning.** It learns patterns from historical data to make predictions.

## 2. What is an LLM?

**LLM = Large Language Model.**

An LLM is trained on large amounts of data to process and generate language. It can answer questions, summarize content, translate, explain concepts, and generate code.

Examples include GPT, Claude, and Gemini model families.

Important terms:

- **Training:** Learning patterns from data by adjusting model parameters.
- **Inference:** Using a trained model to produce an output.
- **Token:** A unit of text processed by a model; it can be a word, part of a word, or punctuation.
- **Context window:** The amount of input and conversation context a model can process at one time.
- **Parameters:** Learned internal values that influence model behaviour.
- **Fine-tuning:** Additional training on a more specific dataset or task.
- **Hallucination:** Incorrect or unsupported information presented as if it were true.

**Exam trap:** A confident answer is not necessarily a correct answer.

## 3. Training vs Prompting vs RAG vs Fine-tuning

| Method | What changes? | Typical use |
|---|---|---|
| Prompting | Instructions and context provided to the model | Guide the current response |
| RAG | Relevant external information is retrieved | Answer using updated documents |
| Fine-tuning | Model parameters are further trained | Adapt task performance or response behaviour |
| Retraining | Model is trained again, usually with revised data | Update what the model has learned |

### Practice MCQ

A company updates its internal policies every week. It wants its chatbot to answer using the latest policy documents without retraining the model every week. What is the best starting approach?

A. Increase temperature  
B. Use RAG with updated documents  
C. Use a longer prompt without retrieving documents  
D. Retrain the model every week

**Answer: B — RAG.** The system retrieves relevant current information and supplies it to the model.

---

# Part 2 — Prompt Engineering

## 4. What makes a good prompt?

A useful prompt clearly states:

1. **Role:** What perspective the AI should take.
2. **Task:** What it must do.
3. **Context:** Relevant background information.
4. **Constraints:** Rules, limits, and requirements.
5. **Output format:** Table, bullets, JSON, code, etc.
6. **Examples:** Sample inputs and outputs when useful.

Weak prompt:

`Explain SQL.`

Improved prompt:

`Act as a computer science tutor. Explain SQL joins to a beginner using an Employees and Departments example. Compare INNER JOIN and LEFT JOIN in a table, then provide three MCQs with answers.`

The second prompt specifies the audience, task, context, and desired output.

## 5. Zero-shot, One-shot, and Few-shot Prompting

- **Zero-shot:** Give instructions without examples.
- **One-shot:** Provide one example.
- **Few-shot:** Provide a small number of examples to demonstrate the desired pattern.

### Practice MCQ

You give an AI three examples of correctly formatted customer-support replies and ask it to follow the same format for a new case. Which technique is this?

A. Zero-shot  
B. Few-shot  
C. Fine-tuning  
D. Model retraining

**Answer: B — Few-shot prompting.**

## 6. Temperature and Context

- **Lower temperature:** Generally produces more predictable, less varied responses.
- **Higher temperature:** Generally permits more varied or creative responses.
- **More context:** Can help when relevant to the task.
- **Longer prompts:** Are not automatically better; irrelevant details can reduce clarity.

**Scenario:** A company wants consistent output when extracting invoice numbers and dates. What should it prioritize?

**Answer:** Clear structured instructions, a fixed output schema, validation, and generally low randomness where supported.

**Exam trap:** Low temperature does not guarantee factual accuracy.

---

# Part 3 — RAG, AI Agents, and Multimodal AI

## 7. RAG (Retrieval-Augmented Generation)

RAG combines information retrieval with text generation.

Typical workflow:

1. The user asks a question.
2. The system searches a knowledge base for relevant information.
3. Relevant passages are retrieved.
4. The passages are provided to the language model as context.
5. The model generates a response grounded in the retrieved information.

**Benefits:** Updated knowledge, document-based answers, and less dependence on information stored only in the model's parameters.

**Limitations:** RAG does not guarantee correctness. Retrieval can be poor, documents can be outdated, and the model can misinterpret evidence.

### Practice MCQ

A university updates its fee structure. Students ask an AI assistant about the latest fees. The assistant should use the university's current official documents.

A. Train a new LLM for every fee update  
B. Use RAG with updated official documents  
C. Increase the model's temperature  
D. Remove the knowledge base

**Answer: B — RAG.**

## 8. RAG vs Fine-tuning

| Scenario | Better starting choice |
|---|---|
| Answer from frequently updated company documents | RAG |
| Use a consistent domain-specific response style | Prompting or fine-tuning, depending on need |
| Teach an output pattern with a few examples | Few-shot prompting |
| Adapt a model using many domain-specific examples | Fine-tuning may help |
| Need reliable current facts | Retrieve trusted current sources and validate |

**Exam trap:** Fine-tuning is not the default solution whenever new facts are added. For frequently updated information, retrieval is often more appropriate.

## 9. AI Agents

An AI agent is a system that can pursue a goal by selecting actions, using tools, and responding to results.

Example: A travel-planning agent might search flights, compare prices, check dates, and prepare an itinerary.

- **Ordinary chatbot:** Primarily responds to the user's message.
- **Tool-using AI:** Can call tools such as search, databases, or calculators.
- **Agentic system:** Can plan and execute a sequence of actions toward a goal, often using tools iteratively.

Not every chatbot is an agent, and not every agent is fully autonomous.

### Practice MCQ

An AI system checks a database, retrieves missing customer information, calls a validation service, and prepares a report based on the results. What capability does this illustrate?

A. Static rule documentation  
B. Agentic, tool-using workflow  
C. Text tokenization only  
D. Model fine-tuning

**Answer: B — Agentic, tool-using workflow.**

## 10. Multimodal AI

A multimodal model can work with multiple types of input or output, such as text, images, audio, and video.

Examples:
- Summarizing a document from a scanned image.
- Answering a question about a photograph.
- Transcribing audio and summarizing it.

**MCQ:** A model accepts a picture and a written question about the picture. Which capability is being used?

**Answer: Multimodal AI.**

---

# Part 4 — Responsible AI, Accuracy, and Evaluation

## 11. Hallucination and Factual Verification

AI can generate plausible but false information.

If an AI-generated report includes statistics, legal claims, medical facts, or company policies, verify important claims against reliable sources.

### Scenario MCQ

An AI generates a report with three impressive statistics but provides no sources. The report will be sent to a client.

A. Send it because the writing is professional  
B. Verify the statistics and supporting sources before sending  
C. Assume the statistics are correct  
D. Ask the model to sound more confident

**Answer: B — Verify the claims.**

## 12. Bias and Fairness

AI bias can occur when data, design choices, or evaluation processes disadvantage certain groups.

Good practices:
- Use representative and appropriate data.
- Test performance across relevant groups.
- Investigate unequal error rates.
- Apply human oversight to high-impact decisions.

**MCQ:** An AI recruitment tool consistently ranks qualified applicants from one demographic group lower than comparable applicants from other groups. What should the company do?

**Answer:** Investigate the cause, audit data and model behaviour, evaluate fairness, and correct the issue before relying on the tool.

## 13. Transparency and Disclosure

AI transparency means communicating relevant information about AI involvement, limitations, and decisions when appropriate.

Remember:
- AI-generated does not automatically mean false.
- AI-generated does not automatically mean verified.
- Disclosure requirements depend on the applicable policy, context, and law.
- Do not make misleading claims about human authorship.

**Scenario MCQ:** An organization requires AI-assisted reports to be disclosed. An employee uses AI to draft a report.

**Answer:** Follow the organization's disclosure policy and verify the report.

## 14. Privacy and Security

Never send sensitive personal, financial, customer, or confidential company data to an AI service unless the use is authorized and compliant with applicable policies.

Key concepts:
- **Data minimization:** Use only the information needed.
- **Access control:** Only authorized people and systems should access data.
- **Anonymization:** Remove identifying information where appropriate; simple masking may not always be enough.
- **Human oversight:** Review important decisions rather than blindly trusting AI output.

**MCQ:** A developer wants to debug an error using an external AI assistant. The log contains real customer passwords.

**Answer:** Remove the secrets or use an approved secure workflow before sharing the log.

## 15. Human-in-the-Loop

Human-in-the-loop means a person reviews, approves, or guides an AI process. It is especially important for high-impact, sensitive, or irreversible actions.

**Scenario:** An AI recommends rejecting a job applicant based on its assessment. What is the safer approach?

**Answer:** Use appropriate human review, check the evidence and fairness, and follow the organization's recruitment policy.

## 16. Evaluation Metrics — Quick Revision

- **Accuracy:** Fraction of all predictions that are correct.
- **Precision:** Of all predicted positives, how many are actually positive?
- **Recall:** Of all actual positives, how many were correctly identified?
- **F1 score:** Harmonic mean of precision and recall.

Formulas:

`Precision = TP / (TP + FP)`

`Recall = TP / (TP + FN)`

`F1 = 2 × Precision × Recall / (Precision + Recall)`

For an AI chatbot, evaluation can also include factual correctness, relevance, groundedness, safety, and user satisfaction.

**Scenario MCQ:** A fraud-detection system misses many genuinely fraudulent transactions. Which metric should you examine closely?

**Answer: Recall**, because false negatives are the key concern.

---

# Part 5 — AI-Assisted Software Development and Testing

## 17. AI Coding Assistants

AI coding assistants can explain code, generate functions, suggest tests, identify likely bugs, and help refactor code.

They can also introduce incorrect logic, insecure patterns, and code that fails edge cases.

Best workflow:

1. Understand the requirement.
2. Give the AI the relevant code and constraints.
3. Ask for a specific solution or explanation.
4. Review the generated code.
5. Run tests and inspect failures.
6. Verify edge cases, security, and performance.

### Practice MCQ

An AI assistant generates a function that appears correct but fails two hidden test cases. What should the developer do?

A. Submit it anyway  
B. Ask for an unrelated solution  
C. Inspect the failing cases, identify the logic error, and retest the correction  
D. Delete the tests

**Answer: C — Debug and retest.**

## 18. Automated Testing and Selenium

- **Automated testing:** Tests software using scripts or tools rather than relying entirely on manual execution.
- **Selenium:** A toolset used to automate browser interactions for web application testing.
- **Test case:** A defined input or scenario with expected results.
- **Regression testing:** Checks that previously working functionality still works after changes.
- **Cross-browser testing:** Checks behaviour across different browsers.
- **Cross-platform testing:** Checks behaviour across different operating systems, devices, or environments.

### Scenario MCQ

A web application works in Chrome but fails in Firefox. What should the testing team do?

A. Assume Firefox is always incorrect  
B. Investigate browser-specific behaviour and run cross-browser tests  
C. Delete the Firefox tests  
D. Rewrite the entire application without investigating

**Answer: B — Investigate and test.**

## 19. Logs and Monitoring

- **Logs:** Records of events that occurred in a system.
- **Monitoring:** Continuous observation of system health, performance, and behaviour.
- **Metrics:** Quantitative measurements such as error rate and latency.
- **Tracing:** Following a request through multiple components or services.

### Scenario MCQ

After a new AI application release, the error rate suddenly rises. What is the best first step?

**Answer:** Examine monitoring metrics, logs, and traces to identify the cause.

## 20. Choosing the Right Tool

| Problem | Appropriate starting point |
|---|---|
| Browser actions need automated testing | Selenium or another suitable browser automation tool |
| AI gives outdated answers about internal documents | RAG with current trusted sources |
| AI-generated code fails tests | Debug, correct, and retest |
| App behaves differently across browsers | Cross-browser testing |
| Error rates rise after deployment | Logs, metrics, and traces |
| Model output is biased | Fairness evaluation and mitigation |
| Sensitive data appears in a prompt | Follow privacy/security policies; remove or protect the data |

**Exam rule:** Identify the problem first, then choose the tool that directly addresses it.

---

# Part 6 — Mock Test: 20 AI Literacy MCQs

**Suggested practice time: 15 minutes.** Attempt each question before checking the answer key.

### Q1
A company updates its internal documents daily. The chatbot must answer using the latest versions without retraining the LLM every day. What is the best approach?

A. Increase temperature  
B. RAG with updated documents  
C. Fine-tune daily by default  
D. Increase context window only

### Q2
An LLM gives a confident but incorrect answer about company policy. What is this commonly called?

A. Tokenization  
B. Hallucination  
C. Regression testing  
D. Fine-tuning

### Q3
You give an AI three examples of the exact output format you need. Which technique is this?

A. Zero-shot prompting  
B. Few-shot prompting  
C. Retraining  
D. Inference-time fine-tuning

### Q4
Which process adjusts model parameters using additional task-specific training data?

A. Prompting  
B. Inference  
C. Fine-tuning  
D. Retrieval

### Q5
An AI system searches a database, calls a tool, evaluates the result, and performs another action toward a goal. This is best described as:

A. A static FAQ  
B. An agentic tool-using workflow  
C. Text compression only  
D. Data anonymization

### Q6
An AI-generated financial report contains unsourced statistics. What should happen before publication?

A. Publish if the report sounds convincing  
B. Verify claims against reliable sources  
C. Increase temperature  
D. Remove all references

### Q7
A recruitment model performs worse for one demographic group. What is appropriate?

A. Ignore the difference  
B. Audit the data and model for bias  
C. Hide the results  
D. Use the model without review

### Q8
Which statement about AI disclosure is most accurate?

A. AI content is always false  
B. Disclosure is never required  
C. Follow applicable policies and avoid misleading claims  
D. Every AI answer is automatically verified

### Q9
A prompt contains real customer passwords. What is the best practice?

A. Send the complete prompt to any AI tool  
B. Remove secrets and use an approved secure workflow  
C. Post the password in a public issue  
D. Ignore security policy

### Q10
A system must identify as many genuinely fraudulent transactions as possible. Which metric is particularly important?

A. Recall  
B. Font size  
C. Token count  
D. Training duration alone

### Q11
AI-generated code fails edge-case tests. What should the developer do?

A. Submit it without changes  
B. Inspect failures, correct the logic, and retest  
C. Delete the tests  
D. Assume the compiler is wrong

### Q12
Which tool is commonly used for browser-based web UI automation?

A. Selenium  
B. RAG  
C. SQL JOIN  
D. Tokenization

### Q13
An application works in Chrome but fails in Firefox. What is appropriate?

A. Ignore Firefox  
B. Perform cross-browser investigation and testing  
C. Retrain the language model  
D. Delete all test cases

### Q14
An application's error rate rises immediately after deployment. What should the team examine first?

A. Logs, metrics, and traces  
B. The logo colour  
C. Unrelated source files only  
D. User passwords

### Q15
Which statement best distinguishes training from inference?

A. They always mean the same thing  
B. Training learns model parameters; inference uses a model to produce outputs  
C. Inference always changes model parameters  
D. Training means writing a prompt

### Q16
What is a context window?

A. The number of browser tabs open  
B. The amount of context a model can process at once  
C. The model's accuracy percentage  
D. The number of users in a database

### Q17
A chatbot uses RAG, but retrieval returns irrelevant passages. What should be improved?

A. Retrieval quality and document indexing  
B. Only the answer's font  
C. The user's password  
D. The number of unrelated prompts

### Q18
Which prompt is most likely to produce a useful structured answer?

A. Do something useful  
B. Explain SQL  
C. Explain SQL LEFT JOIN to a beginner, show a small example, and provide three MCQs with answers  
D. Write everything

### Q19
A software team wants to ensure a code change has not broken previously working features. Which testing is appropriate?

A. Regression testing  
B. Tokenization  
C. Fine-tuning  
D. Data retrieval

### Q20
An AI assistant is asked to make a high-impact decision using incomplete information. What is the safest approach?

A. Accept the first output automatically  
B. Use appropriate human review and verify the evidence  
C. Increase randomness  
D. Remove the audit trail

## Answer Key with Explanations

| Q | Answer | Explanation |
|---|---|---|
| 1 | B | RAG retrieves current external information. |
| 2 | B | Hallucination is incorrect or unsupported output presented as true. |
| 3 | B | Few-shot prompting uses multiple examples. |
| 4 | C | Fine-tuning further trains the model. |
| 5 | B | Agentic workflows can plan actions and use tools. |
| 6 | B | Important factual claims should be verified. |
| 7 | B | Bias requires investigation and fairness evaluation. |
| 8 | C | Disclosure depends on context and applicable policy. |
| 9 | B | Protect sensitive information. |
| 10 | A | Recall measures how many actual positives are found. |
| 11 | B | Debug and retest generated code. |
| 12 | A | Selenium automates browser interactions. |
| 13 | B | Investigate browser-specific differences. |
| 14 | A | Logs, metrics, and traces help diagnose production issues. |
| 15 | B | Training learns parameters; inference uses the model. |
| 16 | B | The context window limits context processed in a request. |
| 17 | A | RAG depends on retrieving relevant, reliable information. |
| 18 | C | It specifies audience, task, example, and output. |
| 19 | A | Regression testing checks existing functionality after changes. |
| 20 | B | High-impact decisions need appropriate oversight and evidence. |

### Score Guide

- **17–20:** Strong revision; review mistakes once more.
- **13–16:** Good start; revise weak concepts and scenario questions.
- **0–12:** Read Parts 1–5 again, then retake the test.

This is a self-practice score, not an official Capgemini cutoff.

---

# Part 7 — Last-Minute Revision Sheet

## Key Definitions

1. AI = machines performing intelligent tasks.
2. ML = learning patterns from data.
3. Deep Learning = ML using multilayer neural networks.
4. Generative AI = creates text, code, images, audio, etc.
5. LLM = Large Language Model.
6. Token = unit of text processed by a model.
7. Context window = amount of context processed at once.
8. Training = learning/updating model parameters.
9. Inference = using a trained model to produce output.
10. Fine-tuning = additional task-specific model training.
11. Prompting = guiding a model through instructions and context.
12. Zero-shot = no examples.
13. One-shot = one example.
14. Few-shot = multiple examples.
15. Hallucination = incorrect/unsupported output presented as true.
16. RAG = retrieve external information, then generate an answer.
17. AI agent = can plan actions and use tools toward a goal.
18. Multimodal AI = works with multiple modalities, such as text and images.
19. Responsible AI = fairness, safety, privacy, accountability.
20. Human-in-the-loop = human review or intervention.
21. Selenium = browser automation/testing.
22. Regression testing = check that existing features still work.
23. Logs = event records.
24. Monitoring = observe system health and performance.
25. Tracing = follow a request across system components.
26. Prompt injection = malicious instructions attempting to manipulate an AI system.
27. Data minimization = use only necessary information.
28. Precision = TP / (TP + FP).
29. Recall = TP / (TP + FN).
30. F1 = harmonic mean of precision and recall.

## Scenario Shortcuts

- Frequently updated documents → **RAG**
- New response style → **Improve prompts; consider fine-tuning if justified**
- False AI answer → **Verify sources and evidence**
- Biased AI decision → **Audit fairness**
- Sensitive information → **Protect/redact it; follow approved policies**
- Code fails tests → **Debug, fix, and retest**
- Browser-specific failure → **Cross-browser testing**
- Post-deployment errors → **Inspect logs, metrics, and traces**
- High-impact decision → **Appropriate human oversight**
- Consistent structured output → **Clear instructions, schema, and validation**
- Missing many actual positive cases → **Check recall**
- Many false positive predictions → **Check precision**
- Need to test previously working features → **Regression testing**

---

## Final Exam Strategy

1. Read the complete question before looking at options.
2. Identify the actual problem: outdated information, inaccurate output, bias, security, testing, or tool selection.
3. Eliminate options that do not address the problem.
4. Prefer evidence, verification, privacy, fairness, and appropriate human oversight when relevant.
5. Do not assume that AI output is correct just because it sounds confident.
6. Do not confuse RAG with fine-tuning.
7. Watch for words such as **best**, **first**, **most appropriate**, and **most reliable**.
8. Manage time: do not spend too long on a single MCQ.
9. Follow the actual assessment instructions; the test format may vary.
10. Sleep sufficiently before the drive if possible.

**Final reminder:** This guide is designed for focused revision, not guaranteed prediction of the actual paper. Use candidate-recalled topics as clues, and rely on the concepts to handle unfamiliar questions.

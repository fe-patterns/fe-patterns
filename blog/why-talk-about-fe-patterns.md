---
title: Why talk about Frontend Patterns?
date: 2026-07-04
---

There are two sub-questions implied in the question above:
1. Why talk about Frontend Patterns **at all**?
2. Why should we talk about them **now**?

But first, what do I even mean by this concept? It's quite straightforward - software architecture patterns, applied to the Frontend stack. 

## Prologue
---

Now a little context about me, to get an idea of why I'm interested into this topic. I've been a software developer for over 16 years. I've spent the first 6-7 years working on the Backend (Java then Node.js), and for the last 10 years I've taken over the other half of the stack. 

During my BE time, I've got really into design patterns, clean code, SOLID principles and so on. I've tried to practice TDD best as I could, enjoyed refactoring, and crafting clean architectures. All those gave a me feeling of accomplishment, and I aspired to be a good Software Craftsman. 

### On the other side

Then I came to the Frontend side. And things felt very different. TDD was hard to do on UI components. Separation of concerns was a foreign concept. All kind of logic was to be found in a component: data was fetched, was stored locally, was manipulated in various ways, and eventually got rendered on the screen. All inside a huge component. And clean, hexagonal architecture was outside of any React tutorial.

Meanwhile, things got better, there are some established patterns, some separation of concerns. But things are still not really settled, and I still see React components that abuse `useEffect` for all kind of things. And still no clear reference to anything resembling hexagonal architecture.

So, why should we talk about Frontend Patterns? Because this concept is not really discussed that much as a whole, but rather as isolated articles and ideas. 

Of course, I don't claim that I have the definitive solution to all FE architectural issues. I just want to share some patterns that were distilled over the years while working on non-trivial FE applications. So, these insights are, of course, biased towards the type of apps that me and my team has been working on for the last decade: dashboard-like SPA clients talking to RESTful APIs, manipulating large amounts of data and presenting them in an useful manner. That means that I'm not that familiar with SSR apps, for example, apart of a few side projects. But, anyway, I think most patterns are useful regardless of context, and some might even apply outside FE as well.

## Why bother with patterns now, in the agentic era
---

I've been wanting to start this project for a long time, but kept postponing for various reasons. Then came AI agents, with strong LLM models, that anyone can use to make a decent app. So I thought to myself that it's maybe too late now to start talking about patterns: in the end, if we won't be writing code anymore, but prompts instead, why bother? But, as others have figured out as well, we're not at AGI yet, so models, even the best ones, still have limitations and can't do the whole thing for you. They can't design an architecture, consider tradeoffs, and, generally speaking, have real judgement. So there's still a job for us, human programmers. 

### Agents need good guides and guardrails

No matter how strong an AI model is, and no matter how clever and seemingly clean code it writes, it can still drift at some point. It can choose the wrong abstractions, optimize prematurely, use bad practices, etc. After all, with all the refinement and optimizations they get, they're still trained on existing codebases, and their quality varies. 

I've read somewhere that the models have the potential for extraordinary things, but those need to be unlocked. By default, they are at the median - you have to stir them to unlock the "high zone" of their potential. That's why it's important to add guides for best-practices and guardrails that check if those guides are respected. As many well-respected software craftsmen noticed, the [AI benefits from good practices](https://articles.pragdave.me/p/clean-code-is-good-for-ais-too) as well - if a codebase is easy for a human programmer to work on, it's easier for an agent too.

That's the reason why having some structure and constraints on your project helps. And why there is an increasing focus towards developing [good agent harnesses](https://martinfowler.com/articles/harness-engineering.html). And here is where this project aims to contribute, by providing a set of patterns, and especially on the Frontend side, an area where these are not that established. 

## How AI actually can help with patterns
---

During the last few months since I've started using agentic coding practices, I've got new and unexpected insights. Whereas at first I thought that having a project about patterns is useless now that agents write all the code, the perspective shifted quite a lot. Now I realize that coding agents can actually help with pattern development and adoption. That's because they can do some intensive work quite easily, and allow for quick and cheap iteration.

### Quick and cheap code samples

It's really easy for an AI to get a half-backed pattern idea and generate some code to implement it. Then, based on the output, the pattern can be refined for better results, and turned into a skill. You can even add automated evals to keep its quality high. 

This kind of iteration would have been much slower in the past - you would have written a documentation on a pattern, then try out yourself and your team, then iterate on it. That can take a lot of time. And the pattern is applied on an existing codebase, while implementing actual user features, so there is a tension between the technical and product side. On the other hand, an AI can quickly generate new code, so the feedback is faster, and it doesn't really interfere with feature development.

### Pattern adoption is easier

In the pre-agentic era, in order to implement a pattern, programmers need to read the documentation, maybe take some code samples and adapt them to the new feature. On rare occasions a code generator might do some scaffolding, based on patterns. But it still took human effort, and discipline, to apply the pattern. And there might be cases when the programmer misses something, or gets some nuance wrong. That's also hard to check - testing or linting for pattern adherence is not always trivial. There is the peer review step, but that might also miss somethings. 

But that changes with agents - a good skill is much more likely to apply the pattern. Of course, LLM are non-deterministic and "can make mistakes", but they can also help catch the drifts, either by implementing custom lint rules or tests, or by having a LLM-judge check that the pattern is applied.

### Codebase scale is no longer an issue

One of the biggest issues we've had with pattern adoption was applying it to the whole codebase. This is how it usually went: 
- We came up with a new pattern that sounded really good. 
- Wrote documentation on it, came up with some code samples, and made a small demo module
- Implemented the pattern on a new module in the actual app - at this point the actual code can drift
- During the implementation we get feedback and incorporate it into the documentation, potentially making even major revisions.
- Now it would be a good time to go back and update the code to match the pattern changes
- But, since there are many competing priorities, this refactoring is at the bottom of the backlog, for sometime, "when we have time".

This might sound familiar for various code migrations, it probably happens in most projects. The end result is that the code embodies multiple variations of the same pattern, and some parts - the absence of the pattern. In an ideal world, we would apply the latest version consistently throughout the codebase. Only if there were time...

Well, we're no longer bound by time for this kind of things. Now LLMs can do these large scale migrations very easily and with minimal human supervision.

## What's next
---
All of these aspects make me pretty excited to work on this project. But it doesn't mean I have everything figured out. It's going to be mostly an exploration, a lot of trial an error, with potential dead ends. But, as with everything AI-related, we're still figuring things out. And, as Kent Beck says, ["Nobody knows" ](https://newsletter.kentbeck.com/p/nobody-knows). But that doesn't make things less fun - quite the opposite. If you want to join me in this exploratory journey, you can subscribe for occasional updates.

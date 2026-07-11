# Welcome email (Buttondown)

The automated welcome email sent to new newsletter subscribers. Paste the body
into Buttondown's welcome-email template; set the subject and preview text in the
dashboard.

**Subject:** Welcome to Frontend Patterns

**Preview text:** No fixed schedule, no spam — just occasional notes on frontend patterns.

---

{% if subscriber.metadata.first_name %}Hi {{ subscriber.metadata.first_name }},{% else %}Hi there,{% endif %}

Thanks for subscribing.

I came to the frontend from the backend, where design patterns and clean architecture were a given. On the frontend they weren't — but the same problems kept recurring, and similar solutions started emerging. This newsletter is me writing those down as patterns, with the tests, skills, and guards that make them real.

What makes these different from a normal pattern catalog: each one ships as something an AI agent can actually apply — a Skill that implements or refactors your code toward the pattern, and Guards that keep it that way.

First up is a big one: **hexagonal architecture, for the frontend**. It's a broad, encompassing pattern — the foundation a lot of the smaller ones build on — and it advances all three goals at once: testability, maintainability, and comprehensibility.

No fixed schedule. I write when I've got something worth your time.

Bogdan

P.S. — I'd genuinely like to know: what kind of app are you building, and what's the part that hurts? Just hit reply — it helps me pick what to write next.

#!/bin/bash

# Chat-in-a-Box Completion Jokes
# Randomly selects and speaks a witty one-liner when Claude finishes working
echo $(date) >> /tmp/completion-one-liner.log

# 100 completion one-liners for AAC Communication Board project
one_liners=(
    # Classic completions (1-10)
    "Communication complete. Your move."
    "Words delivered. Mission accomplished."
    "Task done. Time to speak up."
    "Code compiled. Voice amplified."
    "The board is set. Let's communicate."
    "Finished! Now go help someone find their voice."
    "Done and deployed. Ready to empower."
    "All systems vocal. Task complete."
    "Built with care. Ready to share."

    # AAC Mission themed (11-20)
    "Every button pressed is a voice heard."
    "Making communication accessible, one commit at a time."
    "Bridging the gap between thought and expression."
    "Code that speaks volumes."
    "Building bridges, not barriers."
    "From silence to expression. Task complete."
    "Empowering voices, one feature at a time."
    "Communication is a right, not a privilege. Done."
    "Giving voice to the voiceless. Complete."
    "Technology in service of humanity. Finished."

    # Developer humor (21-35)
    "I'd tell you a UDP joke, but you might not get it."
    "There's no place like 127.0.0.1."
    "It works on my machine. Ship it!"
    "99 little bugs in the code. Take one down, patch it around. 127 little bugs in the code."
    "I don't always test my code, but when I do, I do it in production."
    "To understand recursion, you must first understand recursion."
    "A SQL query walks into a bar, walks up to two tables and asks, may I join you?"
    "Why do programmers prefer dark mode? Because light attracts bugs."
    "It's not a bug, it's an undocumented feature."
    "The code works. Don't ask me how."
    "Commit early, commit often, push when ready."
    "Works perfectly. Time to refactor everything."
    "If it ain't broke, add more features."
    "Debugging complete. Coffee depleted."
    "Another day, another merged PR."

    # Motivational (36-50)
    "Progress, not perfection."
    "Small steps lead to big changes."
    "Every expert was once a beginner."
    "The best time to plant a tree was 20 years ago. The second best time is now."
    "Done is better than perfect."
    "Shipped! The user will decide if it's good."
    "Momentum builds momentum."
    "One percent better every day."
    "The journey of a thousand miles begins with a single step."
    "Excellence is a habit, not an act."
    "Keep building. Keep shipping."
    "The obstacle is the way."
    "Embrace the struggle. It's making you better."
    "Success is the sum of small efforts repeated daily."
    "What we do today echoes in eternity."

    # Playful (51-65)
    "I am Groot. I mean, done."
    "This is the way."
    "May the source be with you."
    "Live long and prosper. Task complete."
    "Hasta la vista, bug-y."
    "I'll be back. With more features."
    "Elementary, my dear developer."
    "Houston, we have a solution."
    "One small step for code, one giant leap for accessibility."
    "Beam me up, the code is deployed."
    "Winter is coming. But this feature is done."
    "I have spoken."
    "So say we all. Task complete."
    "Make it so. And so it was made."
    "The spice must flow. And so must the code."

    # Philosophical (81-90)
    "We shape our tools, and thereafter our tools shape us."
    "The medium is the message. The code is the solution."
    "In the beginner's mind there are many possibilities."
    "Simplicity is the ultimate sophistication."
    "First, solve the problem. Then, write the code."
    "The art of programming is the art of organizing complexity."
    "Code is poetry in motion."
    "Every line of code is a decision."
    "Software is a great combination of artistry and engineering."
    "The best code is no code at all."

    # AAC specific encouragement (91-100)
    "Someone's world just got a little bigger."
    "A voice was heard today because of this work."
    "Communication barriers don't stand a chance."
    "Building tools that matter."
    "Accessibility isn't optional. It's essential."
    "Every feature we ship helps someone connect."
    "Technology should adapt to people, not the other way around."
    "We're not just writing code. We're writing possibilities."
    "Behind every button is a thought waiting to be shared."
    "The best interfaces disappear. The message remains."
)
# Pick random one-liner
random_index=$((RANDOM % ${#one_liners[@]}))
one_liner="${one_liners[$random_index]}"

# Speak it using default macOS voice
say "$one_liner"

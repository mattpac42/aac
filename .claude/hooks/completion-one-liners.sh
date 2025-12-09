#!/bin/bash

# Chat-in-a-Box Completion Jokes
# Randomly selects and speaks a witty one-liner when Claude finishes working
echo $(date) >> /tmp/completion-one-liner.log

# Add more one-liners here during onboarding
one_liners=(
    "The Garden is finished."
)
# Pick random one-liner
random_index=$((RANDOM % ${#one_liners[@]}))
one_liner="${one_liners[$random_index]}"

# Speak it using default macOS voice
say "$one_liner"

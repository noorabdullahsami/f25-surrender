# Design Decisions

Surrender is designed as an experience about delayed communication rather than a conventional messaging tool. The system behavior, interface structure, and technical constraints all support a single emotional interaction: writing something that will arrive later, outside the sender’s control.


## Communication -- Asynchronous Experience

Traditional messaging systems emphasize immediacy and control. Surrender intentionally removes both.

Key design goals:

* Introduce temporal distance between sender and receiver
* Reduce impulsive editing or retraction
* Encourage reflection through delayed delivery

## Encryption -- User Trust Signal

Client-side encryption is implemented not only for technical privacy but also as a psychological design choice.

Users understand that:

* Messages are transformed before leaving the browser
* The system does not present itself as an all-seeing intermediary

This reinforces the emotional framing of surrendering a message rather than sending a chat.


## Minimal Interface Philosophy

The interface avoids complex dashboards or message histories.

Reasons:

* Reducing cognitive load keeps focus on the act of writing
* Lack of persistent history reinforces impermanence
* Simplicity mirrors the conceptual theme of letting go

Design intentionally favors clarity over feature density.


## Temporary Storage and Ephemerality

Messages exist only long enough to complete delivery.

From a UX perspective, this communicates:

* The platform is a medium, not an archive
* Users are not expected to return and manage content later

Ephemerality reduces anxiety around long-term digital traces.


## Emotional Ambiguity as Interaction Design

Unlike typical productivity tools, uncertainty is part of the experience.

Examples:

* Users cannot “watch” the delivery happen in real time
* Feedback is minimal once submission occurs

This design choice aligns with the narrative theme of uncertainty in communication.

## Constraints -- Creative Drivers

Several technical decisions were shaped by experiential goals:

* SQLite chosen for simplicity and containment
* Cron scheduling reinforces the idea of periodic release
* Lack of complex account systems avoids turning the project into a social platform

The system intentionally resists becoming a full messaging product.

## Future UX Exploration

Potential directions:

* Visualization of time passing after submission
* Alternative delivery mediums (letters, audio, or artifacts)
* Contextual prompts to guide reflective writing

Future iterations should continue prioritizing emotional clarity over feature expansion.

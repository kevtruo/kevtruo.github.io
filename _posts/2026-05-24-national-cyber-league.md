---
title: 2026 National Cyber League Takeaways
date: 2026-05-24 00:00:00 -0400
category: Events
tags: [ctf, review]
---

This year I competed in the National Cyber League (NCL) Cyber Command CTF. NCL is a cybersecurity skills competition structured around realistic, scenario-driven challenges across a broad range of domains — log analysis, network forensics, web exploitation, cryptography, binary reversing, and OSINT. This post recaps my experience and walks through one challenge in depth: an AWS CloudTrail IAM enumeration problem that was the most directly applicable to real-world security work I encountered across the entire competition.

## Challenge Overview

**Challenge**: Analyze a set of AWS CloudTrail logs to reconstruct attacker activity across multiple IAM-related API calls. Specific questions covered identifying the AWS account ID present in the logs, the total number of unique IAM users created during the incident window, the EC2 instance ID launched by the threat actor, and the ARNs of IAM roles assumed during the session.

**Category**: Log Analysis / Cloud Forensics

**Level**: Medium

**Files Provided**: cloudtrail_logs.json — a multi-record AWS CloudTrail export in JSON format containing hundreds of API event records across IAM, EC2, and STS service namespaces.

**Estimated time spent**: ~45 minutes

---

## Initial Thoughts and Information Gathering

### First Impressions

This challenge immediately signaled an IAM-centric cloud incident scenario. AWS CloudTrail logs are the canonical audit trail for AWS API activity, and the theme of the questions — account enumeration, user creation counts, EC2 instance attribution, and role assumption chains — mapped directly to a credential compromise or insider threat investigation pattern. The challenge was structured to reward familiarity with CloudTrail's JSON schema rather than any exploitation skill.

I'd say the primary risk of error was misreading the log structure. CloudTrail exports a top-level Records array, and individual events nest their key fields (eventName, userIdentity, requestParameters, responseElements) several layers deep. Any script that assumes a flat structure would silently return wrong counts.

### Information Gathering Steps

For initial triage before writing any query logic, I opened the file in a text editor to confirm the expected structure: top-level key was Records, each record was a distinct JSON object, and the file was not newline-delimited JSON (NDJSON) but a single document. I then identified the relevant eventName values for each question: CreateUser for IAM user creation, RunInstances for EC2 launch, AssumeRole for role assumption chains. Next, I noted that instance IDs in RunInstances responses appear under responseElements.instancesSet.items[], not at the top level. Lastly, I confirmed that IAM user ARNs created via CreateUser appear in responseElements.user.arn, and role ARNs assumed via AssumeRole appear in requestParameters.roleArn.

---

## Methodology and Strategy

### Chosen Approach

Python made log parsing easy given the file's JSON format, allowing for precise data query. The strategy was to write a single-pass parser that extracted answers to all four questions simultaneously, minimizing the risk of inconsistencies.

### Tools and Techniques

**Python 3 (json module)** — primarily used to parse through logs
**macOS terminal (zsh)** — execution environment; no external libraries required
**jq (validation only)** — used to spot-check field paths before committing to the Python implementation
**Manual cross-reference** — compared parsed counts against raw grep output for CreateUser to validate

---

## Conclusion

I wanted to highlight this challenge because it was the most directly applicable to real-world IAM forensics work in the competition. AWS CloudTrail analysis is a foundational skill for any security practitioner, and the challenge emphasized schema knowledge over brute-force tooling. The key lesson for me was to use responseElements over requestParameters when counting successful resource creation events. Relying on request-side fields over what is actually presented can inflate counts, since requestParameters also captures failed or denied API calls.

From an IAM perspective, the challenge illustrated a classic attack: initial access via a compromised credential, programmatic user creation for persistence, role assumption chains for privilege escalation, and compute resource launch as the objective. Seeing this sequence in log data is the bread-and-butter of modern incident response.

For anyone approaching similar challenges: parse the log schema manually before writing any code, use sets for deduplication from the start, and always prefer response-side fields over request-side fields when the question asks what was created rather than what was attempted.

~ Kevin Truong
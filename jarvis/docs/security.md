# JARVIS Cybersecurity

## Policy Checks
All critical tool interactions run through `check_action_allowed` in `app/core/policy.py`. This sets hooks where destructive actions can be paused for user confirmation.

## Audit Logs
All tool activities, policy checks, and kernel task assignments are stored in the `audit_logs` table. They can be viewed directly from the web dashboard.

## Sandboxing
In v1, command execution is run natively via python `subprocess`, but is heavily monitored by audit logging and constrained by paths config setup in `settings.py`. Future iterations should implement cgroup / dockerd sandboxing for absolute safety.

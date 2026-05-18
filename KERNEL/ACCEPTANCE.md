# Acceptance Criteria

Acceptance criteria define how the overall system is judged correct.


- Anonymous User Sees Login Only - cannot see the Feature List or Submit a Feature Request
- Google OAuth Logged in User can see the Feature List, Submit a Feature Request

A feature has at least:
- Title
- Description or summary
- Author's identity
- Creation time

Features should be sorted - for now use Creation Date Time

It is a multi-user app: in testing have at least 3 Users to prove the permutations (User 1 has no submitted features)

If the app is restarted state should correctly load from persistence.


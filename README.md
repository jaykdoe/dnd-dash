##Repository Branch Strategy

Master - > Main Branch
  - Branch is read-only. Users cannot push to the branch.
  - Before merging, should open pull request.
  
Pull Request Steps
  - When enabled, pull requests targeting a matching branch require a number of approvals and no changes requested before they can be merged. (1 approval     required.)
  - New reviewable commits pushed to a matching branch will dismiss pull request review approvals.

Development Branch Strategy
  Prefixes: feature/, bugfix/, hotfix/

## Projects

- [Core](./core) - Core Layer
- [WebClient](./webclient) - Web Client
- [WebClient E2E Tests](./webclient.e2e) - Web Client End-to-End Tests

### Setup
```
git clone https://github.com/yusufeliacik/dashboard-dnd.git
npm run postinstall
npm run postrun
```

## Repository Branch Strategy

###### Master - > Main Branch
  - Branch is read-only. Users cannot push to the branch.
  - Before merging, should open pull request.
  
###### Pull Request Steps
  - When enabled, pull requests targeting a matching branch require a number of approvals and no changes requested before they can be merged. (1 approval     required.)
  - New reviewable commits pushed to a matching branch will dismiss pull request review approvals.

###### Development Branch Strategy
  - Prefixes: feature/, bugfix/, hotfix/
  - We have to create a new branch for each task.
  
 


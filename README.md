# SQA Assignment

- [SQA Assignment](#sqa-assignment)
  - [Team Contributions](#team-contributions)
  - [Setup Instructions](#setup-instructions)
  - [Features](#features)
  - [Challenges \& Solutions](#challenges--solutions)
  - [Evidence for Marking Criteria](#evidence-for-marking-criteria)
  - [Feature Implementation](#feature-implementation)
  - [Testing](#testing)
    - [Test Approach](#test-approach)
    - [Evidence of achieving the coverage report](#evidence-of-achieving-the-coverage-report)
    - [How edge cases and error conditions were tested](#how-edge-cases-and-error-conditions-were-tested)
  - [Security Enhancements](#security-enhancements)
    - [Password Hashing](#password-hashing)
      - [Implementation Details](#implementation-details)
    - [Input Validation](#input-validation)
    - [CSRF Protection](#csrf-protection)
    - [Safeguards against XSS](#safeguards-against-xss)
    - [Safeguards against SQL injection](#safeguards-against-sql-injection)
    - [Any additional configurations or tools used](#any-additional-configurations-or-tools-used)
  - [Code Quality and Refactoring](#code-quality-and-refactoring)
    - [Sections of the code demonstrating modularisation](#sections-of-the-code-demonstrating-modularisation)
      - [Route Definitions (routes/ Directory)](#route-definitions-routes-directory)
      - [Middleware Functions (middleware/ Directory)](#middleware-functions-middleware-directory)
    - [Key improvements made during refactoring](#key-improvements-made-during-refactoring)
  - [CI/CD and Git Practices](#cicd-and-git-practices)
    - [GitHub Actions Used](#github-actions-used)
      - [Linting Code](#linting-code)
      - [Testing](#testing-1)
    - [Git Practices](#git-practices)
      - [Use feature branches for each functionality.](#use-feature-branches-for-each-functionality)
      - [Commit regularly with clear, descriptive messages.](#commit-regularly-with-clear-descriptive-messages)
    - [How we colllaborated](#how-we-colllaborated)
      - [Standups](#standups)
      - [PRs](#prs)
      - [Collaborative PRs](#collaborative-prs)

## Team Contributions

| Team Member       |                    Responsibility                    | Percentage |
| ----------------- | :--------------------------------------------------: | ---------- |
| Nathan Voong      | Blog Post Management (searching and filtering posts) | 25%        |
| Asher De Souza    |   User Profile (editing and deleting user details)   | 25%        |
| Arran McPherson   |           Adding UUIDs and session tokens            | 25%        |
| Isabella Sulisufi |      User Authentication (registration & login)      | 25%        |

## Setup Instructions

1. Clone the app using your preferred method (HTTPS, SSH, GitHub CLI)
2. Open up the project in an IDE (VS Code, IntelliJ, Cursor etc.)
3. In the terminal, run `npm install` to install the relevant dependencies for the project
4. Run `npm run dev` to start the development server. Any changes that you make to the code while the server is running will immediately be reflected on the web page after you save the code & reload the page

## Features

The boilerplate code that was given to us allowed users to:

- View all posts in the database
- Create a new post and add it to the database
- Edit existing posts
- Delete existing posts

We also added the ability for users to search for existing posts and sort existing posts with a selection of predefined filters.

We also added the ability for people to register or log in to an account which is securely saved to the database.

We also added a user profile pages where users can change their profile picture, edit their name or email, change their password and even permanently delete their account.

## Challenges & Solutions

#### Session Tokens - **Arran McPherson**

One of the challenges that I faced was the implementation of session tokens as a whole. I originally thought that the implemention would be fairly simple and not take a significant time. However in the process of researching it realised there were a number of issue with my palns to implement it due to large secuirty issues and difficulty with persisting sessions. Some of these errors were likely due to misunderstandings of the how the actual functions I was using worked even after researching them. I read and watch many articles and videos in order to try and progress my understanding of how most websites and etc would use session tokens to authenticate a user and attempted to implement a slightly simplified version using the sessionStorage.getItem and sessionStorage.getItem functions. Unfortunatley for me this lead to a miread of issues and additionally I realised that the database had no implementation of uuids and only an instance of integer ids that were generated through the model that were not truely UUIDs and instead simple ints that reflected the order which users were added to the database. This meant I had to refactor the code and tests to use uuids and migrate the existing database so that all users had one. I then opted for a cookie based session token In order to securely manage permissions I implemented a session-token system using express-session to ensure only authenticated users had access to funtions that they were meant to. I decided on this approach as opposed to JWT due to its ability to invalidate sessions on logout, security of session token storage and ease of use. Each session token is stored

#### Protecting against SQL injection attacks - **Isabella Sulisufi**

A challenge I faced was preventing SQL injection attacks, as I had no prior experience with them. I had to research how SQL injection works and adapt solutions I found online, as most examples used technologies different from Sequelize. To overcome this, I explored Sequelize’s built-in query protection features and used different methods to sanitise user inputs, such as a validator library and also trimmed inputs to remove empty space.

#### Working with the Pug template engine - **Nathan Voong**

A challenge I faced was working with a new language, PUG, and knowing what I wanted to do but struggling to implement it. To overcome this I had to research every step of the way of implementing my feature like how to create search queries, pass variables from the backend into the PUG file, and mostly checking the syntax necessary for my logic to work.

#### Adding profile settings - **Asher De Souza**

One of the issues that I faced when testing my changes was that the tests were attempting to either GET or POST requests in the wrong format. The tests were initially trying to send requests as raw JSON, but since the requests all happened through a HTML form they required `.type("form")` to be added to the request. This issue was solved by asking for some help from frontend developers at my company, as some of them have had experience with using express in the past. We paired on debugging the code and the responses until we found out that the data needed to be sent as a form.

Additionally, I had an issue when testing the profile page where test suites would pass inconsistently. My first debugging step was to split the large `profile.test.js` file into seperate test files for `index`, `edit-details`, `delete-account` & `change-password`, and recreate the same test user for them all. However, I was getting the same errors so I decided to look into how the jest testing library actually runs the test files. I found that by default, jest runs test suites in parallel so that overall execution is faster. I then added the flag `--runInBand` to my test file which made it so that tests ran sequentially rather than in parallel. This fixed the issue of my tests passing inconsistently, because the same user wasn't being created multiple times simultaneously.

## Evidence for Marking Criteria

## Feature Implementation

video goes here, need to show code examples in the video

## Testing

### Test Approach

We decided not to follow a TDD (Test Driven Development) approach because we were still in the process of defining the application's scope and determining which features to prioritise. Without a clear roadmap of all the functionalities, writing precise tests before implementation felt impractical.

Instead, we adopted BDD (Behaviour Driven Development), which allowed us to write tests based on how the application should behave from a user's perspective. This approach provided us the flexibility to iterate on features while still ensuring that the core functionalities met our expectations.

Our tests are structured to validate the application's behavior, as seen in the example below:

```javascript
describe("GET /", () => {
	it("should ..test scenario", async () => {});
});
```

With this format, we validate both the HTTP response status and the presence of key elements on the page, ensuring that the user experience aligns with our expectations. By using BDD, we were able to remain adaptable while still maintaining confidence in our application's functionality.

### Evidence of achieving the coverage report

Attached is the test coverage report
![alt text](/public/resources/readme-assets/test-coverage.png)

### How edge cases and error conditions were tested

The primary way in which edge cases were identified was through carefully thinking about how potential users of the app would use it. Across the website, there are places where input forms are used - users could potentially enter nothing into the input fields and potentially risk sending bad requests to modify the database. To reduce the risk of this, we modified the input field component to not accept blank inputs and force the user to input text before submitting the form.

In the test files, the first few assertions were those to test the 'happy path' of the app, by checking that if a user entered a correct input, they would get the expected response. Other assertions checked that if a user was to enter incorrect information (such as the wrong email or password), then they would receive an error message.

![alt text](/public/resources/readme-assets/forms.png)

## Security Enhancements

### Password Hashing

We decided not to encrypt passwords as it relies on an encryption key to decrypt the data back into its original form. Even if we store this key securely in environment variables, there's still a risk: if someone gains access to the key, they could decrypt and expose all stored passwords.

We decided to hash the passwords using [bcrypt](https://www.npmjs.com/package/bcryptjs). Hashing is a one-way operation, meaning once a password is hashed, it cannot be reversed back to its original form.
When users register, their password is hashed and stored in the database. During login, the input password is hashed again and compared to the stored hash, ensuring the original password is never stored or exposed.

However, even hashing can cause hash collisions. If two users set the same password, they would have the same hash. Additionally, precomputed hash tables (rainbow tables) exist online for common passwords, making it easier for attackers to crack weak hashes.

To address this limitation, we added salting to our password hashing process. Each password is hashed with a unique, random salt, ensuring even identical passwords produce unique hashes, effectively preventing rainbow table attacks.

#### Implementation Details

**Registration**: Passwords are hashed with bcrypt using a salt round of 10
`(bcrypt.hash(password, 10))`
before being stored.

**Login**: User-entered passwords are compared securely using bcrypt.compare, ensuring the plain text password never touches our database.

Example picture of database where password entered was 123 and it shows the hashed password

![image of the database showing a users password being hashed](/public/resources/readme-assets/exampledatabasehashing.png)

By using hashing with salting, we've significantly enhanced our password security. Users’ credentials are better protected against common attacks like rainbow table lookups and hash collisions, ensuring that their sensitive information remains confidential even in the event of a database breach.

### Input Validation

**Input Sanitisation**
We sanitise inputs by using the [validator library](https://www.npmjs.com/package/validator) to ensure that the inputs are well-formed. For example, we check if the email follows a valid format and if passwords are long enough. This ensures that malicious or unexpected input, such as special characters that might be used for injection (e.g., `--` `;` ` ` ), doesn't get submitted in the first place.

For example, the validation checks that:

```javascript
if (!validator.isEmail(email)) {
	return res
		.status(400)
		.json({ success: false, message: "Invalid email format." });
}
```

If an attacker tries to input something like `DROP TABLE users;`, this won't pass the `isEmail()` validation check and will be rejected.

```javascript
app.use(
	session({
		secret: process.env.SESSION_SECRET || "supersecretkey", // Replace with a strong, environment-based secret
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true, // Prevents XSS attacks
			secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
			sameSite: "Strict", // Prevents CSRF attacks
			maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
		},
	})
);
```

### CSRF Protection

CSRF attacks trick users into making unwanted requests on a web application where they are authenticated. Our blog app mitigates this by setting `sameSite: "Strict"` in session cookies, ensuring that cookies are not sent with cross-site requests, which blocks unauthorized actions initiated from other domains.

### Safeguards against XSS

XSS attacks occur when malicious scripts are injected into web pages viewed by users. In our blog application, the middleware `httpOnly: true` setting helps mitigate XSS risks by preventing JavaScript from accessing the session cookie, making it harder for attackers to steal authentication tokens.

### Safeguards against SQL injection

While Sequelize's ORM handles SQL injection prevention automatically, we further strengthened the app's security through different methods.

**Trim Input Values**
We trim the input values (e.g., `name.trim()`, `email.trim()`), which helps remove leading and trailing spaces. This reduces the risk of injecting characters that could be used for SQL injection

**Limit the amount of data being retrieved from the database**
We added an attributes option in the Sequelize queries to limit the amount of data being retrieved from the database.

When querying a database using Sequelize, by default, all fields of the matching records are returned unless you specify otherwise. Since most of the time, we only need specific fields (e.g., id, password), we now request only the necessary fields using the attributes option. This helps reduce the amount of data being transferred from the database and can improve performance, especially when dealing with large tables.
For example, when checking if an email is already registered, we only need the id to know whether the user exists or not.

```javascript
const existingUser = await User.findOne({
	where: { email },
	attributes: ["id"],
});
```

By limiting the fields retrieved to just what's necessary (id, password), we reduce the amount of data fetched from the database, improving performance.

Restricting the data selected prevents unnecessary exposure of sensitive information. For example, we don't need to retrieve the user's name or email when we're just checking if a user exists or verifying their password.

### Any additional configurations or tools used

## Code Quality and Refactoring

### Sections of the code demonstrating modularisation

##### Route Definitions (routes/ Directory)

`routes/file.js`
We separated all of the routes into their own module which helped us achieve a clear separation of concerns, enhancing maintainability. For example, blog, profile, user and session tokens all have their own file.

##### Middleware Functions (middleware/ Directory)

`middleware/auth.js`
This middleware handles user authentication checks, ensuring that only authorised users can access certain routes. Isolating authentication logic in a dedicated module helped us make it reusable and keeps the main application code clean.

### Key improvements made during refactoring

For the Profile page, initially all of the test suites were held within one file, although separated by distinct describe blocks. However, it was getting difficult to work on the file because of the amount of unrelated tests. As a solution, we decided to split up the tests into their individual functionalities (edit details, delete account etc.)

![alt text](/public/resources/readme-assets/profile-tests.png)

This made the tests much easier to work with, because there was a 'separation of concerns' between the various test files.

We also refactored the views folder containing the `.pug` files, because as we added new page views, it became more difficult to find a particular file. Each `.pug` file is now categorised into being under either **blog-posts** or **user-profile**, this made it a lot easier for us to find the file that we were looking for while developing.
![alt text](/public/resources/readme-assets/pug-folder.png)

## CI/CD and Git Practices

### GitHub Actions Used

After a pull request had been made, we added a couple of GitHub actions to our repository for both linting and testing our code.

![alt text](/public/resources/readme-assets/pr-checks.png)

#### Linting Code

[Linting file](https://github.com/Rainbow-Turtle1/SQA-Repository/blob/main/.github/workflows/lint.yml)
To maintain consistent code standards and ensure our codebase remains clean and tidy, we implemented a GitHub Action specifically for linting. For this, we used ESLint along with a custom configuration file tailored to our project requirements.

The linting action is triggered automatically on both pull requests and direct pushes to the master branch, helping to catch issues early and streamline the code review process.
We opted for ESLint due to its flexibility and wide adoption within the JavaScript ecosystem.

#### Testing

[Testing file](https://github.com/Rainbow-Turtle1/SQA-Repository/blob/main/.github/workflows/node.js.yml)
We streamlined the CI process by automating functionality tests. This workflow triggers whenever changes are pushed or when pull requests are created. This provides rapid feedback on code changes, allowing us to catch errors early and fix them before they reach production. This in turn reduces manual effort and human error, as every change is thoroughly tested without requiring developer intervention. It also ensures consistent testing environments and accelerates the development workflow by integrating caching mechanisms for dependencies to improve efficiency.

### Git Practices

##### Use feature branches for each functionality.

We followed a structured branch naming convention using the format `type/task-name`, where type could be `feat` (feature), `fix` (bug fix), or `chore` (maintenance tasks). This approach closely mirrored ClearScore practices, making it both familiar and easy to adopt. By maintaining consistency in our branch names, we improved clarity, streamlined collaboration, and made it easier to track the purpose of each branch within the project.

![Example branch naming convention](/public/resources/readme-assets/branch-names.jpeg)

##### Commit regularly with clear, descriptive messages.

Our commits were consistently spaced out and made on a regular basis. Each team member worked at their own pace, and at times, other commitments such as squad work, holidays, or personal circumstances affected contribution frequency. However, overall, everyone actively participated and maintained a steady flow of commits.

To ensure clarity, we added descriptive messages to our commits and left comments when necessary, especially in cases where there were no accompanying videos or evidence of changes. This practice helped us track modifications effectively and provided useful context for the entire team.

Example of PRs with descriptive descriptions or videos
![Example branch naming convention](/public/resources/readme-assets/descriptive-pr-1.png)
![Example branch naming convention](/public/resources/readme-assets/descriptive-pr-2.png)

Example of comments being left asking for a screenshot of change
![Example branch naming convention](/public/resources/readme-assets/leaving-comments.png)

### How we collaborated

#### Standups

We held standup meetings every Monday and Wednesday to discuss our current tasks, identify areas needing support, and address any challenges. These meetings were highly valuable, as they kept everyone informed about each other's progress and allowed us to reassess and adjust our plans as needed.

#### PRs

To collaborate on the code that we individually worked on, we used PRs (pull requests) as a means to verify each other's code before it had been merged into the main branch. This process would start once somebody had pushed changes to their branch such that they had added implementation and the necessary tests. Once they had created a pull request on GitHub and added a relevant description to their PR, they would share this PR with the rest of the team via Slack, which is the primary messaging tool that we use at work.

We made sure to leave comments on pull requests, even when everything looked good. Additionally, we discussed PRs in person or on Slack, facilitating offline conversations to ensure clarity and alignment.

After the PR had completed the necessary checks, the person who made the PR would merge their branch into the `main` branch using GitHub's `Rebase and merge` button.

![alt text](/public/resources/readme-assets/git-rebase-and-merge.png)

#### Collaborative PRs

There were also instances where team members collaborated on a pull request, working together to refine the code, troubleshoot issues, and ensure the best possible implementation. This collaborative approach helped improve code quality and knowledge sharing within the team.

[PR where Asher helped Arran fix some failing test](https://github.com/Rainbow-Turtle1/SQA-Repository/pull/34)

[PR where Arran and Nathan worked together](https://github.com/Rainbow-Turtle1/SQA-Repository/pull/38)
